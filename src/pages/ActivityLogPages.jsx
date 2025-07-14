import ActivityLog from '../components/ActivityLog';
import Navbar from '../components/NavigationBar';

export default function ActivityLogPages() {
  return (
    <div className='w-screen'>
         <Navbar />
    <div className="w-screen bg-gray-100 p-6">
        <ActivityLog />
    </div>
    </div>
  );
}