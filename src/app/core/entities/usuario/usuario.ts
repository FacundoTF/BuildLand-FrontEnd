import { ConjuntoGrupoPermiso } from '../conjuntoGrupoPermiso/conjunto-grupo-permiso';
import { Distribuidora } from '../distribuidora/distribuidora';
import { Empleado } from '../empleado/empleado';
import { PersonaFisica } from '../personaFisica/persona-fisica';
export type UsuarioTipo = Distribuidora | PersonaFisica | Empleado;

export class Usuario {
  private tipo?: UsuarioTipo;
  private grupos: [];
  private email: string;
  private password: string;

  public getGrupos() {
    return this.grupos;
  }
  public setGrupos(grupos: []) {
    this.grupos = grupos;
  }

  public getEmail() {
    return this.email;
  }
  public setEmail(email: string) {
    this.email = email;
  }

  public getPassword() {
    return this.password;
  }
  public setPassword(password: string) {
    this.password = password;
  }

  public getTipo() {
    return this.tipo;
  }
  public setTipo(tipo: UsuarioTipo) {
    this.tipo = tipo;
  }

  constructor(grupos: [], email: string, password: string, tipo?: UsuarioTipo) {
    this.grupos = grupos;
    this.email = email;
    this.password = password;
    this.tipo = tipo;
  }
}
