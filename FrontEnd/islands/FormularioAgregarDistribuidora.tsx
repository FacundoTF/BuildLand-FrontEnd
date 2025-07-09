import { useState } from "preact/hooks";
import { DistribuidoraService, DistribuidoraValidator } from "../services/distribuidoraService.ts";
import { NuevaDistribuidora } from "../types/distribuidora.ts";

export default function FormularioAgregarDistribuidora() {
  const [formData, setFormData] = useState<NuevaDistribuidora>({
    cuit: "",
    nombre: "",
    direccion: "",
    numeroTelefono: "",
    descripcion: "",
    codigoPostal: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
    
    // Limpiar mensaje de éxito
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);
    setSuccessMessage("");

    try {
      // Validaciones del lado del cliente
      const validationErrors = DistribuidoraValidator.validarDistribuidora(formData);
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Enviar al backend
      const nuevaDistribuidora = await DistribuidoraService.crear(formData);
      
      // Éxito
      setSuccessMessage(`Distribuidora "${nuevaDistribuidora.nombre}" creada exitosamente con CUIT ${nuevaDistribuidora.id}`);
      
      // Limpiar formulario
      setFormData({
        cuit: "",
        nombre: "",
        direccion: "",
        numeroTelefono: "",
        descripcion: "",
        codigoPostal: "",
      });

    } catch (error) {
      console.error("Error al crear distribuidora:", error);
      setErrors([error instanceof Error ? error.message : "Error desconocido al crear la distribuidora"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Agregar Nueva Distribuidora</h1>
          <p class="text-gray-600">Completa el formulario para registrar una nueva distribuidora</p>
        </div>
        
        {/* Mensajes de error */}
        {errors.length > 0 && (
          <div class="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Errores de validación:</h3>
                <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {successMessage && (
          <div class="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex">
              <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="ml-3">
                <p class="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} class="p-6 space-y-6">
          {/* CUIT */}
          <div>
            <label htmlFor="cuit" class="block text-sm font-medium text-gray-700 mb-2">
              CUIT *
            </label>
            <input
              type="text"
              id="cuit"
              name="cuit"
              required
              maxLength={8}
              pattern="[0-9]{8}"
              placeholder="12345678"
              value={formData.cuit}
              onInput={handleInputChange}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="mt-1 text-sm text-gray-500">Debe contener exactamente 8 dígitos</p>
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              maxLength={100}
              placeholder="Distribuidora Norte"
              value={formData.nombre}
              onInput={handleInputChange}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="direccion" class="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              maxLength={200}
              placeholder="Av. Libertador 1234, CABA"
              value={formData.direccion}
              onInput={handleInputChange}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Número de Teléfono */}
          <div>
            <label htmlFor="numeroTelefono" class="block text-sm font-medium text-gray-700 mb-2">
              Número de Teléfono
            </label>
            <input
              type="tel"
              id="numeroTelefono"
              name="numeroTelefono"
              maxLength={20}
              placeholder="+54 11 4567-8901"
              value={formData.numeroTelefono}
              onInput={handleInputChange}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" class="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              maxLength={120}
              placeholder="Descripción de la distribuidora..."
              value={formData.descripcion}
              onInput={handleInputChange}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">Máximo 120 caracteres ({formData.descripcion?.length || 0}/120)</p>
          </div>

          {/* Código Postal */}
          <div>
            <label htmlFor="codigoPostal" class="block text-sm font-medium text-gray-700 mb-2">
              Código Postal
            </label>
            <input
              type="text"
              id="codigoPostal"
              name="codigoPostal"
              maxLength={4}
              pattern="[0-9]{4}"
              placeholder="1425"
              value={formData.codigoPostal}
              onInput={handleInputChange}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="mt-1 text-sm text-gray-500">Debe contener exactamente 4 dígitos</p>
          </div>

          {/* Botones */}
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <a
              href="/"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </a>
            <button
              type="submit"
              disabled={isLoading}
              class={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </>
              ) : (
                <>
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Crear Distribuidora
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
