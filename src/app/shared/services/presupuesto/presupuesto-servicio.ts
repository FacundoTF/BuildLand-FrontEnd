import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Presupuesto } from '../../../core/entities/presupuesto/presupuesto';
import { lastValueFrom } from 'rxjs';
import { ReturnResultResponse } from '../return-response';

@Injectable({
  providedIn: 'root',
})
export class PresupuestoServicio {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/presupuestos`;

  async agregarPresupuesto(
    presupuesto: Presupuesto,
  ): Promise<ReturnResultResponse> {
    const body = {
      IdPresupuesto: presupuesto.idPresupuesto,
      persona: presupuesto.persona,
      categoria: presupuesto.categoria,
      fecha: presupuesto.fecha,
      detalles: presupuesto.detalles,
      cotizaciones: presupuesto.cotizaciones,
    };

    const observable = this.http.post<boolean>(this.API_URL, body, {
      observe: 'response',
    });
    try {
      const response = await lastValueFrom(observable);
      return {
        success: response.body || false,
        message: response.body
          ? 'Presupuesto agregado con exito.'
          : 'Error al agregar presupuesto.',
        statusCode: response.status,
      };
    } catch (error: any) {
      if (error.status === 404) {
        return {
          success: false,
          message: 'Recurso no encontrado al agregar presupuesto.',
          statusCode: error.status,
        };
      } else if (error.status === 401) {
        return {
          success: false,
          message:
            'No autorizado para agregar presupuesto. Cierre de sesión inminente.',
          statusCode: error.status,
        };
      }
      return {
        success: false,
        message: 'Error al agregar presupuesto.',
        statusCode: error.status || 500,
      };
    }
  }
}
