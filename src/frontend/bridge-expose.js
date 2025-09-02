import { invoke } from '@forge/bridge';

// Expose bridge invoke on window so existing code using window.invoke works
if (typeof window !== 'undefined') {
  window.invoke = (key, payload) => invoke(key, payload);
  // Also expose a namespaced helper if needed
  window.forgeBridge = { invoke };
}
