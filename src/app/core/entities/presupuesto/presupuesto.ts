import { Categoria } from '../categoria/categoria';
import { Cotizacion } from '../cotizacion/cotizacion';
import { DetallePresupuesto } from '../detalle-presupuesto/detalle-presupuesto';
import { PersonaFisica } from '../personaFisica/persona-fisica';

export class Presupuesto {
  constructor(
    public idPresupuesto: number,
    public persona: PersonaFisica,
    public categoria: Categoria,
    public fecha: Date,
    public detalles: DetallePresupuesto[],
    public cotizaciones: Cotizacion[]
  ) {}
}
