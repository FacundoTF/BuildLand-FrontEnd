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
import { ReturnSearchResponse } from '../../../shared/services/return-search-response';
import { Presupuesto } from '../../../core/entities/presupuesto/presupuesto';
import { MatButton } from '@angular/material/button';
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

  presupuestosData = input.required<ReturnSearchResponse>();
  presupuestos = signal<Presupuesto[]>([]);

  ngOnInit(): void {
    const presupuestos = this.presupuestosData().payload as Presupuesto[];
    if (presupuestos.length <= 0) {
      this.dialog.showMessage('Aviso', 'No se encontraron presupuestos.');
    }
    this.presupuestos.set(presupuestos);
  }
}
