import { Presupuesto } from '../presupuesto/presupuesto';
import { ProductoMarca } from '../producto-marca';

export class DetallePresupuesto {
  constructor(
    public id: number,
    public productoMarca: ProductoMarca,
    public cantidad: number,
    public presupuesto: Presupuesto | null,
  ) {}
}
