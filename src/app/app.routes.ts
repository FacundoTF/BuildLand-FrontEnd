import { DistribuidoraAgregar } from './features/distribuidora/distribuidora-agregar/distribuidora-agregar';
import { Routes } from '@angular/router';
import { DistribuidoraRemover } from './features/distribuidora/distribuidora-remover/distribuidora-remover';
import { DistribuidoraModificar } from './features/distribuidora/distribuidora-modificar/distribuidora-modificar';
import { PersonaFisicaAgregar } from './features/persona-fisica/persona-fisica-agregar/persona-fisica-agregar';
import { PersonaFisicaModificar } from './features/persona-fisica/persona-fisica-modificar/persona-fisica-modificar';
import { PersonaFisicaRemover } from './features/persona-fisica/persona-fisica-remover/persona-fisica-remover';
import { RealizarPresupuesto } from './features/presupuesto/realizar-presupuesto/realizar-presupuesto';
import { InicioSesion } from './core/inicio-sesion/inicio-sesion';
import { BasePage } from './core/base-page/base-page';
import { Home } from './core/home/home';
import { RestorePassword } from './core/restore-password/restore-password';
import { ConfirmNewPassword } from './core/restore-password/confirm-new-password/confirm-new-password';
import { SubmitSecret } from './core/restore-password/submit-secret/submit-secret';
import {
  categoriasResolver,
  presupuestoDetalleResolver,
  presupuestoDetallesCotizarResolver,
  cotizacionesResolver,
  presupuestoResolver,
  categoriasDistribuidoraResolver,
} from './data-resolvers';
import { RecibirPresupuesto } from './features/presupuesto/recibir-presupuesto/recibir-presupuesto';
import { VerDetallesPresupuesto } from './features/presupuesto/recibir-presupuesto/ver-detalles-presupuesto/ver-detalles-presupuesto';
import { RealizarCotizacion } from './features/cotizacion/realizar-cotizacion/realizar-cotizacion';
import { RecibirCotizacion } from './features/cotizacion/recibir-cotizacion/recibir-cotizacion';
import { ProductosSolicitados } from './features/reportes/productos-solicitados/productos-solicitados';
import { CotizacionesPerdidasGanadas } from './features/reportes/cotizaciones-perdidas-ganadas/cotizaciones-perdidas-ganadas';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    path: 'base-page',
    component: BasePage,
    children: [
      // Distribuidoras
      {
        path: 'distribuidora/agregar',
        component: DistribuidoraAgregar,
        resolve: {
          categoriasData: categoriasResolver,
        },
      },
      {
        path: 'distribuidora/remover',
        component: DistribuidoraRemover,
      },
      {
        path: 'distribuidora/modificar',
        component: DistribuidoraModificar,
        resolve: {
          categoriasData: categoriasResolver,
        },
      },
      // Personas Físicas
      {
        path: 'persona-fisica/agregar',
        component: PersonaFisicaAgregar,
      },
      {
        path: 'persona-fisica/remover',
        component: PersonaFisicaRemover,
      },
      {
        path: 'persona-fisica/modificar',
        component: PersonaFisicaModificar,
      },
      // Presupuestos
      {
        path: 'presupuesto/realizar',
        component: RealizarPresupuesto,
        resolve: {
          categoriasData: categoriasResolver,
        },
      },
      {
        path: 'presupuesto/recibir',
        component: RecibirPresupuesto,
        resolve: {
          presupuestosData: presupuestoResolver,
        },
      },
      {
        path: 'presupuesto/ver-detalles/:IdPresupuesto',
        component: VerDetallesPresupuesto,
        resolve: {
          presupuestoDetalleData: presupuestoDetalleResolver,
        },
      },
      {
        path: 'presupuesto/cotizar',
        component: RealizarCotizacion,
        resolve: {
          detalles: presupuestoDetallesCotizarResolver,
        },
      },
      {
        path: 'cotizacion/recibir/:IdPresupuesto',
        component: RecibirCotizacion,
        resolve: {
          cotizacionesData: cotizacionesResolver,
        },
      },
      {
        path: 'reporte/productos-mas-solicitados',
        component: ProductosSolicitados,
        resolve: {
          categoriasData: categoriasDistribuidoraResolver,
        },
      },
      {
        path: 'reporte/cotizaciones-perdidas-ganadas',
        component: CotizacionesPerdidasGanadas,
      },
    ],
  },
  // Rutas de autenticación
  { path: 'iniciar-sesion', component: InicioSesion },
  {
    path: 'restore-password',
    component: RestorePassword,
  },
  {
    path: 'confirm-new-password',
    component: ConfirmNewPassword,
  },
  {
    path: 'submit-secret',
    component: SubmitSecret,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
