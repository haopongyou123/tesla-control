import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchTenants, createTenant } from '../tenantApi';
import { Tenant } from '../tenantApi';

export default function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const { tenants, currentTenant, setCurrentTenant, setTenants } = useStore();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  useEffect(() => {
    if (!id) {
      navigate('/tenants');
      return;
    }
    // Try to find in store first
    const found = tenants.find((t) => t.id === id);
    if (found) {
      setTenant(found);
      setCurrentTenant(found);
    } else {
      // Try to fetch from API
      loadFromApi();
    }
  }, [id, tenants, navigate, setCurrentTenant, setTenants]);

  const loadFromApi = async () => {
    setLoading(true);
    try {
      const { fetchTenants } = await import('../tenantApi');
      const allTenants = await fetchTenants();
      setTenants(allTenants);
      const found = allTenants.find((t) => t.id === id);
      if (found) {
        setTenant(found);
        setCurrentTenant(found);
      } else {
        // Tenant not found
        navigate('/tenants');
      }
    } catch (err) {
      console.error('Fetch tenants failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (tenant) {
      setEditName(tenant.name);
      setEditRole(tenant.role || '');
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      // Update via API (mock)
      const updated = { ...tenant, name: editName, role: editRole };
      // Update in store
      setTenants(tenants.map((t) => (t.id === id ? updated : t)));
      setTenant(updated);
      setCurrentTenant(updated);
      setEditing(false);
    } catch (err) {
      console.error('Update tenant failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tenant || !window.confirm('确定要删除此租户吗？')) return;
    setLoading(true);
    try {
      // Delete via API (mock)
      setTenants(tenants.filter((t) => t.id !== id));
      if (currentTenant?.id === id) {
        setCurrentTenant(null);
      }
      navigate('/tenants');
    } catch (err) {
      console.error('Delete tenant failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!tenant && loading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  if (!tenant) {
    return <div className="p-6 text-center">租户不存在或已删除</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {editing ? '编辑租户' : '租户详情'}
        </h2>
        <div className="flex gap-2">
          {!editing && (
            <>
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                编辑
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                删除
              </button>
            </>
          )}
          {editing && (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
              >
                {loading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                取消
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}>
          <div>
            <label className="block text-sm font-medium mb-1">名称</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">角色</label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="owner">所有者</option>
              <option value="admin">管理员</option>
              <option value="viewer">查看者</option>
            </select>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">名称</p>
              <p className="text-lg font-medium">{tenant.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">角色</p>
              <p className="text-lg font-medium">{tenant.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ID</p>
              <p className="font-mono text-sm text-gray-600 break-all">{tenant.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">创建时间</p>
              <p className="text-sm text-gray-600">2024-01-01 00:00:00</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}