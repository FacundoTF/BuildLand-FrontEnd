import { Cotizacion } from '../cotizacion/cotizacion';
import { Marca } from '../marca/marca';
import { Producto } from '../producto/producto';

export class DetalleCotizacion {
  constructor(
    public idDetalleCotizacion: number,
    public producto: Producto,
    public precioUnitario: number,
    public cotizacion: Cotizacion,
    public marca: Marca
  ) {}
}
