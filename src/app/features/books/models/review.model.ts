export interface ReviewRequest {
  usuarioId: number;
  libroId: number;
  calificacion: number;
  comentario: string;
}

export interface Review {
  id: number;
  usuarioId: number;
  libroId: number;
  calificacion: number;
  comentario: string;
  fecha: string;
}
