import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoriaService } from '../../../shared/services/categoria/categoria-service';
import { ProductoService } from '../../../shared/services/producto/producto-service';
import { MarcaService } from '../../../shared/services/marca/marca-service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { Producto } from '../../../core/entities/producto/producto';
import { Marca } from '../../../core/entities/marca/marca';

import * as chartjs from 'chart.js';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';

chartjs.Chart.register(...chartjs.registerables);
@Component({
  selector: 'app-productos-solicitados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './productos-solicitados.html',
  styleUrl: './productos-solicitados.scss',
  providers: [],
})
export class ProductosSolicitados implements OnInit {
  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);
  private marcaService = inject(MarcaService);
  private dialogService = inject(DialogService);

  // Fases
  faseActual = signal<number>(1);
  fase1Confirmada = signal<boolean>(false);
  fase2Confirmada = signal<boolean>(false);
  fase3Confirmada = signal<boolean>(false);

  categoriasData = input.required<ReturnSearchResponse>();

  // Fase 1: Categoría
  categorias = signal<Categoria[]>([]);
  categoriaSeleccionada = signal<Categoria | null>(null);

  // Fase 2: Tipo de Reporte
  tipoReporte = signal<'general' | 'marca' | 'producto' | null>(null);

  // Datos Fase 2
  marcas = signal<Marca[]>([]);
  productos = signal<Producto[]>([]);

  marcaSeleccionada = signal<Marca | null>(null);
  productoSeleccionado = signal<Producto | null>(null);

  // Fase 3: Fechas
  fechaInicio = signal<Date | null>(null);
  fechaFin = signal<Date | null>(null);

  // Computed checks
  resetEnabled = computed(() => this.fase1Confirmada());

  ngOnInit() {
    const categoriasData = this.categoriasData();
    if (categoriasData.success) {
      const data = categoriasData.payload as Categoria[];
      if (data.length <= 0) {
        this.dialogService.showMessage(
          'Aviso',
          'No se encontraron categorías.',
        );
        return;
      }
      this.categorias.set(data);
    } else {
      this.dialogService.showMessage(
        'Error',
        'Error al cargar categorías: ' + categoriasData.message,
      );
    }
  }

  async confirmarFase1() {
    if (!this.categoriaSeleccionada()) {
      this.dialogService.showMessage(
        'Error',
        'Debe seleccionar una categoría.',
      );
      return;
    }
    this.fase1Confirmada.set(true);
    this.faseActual.set(2);

    // Pre-cargar datos si es necesario o esperar a selección en fase 2
    // Se cargarán dinámicamente según la selección en fase 2
  }

  cambioTipoReporte(tipo: 'general' | 'marca' | 'producto') {
    if (this.fase2Confirmada()) return;

    this.tipoReporte.set(tipo);
    this.marcaSeleccionada.set(null);
    this.productoSeleccionado.set(null);
    this.marcas.set([]);
    this.productos.set([]);

    if (tipo === 'marca' || tipo === 'producto') {
      this.cargarDatosFase2(tipo);
    }
  }

  async cargarDatosFase2(tipo: 'marca' | 'producto') {
    const categoria = this.categoriaSeleccionada();
    if (!categoria) return;

    if (tipo === 'marca') {
      const marcas = await this.marcaService.traerMarcas(categoria);
      this.marcas.set(marcas);
    } else if (tipo === 'producto') {
      const response =
        await this.productoService.traerProductosPorCategoria(categoria);
      if (response.success) {
        this.productos.set(response.payload as Producto[]);
      }
    }
  }

  async onMarcaSeleccionada(marca: Marca) {
    this.marcaSeleccionada.set(marca);
    if (this.tipoReporte() === 'marca') {
      // Relevar productos de la categoría (ya tenemos la categoría) y marca elegida.
      // Dado que no hay endpoint para filtrar por marca, traemos todos de la categoría.
      const categoria = this.categoriaSeleccionada()!;
      const response =
        await this.productoService.traerProductosPorCategoria(categoria);
      if (response.success) {
        this.productos.set(response.payload as Producto[]);
        // Aquí filtraríamos si tuviéramos la relación en el frontend
      }
    }
  }

  async onProductoSeleccionado(producto: Producto) {
    this.productoSeleccionado.set(producto);
    if (this.tipoReporte() === 'producto') {
      // Relevar marcas de la categoría y producto elegido.
      const categoria = this.categoriaSeleccionada()!;
      const marcas = await this.marcaService.traerMarcas(categoria);
      this.marcas.set(marcas);
      // Filtrado omitido por falta de relación explícita
    }
  }

  async confirmarFase2() {
    const tipo = this.tipoReporte();
    if (!tipo) {
      this.dialogService.showMessage(
        'Error',
        'Debe seleccionar un tipo de reporte.',
      );
      return;
    }

    if (tipo === 'marca') {
      if (!this.marcaSeleccionada()) {
        this.dialogService.showMessage('Error', 'Debe seleccionar una marca.');
        return;
      }
      if (!this.productoSeleccionado()) {
        this.dialogService.showMessage(
          'Error',
          'Debe seleccionar un producto.',
        );
        return;
      }
    }

    if (tipo === 'producto') {
      if (!this.productoSeleccionado()) {
        this.dialogService.showMessage(
          'Error',
          'Debe seleccionar un producto.',
        );
        return;
      }
      if (!this.marcaSeleccionada()) {
        this.dialogService.showMessage('Error', 'Debe seleccionar una marca.');
        return;
      }
    }

    this.fase2Confirmada.set(true);
    this.faseActual.set(3);
  }

  confirmarFase3() {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();

    if (!inicio || !fin) {
      this.dialogService.showMessage('Error', 'Debe seleccionar ambas fechas.');
      return;
    }

    if (inicio > fin) {
      this.dialogService.showMessage(
        'Error',
        'La fecha de inicio no puede ser mayor a la fecha de fin.',
      );
      return;
    }

    this.fase3Confirmada.set(true);
    this.faseActual.set(4);
    this.generarGrafico();
  }

  resetear() {
    this.fase1Confirmada.set(false);
    this.fase2Confirmada.set(false);
    this.fase3Confirmada.set(false);
    this.faseActual.set(1);

    this.categoriaSeleccionada.set(null);
    this.tipoReporte.set(null);
    this.marcaSeleccionada.set(null);
    this.productoSeleccionado.set(null);
    this.fechaInicio.set(null);
    this.fechaFin.set(null);
    this.marcas.set([]);
    this.productos.set([]);

    // Remove chart if exists (not implemented logic but clearing state)
  }

  generarGrafico() {
    console.log('Generando gráfico con:', {
      categoria: this.categoriaSeleccionada(),
      tipo: this.tipoReporte(),
      marca: this.marcaSeleccionada(),
      producto: this.productoSeleccionado(),
      inicio: this.fechaInicio(),
      fin: this.fechaFin(),
    });

    // Ejemplo básico de inicialización de Chart.js
    setTimeout(() => {
      const canvas = document.getElementById(
        'chartCanvas',
      ) as HTMLCanvasElement;
      if (canvas) {
        new chartjs.Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Enero', 'Febrero', 'Marzo'],
            datasets: [
              {
                label: 'Reporte de Productos',
                data: [12, 19, 3],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }, 100); // Pequeño delay para asegurar que el canvas esté renderizado por el @if
  }
}
