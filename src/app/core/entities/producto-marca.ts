import { Producto } from './producto/producto';
import { Marca } from './marca/marca';

export class ProductoMarca {
  constructor(
    public producto: Producto,
    public marca: Marca,
  ) {}
}
