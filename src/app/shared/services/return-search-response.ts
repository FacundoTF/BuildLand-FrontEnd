import { ReturnResultResponse } from './return-response';
import { Distribuidora } from '../../core/entities/distribuidora/distribuidora';
import { PersonaFisica } from '../../core/entities/personaFisica/persona-fisica';
import { Presupuesto } from '../../core/entities/presupuesto/presupuesto';
import { Categoria } from '../../core/entities/categoria/categoria';
import { Producto } from '../../core/entities/producto/producto';
import { DetallePresupuesto } from '../../core/entities/detalle-presupuesto/detalle-presupuesto';

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
