import { Grupo } from '../grupo/grupo';

export enum TipoUsuario {
  DISTRIBUIDORA = 'DISTRIBUIDORA',
  EMPLEADO = 'EMPLEADO',
  PERSONA_FISICA = 'PERSONA_FISICA',
}

export class Usuario {
  constructor(
    public cuit: string | null,
    public tipoUsuario: TipoUsuario,
    public idReferencia: string,
    public grupo: Grupo | null,
    public email: string,
    public password: string,
  ) {}
}
