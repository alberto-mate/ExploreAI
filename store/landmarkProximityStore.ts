import { radiusUnlocked } from "@/constants";
import { LandmarkProps } from "@/types";
import { calculateDistance } from "@/utils/mapUtils";
import { create } from "zustand";

interface LandmarkProximityStore {
  landmarks: LandmarkProps[];
  userIsInside: Record<number, boolean>; // Map of landmarkId to userIsInside
  setLandmarks: (landmarks: LandmarkProps[]) => void;
  updateProximity: (userLatitude: number, userLongitude: number) => void;
  getUserIsInside: (landmarkId: number) => boolean; // New method
}

export const useLandmarkProximityStore = create<LandmarkProximityStore>(
  (set, get) => ({
    landmarks: [],
    userIsInside: {},
    setLandmarks: (landmarks) => set({ landmarks }),

    updateProximity: (userLatitude, userLongitude) => {
      set((state) => {
        const userIsInside = state.landmarks.reduce(
          (acc, landmark) => {
            const distance =
              calculateDistance(
                userLatitude,
                userLongitude,
                landmark.latitude,
                landmark.longitude,
              ) * 1000;
            acc[landmark.id] = distance <= radiusUnlocked;
            return acc;
          },
          {} as Record<number, boolean>,
        );

        return { userIsInside };
      });
    },

    // New method to check if user is inside a specific landmark
    getUserIsInside: (landmarkId) => {
      const { userIsInside } = get();
      return userIsInside[landmarkId] ?? false; // Return false if landmarkId is not in the map
    },
  }),
);
