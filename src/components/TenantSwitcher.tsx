import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { fetchTenants } from '../tenantApi';

const TenantSwitcher: React.FC = () => {
  const tenants = useStore((s) => s.tenants);
  const currentTenant = useStore((s) => s.currentTenant);
  const setCurrentTenant = useStore((s) => s.setCurrentTenant);
  const setTenants = useStore((s) => s.setTenants);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 先尝试从 API 获取；不可用时保留本地 mock
    if (tenants.length === 0) {
      setLoading(true);
      fetchTenants()
        .then(setTenants)
        .catch(() => {
          setTenants([
            { id: 't-001', name: 'Tesla 中国', role: 'owner' },
            { id: 't-002', name: 'Tesla US', role: 'admin' },
            { id: 't-003', name: 'Tesla EU', role: 'viewer' },
          ]);
        })
        .finally(() => setLoading(false));
    }
  }, [tenants.length, setTenants]);

  return (
    <div data-testid="tenant-switcher">
      {loading && <span className="text-xs text-gray-400">加载中…</span>}
      <label className="block text-sm mb-1" htmlFor="tenant-select">
        当前租户
      </label>
      <select
        id="tenant-select"
        className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
        value={currentTenant?.id ?? ''}
        onChange={(e) => {
          const t = tenants.find((x) => x.id === e.target.value) ?? null;
          setCurrentTenant(t);
        }}
      >
        <option value="">无租户</option>
        {tenants.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TenantSwitcher;