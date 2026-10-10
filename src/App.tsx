import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import TenantSwitcher from './components/TenantSwitcher';
import TenantList from './pages/TenantList';
import TenantDetail from './pages/TenantDetail';
import Profile from './pages/Profile';
import RoleManagement from './pages/RoleManagement';

export default function App() {
  const currentTenant = useStore((s) => s.currentTenant);
  const loadTenants = useStore((s) => s.loadTenants);
  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <aside className="w-56 bg-gray-800 text-white p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Tesla Control</h2>
          <TenantSwitcher />
        </aside>
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Navigate replace to="/tenants" />} />
            <Route path="/tenants" element={<TenantList />} />
            <Route path="/tenants/:id" element={<TenantDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/roles" element={<RoleManagement />} />
            <Route path="*" element={<Navigate replace to="/tenants" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
