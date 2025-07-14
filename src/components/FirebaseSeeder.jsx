// Firebase Seeder Component
import { useState } from 'react';
import { seedFirebaseData } from '../firebase/seeder';
import { cleanupFirebaseData } from '../firebase/cleanup';

export default function FirebaseSeeder() {
  const [loading, setLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    
    const result = await seedFirebaseData();
    setResult(result);
    setLoading(false);
  };

  const handleCleanup = async () => {
    setCleanupLoading(true);
    setResult(null);
    
    const result = await cleanupFirebaseData();
    setResult(result);
    setCleanupLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h3 className="text-lg font-semibold mb-4">Firebase Data Seeder</h3>
      
      <div className="mb-4 text-sm text-gray-600">
        <p>This will create:</p>
        <ul className="list-disc list-inside mt-2">
          <li>3 sample users with email/password</li>
          <li>25 transactions per user</li>
          <li>User preferences</li>
        </ul>
      </div>

      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <strong>Sample Accounts:</strong>
        <ul className="mt-1">
          <li>john.doe@example.com</li>
          <li>jane.smith@example.com</li>
          <li>bob.wilson@example.com</li>
        </ul>
        <p className="mt-1"><strong>Password:</strong> Password123!</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleCleanup}
          disabled={cleanupLoading || loading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            cleanupLoading || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {cleanupLoading ? 'Cleaning Data...' : 'Clean Firebase Data'}
        </button>
        
        <button
          onClick={handleSeed}
          disabled={loading || cleanupLoading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            loading || cleanupLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Seeding Data...' : 'Seed Firebase Data'}
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-3 rounded-md ${
          result.success 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {result.success 
            ? '✅ Data seeded successfully! You can now login with sample accounts.'
            : `❌ Seeding failed: ${result.error}`
          }
        </div>
      )}
    </div>
  );
}