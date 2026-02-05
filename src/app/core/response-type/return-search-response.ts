import { ReturnResultResponse } from './return-response';
import { Distribuidora } from '../entities/distribuidora/distribuidora';
import { PersonaFisica } from '../entities/personaFisica/persona-fisica';
import { Presupuesto } from '../entities/presupuesto/presupuesto';
import { Categoria } from '../entities/categoria/categoria';
import { Producto } from '../entities/producto/producto';
import { DetallePresupuesto } from '../entities/detalle-presupuesto/detalle-presupuesto';
import { Cotizacion } from '../entities/cotizacion/cotizacion';
import { DetalleCotizacion } from '../entities/detalle-cotizacion/detalle-cotizacion';
import { ResultadoCotizacion } from '../entities/cotizacion/resultado-cotizacion';
import { Usuario } from '../entities/usuario/usuario';
import { ReporteProductosSolicitados } from '../entities/reporte/productosSolicitados/reporte-productos-solicitados';
import { MensajeRechazoCotizacion } from '../entities/cotizacion/mensaje-rechazo-cotizacion';

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
    | Cotizacion
    | Cotizacion[]
    | DetalleCotizacion
    | DetalleCotizacion[]
    | ResultadoCotizacion
    | ResultadoCotizacion[]
    | Usuario
    | ReporteProductosSolicitados[]
    | MensajeRechazoCotizacion[]
    | NullOrUndefined;
}
