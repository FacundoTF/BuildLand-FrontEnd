import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { DialogService } from '../../../shared/services/dialog.service';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';
import { Presupuesto } from '../../../core/entities/presupuesto/presupuesto';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { PresupuestoServicio } from '../../../shared/services/presupuesto/presupuesto-servicio';
import { ReturnPaginationResponse } from '../../../core/response-type/return-pagination-response';
import { PaginationService } from '../../../shared/services/pagination-service';

@Component({
  selector: 'app-recibir-presupuesto',
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
  ],
  providers: [PaginationService],
  templateUrl: './recibir-presupuesto.html',
  styleUrl: './recibir-presupuesto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecibirPresupuesto implements OnInit {
  dialog = inject(DialogService);
  router = inject(Router);
  presupuestoService = inject(PresupuestoServicio);
  paginationService = inject(PaginationService);

  presupuestosData = input.required<ReturnPaginationResponse>();
  presupuestos = signal<Presupuesto[]>([]);
  ngOnInit(): void {
    const presupuestos = this.presupuestosData().payload as Presupuesto[];
    if (presupuestos.length <= 0) {
      this.dialog.showMessage('Aviso', 'No se encontraron presupuestos.');
    }
    this.paginationService.firstPage.set(true);
    if (this.presupuestosData().hasNext) {
      this.paginationService.lastPage.set(false);
    }
    this.presupuestos.set(presupuestos);
  }
  async incrementarPagina(numeroPagina: number): Promise<void> {
    const nuevosResultados =
      await this.presupuestoService.alterarPaginaPresupuesto(numeroPagina);
    const presupuestos = nuevosResultados.payload as Presupuesto[];
    if (presupuestos.length <= 0) {
      this.dialog
        .showMessage('Aviso', 'No se encontraron más presupuestos.')
        .subscribe();
      return;
    }

    this.alternarBotonesPaginacion(
      nuevosResultados.hasPrevious,
      nuevosResultados.hasNext,
    );

    this.paginationService.incrementarPagina();
    this.presupuestos.set(presupuestos);
  }
  async decrementarPagina(numeroPagina: number): Promise<void> {
    const nuevosResultados =
      await this.presupuestoService.alterarPaginaPresupuesto(numeroPagina);
    const presupuestos = nuevosResultados.payload as Presupuesto[];
    this.alternarBotonesPaginacion(
      nuevosResultados.hasPrevious,
      nuevosResultados.hasNext,
    );
    this.paginationService.decrementarPagina();
    this.presupuestos.set(presupuestos);
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
  verDetalles(IdPresupuesto: number): void {
    this.presupuestoService.presupuestoId.set(IdPresupuesto);
    this.paginationService.resetearPagina();
    this.router
      .navigate(['base-page/presupuesto/ver-detalles', IdPresupuesto])
      .catch(() => {
        this.dialog
          .showMessage('Error', 'Hubo un error al entrar en esta página')
          .subscribe();
      });
  }
}
