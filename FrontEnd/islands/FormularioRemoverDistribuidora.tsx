import { useState } from "preact/hooks";
import { DistribuidoraService, DistribuidoraValidator } from "../services/distribuidoraService.ts";
import { Distribuidora } from "../types/distribuidora.ts";

export default function FormularioRemoverDistribuidora() {
  const [distribuidoraEncontrada, setDistribuidoraEncontrada] = useState<Distribuidora | null>(null);
  const [busquedaCuit, setBusquedaCuit] = useState("");
  const [confirmacionTexto, setConfirmacionTexto] = useState("");
  const [confirmacionCheck, setConfirmacionCheck] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuscando, setIsBuscando] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const limpiarFormulario = () => {
    setDistribuidoraEncontrada(null);
    setBusquedaCuit("");
    setConfirmacionTexto("");
    setConfirmacionCheck(false);
    setErrors([]);
    setSuccessMessage("");
  };

  const buscarPorCuit = async () => {
    if (!busquedaCuit.trim()) {
      setErrors(["Por favor ingrese un CUIT para buscar"]);
      return;
    }

    if (!DistribuidoraValidator.validarCuit(busquedaCuit)) {
      setErrors(["El CUIT debe tener exactamente 8 dígitos"]);
      return;
    }

    setIsBuscando(true);
    setErrors([]);
    
    try {
      const distribuidora = await DistribuidoraService.obtenerPorCuit(busquedaCuit);
      setDistribuidoraEncontrada(distribuidora);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Distribuidora no encontrada"]);
      setDistribuidoraEncontrada(null);
    } finally {
      setIsBuscando(false);
    }
  };

  const eliminarDistribuidora = async () => {
    if (!distribuidoraEncontrada) {
      setErrors(["No hay distribuidora seleccionada para eliminar"]);
      return;
    }

    if (!confirmacionCheck) {
      setErrors(["Debe confirmar que desea eliminar la distribuidora"]);
      return;
    }

    if (confirmacionTexto !== "ELIMINAR") {
      setErrors(["Debe escribir 'ELIMINAR' en el campo de confirmación"]);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      await DistribuidoraService.eliminar(distribuidoraEncontrada.id);
      setSuccessMessage(`Distribuidora "${distribuidoraEncontrada.nombre}" (CUIT: ${distribuidoraEncontrada.id}) eliminada exitosamente`);
      limpiarFormulario();
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Error al eliminar la distribuidora"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter: (value: string) => void) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    setter(target.value);
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const isFormValid = confirmacionCheck && confirmacionTexto === "ELIMINAR";

  return (
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Remover Distribuidora</h1>
          <p class="text-gray-600">Busca por CUIT y elimina distribuidoras del sistema</p>
        </div>
        
        <div class="p-6">
          {/* Mensajes de error */}
          {errors.length > 0 && (
            <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Errores:</h3>
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
                  <p class="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Buscador */}
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Buscar Distribuidora por CUIT</h2>
            <div class="max-w-md">
              <label htmlFor="buscarCuit" class="block text-sm font-medium text-gray-700 mb-2">
                Ingrese el CUIT de la distribuidora
              </label>
              <div class="flex">
                <input
                  type="text"
                  id="buscarCuit"
                  maxLength={8}
                  pattern="[0-9]{8}"
                  placeholder="12345678"
                  value={busquedaCuit}
                  onInput={handleInputChange(setBusquedaCuit)}
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={buscarPorCuit}
                  disabled={isBuscando}
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-r-lg transition-colors duration-200"
                >
                  {isBuscando ? "..." : "Buscar"}
                </button>
              </div>
              <p class="mt-1 text-sm text-gray-500">El CUIT debe contener exactamente 8 dígitos</p>
            </div>
          </div>

          {/* Información de la distribuidora encontrada */}
          {distribuidoraEncontrada && (
            <div class="border-t border-gray-200 pt-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Distribuidora Encontrada</h2>
              
              <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                  </div>
                  <div class="ml-3 flex-1">
                    <h3 class="text-sm font-medium text-red-800">
                      ¡Atención! Esta acción no se puede deshacer
                    </h3>
                    <p class="mt-1 text-sm text-red-700">
                      Al eliminar esta distribuidora, toda su información será permanentemente removida del sistema.
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-6 mb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-700">CUIT</h3>
                    <p class="mt-1 text-sm text-gray-900">{distribuidoraEncontrada.id}</p>
                  </div>
                  
                  <div>
                    <h3 class="text-sm font-medium text-gray-700">Nombre</h3>
                    <p class="mt-1 text-sm text-gray-900">{distribuidoraEncontrada.nombre}</p>
                  </div>
                  
                  <div>
                    <h3 class="text-sm font-medium text-gray-700">Dirección</h3>
                    <p class="mt-1 text-sm text-gray-900">{distribuidoraEncontrada.direccion || "No especificada"}</p>
                  </div>
                  
                  <div>
                    <h3 class="text-sm font-medium text-gray-700">Teléfono</h3>
                    <p class="mt-1 text-sm text-gray-900">{distribuidoraEncontrada.numeroTelefono || "No especificado"}</p>
                  </div>
                  
                  <div>
                    <h3 class="text-sm font-medium text-gray-700">Código Postal</h3>
                    <p class="mt-1 text-sm text-gray-900">{distribuidoraEncontrada.codigoPostal || "No especificado"}</p>
                  </div>
                  
                  <div>
                    <h3 class="text-sm font-medium text-gray-700">Descripción</h3>
                    <p class="mt-1 text-sm text-gray-900">{distribuidoraEncontrada.descripcion || "Sin descripción"}</p>
                  </div>
                </div>
              </div>

              {/* Confirmación de eliminación */}
              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirmar Eliminación</h3>
                
                <div class="mb-4">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      checked={confirmacionCheck}
                      onChange={(e) => setConfirmacionCheck((e.target as HTMLInputElement).checked)}
                      class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">
                      Confirmo que quiero eliminar permanentemente esta distribuidora
                    </span>
                  </label>
                </div>

                <div class="mb-6">
                  <label htmlFor="confirmacion" class="block text-sm font-medium text-gray-700 mb-2">
                    Para confirmar, escriba "ELIMINAR" en el campo de abajo:
                  </label>
                  <input
                    type="text"
                    id="confirmacion"
                    placeholder="ELIMINAR"
                    value={confirmacionTexto}
                    onInput={handleInputChange(setConfirmacionTexto)}
                    class="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Botones */}
                <div class="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={eliminarDistribuidora}
                    disabled={!isFormValid || isLoading}
                    class={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
                      isFormValid && !isLoading
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Eliminar Distribuidora
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje cuando no se encuentra distribuidora */}
          {!distribuidoraEncontrada && !successMessage && (
            <div class="border-t border-gray-200 pt-8 text-center text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p class="mt-2">Utilice los campos de búsqueda para encontrar una distribuidora</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
