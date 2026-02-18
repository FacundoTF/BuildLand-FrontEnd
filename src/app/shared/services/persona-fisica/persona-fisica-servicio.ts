import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { PersonaFisica } from '../../../core/entities/personaFisica/persona-fisica';
import { Usuario } from '../../../core/entities/usuario/usuario';
import { lastValueFrom } from 'rxjs';
import { ReturnResultResponse } from '../../../core/response-type/return-response';
import { ReturnSearchResponse } from '../../../core/response-type/return-search-response';

@Injectable({
  providedIn: 'root',
})
export class PersonaFisicaService {
  http = inject(HttpClient);

  private API_URL = `${environment.server.host}${environment.server.port}/api/personas-fisicas`;

  async agregarPersonaFisica(
    persona: PersonaFisica,
  ): Promise<ReturnResultResponse> {
    const observable = this.http.post<boolean>(
      this.API_URL,
      {
        usuario: persona.usuario,
        nombre: persona.nombre,
        numeroTelefono: persona.numeroTelefono,
        codigoPostal: persona.codigoPostal,
        ciudad: persona.ciudad,
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
          ? 'Persona fisica agregada con exito.'
          : 'Error al agregar persona fisica.',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error adding persona fisica:', error);
      return {
        success: false,
        message: 'Error al agregar persona fisica.',
        statusCode: error.status || 500,
      };
    }
  }

  async buscarPersonaFisica(
    cuit: string | null | undefined,
  ): Promise<ReturnSearchResponse> {
    const cuitElegido = cuit?.trim();

    if (cuitElegido) {
      const observable = this.http.get<any>(`${this.API_URL}/${cuitElegido}`, {
        observe: 'response',
      });
      try {
        const response = await lastValueFrom(observable);
        const personaFisica = new PersonaFisica(
          response.body!.usuario,
          response.body!.cuit,
          response.body!.nombre,
          response.body!.numeroTelefono,
          response.body!.codigoPostal,
          response.body!.ciudad,
        );
        return {
          success: true,
          message: 'Persona fisica encontrada con exito.',
          payload: personaFisica,
          statusCode: response.status,
        };
      } catch (error: any) {
        let errorMessage = 'Error al buscar persona fisica.';
        if (error.status === 404) {
          errorMessage = 'Persona fisica no encontrada con CUIT.';
        } else if (error.status === 401) {
          errorMessage =
            'No autorizado para buscar la persona fisica. Cierre de sesión inminente.';
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

  async modificarPersonaFisica(
    usuario: Usuario,
    persona: PersonaFisica,
  ): Promise<ReturnResultResponse> {
    const body = {
      usuario: {
        email: usuario.email,
        password: usuario.password,
        tipoUsuario: 'PERSONA_FISICA',
      },
      cuit: persona.cuit,
      nombre: persona.nombre,
      numeroTelefono: persona.numeroTelefono,
      codigoPostal: persona.codigoPostal,
      ciudad: persona.ciudad,
    };

    const observable = this.http.patch(`${this.API_URL}`, body, {
      observe: 'response',
    });
    try {
      const response = await lastValueFrom(observable);
      return {
        success: true,
        message: 'Persona fisica modificada con exito.',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error modifying persona fisica:', error);
      let errorMessage = 'Error al modificar persona fisica.';
      if (error.status === 404) {
        errorMessage = 'Persona fisica no encontrada.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
  }

  async removerPersonaFisica(
    personaFisicaEncontrada: PersonaFisica,
  ): Promise<ReturnResultResponse> {
    const observable = this.http.delete(
      `${this.API_URL}/${personaFisicaEncontrada.cuit}`,
      {
        observe: 'response',
      },
    );
    try {
      const response = await lastValueFrom(observable);
      return {
        success: true,
        message: 'Persona fisica eliminada con exito.',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error removing persona fisica:', error);
      let errorMessage = 'Error al eliminar persona fisica.';
      if (error.status === 404) {
        errorMessage = 'Persona fisica no encontrada.';
      } else if (error.status === 401) {
        errorMessage =
          'No autorizado para eliminar la persona fisica. Cierre de sesión inminente.';
      }
      return {
        success: false,
        message: errorMessage,
        statusCode: error.status || 500,
      };
    }
  }
}
