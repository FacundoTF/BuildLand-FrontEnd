import { ConjuntoGrupoPermiso } from '../conjuntoGrupoPermiso/conjunto-grupo-permiso';
import { Distribuidora } from '../distribuidora/distribuidora';
import { Empleado } from '../empleado/empleado';
import { PersonaFisica } from '../personaFisica/persona-fisica';

/**
 * Clase que representa un usuario del sistema.
 * Puede ser de tipo Distribuidora, Empleado o PersonaFisica.
 */
// Si el usuario es una instancia de Distribuidora o PersonaFisica, tendrá un conjunto de grupos y permisos especificos. No se podrán cambiar. Caso contrario es el del empleado.

export class Usuario {
  private tipo: Distribuidora | Empleado | PersonaFisica;
  private conjuntoGrupoPermiso: ConjuntoGrupoPermiso[];
  private correoElectronico: string;
  private contraseña: string;

  constructor(
    tipo: Distribuidora | Empleado | PersonaFisica,
    conjuntoGrupoPermiso: ConjuntoGrupoPermiso[],
    correoElectronico?: string,
    contraseña?: string
  );
  constructor(
    tipo: Distribuidora | Empleado | PersonaFisica,
    conjuntoGrupoPermiso?: ConjuntoGrupoPermiso[],
    correoElectronico?: string,
    contraseña?: string
  );
  constructor(
    tipo: Distribuidora | Empleado | PersonaFisica,
    conjuntoGrupoPermiso: ConjuntoGrupoPermiso[],
    correoElectronico: string,
    contraseña: string
  ) {
    this.tipo = tipo;
    this.conjuntoGrupoPermiso = conjuntoGrupoPermiso;
    this.correoElectronico = correoElectronico;
    this.contraseña = contraseña;
  }
}
