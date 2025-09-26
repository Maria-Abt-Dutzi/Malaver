// models/artwork.model.ts
export interface Artwork {
  id: string;  // Cambiado de number a string
  titulo: string;
  medidas: string;
  tecnica: string;
  estilo?: string;
  genero: string;
  descripcion?: string;
  estado: string;
  precio: number;
  moneda: string;
  imagen: string;
  anio: number;
  categoria: string;
  vendido: boolean;
}
