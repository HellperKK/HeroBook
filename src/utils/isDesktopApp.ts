import { invoke } from "@tauri-apps/api/core";

export async function isDesktopApp() {
  try {
    const result = await invoke<boolean>("is_desktop", {});
    return result;
  } catch (_error) {
    return false;
  }
}