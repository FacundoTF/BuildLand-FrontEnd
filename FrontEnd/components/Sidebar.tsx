import { useState } from "preact/hooks";

export default function Sidebar() {
  // Estado local para controlar el menú desplegable
  const [isDistribuidorasMenuOpen, setIsDistribuidorasMenuOpen] = useState(false);

  const toggleDistribuidorasMenu = () => {
    setIsDistribuidorasMenuOpen(!isDistribuidorasMenuOpen);
  };

  return (
    <div class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      {/* Header de la barra lateral */}
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">BuildLand</h2>
        <p class="text-sm text-gray-600">Panel de Administración</p>
      </div>

      {/* Navegación */}
      <nav class="mt-6">
        <div class="px-4">
          {/* Botón desplegable para Gestionar distribuidoras */}
          <div class="mb-2">
            <button
              type="button"
              onClick={toggleDistribuidorasMenu}
              class="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 mr-3 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span class="font-medium">Gestionar distribuidoras</span>
              </div>
              <svg
                class={`w-4 h-4 transition-transform duration-200 ${
                  isDistribuidorasMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Submenú desplegable */}
            {isDistribuidorasMenuOpen && (
              <div class="ml-4 mt-2 space-y-1">
                <a
                  href="/distribuidoras/agregar"
                  class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Agregar distribuidora
                </a>

                <a
                  href="/distribuidoras/modificar"
                  class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 rounded-md transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modificar distribuidora
                </a>

                <a
                  href="/distribuidoras/remover"
                  class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remover distribuidora
                </a>
              </div>
            )}
          </div>

          {/* Otras opciones del menú */}
          <div class="mt-6">
            <a
              href="/"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <svg
                class="w-5 h-5 mr-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Inicio</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
