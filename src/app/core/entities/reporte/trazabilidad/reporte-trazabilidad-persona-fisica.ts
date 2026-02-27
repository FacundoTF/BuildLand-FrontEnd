export interface ReporteTrazabilidadPersonaFisica {
  cuit: string;
  nombre: string;
  numeroTelefono: string;
  ciudad: string;
  email: string;
  estado: boolean;
  accion: 'REGISTRO' | 'MODIFICACION' | 'ELIMINACION';
  fechaAccion: string;
}
