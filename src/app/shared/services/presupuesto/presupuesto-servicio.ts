import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Usuario } from '../../../core/entities/usuario/usuario';
import { Presupuesto } from '../../../core/entities/presupuesto/presupuesto';

@Injectable({
  providedIn: 'root',
})
export class PresupuestoServicio {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/presupuestos`;

  agregarPresupuesto(presupuesto: Presupuesto) {
    const body = {
      presupuesto: presupuesto,
    };

    return this.http.post<boolean>(this.API_URL, body);
  }
}
