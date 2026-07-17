import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import Navbar from '../components/dashboard/Navbar.jsx';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-shell__main">
        <Navbar />
        <div className="dashboard-shell__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
