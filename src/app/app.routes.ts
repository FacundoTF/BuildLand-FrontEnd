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
  usuarioPorEmailResolver,
  gruposResolver,
  permisosResolver,
} from './data-resolvers';
import { RecibirPresupuesto } from './features/presupuesto/recibir-presupuesto/recibir-presupuesto';
import { VerDetallesPresupuesto } from './features/presupuesto/recibir-presupuesto/ver-detalles-presupuesto/ver-detalles-presupuesto';
import { RealizarCotizacion } from './features/cotizacion/realizar-cotizacion/realizar-cotizacion';
import { RecibirCotizacion } from './features/cotizacion/recibir-cotizacion/recibir-cotizacion';
import { ProductosSolicitados } from './features/reportes/productos-solicitados/productos-solicitados';
import { CotizacionesPerdidasGanadas } from './features/reportes/cotizaciones-perdidas-ganadas/cotizaciones-perdidas-ganadas';
import { AgregarUsuario } from './features/usuario/agregar-usuario/agregar-usuario';
import { UsuarioRemover } from './features/usuario/usuario-remover/usuario-remover';
import { UsuarioModificar } from './features/usuario/usuario-modificar/usuario-modificar';
import { ModificandoUsuario } from './features/usuario/modificando-usuario/modificando-usuario';
import { GrupoAgregar } from './features/grupo/grupo-agregar/grupo-agregar';
import { GrupoRemover } from './features/grupo/grupo-remover/grupo-remover';
import { GrupoModificar } from './features/grupo/grupo-modificar/grupo-modificar';
import { ResetearClave } from './features/usuario/resetear-clave/resetear-clave';
import { ReseteandoClave } from './features/usuario/reseteando-clave/reseteando-clave';
import { NotFoundPage } from './core/not-found-page/not-found-page';

export const routes: Routes = [
  { path: '', component: InicioSesion, pathMatch: 'full' },
  {
    path: 'base-page',
    component: BasePage,
    children: [
      // Usuarios
      {
        path: 'usuario/agregar',
        component: AgregarUsuario,
      },
      {
        path: 'usuario/remover',
        component: UsuarioRemover,
      },
      {
        path: 'usuario/modificar',
        component: UsuarioModificar,
      },
      {
        path: 'usuario/modificando/:email',
        component: ModificandoUsuario,
        resolve: {
          usuarioData: usuarioPorEmailResolver,
          categoriasData: categoriasResolver,
          gruposData: gruposResolver,
          permisosData: permisosResolver,
        },
      },
      {
        path: 'usuario/resetear-clave',
        component: ResetearClave,
      },
      {
        path: 'usuario/reseteando-clave/:email',
        component: ReseteandoClave,
      },
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
      {
        path: 'grupo/agregar',
        component: GrupoAgregar,
        resolve: {
          gruposData: gruposResolver,
          permisosData: permisosResolver,
        },
      },
      {
        path: 'grupo/remover',
        component: GrupoRemover,
        resolve: {
          gruposData: gruposResolver,
        },
      },
      {
        path: 'grupo/modificar',
        component: GrupoModificar,
        resolve: {
          gruposData: gruposResolver,
          permisosData: permisosResolver,
        },
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
