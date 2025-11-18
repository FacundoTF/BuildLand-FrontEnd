import { Usuario } from '../usuario/usuario';
import { Categoria } from '../categoria/categoria';

export class Distribuidora {
  constructor(
    public usuario: Usuario,
    public cuit: string,
    public nombre: string,
    public direccion: string,
    public numeroTelefono: string,
    public descripcion: string,
    public codigoPostal: string,
    public ciudad: string,
    public categorias: Categoria[]
  ) {}
}
