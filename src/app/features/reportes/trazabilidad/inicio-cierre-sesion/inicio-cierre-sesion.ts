import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { ReporteService } from '../../../../shared/services/reporte/reporte';
import { DialogService } from '../../../../shared/services/dialog.service';
import { PaginationService } from '../../../../shared/services/pagination-service';
import { ReporteTrazabilidadLogin } from '../../../../core/entities/reporte/trazabilidad/reporte-trazabilidad-login';

@Component({
  selector: 'app-inicio-cierre-sesion',
  imports: [
    FormsModule,
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
  ],
  providers: [PaginationService],
  templateUrl: './inicio-cierre-sesion.html',
  styleUrl: './inicio-cierre-sesion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioCierreSesion {
  private reporteService = inject(ReporteService);
  private dialogService = inject(DialogService);
  paginationService = inject(PaginationService);

  cuit = signal<string>('');
  resultados = signal<ReporteTrazabilidadLogin[]>([]);
  busquedaConfirmada = signal<boolean>(false);

  buscar(): void {
    const cuitValue = this.cuit().trim();
    if (!cuitValue) {
      this.dialogService.showMessage('Error', 'Debe ingresar un CUIT.');
      return;
    }

    this.paginationService.resetearPagina();
    this.reporteService
      .getTrazabilidadLoginLogout(cuitValue, 0)
      .subscribe((res) => {
        if (!res.success) {
          this.dialogService.showMessage('Error', res.message);
          return;
        }
        const datos = res.payload as ReporteTrazabilidadLogin[];
        if (datos.length === 0) {
          this.dialogService.showMessage(
            'Aviso',
            'No se encontraron registros para el CUIT ingresado.',
          );
          return;
        }
        this.paginationService.firstPage.set(!res.hasPrevious);
        this.paginationService.lastPage.set(!res.hasNext);
        this.resultados.set(datos);
        this.busquedaConfirmada.set(true);
      });
  }

  async incrementarPagina(): Promise<void> {
    const siguientePagina = this.paginationService.currentPage() + 1;
    this.reporteService
      .getTrazabilidadLoginLogout(this.cuit().trim(), siguientePagina)
      .subscribe((res) => {
        if (!res.success) {
          this.dialogService.showMessage('Error', res.message);
          return;
        }
        const datos = res.payload as ReporteTrazabilidadLogin[];
        if (datos.length === 0) {
          this.dialogService
            .showMessage('Aviso', 'No se encontraron más registros.')
            .subscribe();
          return;
        }
        this.alternarBotonesPaginacion(res.hasPrevious, res.hasNext);
        this.paginationService.incrementarPagina();
        this.resultados.set(datos);
      });
  }

  async decrementarPagina(): Promise<void> {
    const paginaAnterior = this.paginationService.currentPage() - 1;
    this.reporteService
      .getTrazabilidadLoginLogout(this.cuit().trim(), paginaAnterior)
      .subscribe((res) => {
        if (!res.success) {
          this.dialogService.showMessage('Error', res.message);
          return;
        }
        const datos = res.payload as ReporteTrazabilidadLogin[];
        this.alternarBotonesPaginacion(res.hasPrevious, res.hasNext);
        this.paginationService.decrementarPagina();
        this.resultados.set(datos);
      });
  }

  private alternarBotonesPaginacion(
    hasPrevious: boolean,
    hasNext: boolean,
  ): void {
    if (hasPrevious && hasNext) {
      this.paginationService.firstPage.set(false);
      this.paginationService.lastPage.set(false);
    } else if (hasPrevious) {
      this.paginationService.firstPage.set(false);
      this.paginationService.lastPage.set(true);
    } else if (hasNext) {
      this.paginationService.firstPage.set(true);
      this.paginationService.lastPage.set(false);
    }
  }

  resetear(): void {
    this.cuit.set('');
    this.resultados.set([]);
    this.busquedaConfirmada.set(false);
    this.paginationService.resetearPagina();
  }
}
