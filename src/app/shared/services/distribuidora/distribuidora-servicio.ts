import { inject, Injectable } from '@angular/core';
import { Distribuidora } from '../../../core/entities/distribuidora/distribuidora';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ReturnResultResponse } from '../return-response';
import { ReturnSearchResponse } from '../return-search-response';

@Injectable({
  providedIn: 'root',
})
export class DistribuidoraServicio {
  private http = inject(HttpClient);
  private url = `${environment.server.host}${environment.server.port}/api/distribuidoras`;

  async agregarDistribuidora(
    distribuidora: Distribuidora,
  ): Promise<ReturnResultResponse> {
    const observable = this.http.post<boolean>(
      this.url,
      {
        usuario: distribuidora.usuario,
        cuit: distribuidora.cuit,
        nombre: distribuidora.nombre,
        direccion: distribuidora.direccion,
        numeroTelefono: distribuidora.numeroTelefono,
        descripcion: distribuidora.descripcion,
        codigoPostal: distribuidora.codigoPostal,
        ciudad: distribuidora.ciudad,
        categorias: distribuidora.categorias,
      },
      {
        observe: 'response',
      },
    );

    try {
      const response = await lastValueFrom(observable);
      return {
        success: response.body || false,
        message: response.body
          ? 'Distribuidora agregada con exito.'
          : 'Error al agregar distribuidora.',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error al agregar distribuidora:', error);
      return {
        success: false,
        message: 'Error al agregar distribuidora.',
        statusCode: error.status || 500,
      };
    }
  }
  async removerDistribuidora(
    distribuidora: Distribuidora,
  ): Promise<ReturnResultResponse> {
    const observable = this.http.delete(`${this.url}/${distribuidora.cuit}`, {
      observe: 'response',
    });

    try {
      const response = await lastValueFrom(observable);
      if (response.status === 204) {
        console.log(
          'Distribuidora eliminada exitosamente:',
          distribuidora.cuit,
        );
        return {
          success: true,
          message: 'Distribuidora eliminada con exito.',
          statusCode: response.status,
        };
      }
      return {
        success: false,
        message: 'Error al eliminar distribuidora.',
        statusCode: response.status,
      };
    } catch (error: any) {
      let errorMessage = 'Error al eliminar distribuidora.';
      if (error.status === 404) {
        console.error('Distribuidora no encontrada');
        errorMessage = 'Distribuidora no encontrada.';
      } else if (error.status === 401) {
        console.error(
          'No autorizado para eliminar la distribuidora. Cierre de sesión inminente.',
        );
        errorMessage =
          'No autorizado para eliminar la distribuidora. Cierre de sesión inminente.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
  }
  async modificarDistribuidora(
    distribuidora: Distribuidora,
  ): Promise<ReturnResultResponse> {
    const observable = this.http.patch<Distribuidora>(
      this.url,
      {
        usuario: distribuidora.usuario,
        cuit: distribuidora.cuit,
        nombre: distribuidora.nombre,
        direccion: distribuidora.direccion,
        numeroTelefono: distribuidora.numeroTelefono,
        descripcion: distribuidora.descripcion,
        codigoPostal: distribuidora.codigoPostal,
        ciudad: distribuidora.ciudad,
        categorias: distribuidora.categorias,
      },
      {
        observe: 'response',
      },
    );

    try {
      const response = await lastValueFrom(observable);
      return {
        success: true,
        message: 'Distribuidora modificada con exito.',
        statusCode: response.status,
      };
    } catch (error: any) {
      let errorMessage = 'Error al modificar distribuidora.';
      if (error.status === 404) {
        errorMessage = 'Distribuidora no encontrada.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
  }

  async buscarDistribuidoraCuit(
    cuit: string | null | undefined,
  ): Promise<ReturnSearchResponse> {
    const cuitElegido = cuit?.trim();

    if (cuitElegido) {
      const observable = this.http.get<Distribuidora>(
        `${this.url}/${cuitElegido}`,
        {
          observe: 'response',
        },
      );
      try {
        const response = await lastValueFrom(observable);
        console.info(typeof response);
        const distribuidora = new Distribuidora(
          response.body!.usuario,
          response.body!.cuit,
          response.body!.nombre,
          response.body!.direccion,
          response.body!.numeroTelefono,
          response.body!.descripcion,
          response.body!.codigoPostal,
          response.body!.ciudad,
          response.body!.categorias,
        );
        return {
          success: true,
          message: 'Distribuidora encontrada con exito.',
          payload: distribuidora,
          statusCode: response.status,
        };
      } catch (error: any) {
        let errorMessage: string = 'Error al buscar distribuidora.';
        if (error.status === 404) {
          errorMessage = 'Distribuidora no encontrada con CUIT.';
        } else if (error.status === 401) {
          errorMessage =
            'No autorizado para buscar la distribuidora. Cierre de sesión inminente.';
        }
        return {
          success: false,
          message: errorMessage,
          payload: null,
          statusCode: error.status || 500,
        };
      }
    } else {
      return {
        success: false,
        message: 'CUIT inválido o vacío.',
        payload: null,
        statusCode: 400,
      };
    }
  }
}
