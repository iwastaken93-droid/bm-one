import { TauriNativeService, type IApplicationService } from "./tauri";
import { MockApplicationService } from "./mock";

export * from "./tauri";
export * from "./mock";

export function isTauri(): boolean {
  const g = globalThis as unknown as { __TAURI_INTERNALS__?: Record<string, unknown> };
  return typeof g.__TAURI_INTERNALS__ === "object" && g.__TAURI_INTERNALS__ !== null;
}

let _serviceInstance: IApplicationService | null = null;

export function getService(): IApplicationService {
  if (!_serviceInstance) {
    _serviceInstance = isTauri() ? new TauriNativeService() : new MockApplicationService();
  }
  return _serviceInstance;
}
