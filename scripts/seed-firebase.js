// Manual Firebase Seeder Script
// Run with: node scripts/seed-firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";

// Your Firebase config here
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const sampleUsers = [
  {
    email: "john.doe@example.com",
    password: "Password123!",
    profile: { firstName: "John", lastName: "Doe" },
  },
  {
    email: "jane.smith@example.com",
    password: "Password123!",
    profile: { firstName: "Jane", lastName: "Smith" },
  },
];

const generateTransactions = (count = 20) => {
  const transactions = [];
  const types = ["Income", "Expenses"];
  const names = {
    Income: ["Gaji", "Bonus", "Freelance"],
    Expenses: ["Groceries", "Transport", "Makan"],
  };

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const nameList = names[type];

    transactions.push({
      nama: nameList[Math.floor(Math.random() * nameList.length)],
      tipeTransaksi: type,
      nominal:
        type === "Income"
          ? Math.floor(Math.random() * 3000000) + 1000000
          : Math.floor(Math.random() * 300000) + 50000,
      tanggal: new Date().toISOString(),
      timestamp: Date.now(),
    });
  }

  return transactions;
};

async function seedData() {
  ("🌱 Seeding Firebase data...");

  for (const userData of sampleUsers) {
    try {
      `Creating user: ${userData.email}`;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const userId = userCredential.user.uid;

      // Save profile
      await set(ref(database, `users/${userId}`), userData.profile);

      // Add transactions
      const transactions = generateTransactions(15);
      for (const transaction of transactions) {
        const transactionRef = push(ref(database, `transactions/${userId}`));
        await set(transactionRef, transaction);
      }

      `✅ Created ${userData.email} with ${transactions.length} transactions`;
    } catch (error) {
      console.error(`❌ Failed to create ${userData.email}:`, error.message);
    }
  }

  ("🎉 Seeding completed!");
  process.exit(0);
}

seedData();
