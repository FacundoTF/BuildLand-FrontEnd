import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReporteService } from '../../../shared/services/reporte/reporte';
import { DialogService } from '../../../shared/services/dialog.service';
import * as chartjs from 'chart.js';
import { ReporteMensajesCotizacionRechazo } from '../../../core/entities/reporte/mensajesCotizacionRechazo/reporte-mensajes-cotizacion-rechazo';
import { ReporteMensajesCotizacionRechazoGral } from '../../../core/entities/reporte/mensajesCotizacionRechazo/reporte-mensajes-cotizacion-rechazo-gral';

chartjs.Chart.register(...chartjs.registerables);

@Component({
  selector: 'app-cotizaciones-perdidas-ganadas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './cotizaciones-perdidas-ganadas.html',
  styleUrl: './cotizaciones-perdidas-ganadas.scss',
})
export class CotizacionesPerdidasGanadas {
  private reporteService = inject(ReporteService);
  private dialogService = inject(DialogService);

  // Fases
  faseActual = signal<number>(1);
  fase1Confirmada = signal<boolean>(false);
  fase2Confirmada = signal<boolean>(false);

  // Fase 1: Fechas
  fechaInicio = signal<Date | null>(null);
  fechaFin = signal<Date | null>(null);

  // Fase 2: Tipo de Reporte Rechazo
  tipoReporte = signal<'general' | 'categoria' | null>(null);

  // Referencias a los charts para destruirlos si se resetea
  charts: chartjs.Chart[] = [];

  confirmarFase1() {
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

    this.fase1Confirmada.set(true);
    this.faseActual.set(2);
  }

  confirmarFase2() {
    if (!this.tipoReporte()) {
      this.dialogService.showMessage(
        'Error',
        'Debe seleccionar un tipo de reporte para los mensajes de rechazo.',
      );
      return;
    }
    this.fase2Confirmada.set(true);
    this.faseActual.set(3);
    this.generarReportes();
  }

  resetear() {
    this.fase1Confirmada.set(false);
    this.fase2Confirmada.set(false);
    this.faseActual.set(1);

    this.fechaInicio.set(null);
    this.fechaFin.set(null);
    this.tipoReporte.set(null);

    // Limpiar charts
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }

  generarReportes() {
    const inicio = this.fechaInicio()!;
    const fin = this.fechaFin()!;
    const tipo = this.tipoReporte()!;

    // 1. Cotizaciones Ganadas/Perdidas
    this.reporteService
      .cotizacionesGanadasPerdidas(inicio, fin)
      .subscribe((res) => {
        if (res.success) {
          const data = res.payload as ReporteMensajesCotizacionRechazo[];
          if (data.length > 0) {
            this.generarGraficoGanadasPerdidas(data);
          } else {
            this.dialogService.showMessage(
              'Aviso',
              'No hay datos de cotizaciones ganadas/perdidas para el rango de fechas seleccionado.',
            );
          }
        } else {
          this.dialogService.showMessage(
            'Error',
            'Error al obtener cotizaciones ganadas/perdidas.',
          );
        }
      });

    // 2. Mensajes de Rechazo
    if (tipo === 'general') {
      this.reporteService
        .mensajesRechazoCotizacionGeneral(inicio, fin)
        .subscribe((res) => {
          if (res.success) {
            const data = res.payload as ReporteMensajesCotizacionRechazo[];
            if (data.length > 0) {
              this.generarGraficoRechazoGeneral(data);
            }
          } else {
            this.dialogService.showMessage(
              'Error',
              'Error al obtener mensajes de rechazo general.',
            );
          }
        });
    } else {
      this.reporteService
        .mensajesRechazoCotizacion(inicio, fin)
        .subscribe((res) => {
          if (res.success) {
            const data = res.payload as Record<
              string,
              ReporteMensajesCotizacionRechazoGral[]
            >;
            // verificar si hay keys
            if (Object.keys(data).length > 0) {
              this.generarGraficosRechazoCategoria(data);
            }
          } else {
            this.dialogService.showMessage(
              'Error',
              'Error al obtener mensajes de rechazo por categoría.',
            );
          }
        });
    }
  }

  generarGraficoGanadasPerdidas(data: ReporteMensajesCotizacionRechazo[]) {
    // Procesar datos
    const labels = data.map((d) => d.mensaje);
    const valores = data.map((d) => d.porcentaje);

    setTimeout(() => {
      const canvas = document.getElementById(
        'chartGanadasPerdidas',
      ) as HTMLCanvasElement;
      if (canvas) {
        const chart = new chartjs.Chart(canvas, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Porcentaje',
                data: valores,
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: 'Relación Cotizaciones Ganadas vs Perdidas',
              },
            },
          },
        });
        this.charts.push(chart);
      }
    }, 100);
  }

  generarGraficoRechazoGeneral(data: ReporteMensajesCotizacionRechazo[]) {
    const labels = data.map((d) => d.mensaje);
    const valores = data.map((d) => d.porcentaje);

    setTimeout(() => {
      const canvas = document.getElementById(
        'chartRechazoGeneral',
      ) as HTMLCanvasElement;
      if (canvas) {
        const chart = new chartjs.Chart(canvas, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Porcentaje',
                data: valores,
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: 'Motivos de Rechazo (General)',
              },
            },
          },
        });
        this.charts.push(chart);
      }
    }, 100);
  }

  identificadoresCategorias: string[] = []; // Para trackear en el @for

  generarGraficosRechazoCategoria(
    data: Record<string, ReporteMensajesCotizacionRechazoGral[]>,
  ) {
    this.identificadoresCategorias = Object.keys(data);

    setTimeout(() => {
      this.identificadoresCategorias.forEach((cat, index) => {
        const items = data[cat];
        const labels = items.map((d) => d.mensaje);
        const valores = items.map((d) => d.porcentaje);

        const canvasId = 'chartRechazoCat-' + index;
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        if (canvas) {
          const chart = new chartjs.Chart(canvas, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Porcentaje',
                  data: valores,
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: `Motivos de Rechazo: ${cat}`,
                },
              },
            },
          });
          this.charts.push(chart);
        }
      });
    }, 100);
  }
}
