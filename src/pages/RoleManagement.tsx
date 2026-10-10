import React, { useState } from 'react';
import { useStore } from '../store/useStore';

interface Role {
  id: string;
  name: string;
  description: string;
}

const DEFAULT_ROLES: Role[] = [
  { id: 'r-001', name: 'owner', description: '所有者，拥有全部权限' },
  { id: 'r-002', name: 'admin', description: '管理员，可管理成员与设置' },
  { id: 'r-003', name: 'viewer', description: '查看者，仅可查看资源' },
];

export default function RoleManagement() {
  const { currentTenant } = useStore();
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const nr: Role = {
      id: 'r-' + Math.random().toString(36).slice(2, 8),
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || '自定义角色',
    };
    setRoles([...roles, nr]);
    setShowCreate(false);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">角色管理</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowCreate(true)}
          data-testid="role-create-btn"
        >
          + 新建角色
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        当前租户：{currentTenant?.name ?? '无租户'}
      </p>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-4 p-4 bg-gray-50 rounded border space-y-3" data-testid="role-create-form">
          <div>
            <label className="block text-sm font-medium mb-1">角色名称</label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="例如：operator"
              className="w-full px-3 py-2 border rounded"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">描述</label>
            <input
              type="text"
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              placeholder="角色职责说明"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              创建
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
            <th className="px-4 py-2 text-left border">角色名</th>
            <th className="px-4 py-2 text-left border">描述</th>
            <th className="px-4 py-2 text-left border">操作</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border font-mono text-sm">{r.name}</td>
              <td className="px-4 py-2 border">{r.description}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}