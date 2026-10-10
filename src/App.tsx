import React from 'react';
import { useStore } from './store/useStore';
import TenantSwitcher from './components/TenantSwitcher';

export default function App() {
  const currentTenant = useStore((s) => s.currentTenant);
  const loadTenants = useStore((s) => s.loadTenants);
  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-gray-800 text-white p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Tesla Control</h2>
        <TenantSwitcher />
      </aside>
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {currentTenant?.name ?? '无租户'} – Overview
          </h1>
        </header>
        <div className="rounded-lg border p-6 bg-white shadow">
          <p className="text-gray-700">
            当前租户:{' '}
            {currentTenant ? `${currentTenant.name} (${currentTenant.id})` : '无'}
          </p>
        </div>
      </main>
    </div>
  );
}
