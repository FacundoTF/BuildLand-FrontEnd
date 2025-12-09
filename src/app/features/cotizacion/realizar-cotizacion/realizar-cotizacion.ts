import {
  AfterContentInit,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { PresupuestoServicio } from '../../../shared/services/presupuesto/presupuesto-servicio';
import { Presupuesto } from '../../../core/entities/presupuesto/presupuesto';
import { DialogService } from '../../../shared/services/dialog.service';
import { ReturnSearchResponse } from '../../../shared/services/return-search-response';

@Component({
  selector: 'app-realizar-cotizacion',
  imports: [],
  templateUrl: './realizar-cotizacion.html',
  styleUrl: './realizar-cotizacion.scss',
})
export class RealizarCotizacion implements OnInit {
  presupuestoServicio = inject(PresupuestoServicio);
  dialog = inject(DialogService);

  presupuestosData = input.required<ReturnSearchResponse>();
  presupuestos: Presupuesto[] = [];

  ngOnInit(): void {
    this.presupuestos = this.presupuestosData().payload as Presupuesto[];
  }
}
