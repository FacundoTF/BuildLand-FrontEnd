import { Component, inject, signal, computed } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

interface PresupuestoItem {
  producto: string;
  marca: string;
  cantidad: number;
}

@Component({
  selector: 'app-realizar-presupuesto',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
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
  selectedProduct = new FormControl<string | null>(null);
  selectedMarca = new FormControl<string | null>(null);
  cantidad = new FormControl<number>(1);

  presupuestoItems = signal<PresupuestoItem[]>([]);
  mostrarTabla = computed(() => this.presupuestoItems().length > 0);
  displayedColumns: string[] = ['producto', 'marca', 'cantidad', 'acciones'];

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

  agregarAlPresupuesto() {
    const producto = this.selectedProduct.value;
    const marca = this.selectedMarca.value;
    const cantidadValue = this.cantidad.value;
    const presupuestoItems = this.presupuestoItems();
    let itemRepetido = false;

    if (!producto || !marca || !cantidadValue) {
      alert(
        'Debe completar todos los campos para agregar un producto al presupuesto.',
      );
      return;
    }

    if (cantidadValue <= 0) {
      alert('La cantidad debe ser mayor que cero.');
      return;
    }

    const item: PresupuestoItem = {
      producto: producto,
      marca: marca,
      cantidad: cantidadValue,
    };

    for (const presupuestoItem of presupuestoItems) {
      if (presupuestoItem.producto === item.producto) {
        itemRepetido = true;
      }
    }

    if (itemRepetido) {
      alert('No se puede colocar el mismo producto en el presupuesto');
      return;
    }

    this.presupuestoItems.update((items) => [...items, item]);

    this.selectedProduct.reset();
    this.selectedMarca.reset();
    this.cantidad.setValue(1);
  }

  removerItem(index: number) {
    this.presupuestoItems.update((items) =>
      items.filter((_, i) => i !== index),
    );
  }
}
