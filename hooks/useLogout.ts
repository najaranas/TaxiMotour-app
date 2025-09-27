import { useCallback } from "react";
import { useMapStore } from "@/store/mapStore";
import { useUserData } from "@/store/userStore";
import { useSelfieStore } from "@/store/selfieImageStore";
import StorageManager from "@/utils/storage";
import { getSupabaseClient } from "@/services/supabaseClient";
import { useSession } from "@clerk/clerk-expo";

export const useLogout = () => {
  const { clearAllMapData } = useMapStore();
  const { clearUserData } = useUserData();
  const { clearSelfieImage } = useSelfieStore();
  const { session } = useSession();

  const clearAllUserData = useCallback(async () => {
    try {
      console.log("Starting comprehensive user data cleanup...");

      // 1. Clear all Zustand stores
      console.log("Clearing Zustand stores...");
      clearAllMapData();
      clearUserData();
      clearSelfieImage();

      // 2. Clear user-related data from MMKV storage (preserving app settings)
      console.log("Clearing user data from storage...");
      StorageManager.clearAllUserData();

      // 3. Close all Supabase subscriptions
      console.log("Closing Supabase subscriptions...");
      const supabaseClient = getSupabaseClient(session);
      if (supabaseClient) {
        supabaseClient.removeAllChannels();
      }

      console.log("User data cleanup completed successfully");
      return { success: true };
    } catch (error) {
      console.error("Error during user data cleanup:", error);
      return { success: false, error };
    }
  }, [clearAllMapData, clearUserData, clearSelfieImage, session]);

  const clearAllDataCompletely = useCallback(async () => {
    try {
      console.log("Starting complete data wipe...");

      // 1. Clear all Zustand stores
      clearAllMapData();
      clearUserData();
      clearSelfieImage();

      // 2. Clear ALL storage (including app settings)
      StorageManager.clearAllStorageCompletely();

      // 3. Close all Supabase subscriptions
      const supabaseClient = getSupabaseClient(session);
      if (supabaseClient) {
        supabaseClient.removeAllChannels();
      }

      console.log("Complete data wipe completed");
      return { success: true };
    } catch (error) {
      console.error("Error during complete data wipe:", error);
      return { success: false, error };
    }
  }, [clearAllMapData, clearUserData, clearSelfieImage, session]);

  return {
    clearAllUserData, // Clears user data but preserves app settings
    clearAllDataCompletely, // Nuclear option - clears everything
  };
};
