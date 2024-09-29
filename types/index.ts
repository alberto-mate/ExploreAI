export interface LandmarkProps {
  id: number;
  name: string;
  position: {
    latitude: number;
    longitude: number;
  };
  unlocked: boolean;
  address: string;
  image: string;
}

export interface CityProps {
  id: number;
  name: string;
  position: {
    latitude: number;
    longitude: number;
  };
  image: string;
}

export interface LocationProps {
  latitude: number;
  longitude: number;
  address: string;
}

export interface LocationStoreProps {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  setUserLocation: (location: LocationProps) => void;
}
