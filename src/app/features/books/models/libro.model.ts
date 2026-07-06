export interface LibroRequest {
  titulo: string;
  autor: string;
  descripcion: string;
  imagenUrl: string;
  apiId: string;
  fechaPublicacion: string;
  genero: string;
}

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  descripcion: string;
  imagenUrl: string;
  apiId: string;
  fechaPublicacion: string;
  genero: string;
}
