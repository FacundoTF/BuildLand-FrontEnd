import { Usuario } from '../usuario/usuario';

export class PersonaFisica {
  constructor(
    public usuario: Usuario,
    public cuit: string,
    public nombre: string,
    public numeroTelefono: string,
    public codigoPostal: string,
    public ciudad: string
  ) {}
}
