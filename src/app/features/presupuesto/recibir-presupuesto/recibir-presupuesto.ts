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
  templateUrl: './recibir-presupuesto.html',
  styleUrl: './recibir-presupuesto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecibirPresupuesto implements OnInit {
  dialog = inject(DialogService);
  router = inject(Router);
  presupuestosData = input.required<ReturnSearchResponse>();
  presupuestos = signal<Presupuesto[]>([]);
  ngOnInit(): void {
    const presupuestos = this.presupuestosData().payload as Presupuesto[];
    if (presupuestos.length <= 0) {
      this.dialog.showMessage('Aviso', 'No se encontraron presupuestos.');
    }
    this.presupuestos.set(presupuestos);
  }
  verDetalles(IdPresupuesto: number): void {
    this.router
      .navigate(['base-page/presupuesto/ver-detalles', IdPresupuesto])
      .catch(() => {
        this.dialog
          .showMessage('Error', 'Hubo un error al entrar en esta página')
          .subscribe();
      });
  }
}
