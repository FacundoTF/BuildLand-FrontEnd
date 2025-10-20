import { ConjuntoGrupoPermiso } from '../conjuntoGrupoPermiso/conjunto-grupo-permiso';
import { Permiso } from '../permiso/permiso';

export class Grupo implements ConjuntoGrupoPermiso {
  private nombre: string;
  private descripcion: string;
  private permisos: Permiso[];
  private grupos: Grupo[];

  constructor(
    nombre: string,
    descripcion: string,
    permisos: Permiso[],
    grupos: Grupo[]
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.permisos = permisos;
    this.grupos = grupos;
  }

  Nombre(): string {
    return this.nombre;
  }
  Descripcion(): string {
    return this.descripcion;
  }
  Permisos(): Permiso[] {
    return this.permisos;
  }
  Grupos(): Grupo[] {
    return this.grupos;
  }
}
