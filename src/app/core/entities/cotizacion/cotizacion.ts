import { DetalleCotizacion } from '../detalle-cotizacion/detalle-cotizacion';
import { Distribuidora } from '../distribuidora/distribuidora';
import { Presupuesto } from '../presupuesto/presupuesto';

export class Cotizacion {
  constructor(
    public idCotizacion: number,
    public detalles: DetalleCotizacion[],
    public distribuidora: Distribuidora,
    public fecha: Date,
    public presupuesto: Presupuesto
  ) {}
}
