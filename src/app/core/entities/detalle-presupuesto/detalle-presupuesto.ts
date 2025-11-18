import { Marca } from '../marca/marca';
import { Presupuesto } from '../presupuesto/presupuesto';
import { Producto } from '../producto/producto';

export class DetallePresupuesto {
  constructor(
    public idDetallePresupuesto: number | null,
    public producto: Producto,
    public cantidad: number,
    public presupuesto: Presupuesto | null,
  ) {}
}
