import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Presupuesto } from '../../../core/entities/presupuesto/presupuesto';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresupuestoServicio {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/presupuestos`;

  async agregarPresupuesto(presupuesto: Presupuesto): Promise<boolean> {
    const body = {
      presupuesto: presupuesto,
    };

    const observable = this.http.post<boolean>(this.API_URL, body);
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      console.error('Error adding presupuesto:', error);
      return false;
    }
  }
}
