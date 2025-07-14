// Firebase Data Cleanup
import { ref, remove } from "firebase/database";
import { database } from "./config";

export const cleanupFirebaseData = async () => {
  ("🧹 Starting Firebase data cleanup...");

  try {
    // Remove all users data
    await remove(ref(database, "users"));
    ("✅ Removed users data");

    // Remove all transactions
    await remove(ref(database, "transactions"));
    ("✅ Removed transactions data");

    // Remove all preferences
    await remove(ref(database, "preferences"));
    ("✅ Removed preferences data");

    ("🎉 Firebase cleanup completed!");
    return { success: true };
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    return { success: false, error: error.message };
  }
};

// Note: Firebase Auth users need to be deleted manually from console
// or using Firebase Admin SDK
