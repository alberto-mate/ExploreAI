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
