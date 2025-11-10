import { Usuario } from '../usuario/usuario';

export class Empleado {
  constructor(
    public usuario: Usuario,
    public cuit: string,
    public nombre: string,
    public numeroTelefono: string,
    public direccion: string,
    public codigoPostal: string,
    public ciudad: string
  ) {}
}
