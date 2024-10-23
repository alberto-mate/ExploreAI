export interface UserProps {
  name: string;
  email: string;
  clerkId: string | null;
}

export interface LandmarkProps {
  id: number;
  cityId: number;
  name: string;
  latitude: number;
  longitude: number;
  isUnlocked: boolean;
  address: string;
  image: string;
  unlockedDate?: string | null; // Optional, since the landmark may not be unlocked
}

export interface CityProps {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  image: string;
}

export interface LocationProps {
  latitude: number;
  longitude: number;
  address: string;
}

export interface CityProgress {
  [cityId: string]: {
    cityName: string;
    totalLandmarks: number;
    unlockedLandmarks: number;
    lockedLandmarks: number;
    progress: number;
  };
}
