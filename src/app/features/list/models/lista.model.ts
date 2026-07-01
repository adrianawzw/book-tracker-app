export interface Lista {
  id: number;
  nombre: string;
  userId: number;
}

export interface ListaRequest {
  nombre: string;
  userId: number | null;
}

export interface LibroEnLista {
  id: number;
  libroId: number;
  listaId: number;
  fechaAgregado: string;
}

export interface LibroEnListaRequest {
  libroId: number;
  listaId: number;
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
