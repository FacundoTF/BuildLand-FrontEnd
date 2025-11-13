import { Component, inject, signal } from '@angular/core';
import { PresupuestoServicio } from '../../../shared/services/presupuesto/presupuesto-servicio';
import { CategoriaService } from '../../../shared/services/categoria/categoria-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Marca } from '../../../core/entities/marca/marca';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { Producto } from '../../../core/entities/producto/producto';
import { MarcaService } from '../../../shared/services/marca/marca-service';
import { ProductoService } from '../../../shared/services/producto/producto-service';
import { Observable } from 'rxjs';
import {
  MatGridList,
  MatGridTileHeaderCssMatStyler,
} from '@angular/material/grid-list';

@Component({
  selector: 'app-realizar-presupuesto',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatGridList,
    MatGridTileHeaderCssMatStyler,
  ],
  templateUrl: './realizar-presupuesto.html',
  styleUrl: './realizar-presupuesto.scss',
})
export class RealizarPresupuesto {
  private presupuestoServicio = inject(PresupuestoServicio);
  private categoriaService = inject(CategoriaService);
  private marcaService = inject(MarcaService);
  private productoService = inject(ProductoService);

  presupuestoHabilitado = signal(false);

  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  productos: Producto[] = [];

  selectedCategory = new FormControl<Categoria | null>(null);

  constructor() {
    this.categoriaService.traerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
    });
  }
  async habilitarPresupuesto(categoria: Categoria) {
    let contenedorPresupuesto = document.getElementById(
      'presupuesto-container',
    );
    if (!contenedorPresupuesto) {
      return;
    }
    this.presupuestoHabilitado.set(true);
    contenedorPresupuesto.style.display = 'block';

    await this.buscarMarcas(categoria);
    await this.buscarProductos(categoria);
  }
  async buscarProductos(categoria: Categoria) {
    this.productos =
      await this.productoService.traerProductosPorCategoria(categoria);
  }
  async buscarMarcas(categoria: Categoria) {
    this.marcas = await this.marcaService.traerMarcas(categoria);
  }
}
