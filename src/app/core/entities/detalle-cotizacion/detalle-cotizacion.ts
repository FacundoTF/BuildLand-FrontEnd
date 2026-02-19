import { Cotizacion } from '../cotizacion/cotizacion';
import { ProductoMarca } from '../producto-marca';

export class DetalleCotizacion {
  constructor(
    public idDetalleCotizacion: number,
    public productoMarca: ProductoMarca,
    public importe: number,
    public cotizacion: Cotizacion,
  ) {}
}
