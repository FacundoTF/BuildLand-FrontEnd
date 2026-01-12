import { Cotizacion } from './cotizacion';
import { DetalleCotizacion } from '../detalle-cotizacion/detalle-cotizacion';

export class ResultadoCotizacion {
  constructor(
    public id: number,
    public idDistribuidora: number,
    public nombreDistribuidora: string,
    public cuitDistribuidora: string,
    public fecha: Date,
    public importeTotal: number,
    public detalles: DetalleCotizacion[],
  ) {}
}
