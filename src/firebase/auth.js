// Firebase Authentication Service
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, database } from "./config";
import { addTransferTransactions } from "./transactions";

// Sign in user with email and password
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Generate unique account number
const generateAccountNumber = async () => {
  const baseNumber = "821983";
  let accountNumber;
  let isUnique = false;

  while (!isUnique) {
    const randomSuffix = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    accountNumber = baseNumber + randomSuffix;

    // Check if account number exists
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const existingNumbers = Object.values(users)
        .map((user) => user.accountNumber)
        .filter(Boolean);

      isUnique = !existingNumbers.includes(accountNumber);
    } else {
      isUnique = true;
    }
  }

  return accountNumber;
};

// Check if username exists
// const checkUsernameExists = async (username) => {
//   const usersRef = ref(database, "users");
//   const snapshot = await get(usersRef);

//   if (snapshot.exists()) {
//     const users = snapshot.val();
//     return Object.values(users).some((user) => user.username === username);
//   }
//   return false;
// };

// Register new user with username
export const registerUser = async (email, name, password) => {
  try {
    // Check if username already exists
    // const usernameExists = await checkUsernameExists(username);
    // if (usernameExists) {
    //   return { success: false, error: "Username already exists" };
    // }

    // Convert username to email format for Firebase Auth
    // const email = `${username}@banktechpro.com`;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Generate unique account number
    const accountNumber = await generateAccountNumber();

    // Save user profile
    await set(ref(database, `users/${userId}`), {
      email,
      name,
      bankAccounts: [
        {
          accountNumber,
          accountType: "Savings",
          balance: 5000000,
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    });

    // Save default preferences
    await set(ref(database, `preferences/${userId}`), {
      itemsPerPage: 10,
      filterTipe: "All",
      theme: "light",
    });

    return {
      success: true,
      user: userCredential.user,
      accountNumber,
      email,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state listener
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Transfer money with transaction records
export const transferMoney = async (
  fromAccountNumber,
  targetAccountNumber,
  amount
) => {
  const usersRef = ref(database, "users");
  const snap = await get(usersRef);

  if (!snap.exists()) {
    return { success: false, error: "No users found" };
  }

  const users = snap.val();
  let fromPath = null;
  let targetPath = null;
  let fromUserId = null;
  let targetUserId = null;
  let fromAccountMeta = null;
  let targetAccountMeta = null;

  // Find account paths and user IDs
  Object.entries(users).forEach(([uid, user]) => {
    if (user.bankAccounts && Array.isArray(user.bankAccounts)) {
      user.bankAccounts.forEach((acc, idx) => {
        if (acc.accountNumber === fromAccountNumber) {
          fromPath = `users/${uid}/bankAccounts/${idx}/balance`;
          fromUserId = uid;
          fromAccountMeta = { name: user.name, accountType: acc.accountType };
        }
        if (acc.accountNumber === targetAccountNumber) {
          targetPath = `users/${uid}/bankAccounts/${idx}/balance`;
          targetUserId = uid;
          targetAccountMeta = { name: user.name, accountType: acc.accountType };
        }
      });
    }
  });

  console.log('🔍 Found users:', { fromUserId, targetUserId, fromPath, targetPath });

  if (!fromPath || !targetPath) {
    return { success: false, error: "Account not found" };
  }

  try {
    // Get current balances
    const fromSnap = await get(ref(database, fromPath));
    const fromBalance = fromSnap.val();

    const targetSnap = await get(ref(database, targetPath));
    const targetBalance = targetSnap.val();

    // Update balances
    await set(ref(database, fromPath), fromBalance - amount);
    await set(ref(database, targetPath), targetBalance + amount);

    // Add transaction records
    console.log('💾 Adding transaction records...', {
      fromUserId,
      fromAccountNumber,
      targetUserId,
      targetAccountNumber,
      amount
    });
    
    const transactionResult = await addTransferTransactions(
      fromUserId,
      fromAccountNumber,
      targetUserId,
      targetAccountNumber,
      amount,
      fromAccountMeta.name,
      targetAccountMeta.name
    );

    if (!transactionResult.success) {
      console.warn('⚠️ Transfer completed but transaction records failed:', transactionResult.error);
    } else {
      console.log('✅ Transaction records added successfully');
    }

    console.log('✅ Transfer completed with transaction records');
    
    return {
      success: true,
      name: targetAccountMeta.name,
      accountType: targetAccountMeta.accountType,
      transactionId: transactionResult.timestamp || Date.now()
    };
  } catch (err) {
    console.error('Transfer failed:', err);
    return { success: false, error: "Transfer failed" };
  }
};
