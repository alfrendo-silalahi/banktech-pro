import FirebaseSeeder from "../components/FirebaseSeeder";

export default function SeederPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firebase Data Seeder
          </h1>
          <p className="text-gray-600">
            Manage your Firebase database with sample data
          </p>
        </div>
        
        <FirebaseSeeder />
        
        <div className="mt-8 text-center">
          <a 
            href="/signin" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}