import { Presupuesto } from '../presupuesto/presupuesto';
import { ProductoMarca } from '../producto-marca';

export class DetallePresupuesto {
  constructor(
    public idDetallePresupuesto: number,
    public productoMarca: ProductoMarca,
    public cantidad: number,
    public presupuesto: Presupuesto | null,
  ) {}
}
