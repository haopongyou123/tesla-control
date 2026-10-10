import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tenant {
  id: string;
  name: string;
  role?: string;
}

interface StoreState {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  setCurrentTenant: (t: Tenant | null) => void;
  setTenants: (ts: Tenant[]) => void;
  loadTenants: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentTenant: null,
      tenants: [],
      loading: false,
      setCurrentTenant: (t) => set({ currentTenant: t }),
      setTenants: (ts) => set({ tenants: ts }),
      loadTenants: async () => {
        if (get().loading) return;
        set({ loading: true });
        try {
          const { fetchTenants } = await import('../tenantApi');
          const ts = await fetchTenants();
          set({ tenants: ts });
        } catch {
          // API 不可用时保持现有列表
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: 'tesla-control-storage' },
  ),
);
