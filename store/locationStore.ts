import { create } from "zustand";

import { LocationProps } from "@/types";

export interface LocationStoreProps {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  setUserLocation: (location: LocationProps) => void;
}

export const useLocationStore = create<LocationStoreProps>((set: any) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,

  setUserLocation: ({ latitude, longitude, address }: LocationProps) => {
    set({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    });
  },
}));
