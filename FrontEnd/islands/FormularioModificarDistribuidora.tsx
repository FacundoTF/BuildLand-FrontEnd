import { useState } from "preact/hooks";
import { DistribuidoraService, DistribuidoraValidator } from "../services/distribuidoraService.ts";
import { Distribuidora, DistribuidoraActualizada } from "../types/distribuidora.ts";

export default function FormularioModificarDistribuidora() {
  const [cuitBusqueda, setCuitBusqueda] = useState("");
  const [distribuidoraEncontrada, setDistribuidoraEncontrada] = useState<Distribuidora | null>(null);
  const [formData, setFormData] = useState<DistribuidoraActualizada>({
    nombre: "",
    direccion: "",
    numeroTelefono: "",
    descripcion: "",
    codigoPostal: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [notFoundMessage, setNotFoundMessage] = useState("");

  const handleBusquedaChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setCuitBusqueda(target.value);
    
    // Limpiar mensajes y datos previos
    if (distribuidoraEncontrada) {
      setDistribuidoraEncontrada(null);
      setFormData({
        nombre: "",
        direccion: "",
        numeroTelefono: "",
        descripcion: "",
        codigoPostal: "",
      });
    }
    if (errors.length > 0) setErrors([]);
    if (successMessage) setSuccessMessage("");
    if (notFoundMessage) setNotFoundMessage("");
  };

  const buscarDistribuidora = async (e: Event) => {
    e.preventDefault();
    
    if (!cuitBusqueda.trim()) {
      setErrors(["Debe ingresar un CUIT para buscar"]);
      return;
    }

    if (!DistribuidoraValidator.validarCuit(cuitBusqueda)) {
      setErrors(["El CUIT debe tener exactamente 8 dígitos"]);
      return;
    }

    setIsSearching(true);
    setErrors([]);
    setNotFoundMessage("");
    setSuccessMessage("");

    try {
      const distribuidora = await DistribuidoraService.obtenerPorCuit(cuitBusqueda);
      
      setDistribuidoraEncontrada(distribuidora);
      setFormData({
        nombre: distribuidora.nombre,
        direccion: distribuidora.direccion || "",
        numeroTelefono: distribuidora.numeroTelefono || "",
        descripcion: distribuidora.descripcion || "",
        codigoPostal: distribuidora.codigoPostal || "",
      });
      
    } catch (error) {
      console.error("Error al buscar distribuidora:", error);
      setNotFoundMessage(`No se encontró una distribuidora con CUIT ${cuitBusqueda}`);
      setDistribuidoraEncontrada(null);
    } finally {
      setIsSearching(false);
    }
  };

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
    
    if (!distribuidoraEncontrada) {
      setErrors(["Debe buscar y seleccionar una distribuidora primero"]);
      return;
    }

    setIsUpdating(true);
    setErrors([]);
    setSuccessMessage("");

    try {
      // Validaciones del lado del cliente
      const validationErrors = DistribuidoraValidator.validarActualizacionDistribuidora(formData);
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsUpdating(false);
        return;
      }

      // Verificar que al menos un campo haya cambiado
      const hasChanges = Object.entries(formData).some(([key, value]) => {
        const originalValue = distribuidoraEncontrada[key as keyof Distribuidora] || "";
        return value !== originalValue;
      });

      if (!hasChanges) {
        setErrors(["Debe modificar al menos un campo para actualizar la distribuidora"]);
        setIsUpdating(false);
        return;
      }

      // Enviar al backend
      const distribuidoraActualizada = await DistribuidoraService.actualizar(
        distribuidoraEncontrada.id, 
        formData
      );
      
      // Éxito
      setSuccessMessage(`Distribuidora "${distribuidoraActualizada.nombre}" actualizada exitosamente`);
      
      // Actualizar los datos mostrados
      setDistribuidoraEncontrada(distribuidoraActualizada);

    } catch (error) {
      console.error("Error al actualizar distribuidora:", error);
      setErrors([error instanceof Error ? error.message : "Error desconocido al actualizar la distribuidora"]);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Modificar Distribuidora</h1>
          <p class="text-gray-600">Busca por CUIT y modifica los datos de la distribuidora</p>
        </div>
        
        {/* Formulario de búsqueda */}
        <div class="p-6 border-b border-gray-200 bg-gray-50">
          <form onSubmit={buscarDistribuidora} class="space-y-4">
            <div>
              <label htmlFor="cuitBusqueda" class="block text-sm font-medium text-gray-700 mb-1">
                CUIT de la distribuidora *
              </label>
              <div class="flex gap-2">
                <input
                  type="text"
                  id="cuitBusqueda"
                  name="cuitBusqueda"
                  value={cuitBusqueda}
                  onInput={handleBusquedaChange}
                  placeholder="Ingrese 8 dígitos"
                  maxLength={8}
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  disabled={isSearching || !cuitBusqueda.trim()}
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Mensajes de error para búsqueda */}
        {errors.length > 0 && !distribuidoraEncontrada && (
          <div class="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error:</h3>
                <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de no encontrado */}
        {notFoundMessage && (
          <div class="m-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex">
              <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="ml-3">
                <p class="text-sm text-yellow-800">{notFoundMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de modificación - solo visible si se encontró una distribuidora */}
        {distribuidoraEncontrada && (
          <div class="p-6">
            {/* Información de la distribuidora encontrada */}
            <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex">
                <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Distribuidora encontrada:</h3>
                  <p class="text-sm text-green-700">
                    <strong>CUIT:</strong> {distribuidoraEncontrada.id} - <strong>Nombre:</strong> {distribuidoraEncontrada.nombre}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensajes de error para actualización */}
            {errors.length > 0 && distribuidoraEncontrada && (
              <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
              <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex">
                  <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} class="space-y-6">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la distribuidora *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onInput={handleInputChange}
                  placeholder="Nombre de la distribuidora"
                  maxLength={100}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                />
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="direccion" class="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onInput={handleInputChange}
                  placeholder="Dirección de la distribuidora"
                  maxLength={200}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                />
              </div>

              {/* Número de teléfono */}
              <div>
                <label htmlFor="numeroTelefono" class="block text-sm font-medium text-gray-700 mb-1">
                  Número de teléfono
                </label>
                <input
                  type="text"
                  id="numeroTelefono"
                  name="numeroTelefono"
                  value={formData.numeroTelefono}
                  onInput={handleInputChange}
                  placeholder="Número de teléfono"
                  maxLength={20}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                />
              </div>

              {/* Código postal */}
              <div>
                <label htmlFor="codigoPostal" class="block text-sm font-medium text-gray-700 mb-1">
                  Código postal
                </label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onInput={handleInputChange}
                  placeholder="4 dígitos"
                  maxLength={4}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                />
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" class="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onInput={handleInputChange}
                  placeholder="Descripción de la distribuidora (máximo 120 caracteres)"
                  maxLength={120}
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={isUpdating}
                />
                <div class="text-right text-xs text-gray-500 mt-1">
                  {formData.descripcion?.length || 0}/120 caracteres
                </div>
              </div>

              {/* Botón de envío */}
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Actualizando..." : "Actualizar Distribuidora"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
