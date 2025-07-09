// Tipo para la entidad Distribuidora
export interface Distribuidora {
  id: string; // CUIT
  nombre: string;
  direccion?: string;
  numeroTelefono?: string;
  descripcion?: string;
  codigoPostal?: string;
}

// Tipo para crear una nueva distribuidora
export type NuevaDistribuidora = Omit<Distribuidora, 'id'> & {
  cuit: string;
};

// Tipo para actualizar una distribuidora
export type DistribuidoraActualizada = Partial<Omit<Distribuidora, 'id'>>;

// Tipo para respuestas de error de la API
export interface ErrorResponse {
  message: string;
  status: number;
}
