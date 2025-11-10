import { ConjuntoGrupoPermiso } from '../conjuntoGrupoPermiso/conjunto-grupo-permiso';
import { Permiso } from '../permiso/permiso';

export class Grupo implements ConjuntoGrupoPermiso {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string,
    public permisos: Permiso[],
    public grupos: Grupo[]
  ) {}
}
