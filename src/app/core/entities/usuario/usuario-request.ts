import { TipoUsuario } from './usuario';
import { Categoria } from '../categoria/categoria';
import { ConjuntoGrupoPermiso } from '../conjuntoGrupoPermiso/conjunto-grupo-permiso';

export interface UsuarioRequest {
  nombre: string;
  ciudad: string;
  codigoPostal: string;
  numeroTelefono: string;
  direccion?: string;
  descripcion?: string;
  usuario: {
    cuit: string | null;
    email: string;
    password?: string;
    tipoUsuario: TipoUsuario;
    conjunto: ConjuntoGrupoPermiso[];
  };
  categorias?: Categoria[];
}
