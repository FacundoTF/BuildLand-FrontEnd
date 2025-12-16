import {
  Component,
  inject,
  signal,
  computed,
  input,
  OnInit,
} from '@angular/core';
import { PresupuestoServicio } from '../../../shared/services/presupuesto/presupuesto-servicio';
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
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Presupuesto } from '../../../core/entities/presupuesto/presupuesto';
import { Usuario, TipoUsuario } from '../../../core/entities/usuario/usuario';
import { DetallePresupuesto } from '../../../core/entities/detalle-presupuesto/detalle-presupuesto';
import { UsuarioServicio } from '../../../shared/services/usuario-servicio';
import { DialogService } from '../../../shared/services/dialog.service';
import { ReturnSearchResponse } from '../../../shared/services/return-search-response';

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
export class RealizarPresupuesto implements OnInit {
  private presupuestoServicio = inject(PresupuestoServicio);
  private marcaService = inject(MarcaService);
  private productoService = inject(ProductoService);
  private usuarioService = inject(UsuarioServicio);
  private dialogService = inject(DialogService);

  categoriasData = input.required<ReturnSearchResponse>();

  presupuestoHabilitado = signal(false);
  categoriaConfirmada = signal(false);

  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  productos: Producto[] = [];

  selectedCategory = new FormControl<Categoria | null>({
    value: null,
    disabled: false,
  });
  selectedProduct = new FormControl<string | null>(null);
  selectedMarca = new FormControl<string | null>(null);
  cantidad = new FormControl<number>(1);

  presupuestoItems = signal<PresupuestoItem[]>([]);
  hayProductosEnPresupuesto = computed(
    () => this.presupuestoItems().length > 0,
  );
  displayedColumns: string[] = ['producto', 'marca', 'cantidad', 'acciones'];

  ngOnInit() {
    this.categorias = this.categoriasData().payload as Categoria[];
  }
  async habilitarPresupuesto(categoria: Categoria) {
    const contenedorPresupuesto = document.getElementById(
      'presupuesto-container',
    );
    if (!contenedorPresupuesto) {
      return;
    }
    this.presupuestoHabilitado.set(true);
    this.categoriaConfirmada.set(true);
    this.selectedCategory.disable();
    contenedorPresupuesto.classList.add('visible');

    await this.buscarMarcas(categoria);
    await this.buscarProductos(categoria);
  }

  async buscarProductos(categoria: Categoria) {
    const resultado =
      await this.productoService.traerProductosPorCategoria(categoria);
    if (resultado.success) {
      this.productos = resultado.payload as Producto[];
      this.productos.forEach((producto: Producto) => {});
    } else {
      this.dialogService.showMessage('Error', resultado.message).subscribe();
      if (resultado.statusCode === 401) {
        this.usuarioService.cerrarSesion();
      }
    }
  }

  async buscarMarcas(categoria: Categoria) {
    this.marcas = await this.marcaService.traerMarcas(categoria);
  }

  async confirmarPresupuesto() {
    /*
     * 1) Obtener los items del presupuesto -- HECHO
     * 2) Obtener la categoria del presupuesto -- HECHO
     * 3) Obtener el usuario actual, osea la persona fisica -- PENDIENTE (FALTA IMPLEMENTAR)
     * 4) Crear una nueva instancia de Presupuesto con los items y la categoria
     * 5) Hacer la peticion POST del servicio para guardar el presupuesto
     * 6) Mostrar un mensaje de confirmacion al usuario o de error si no se pudo guardar
     * */
    const items = this.presupuestoItems();
    const categoria = this.selectedCategory.value;
    const personaFisicaPlaceHolder = new PersonaFisica(
      new Usuario('20438442317', TipoUsuario.PERSONA_FISICA, '', null, '', ''),
      '20438442317',
      'Facu',
      '3416614462',
      '2000',
      'Rosario',
    );

    if (!categoria) {
      return;
    }

    let detallesPresupuesto = new Array<DetallePresupuesto>();

    const presupuesto = new Presupuesto(
      -1,
      personaFisicaPlaceHolder,
      categoria,
      null,
      null,
      detallesPresupuesto,
      null,
    );

    items.forEach((item) => {
      detallesPresupuesto.push(
        new DetallePresupuesto(
          null,
          new Producto(
            null,
            item.producto,
            null,
            new Marca(null, item.marca, null),
          ),
          item.cantidad,
          null,
        ),
      );
    });

    const result =
      await this.presupuestoServicio.agregarPresupuesto(presupuesto);
    if (result.success) {
      this.dialogService.showMessage('Éxito', result.message).subscribe(() => {
        this.resetearPresupuesto();
      });
    } else {
      this.dialogService.showMessage('Error', result.message).subscribe();
      if (result.statusCode === 401) {
        this.usuarioService.cerrarSesion();
      }
    }
  }

  agregarAlPresupuesto() {
    const producto = this.selectedProduct.value;
    const marca = this.selectedMarca.value;
    const cantidadValue = this.cantidad.value;
    const presupuestoItems = this.presupuestoItems();
    let itemRepetido = false;

    if (!producto || !marca || !cantidadValue) {
      this.dialogService
        .showMessage(
          'Error',
          'Debe completar todos los campos para agregar un producto al presupuesto.',
        )
        .subscribe();
      return;
    }

    if (cantidadValue <= 0) {
      this.dialogService
        .showMessage('Error', 'La cantidad debe ser mayor que cero.')
        .subscribe();
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
      this.dialogService
        .showMessage(
          'Error',
          'No se puede colocar el mismo producto en el presupuesto',
        )
        .subscribe();
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

  resetearPresupuesto() {
    this.categoriaConfirmada.set(false);
    this.presupuestoHabilitado.set(false);
    this.selectedCategory.reset();
    this.selectedCategory.enable();
    this.selectedProduct.reset();
    this.selectedMarca.reset();
    this.cantidad.setValue(1);
    this.presupuestoItems.set([]);
    const contenedorPresupuesto = document.getElementById(
      'presupuesto-container',
    );
    if (contenedorPresupuesto) {
      contenedorPresupuesto.classList.remove('visible');
    }
  }
}
