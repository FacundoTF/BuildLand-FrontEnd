import { Grupo } from '../grupo/grupo';
import { ConjuntoGrupoPermiso } from '../conjuntoGrupoPermiso/conjunto-grupo-permiso';

export enum TipoUsuario {
  DISTRIBUIDORA = 'DISTRIBUIDORA',
  EMPLEADO = 'EMPLEADO',
  PERSONA_FISICA = 'PERSONA_FISICA',
}

export class Usuario {
  constructor(
    public cuit: string | null,
    public tipoUsuario: TipoUsuario,
    public estado: boolean | null,
    public conjunto: ConjuntoGrupoPermiso | ConjuntoGrupoPermiso[] | null,
    public email: string,
    public password: string,
  ) {}
}
