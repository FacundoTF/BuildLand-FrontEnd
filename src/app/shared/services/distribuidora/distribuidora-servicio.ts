import { inject, Injectable } from '@angular/core';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DistribuidoraServicio {
  private http = inject(HttpClient);
  private url = `${environment.server.host}${environment.server.port}/api/distribuidoras`;

  async agregarDistribuidora(distribuidora: Distribuidora): Promise<boolean> {
    const observable = this.http.post<Distribuidora>(this.url, {
      usuario: distribuidora.usuario,
      cuit: distribuidora.cuit,
      nombre: distribuidora.nombre,
      direccion: distribuidora.direccion,
      numeroTelefono: distribuidora.numeroTelefono,
      descripcion: distribuidora.descripcion,
      codigoPostal: distribuidora.codigoPostal,
      ciudad: distribuidora.ciudad,
      categorias: distribuidora.categorias,
    });

    try {
      const response = await lastValueFrom(observable);
      console.log('Distribuidora agregada exitosamente:', response);
      return true;
    } catch (error: any) {
      console.error('Error al agregar distribuidora:', error);
      console.error('Error details:', error.error);
      return false;
    }
  }
  async removerDistribuidora(distribuidora: Distribuidora): Promise<boolean> {
    console.log(
      'Intentando eliminar distribuidora con CUIT:',
      distribuidora.cuit,
    );
    const observable = this.http.delete(`${this.url}/${distribuidora.cuit}`, {
      observe: 'response',
    });

    try {
      const response = await lastValueFrom(observable);
      console.log('Status de respuesta:', response.status);
      if (response.status === 204) {
        console.log(
          'Distribuidora eliminada exitosamente:',
          distribuidora.cuit,
        );
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error al eliminar distribuidora:', error);
      if (error.status === 404) {
        console.error('Distribuidora no encontrada');
      }
      return false;
    }
  }
  async modificarDistribuidora(distribuidora: Distribuidora): Promise<boolean> {
    const observable = this.http.patch<Distribuidora>(this.url, {
      usuario: distribuidora.usuario,
      cuit: distribuidora.cuit,
      nombre: distribuidora.nombre,
      direccion: distribuidora.direccion,
      numeroTelefono: distribuidora.numeroTelefono,
      descripcion: distribuidora.descripcion,
      codigoPostal: distribuidora.codigoPostal,
      ciudad: distribuidora.ciudad,
      categorias: distribuidora.categorias,
    });

    try {
      const response = await lastValueFrom(observable);
      console.log('Distribuidora modificada exitosamente:', response);
      return true;
    } catch (error: any) {
      console.error('Error al modificar distribuidora:', error);
      console.error('Error details:', error.error);
      if (error.status === 404) {
        console.error('Distribuidora no encontrada');
      }
      return false;
    }
  }

  async buscarDistribuidoraCuit(
    cuit: string | null | undefined,
  ): Promise<Distribuidora | null> {
    const cuitElegido = cuit?.trim();

    if (cuitElegido) {
      console.log('Buscando distribuidora con CUIT:', cuitElegido);

      const observable = this.http.get<any>(`${this.url}/${cuitElegido}`);
      try {
        const response = await lastValueFrom(observable);
        console.log('Distribuidora encontrada:', response);
        // Crear una instancia de Distribuidora a partir de la respuesta JSON
        const distribuidora = new Distribuidora(
          response.usuario,
          response.cuit,
          response.nombre,
          response.direccion,
          response.numeroTelefono,
          response.descripcion,
          response.codigoPostal,
          response.ciudad,
          response.categorias,
        );
        return distribuidora;
      } catch (error: any) {
        console.error('Error al buscar distribuidora:', error);
        if (error.status === 404) {
          console.error('Distribuidora no encontrada con CUIT:', cuitElegido);
        }
        return null;
      }
    } else {
      return null;
    }
  }
}
