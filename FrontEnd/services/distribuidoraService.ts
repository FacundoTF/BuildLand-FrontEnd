import { Distribuidora, NuevaDistribuidora, DistribuidoraActualizada } from "../types/distribuidora.ts";

const API_BASE_URL = "http://localhost:8080/api/distribuidoras";

// Configuración base para las peticiones fetch
const defaultHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

// Función helper para manejar respuestas HTTP
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Error ${response.status}`;
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  
  return {} as T;
}

// Servicio para manejar operaciones CRUD de distribuidoras
export class DistribuidoraService {
  
  /**
   * Obtiene todas las distribuidoras
   */
  static async obtenerTodas(): Promise<Distribuidora[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: defaultHeaders,
      });
      
      return await handleResponse<Distribuidora[]>(response);
    } catch (error) {
      console.error("Error al obtener distribuidoras:", error);
      throw error;
    }
  }
  
  /**
   * Obtiene una distribuidora por CUIT
   */
  static async obtenerPorCuit(cuit: string): Promise<Distribuidora> {
    try {
      const response = await fetch(`${API_BASE_URL}/${cuit}`, {
        method: "GET",
        headers: defaultHeaders,
      });
      
      return await handleResponse<Distribuidora>(response);
    } catch (error) {
      console.error(`Error al obtener distribuidora ${cuit}:`, error);
      throw error;
    }
  }
  
  /**
   * Crea una nueva distribuidora
   */
  static async crear(distribuidora: NuevaDistribuidora): Promise<Distribuidora> {
    try {
      // Convertir el formato para que coincida con la API del backend
      const distribuidoraData = {
        id: distribuidora.cuit,
        nombre: distribuidora.nombre,
        direccion: distribuidora.direccion || null,
        numeroTelefono: distribuidora.numeroTelefono || null,
        descripcion: distribuidora.descripcion || null,
        codigoPostal: distribuidora.codigoPostal || null,
      };
      
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(distribuidoraData),
      });
      
      return await handleResponse<Distribuidora>(response);
    } catch (error) {
      console.error("Error al crear distribuidora:", error);
      throw error;
    }
  }

  
  /**
   * Elimina una distribuidora por CUIT
   */
  static async eliminar(cuit: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${cuit}`, {
        method: "DELETE",
        headers: defaultHeaders,
      });
      
      await handleResponse<void>(response);
    } catch (error) {
      console.error(`Error al eliminar distribuidora ${cuit}:`, error);
      throw error;
    }
  }
  
  /**
   * Busca distribuidoras por nombre
   */
  static async buscarPorNombre(nombre: string): Promise<Distribuidora[]> {
    try {
      const params = new URLSearchParams({ nombre });
      const response = await fetch(`${API_BASE_URL}/buscar?${params}`, {
        method: "GET",
        headers: defaultHeaders,
      });
      
      return await handleResponse<Distribuidora[]>(response);
    } catch (error) {
      console.error(`Error al buscar distribuidoras por nombre "${nombre}":`, error);
      throw error;
    }
  }

  /**
   * Actualiza una distribuidora existente
   */
  static async actualizar(cuit: string, distribuidora: DistribuidoraActualizada): Promise<Distribuidora> {
    try {
      const response = await fetch(`${API_BASE_URL}/${cuit}`, {
        method: "PUT",
        headers: defaultHeaders,
        body: JSON.stringify(distribuidora),
      });
      
      return await handleResponse<Distribuidora>(response);
    } catch (error) {
      console.error(`Error al actualizar distribuidora ${cuit}:`, error);
      throw error;
    }
  }
}

// Funciones de validación
export class DistribuidoraValidator {
  
  /**
   * Valida el formato del CUIT
   */
  static validarCuit(cuit: string): boolean {
    return /^\d{8}$/.test(cuit);
  }
  
  /**
   * Valida el formato del código postal
   */
  static validarCodigoPostal(codigoPostal: string): boolean {
    return /^\d{4}$/.test(codigoPostal);
  }
  
  /**
   * Valida la longitud de la descripción
   */
  static validarDescripcion(descripcion: string): boolean {
    return descripcion.length <= 120;
  }
  
  /**
   * Valida que el nombre no esté vacío
   */
  static validarNombre(nombre: string): boolean {
    return nombre.trim().length > 0 && nombre.length <= 100;
  }
  
  /**
   * Valida la longitud de la dirección
   */
  static validarDireccion(direccion: string): boolean {
    return direccion.length <= 200;
  }
  
  /**
   * Valida la longitud del número de teléfono
   */
  static validarTelefono(telefono: string): boolean {
    return telefono.length <= 20;
  }
  
  /**
   * Valida todos los campos de una distribuidora
   */
  static validarDistribuidora(distribuidora: NuevaDistribuidora): string[] {
    const errores: string[] = [];
    
    if (!this.validarCuit(distribuidora.cuit)) {
      errores.push("El CUIT debe tener exactamente 8 dígitos");
    }
    
    if (!this.validarNombre(distribuidora.nombre)) {
      errores.push("El nombre es obligatorio y no puede exceder 100 caracteres");
    }
    
    if (distribuidora.direccion && !this.validarDireccion(distribuidora.direccion)) {
      errores.push("La dirección no puede exceder 200 caracteres");
    }
    
    if (distribuidora.numeroTelefono && !this.validarTelefono(distribuidora.numeroTelefono)) {
      errores.push("El número de teléfono no puede exceder 20 caracteres");
    }
    
    if (distribuidora.descripcion && !this.validarDescripcion(distribuidora.descripcion)) {
      errores.push("La descripción no puede exceder 120 caracteres");
    }
    
    if (distribuidora.codigoPostal && !this.validarCodigoPostal(distribuidora.codigoPostal)) {
      errores.push("El código postal debe tener exactamente 4 dígitos");
    }
    
    return errores;
  }

  /**
   * Valida los campos para actualización de una distribuidora
   */
  static validarActualizacionDistribuidora(distribuidora: DistribuidoraActualizada): string[] {
    const errores: string[] = [];
    
    if (distribuidora.nombre && !this.validarNombre(distribuidora.nombre)) {
      errores.push("El nombre no puede exceder 100 caracteres");
    }
    
    if (distribuidora.direccion && !this.validarDireccion(distribuidora.direccion)) {
      errores.push("La dirección no puede exceder 200 caracteres");
    }
    
    if (distribuidora.numeroTelefono && !this.validarTelefono(distribuidora.numeroTelefono)) {
      errores.push("El número de teléfono no puede exceder 20 caracteres");
    }
    
    if (distribuidora.descripcion && !this.validarDescripcion(distribuidora.descripcion)) {
      errores.push("La descripción no puede exceder 120 caracteres");
    }
    
    if (distribuidora.codigoPostal && !this.validarCodigoPostal(distribuidora.codigoPostal)) {
      errores.push("El código postal debe tener exactamente 4 dígitos");
    }
    
    return errores;
  }
}
