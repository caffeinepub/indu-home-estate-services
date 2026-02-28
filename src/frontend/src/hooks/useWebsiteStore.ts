import { getSnapshot, subscribe } from "@/store/websiteStore";
import { useSyncExternalStore } from "react";

export function useWebsiteStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
