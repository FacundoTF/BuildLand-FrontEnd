import {
  Component,
  input,
  signal,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { ReturnSearchResponse } from '../../../../shared/services/return-search-response';
import { DetallePresupuesto } from '../../../../core/entities/detalle-presupuesto/detalle-presupuesto';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'app-ver-detalles-presupuesto',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  templateUrl: './ver-detalles-presupuesto.html',
  styleUrl: './ver-detalles-presupuesto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerDetallesPresupuesto implements OnInit {
  presupuestoDetalleData = input.required<ReturnSearchResponse>();
  detalles = signal<DetallePresupuesto[]>([]);
  ngOnInit(): void {
    console.log('Este componente se esta inicializando');
    const detalles = this.presupuestoDetalleData()
      .payload as DetallePresupuesto[];
    console.log('Detalles del presupuesto:', detalles);
    this.detalles.set(detalles);
  }
}
