import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export default function Profile() {
  const { currentTenant } = useStore();
  const [name, setName] = useState('张三');
  const [email, setEmail] = useState('zhangsan@example.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">个人资料</h2>
      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            data-testid="profile-name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            data-testid="profile-email"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">所属租户</p>
          <p className="text-lg" data-testid="profile-tenant">
            {currentTenant?.name ?? '无租户'}
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          data-testid="profile-save"
        >
          保存
        </button>
        {saved && (
          <p className="text-green-600" data-testid="profile-saved-msg">
            ✅ 保存成功
          </p>
        )}
      </form>
    </div>
  );
}