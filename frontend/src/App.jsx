import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div>
      <AdminDashboard />
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;