import { describe, it, expect, beforeEach } from 'vitest';

// Node 环境无 localStorage，stub 后再动态导入（persist 中间件依赖）
if (typeof (globalThis as any).localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  };
}

const { useStore } = await import('./useStore');

describe('useStore tenant state', () => {
  beforeEach(() => {
    useStore.getState().setCurrentTenant(null);
    useStore.getState().setTenants([]);
  });

  it('defaults to no current tenant', () => {
    expect(useStore.getState().currentTenant).toBeNull();
  });

  it('sets current tenant from tenants list', () => {
    const t = { id: 't-1', name: 'Tesla 中国' };
    useStore.getState().setTenants([t]);
    useStore.getState().setCurrentTenant(t);
    expect(useStore.getState().currentTenant?.id).toBe('t-1');
  });

  it('clears tenant back to null', () => {
    useStore.getState().setCurrentTenant({ id: 't-2', name: 'X' });
    useStore.getState().setCurrentTenant(null);
    expect(useStore.getState().currentTenant).toBeNull();
  });
});
