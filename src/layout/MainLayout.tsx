import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Spin } from 'antd'
import Footer from '../components/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../common/config/firebase/firebase.config';

const MainLayout = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const x = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/auth/login");
      }
    });

    return () => x();
  }, [navigate]);
  return (

    <Spin className="w-full min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <div className='w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900'>
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </Spin>
  );
}

export default MainLayout