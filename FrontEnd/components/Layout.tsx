import { ComponentChildren } from "preact";
import Sidebar from "../islands/Sidebar.tsx";

interface LayoutProps {
  children: ComponentChildren;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div class="min-h-screen bg-gray-100 flex">
      {/* Barra lateral */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div class="flex-1 ml-64">
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="px-6 py-4">
            <h1 class="text-2xl font-semibold text-gray-900">BuildLand</h1>
          </div>
        </header>
        
        <main class="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
