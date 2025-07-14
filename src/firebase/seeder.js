// Firebase Data Seeder
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, push } from 'firebase/database';
import { auth, database } from './config';

// Sample users data
const sampleUsers = [
  {
    username: 'alfito',
    password: 'Alfito123!',
    profile: {
      firstName: 'Alfito',
      lastName: 'Doe',
      phone: '',
      bankAccounts: [
        {
          accountNumber: '8219837001',
          accountType: 'Savings',
          balance: 15000000,
          isDefault: true
        },
        {
          accountNumber: '8219837011',
          accountType: 'Current',
          balance: 5500000,
          isDefault: false
        }
      ]
    }
  },
  {
    username: 'alfrendo', 
    password: 'Alfrendo123!',
    profile: {
      firstName: 'Alfrendo',
      lastName: 'Smith',
      phone: '',
      bankAccounts: [
        {
          accountNumber: '8219837002',
          accountType: 'Savings',
          balance: 8500000,
          isDefault: true
        },
        {
          accountNumber: '8219837012',
          accountType: 'Investment',
          balance: 12000000,
          isDefault: false
        }
      ]
    }
  },
  {
    username: 'akmal',
    password: 'Akmal123!',
    profile: {
      firstName: 'Akmal',
      lastName: 'Wilson', 
      phone: '',
      bankAccounts: [
        {
          accountNumber: '8219837003',
          accountType: 'Savings',
          balance: 12750000,
          isDefault: true
        },
        {
          accountNumber: '8219837013',
          accountType: 'Current',
          balance: 3200000,
          isDefault: false
        },
        {
          accountNumber: '8219837023',
          accountType: 'Investment',
          balance: 8900000,
          isDefault: false
        }
      ]
    }
  }
];

// Generate sample transactions
const generateTransactions = (userId, userAccountNumber, allUsers, count = 20) => {
  const transactions = [];
  const transactionTypes = ['Income', 'Expenses'];
  const incomeNames = ['Gaji Bulanan', 'Bonus', 'Freelance', 'Investasi', 'Penjualan'];
  const expenseNames = ['Transfer ke', 'Belanja di', 'Bayar', 'Beli', 'Pembayaran'];
  
  // Get other account numbers for realistic transfers
  const otherAccounts = [];
  allUsers.forEach(u => {
    u.profile.bankAccounts.forEach(account => {
      if (account.accountNumber !== userAccountNumber) {
        otherAccounts.push({
          accountNumber: account.accountNumber,
          name: `${u.profile.firstName} ${u.profile.lastName}`,
          accountType: account.accountType
        });
      }
    });
  });
  
  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.6; // 40% income, 60% expenses
    const type = isIncome ? 'Income' : 'Expenses';
    
    let transactionName, targetAccount;
    
    if (isIncome) {
      // For income, use income names
      transactionName = incomeNames[Math.floor(Math.random() * incomeNames.length)];
      // For income, nomorRekening could be sender's account (random other account)
      const randomSender = otherAccounts[Math.floor(Math.random() * otherAccounts.length)];
      targetAccount = randomSender.accountNumber;
    } else {
      // For expenses, create realistic transfer/payment names
      const expenseType = expenseNames[Math.floor(Math.random() * expenseNames.length)];
      if (expenseType === 'Transfer ke') {
        const randomReceiver = otherAccounts[Math.floor(Math.random() * otherAccounts.length)];
        transactionName = `${expenseType} ${randomReceiver.name}`;
        targetAccount = randomReceiver.accountNumber;
      } else {
        const merchants = ['Indomaret', 'Alfamart', 'Shopee', 'Tokopedia', 'Grab', 'Gojek', 'PLN', 'Telkom'];
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        transactionName = `${expenseType} ${merchant}`;
        targetAccount = `999${Math.floor(Math.random() * 9000) + 1000}`; // Merchant account
      }
    }
    
    // Random date dalam 3 bulan terakhir
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    transactions.push({
      nama: transactionName,
      nomorRekening: targetAccount, // Account number tujuan/pengirim
      tipeTransaksi: type,
      nominal: isIncome 
        ? Math.floor(Math.random() * 5000000) + 1000000 // Income: 1M - 6M
        : Math.floor(Math.random() * 500000) + 50000,   // Expenses: 50K - 550K
      tanggal: date.toISOString(),
      timestamp: date.getTime(),
      createdAt: new Date().toISOString()
    });
  }
  
  return transactions;
};

// Seed users and transactions
export const seedFirebaseData = async () => {
  console.log('🌱 Starting Firebase data seeding...');
  
  try {
    for (const userData of sampleUsers) {
      console.log(`Creating user: ${userData.username}`);
      
      // Create user account with email format
      const email = `${userData.username}@banktechpro.com`;
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        userData.password
      );
      
      const userId = userCredential.user.uid;
      
      // Save user profile
      await set(ref(database, `users/${userId}`), {
        username: userData.username,
        email: email,
        ...userData.profile,
        createdAt: new Date().toISOString()
      });
      
      // Generate and save transactions for each bank account
      let totalTransactions = 0;
      for (const bankAccount of userData.profile.bankAccounts) {
        const accountTransactions = generateTransactions(userId, bankAccount.accountNumber, sampleUsers, 15);
        
        for (const transaction of accountTransactions) {
          const transactionRef = push(ref(database, `transactions/${userId}/${bankAccount.accountNumber}`));
          await set(transactionRef, transaction);
        }
        
        totalTransactions += accountTransactions.length;
      }
      
      // Save user preferences
      await set(ref(database, `preferences/${userId}`), {
        itemsPerPage: 10,
        filterTipe: 'All',
        theme: 'light'
      });
      
      console.log(`✅ Created user ${userData.username} with ${totalTransactions} transactions across ${userData.profile.bankAccounts.length} accounts`);
    }
    
    console.log('🎉 Firebase seeding completed successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return { success: false, error: error.message };
  }
};

// Quick test data for development
export const addTestTransaction = async (userId) => {
  const testTransaction = {
    nama: 'Test Transaction',
    tipeTransaksi: 'Income',
    nominal: 1000000,
    tanggal: new Date().toISOString(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString()
  };
  
  const transactionRef = push(ref(database, `transactions/${userId}`));
  await set(transactionRef, testTransaction);
  
  return transactionRef.key;
};