export interface Tenant {
  id: string;
  name: string;
  role?: string;
}

export async function fetchTenants(): Promise<Tenant[]> {
  const res = await fetch('/api/tenants');
  if (!res.ok) throw new Error('Failed to fetch tenants');
  return res.json();
}

export async function createTenant(data: Partial<Tenant>): Promise<Tenant> {
  const res = await fetch('/api/tenants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create tenant');
  return res.json();
}