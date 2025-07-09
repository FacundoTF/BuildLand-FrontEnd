import Layout from "../components/Layout.tsx";

export default function Home() {
  return (
    <Layout>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
              Bienvenido a BuildLand
            </h1>            
            <div class="mt-8 text-sm text-gray-500">
              <p>Utiliza la barra lateral para navegar entre las diferentes funciones del sistema.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
