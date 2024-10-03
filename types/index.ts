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
