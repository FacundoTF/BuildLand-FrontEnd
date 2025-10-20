import { ConjuntoGrupoPermiso } from '../conjuntoGrupoPermiso/conjunto-grupo-permiso';

export class Permiso implements ConjuntoGrupoPermiso {
  private nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  Nombre(): string {
    return this.nombre;
  }
}
