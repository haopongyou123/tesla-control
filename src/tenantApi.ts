export interface Tenant {
  id: string;
  name: string;
  role?: string;
}

export interface CreateTenantData {
  name: string;
  role?: string;
}

export async function fetchTenants(): Promise<Tenant[]> {
  const res = await fetch('/api/tenants');
  if (!res.ok) throw new Error('Failed to fetch tenants');
  return res.json();
}

export async function createTenant(data: CreateTenantData): Promise<Tenant> {
  const res = await fetch('/api/tenants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create tenant');
  return res.json();
}

// Placeholder: update tenant (for completeness)
export async function updateTenant(id: string, data: Partial<CreateTenantData>): Promise<Tenant> {
  const res = await fetch(`/api/tenants/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update tenant');
  return res.json();
}

// Placeholder: delete tenant (for completeness)
export async function deleteTenant(id: string): Promise<void> {
  const res = await fetch(`/api/tenants/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete tenant');
}

// Placeholder: fetch current tenant profile (for completeness)
export async function fetchCurrentTenant(): Promise<Tenant> {
  const res = await fetch('/api/tenants/current');
  if (!res.ok) throw new Error('Failed to fetch current tenant');
  return res.json();
}

export { Tenant };