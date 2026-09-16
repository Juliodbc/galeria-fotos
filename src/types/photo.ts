export interface Photo {
  id: string;
  dataUrl: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
  altitude?: number | null;
}
