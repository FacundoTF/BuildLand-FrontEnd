import { Categoria } from '../categoria/categoria';
import { Cotizacion } from '../cotizacion/cotizacion';
import { DetallePresupuesto } from '../detalle-presupuesto/detalle-presupuesto';
import { PersonaFisica } from '../personaFisica/persona-fisica';

export class Presupuesto {
  constructor(
    public id: number,
    public persona: PersonaFisica | null,
    public categoria: Categoria,
    public fecha: Date | null,
    public fechaLimite: Date | null,
    public detalles: DetallePresupuesto[],
    public cotizaciones: Cotizacion[] | null,
  ) {}
}
