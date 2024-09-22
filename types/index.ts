export interface Landmark {
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
  
  export interface UserLocation {
    latitude: number;
    longitude: number;
  }