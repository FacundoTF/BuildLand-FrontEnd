import { Component, input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReturnSearchResponse } from '../../../../shared/services/return-search-response';

@Component({
  selector: 'app-ver-detalles-presupuesto',
  imports: [],
  templateUrl: './ver-detalles-presupuesto.html',
  styleUrl: './ver-detalles-presupuesto.scss',
})
export class VerDetallesPresupuesto implements OnInit {
  presupuestoDetalleData = input.required<ReturnSearchResponse>();
  ngOnInit(): void {
    console.log('Este componente se esta inicializando');
    const detalles = this.presupuestoDetalleData().payload;
    console.log('Detalles del presupuesto:', detalles);
  }
}
