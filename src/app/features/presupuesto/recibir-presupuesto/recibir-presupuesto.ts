import { Component, inject, input, signal } from '@angular/core';
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
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
  ],
  templateUrl: './recibir-presupuesto.html',
  styleUrl: './recibir-presupuesto.scss',
})
export class RecibirPresupuesto {
  dialog = inject(DialogService);

  presupuestosData = input.required<ReturnSearchResponse>();
  presupuestos: Presupuesto[] = [];
  contadorPresupuestos = signal(0);

  ngOnInit(): void {
    this.presupuestos = this.presupuestosData().payload as Presupuesto[];
  }
  sumarContador() {
    this.contadorPresupuestos.update((value) => value + 1);
  }
}
