import { create } from "zustand";

import { LocationProps, LocationStoreProps } from "@/types";

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
