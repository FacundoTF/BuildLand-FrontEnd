import { Component } from '@angular/core';

import * as chartjs from 'chart.js';

chartjs.Chart.register(...chartjs.registerables);
@Component({
  selector: 'app-productos-solicitados',
  imports: [],
  templateUrl: './productos-solicitados.html',
  styleUrl: './productos-solicitados.scss',
  providers: [],
})
export class ProductosSolicitados {}
