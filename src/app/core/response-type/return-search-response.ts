import { ReturnResultResponse } from './return-response';
import { Distribuidora } from '../entities/distribuidora/distribuidora';
import { PersonaFisica } from '../entities/personaFisica/persona-fisica';
import { Presupuesto } from '../entities/presupuesto/presupuesto';
import { Categoria } from '../entities/categoria/categoria';
import { Producto } from '../entities/producto/producto';
import { DetallePresupuesto } from '../entities/detalle-presupuesto/detalle-presupuesto';

type NullOrUndefined = null | undefined;

export interface ReturnSearchResponse extends ReturnResultResponse {
  payload:
    | Distribuidora
    | Distribuidora[]
    | PersonaFisica
    | PersonaFisica[]
    | Presupuesto
    | Presupuesto[]
    | Categoria
    | Categoria[]
    | Producto
    | Producto[]
    | DetallePresupuesto
    | DetallePresupuesto[]
    | NullOrUndefined;
}
