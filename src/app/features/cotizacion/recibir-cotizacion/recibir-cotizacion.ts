import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DialogService } from '../../../shared/services/dialog.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { CotizacionServicio } from '../../../shared/services/cotizacion/cotizacion-servicio';
import { ReturnPaginationResponse } from '../../../core/response-type/return-pagination-response';
import { PaginationService } from '../../../shared/services/pagination-service';
import { ResultadoCotizacion } from '../../../core/entities/cotizacion/resultado-cotizacion';

@Component({
  selector: 'app-recibir-cotizacion',
  imports: [
    DatePipe,
    CurrencyPipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
  ],
  providers: [PaginationService],
  templateUrl: './recibir-cotizacion.html',
  styleUrl: './recibir-cotizacion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecibirCotizacion implements OnInit {
  dialog = inject(DialogService);
  router = inject(Router);
  cotizacionService = inject(CotizacionServicio);
  paginationService = inject(PaginationService);

  cotizacionesData = input.required<ReturnPaginationResponse>();
  cotizaciones = signal<ResultadoCotizacion[]>([]);

  ngOnInit(): void {
    const cotizaciones = this.cotizacionesData()
      .payload as ResultadoCotizacion[];
    if (cotizaciones.length <= 0) {
      this.dialog.showMessage('Aviso', 'No se encontraron cotizaciones.');
    }
    this.paginationService.firstPage.set(true);
    if (this.cotizacionesData().hasNext) {
      this.paginationService.lastPage.set(false);
    }
    this.cotizaciones.set(cotizaciones);
  }

  incrementarPagina(numeroPagina: number): void {
    this.cotizacionService.alterarPaginaCotizacion(numeroPagina).subscribe({
      next: (nuevosResultados) => {
        const cotizaciones = nuevosResultados.payload as ResultadoCotizacion[];
        if (cotizaciones.length <= 0) {
          this.dialog
            .showMessage('Aviso', 'No se encontraron más cotizaciones.')
            .subscribe();
          return;
        }

        this.alternarBotonesPaginacion(
          nuevosResultados.hasPrevious,
          nuevosResultados.hasNext,
        );

        this.paginationService.incrementarPagina();
        this.cotizaciones.set(cotizaciones);
      },
      error: (error) => {
        console.error('Error al obtener cotizaciones:', error);
      },
    });
  }

  decrementarPagina(numeroPagina: number): void {
    this.cotizacionService.alterarPaginaCotizacion(numeroPagina).subscribe({
      next: (nuevosResultados) => {
        const cotizaciones = nuevosResultados.payload as ResultadoCotizacion[];
        this.alternarBotonesPaginacion(
          nuevosResultados.hasPrevious,
          nuevosResultados.hasNext,
        );
        this.paginationService.decrementarPagina();
        this.cotizaciones.set(cotizaciones);
      },
      error: (error) => {
        console.error('Error al obtener cotizaciones:', error);
      },
    });
  }

  private alternarBotonesPaginacion(
    hasPrevious: boolean,
    hasNext: boolean,
  ): void {
    if (hasPrevious && hasNext) {
      this.paginationService.firstPage.set(true);
      this.paginationService.lastPage.set(true);
    } else if (hasPrevious) {
      this.paginationService.firstPage.set(false);
      this.paginationService.lastPage.set(true);
    } else if (hasNext) {
      this.paginationService.firstPage.set(true);
      this.paginationService.lastPage.set(false);
    }
  }

  verDetalles(idCotizacion: number): void {
    // TODO: Implementar navegación a ver-detalles-cotizacion cuando esté disponible
    this.dialog
      .showMessage('Aviso', 'Funcionalidad de ver detalles próximamente.')
      .subscribe();
  }
}
