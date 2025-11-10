import { ConjuntoGrupoPermiso } from '../conjuntoGrupoPermiso/conjunto-grupo-permiso';

export class Permiso implements ConjuntoGrupoPermiso {
  constructor(public id: number, public nombre: string) {}
}
