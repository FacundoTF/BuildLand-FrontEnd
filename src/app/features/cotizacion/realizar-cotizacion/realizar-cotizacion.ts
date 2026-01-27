import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  OnInit,
  computed,
  viewChildren,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../../shared/services/dialog.service';
import { PresupuestoServicio } from '../../../shared/services/presupuesto/presupuesto-servicio';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { DetallePresupuesto } from '../../../core/entities/detalle-presupuesto/detalle-presupuesto';
import { CotizacionServicio } from '../../../shared/services/cotizacion/cotizacion-servicio';
import { Producto } from '../../../core/entities/producto/producto';
import { Marca } from '../../../core/entities/marca/marca';
import { MatInput } from '@angular/material/input';
import { ProductoMarca } from '../../../core/entities/producto-marca';

interface FilaCotizacion {
  id: number;
  productoNombre: string;
  cantidad: number;
  marcaNombre: string;
  importe: number | null;
  bloqueado: boolean;
}

@Component({
  selector: 'app-realizar-cotizacion',
  imports: [MatTableModule, MatButtonModule, FormsModule, MatInput],
  templateUrl: './realizar-cotizacion.html',
  styleUrl: './realizar-cotizacion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealizarCotizacion implements OnInit {
  private router = inject(Router);
  private dialog = inject(DialogService);
  private presupuestoService = inject(PresupuestoServicio);
  private cotizacionServicio = inject(CotizacionServicio);

  detalles = input.required<ReturnSearchResponse>();

  importeInputs = viewChildren<ElementRef<HTMLInputElement>>('importeInput');

  filas = signal<FilaCotizacion[]>([]);
  columnas = ['producto', 'cantidad', 'marca', 'importe', 'guardar'];

  todasFilasBloqueadas = computed(
    () =>
      this.filas().length > 0 && this.filas().every((fila) => fila.bloqueado),
  );

  ngOnInit(): void {
    const detallesData = this.detalles().payload as DetallePresupuesto[];
    const filasIniciales: FilaCotizacion[] = detallesData.map((detalle) => ({
      id: detalle.id,
      productoNombre: detalle.productoMarca.producto.nombre,
      cantidad: detalle.cantidad,
      marcaNombre: detalle.productoMarca.marca.nombre || 'N/A',
      importe: null,
      bloqueado: false,
    }));
    this.filas.set(filasIniciales);
  }

  volverADetalles(): void {
    const idPresupuesto = this.presupuestoService.presupuestoId();
    this.router
      .navigate([`/base-page/presupuesto/ver-detalles/${idPresupuesto}`])
      .catch(() =>
        this.dialog.showMessage(
          'Error',
          'No se pudo navegar a los detalles del presupuesto.',
        ),
      );
  }

  toggleBloqueoFila(
    fila: FilaCotizacion,
    inputRef: ElementRef<HTMLInputElement> | undefined,
  ): void {
    if (!fila.bloqueado) {
      const valorInput = inputRef?.nativeElement?.valueAsNumber;

      if (valorInput === undefined || isNaN(valorInput) || valorInput <= 0) {
        this.dialog
          .showMessage(
            'Error',
            'Debe ingresar un importe válido antes de confirmar.',
          )
          .subscribe();
        return;
      }

      this.filas.update((filas) =>
        filas.map((f) =>
          f.id === fila.id ? { ...f, importe: valorInput, bloqueado: true } : f,
        ),
      );
    } else {
      this.filas.update((filas) =>
        filas.map((f) => (f.id === fila.id ? { ...f, bloqueado: false } : f)),
      );
    }
  }

  enviarCotizacion(): void {
    const filasActuales = this.filas();

    const filasNoBloqueadas = filasActuales.filter((f) => !f.bloqueado);
    if (filasNoBloqueadas.length > 0) {
      this.dialog
        .showMessage(
          'Advertencia',
          'Debe confirmar todos los importes antes de enviar la cotización.',
        )
        .subscribe();
      return;
    }

    const detallesCotizacion = filasActuales.map((fila) => ({
      idDetallePresupuesto: fila.id,
      importe: fila.importe,
      productoNombre: fila.productoNombre,
      productoMarca: fila.marcaNombre,
    }));

    this.dialog
      .showConfirm(
        'Confirmar cotización',
        '¿Está seguro de que desea enviar esta cotización?',
        'Enviar',
        'Cancelar',
      )
      .subscribe((confirmado) => {
        if (confirmado) {
          this.procesarEnvioCotizacion(detallesCotizacion);
        }
      });
  }

  private procesarEnvioCotizacion(
    detallesCotizacion: {
      idDetallePresupuesto: number;
      importe: number | null;
      productoNombre: string;
      productoMarca: string;
    }[],
  ): void {
    this.cotizacionServicio
      .enviarCotizacion(
        detallesCotizacion.map((detalle) => ({
          idDetalleCotizacion: detalle.idDetallePresupuesto,
          productoMarca: new ProductoMarca(
            new Producto(null, detalle.productoNombre, null),
            new Marca(null, detalle.productoMarca, null),
          ),
          importe: detalle.importe || 0,
          cotizacion: null as any, // Aquí se debería mapear correctamente la cotización
        })),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialog
              .showMessage('Éxito', 'Cotización enviada correctamente.')
              .subscribe(() => {
                this.router
                  .navigate(['/base-page/presupuesto/recibir'])
                  .catch(() =>
                    this.dialog.showMessage(
                      'Error',
                      'No se pudo navegar al listado de presupuestos.',
                    ),
                  );
              });
          }
        },
        error: () => {
          this.dialog
            .showMessage(
              'Error',
              'Ocurrió un error al enviar la cotización. Intente nuevamente.',
            )
            .subscribe();
        },
      });
  }
}
