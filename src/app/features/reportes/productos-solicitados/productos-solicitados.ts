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
import { ReporteService } from '../../../shared/services/reporte/reporte';
import { ProductoService } from '../../../shared/services/producto/producto-service';
import { MarcaService } from '../../../shared/services/marca/marca-service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Categoria } from '../../../core/entities/categoria/categoria';
import { Producto } from '../../../core/entities/producto/producto';
import { Marca } from '../../../core/entities/marca/marca';

import * as chartjs from 'chart.js';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { ReporteProductosSolicitados } from '../../../core/entities/reporte/productosSolicitados/reporte-productos-solicitados';

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
  private productoService = inject(ProductoService);
  private marcaService = inject(MarcaService);
  private dialogService = inject(DialogService);
  private reporteService = inject(ReporteService);

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
  }

  async onProductoSeleccionado(producto: Producto) {
    this.productoSeleccionado.set(producto);
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
    }

    if (tipo === 'producto') {
      if (!this.productoSeleccionado()) {
        this.dialogService.showMessage(
          'Error',
          'Debe seleccionar un producto.',
        );
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
    this.realizarFase4();
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

  realizarFase4() {
    const categoriaElegida = this.categoriaSeleccionada();
    const fechaInicioElegida = this.fechaInicio();
    const fechaFinElegida = this.fechaFin();
    const tipoReporteElegido = this.tipoReporte();
    if (!categoriaElegida) {
      this.dialogService.showMessage(
        'Error',
        'Categoría no seleccionada para generar el gráfico.',
      );
      return;
    }
    if (!fechaFinElegida) {
      this.dialogService.showMessage(
        'Error',
        'Fecha fin no seleccionada para generar el gráfico.',
      );
      return;
    }
    if (!fechaInicioElegida) {
      this.dialogService.showMessage(
        'Error',
        'Fecha inicio no seleccionada para generar el gráfico.',
      );
      return;
    }
    if (tipoReporteElegido === 'general') {
      this.realizarReporteGeneral(
        categoriaElegida,
        fechaInicioElegida,
        fechaFinElegida,
      );
    } else if (tipoReporteElegido === 'producto') {
      const productoElegido = this.productoSeleccionado();
      if (!productoElegido) {
        this.dialogService.showMessage(
          'Error',
          'Producto no seleccionado para generar el gráfico.',
        );
        return;
      }
      this.realizarReporteProducto(
        categoriaElegida,
        fechaInicioElegida,
        fechaFinElegida,
        productoElegido,
      );
    } else if (tipoReporteElegido === 'marca') {
      const marcaElegida = this.marcaSeleccionada();
      if (!marcaElegida) {
        this.dialogService.showMessage(
          'Error',
          'Marca no seleccionada para generar el gráfico.',
        );
        return;
      }
      this.realizarReporteMarca(
        categoriaElegida,
        fechaInicioElegida,
        fechaFinElegida,
        marcaElegida,
      );
    } else {
      this.dialogService.showMessage(
        'Error',
        'Tipo de reporte no seleccionado para generar el gráfico.',
      );
      return;
    }
  }

  realizarReporteGeneral(
    categoriaElegida: Categoria,
    fechaInicioElegida: Date,
    fechaFinElegida: Date,
  ) {
    const resultado = this.reporteService.productosSolicitadosGeneral(
      categoriaElegida,
      fechaInicioElegida,
      fechaFinElegida,
    );
    resultado.subscribe((data) => {
      if (!data.success) {
        this.dialogService.showMessage(
          'Error',
          'Error al obtener datos para el gráfico: ' + data.message,
        );
        return;
      }
      if ((data.payload as ReporteProductosSolicitados[]).length === 0) {
        this.dialogService.showMessage(
          'Aviso',
          'No se encontraron datos para el gráfico en el rango de fechas seleccionado.',
        );
        this.resetear();
        return;
      }
      const reporteData = data.payload as ReporteProductosSolicitados[];
      this.generarGrafico(reporteData);
    });
  }

  realizarReporteMarca(
    categoriaElegida: Categoria,
    fechaInicioElegida: Date,
    fechaFinElegida: Date,
    marca: Marca,
  ) {
    const resultado = this.reporteService.productosSolicitadosMarca(
      categoriaElegida,
      fechaInicioElegida,
      fechaFinElegida,
      marca,
    );
    resultado.subscribe((data) => {
      if (!data.success) {
        this.dialogService.showMessage(
          'Error',
          'Error al obtener datos para el gráfico: ' + data.message,
        );
        return;
      }
      if ((data.payload as ReporteProductosSolicitados[]).length === 0) {
        this.dialogService.showMessage(
          'Aviso',
          'No se encontraron datos para el gráfico en el rango de fechas seleccionado. Intente con otra marca o rango de fechas.',
        );
        this.resetear();
        return;
      }
      const reporteData = data.payload as ReporteProductosSolicitados[];
      this.generarGrafico(reporteData);
    });
  }

  realizarReporteProducto(
    categoriaElegida: Categoria,
    fechaInicioElegida: Date,
    fechaFinElegida: Date,
    producto: Producto,
  ) {
    const resultado = this.reporteService.productosSolicitadosProducto(
      categoriaElegida,
      fechaInicioElegida,
      fechaFinElegida,
      producto,
    );
    resultado.subscribe((data) => {
      if (!data.success) {
        this.dialogService.showMessage(
          'Error',
          'Error al obtener datos para el gráfico: ' + data.message,
        );
        return;
      }
      if ((data.payload as ReporteProductosSolicitados[]).length === 0) {
        this.dialogService.showMessage(
          'Aviso',
          'No se encontraron datos para el gráfico en el rango de fechas seleccionado. Intente con otro producto o rango de fechas.',
        );
        this.resetear();
        return;
      }
      const reporteData = data.payload as ReporteProductosSolicitados[];
      this.generarGrafico(reporteData);
    });
  }

  procesarDatosParaGrafico(datos: ReporteProductosSolicitados[]) {
    const labelsProductos = datos.map((dato) => {
      if (this.tipoReporte() === 'general') {
        return `${dato.producto} - ${dato.marca}`;
      } else if (this.tipoReporte() === 'producto') {
        return `${dato.marca}`;
      } else if (this.tipoReporte() === 'marca') {
        return `${dato.producto}`;
      } else {
        return '';
      }
    });
    const porcentajes = datos.map((dato) => {
      return dato.porcentaje;
    });
    const porcentajeTotal = porcentajes.reduce((acc, val) => acc + val, 0);

    if (!(porcentajeTotal === 100)) {
      labelsProductos.push('Otros');
      const otrosPorcentaje = 100 - porcentajeTotal;
      porcentajes.push(otrosPorcentaje);
    }

    return { labelsProductos, porcentajes };
  }

  generarGrafico(datos: ReporteProductosSolicitados[]) {
    const datosProcesados = this.procesarDatosParaGrafico(datos);
    const labelsProductos = datosProcesados.labelsProductos;
    const porcentajes = datosProcesados.porcentajes;

    setTimeout(() => {
      const canvas = document.getElementById(
        'chartCanvas',
      ) as HTMLCanvasElement;
      if (canvas) {
        new chartjs.Chart(canvas, {
          type: 'pie',
          data: {
            labels: [...labelsProductos],
            datasets: [
              {
                label: 'Porcentaje',
                data: [...porcentajes],
                borderWidth: 1,
              },
            ],
          },
        });
      }
    }, 100); // Pequeño delay para asegurar que el canvas esté renderizado por el @if
  }
}
