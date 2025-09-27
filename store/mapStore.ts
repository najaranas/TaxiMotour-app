// store/mapStore.ts
import { create } from "zustand";
import { routeService, apiUtils } from "@/services/api";
import { RouteData } from "@/types/Types";

interface LocationData {
  place?: string;
  lat?: number | null;
  lon?: number | null;
}

interface MapStore {
  // Route state - the essential shared data
  routeGeoJSON: RouteData | null;
  routeLoading: boolean;
  routeError: string | null;

  // Map loading state
  isMapLoading: boolean;

  // Actions
  setMapLoading: (loading: boolean) => void;
  fetchRoute: (roadData: LocationData[]) => Promise<void>;
  clearRoute: () => void;
  clearAllMapData: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  // Route state
  routeGeoJSON: null,
  routeLoading: false,
  routeError: null,

  // Map loading state
  isMapLoading: false,

  // Actions
  setMapLoading: (isMapLoading) => set({ isMapLoading }),

  fetchRoute: async (roadData) => {
    if (!roadData || roadData.length < 2) return;

    const [start, end] = roadData;
    if (
      !apiUtils.validateCoordinates(start.lat ?? null, start.lon ?? null) ||
      !apiUtils.validateCoordinates(end.lat ?? null, end.lon ?? null)
    ) {
      set({ routeError: "Invalid coordinates" });
      return;
    }

    try {
      set({ routeLoading: true, isMapLoading: true, routeError: null });
      const data = await routeService.fetchRoute(
        [start.lon as number, start.lat as number],
        [end.lon as number, end.lat as number]
      );
      set({ routeGeoJSON: data });
    } catch (e: any) {
      set({ routeError: e?.message || "Failed to fetch route" });
    } finally {
      set({ routeLoading: false, isMapLoading: false });
    }
  },

  clearRoute: () => set({ routeGeoJSON: null, routeError: null }),

  clearAllMapData: () => {
    set({
      routeGeoJSON: null,
      routeLoading: false,
      routeError: null,
      isMapLoading: false,
    });
  },
}));
