import { TipoUsuario } from '../../usuario/usuario';

export interface ReporteTrazabilidadLogin {
  id: number;
  cuit: string;
  nombreUsuario: string;
  tipoUsuario: TipoUsuario;
  fecha: Date;
  accion: 'LOGIN' | 'LOGOUT';
}
