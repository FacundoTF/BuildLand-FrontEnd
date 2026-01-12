import {
  Component,
  input,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import { ReturnSearchResponse } from '../../../../core/response-type/return-search-response';
import { DetallePresupuesto } from '../../../../core/entities/detalle-presupuesto/detalle-presupuesto';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { DialogService } from '../../../../shared/services/dialog.service';
import { PaginationService } from '../../../../shared/services/pagination-service';
import { PresupuestoServicio } from '../../../../shared/services/presupuesto/presupuesto-servicio';
import { Usuario } from '../../../../core/entities/usuario/usuario';
import { UsuarioServicio } from '../../../../shared/services/usuario-servicio';

@Component({
  selector: 'app-ver-detalles-presupuesto',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatButton],
  providers: [PaginationService],
  templateUrl: './ver-detalles-presupuesto.html',
  styleUrl: './ver-detalles-presupuesto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerDetallesPresupuesto implements OnInit {
  presupuestoDetalleData = input.required<ReturnSearchResponse>();
  detalles = signal<DetallePresupuesto[]>([]);

  router = inject(Router);
  dialog = inject(DialogService);
  paginationService = inject(PaginationService);
  presupuestoService = inject(PresupuestoServicio);
  usuarioServicio = inject(UsuarioServicio);

  esDistribuidora = signal(false);

  ngOnInit(): void {
    const rol = this.usuarioServicio.identificarUsuario();
    rol.subscribe((value) => {
      const usuario = value.payload as Usuario;

      if (usuario.tipoUsuario === 'DISTRIBUIDORA') {
        this.esDistribuidora.set(true);
      } else {
        this.esDistribuidora.set(false);
      }
    });

    console.log('Este componente se esta inicializando');
    const detalles = this.presupuestoDetalleData()
      .payload as DetallePresupuesto[];
    console.log('Detalles del presupuesto:', detalles);
    this.detalles.set(detalles);
  }
  volverAlListado() {
    this.router
      .navigate(['/base-page/presupuesto/recibir'])
      .catch(() =>
        this.dialog.showMessage(
          'Error',
          'No se pudo navegar al listado de presupuestos.',
        ),
      );
  }

  incrementarPagina(numeroPagina: number): void {
    const nuevosResultados =
      this.presupuestoService.alterarPaginaDetallesPresupuesto(numeroPagina);
    nuevosResultados.subscribe({
      next: (result) => {
        const detalles = result.payload as DetallePresupuesto[];
        if (detalles.length <= 0) {
          this.dialog
            .showMessage('Aviso', 'No se encontraron los detalles.')
            .subscribe();
          return;
        }
        this.alternarBotonesPaginacion(result.hasPrevious, result.hasNext);

        this.paginationService.incrementarPagina();
        this.detalles.set(detalles);
      },
      error: (error) => {
        console.error(
          'Error al obtener nuevos resultados de la paginación:',
          error,
        );
      },
    });
  }
  decrementarPagina(numeroPagina: number): void {
    const nuevosResultados =
      this.presupuestoService.alterarPaginaDetallesPresupuesto(numeroPagina);
    nuevosResultados.subscribe({
      next: (result) => {
        const detalles = result.payload as DetallePresupuesto[];
        if (detalles.length <= 0) {
          this.dialog
            .showMessage('Aviso', 'No se encontraron los detalles.')
            .subscribe();
          return;
        }
        this.alternarBotonesPaginacion(result.hasPrevious, result.hasNext);
        this.paginationService.decrementarPagina();
        this.detalles.set(detalles);
      },
      error: (error) => {
        console.error(
          'Error al obtener nuevos resultados de la paginación:',
          error,
        );
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
  redirigirParaCotizar() {
    this.router
      .navigate([`/base-page/presupuesto/cotizar`])
      .catch(() =>
        this.dialog.showMessage(
          'Error',
          'No se pudo navegar a la página de cotización.',
        ),
      );
  }
}
