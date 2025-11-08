import { DistribuidoraAgregar } from './features/distribuidora/distribuidora-agregar/distribuidora-agregar';
import { Routes } from '@angular/router';
import { DistribuidoraRemover } from './features/distribuidora/distribuidora-remover/distribuidora-remover';
import { DistribuidoraModificar } from './features/distribuidora/distribuidora-modificar/distribuidora-modificar';
import { PersonaFisicaAgregar } from './features/persona-fisica/persona-fisica-agregar/persona-fisica-agregar';
import { PersonaFisicaModificar } from './features/persona-fisica/persona-fisica-modificar/persona-fisica-modificar';
import { PersonaFisicaRemover } from './features/persona-fisica/persona-fisica-remover/persona-fisica-remover';

export const routes: Routes = [
  { path: 'distribuidora/agregar', component: DistribuidoraAgregar },
  { path: 'distribuidora/remover', component: DistribuidoraRemover },
  { path: 'distribuidora/modificar', component: DistribuidoraModificar },
  { path: 'persona-fisica/agregar', component: PersonaFisicaAgregar },
  { path: 'persona-fisica/remover', component: PersonaFisicaRemover },
  { path: 'persona-fisica/modificar', component: PersonaFisicaModificar },
];

// const routes_distribuidora: Routes = [
//     {path: '/distribuidora/agregar', component:DistribuidoraAgregar},
//     {path: '/distribuidora/remover', component:DistribuidoraRemover},
//     {path: '/distribuidora/modificar', component:DistribuidoraModificar}
// ]

// routes.push(...routes_distribuidora)
