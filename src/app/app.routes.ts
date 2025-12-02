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

export const routes: Routes = [
  { path: 'base-page', component: BasePage },
  { path: '', component: Home, pathMatch: 'full' },
];

//Distribuidoras
routes.push(
  {
    path: 'distribuidora/agregar',
    component: DistribuidoraAgregar,
  },
  {
    path: 'distribuidora/remover',
    component: DistribuidoraRemover,
  },
  {
    path: 'distribuidora/modificar',
    component: DistribuidoraModificar,
  },
);
//Personas Físicas
routes.push(
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
);
//Presupuestos
routes.push({
  path: 'presupuesto/realizar',
  component: RealizarPresupuesto,
});
//Inicio de sesión
routes.push(
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
);
