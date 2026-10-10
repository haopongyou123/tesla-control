import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchTenants, createTenant } from '../tenantApi';
import { Tenant } from '../tenantApi';

export default function TenantList() {
  const navigate = useNavigate();
  const { tenants, setTenants, currentTenant, setCurrentTenant } = useStore();
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    setLoading(true);
    try {
      const t = await createTenant({ name: newTenantName.trim(), role: 'owner' });
      setTenants([...tenants, t]);
      setShowCreate(false);
      setNewTenantName('');
      setCurrentTenant(t);
    } catch (err) {
      console.error('Create tenant failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (t: Tenant) => {
    setCurrentTenant(t);
    navigate(`/tenants/${t.id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">租户列表</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowCreate(true)}
        >
          + 新建租户
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-4 p-4 bg-gray-50 rounded border">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTenantName}
              onChange={(e) => setNewTenantName(e.target.value)}
              placeholder="租户名称"
              className="flex-1 px-3 py-2 border rounded"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              取消
            </button>
          </div>
        </form>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left border">名称</th>
            <th className="px-4 py-2 text-left border">角色</th>
            <th className="px-4 py-2 text-left border">ID</th>
            <th className="px-4 py-2 text-left border">操作</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{t.name}</td>
              <td className="px-4 py-2 border">{t.role}</td>
              <td className="px-4 py-2 border font-mono text-sm">{t.id}</td>
              <td className="px-4 py-2 border">
                <button
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  onClick={() => handleSelect(t)}
                >
                  查看详情
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tenants.length === 0 && (
        <p className="text-gray-500 text-center py-8">暂无租户，点击「新建租户」创建</p>
      )}
    </div>
  );
}