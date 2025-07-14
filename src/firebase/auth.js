// Firebase Authentication Service
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from './config';

// Sign in user with username
export const signInUser = async (username, password) => {
  try {
    // Convert username to email format for Firebase Auth
    const email = `${username}@banktechpro.com`;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Generate unique account number
const generateAccountNumber = async () => {
  const baseNumber = '821983';
  let accountNumber;
  let isUnique = false;
  
  while (!isUnique) {
    const randomSuffix = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    accountNumber = baseNumber + randomSuffix;
    
    // Check if account number exists
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      const existingNumbers = Object.values(users)
        .map(user => user.accountNumber)
        .filter(Boolean);
      
      isUnique = !existingNumbers.includes(accountNumber);
    } else {
      isUnique = true;
    }
  }
  
  return accountNumber;
};

// Check if username exists
const checkUsernameExists = async (username) => {
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  
  if (snapshot.exists()) {
    const users = snapshot.val();
    return Object.values(users).some(user => user.username === username);
  }
  return false;
};

// Register new user with username
export const registerUser = async (username, password, firstName, lastName) => {
  try {
    // Check if username already exists
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      return { success: false, error: 'Username already exists' };
    }
    
    // Convert username to email format for Firebase Auth
    const email = `${username}@banktechpro.com`;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Generate unique account number
    const accountNumber = await generateAccountNumber();
    
    // Save user profile
    await set(ref(database, `users/${userId}`), {
      username,
      email, // Keep email for Firebase Auth compatibility
      firstName,
      lastName,
      phone: '', // Empty string as requested
      bankAccounts: [
        {
          accountNumber,
          accountType: 'Savings',
          balance: 5000000, // Default balance 5 juta untuk user baru
          isDefault: true
        }
      ],
      createdAt: new Date().toISOString()
    });
    
    // Save default preferences
    await set(ref(database, `preferences/${userId}`), {
      itemsPerPage: 10,
      filterTipe: 'All',
      theme: 'light'
    });
    
    return { success: true, user: userCredential.user, accountNumber, username };
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