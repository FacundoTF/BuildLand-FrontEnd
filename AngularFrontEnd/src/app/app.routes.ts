import { DistribuidoraAgregar } from './features/distribuidora/distribuidora-agregar/distribuidora-agregar';
import { Routes } from '@angular/router';
import { DistribuidoraRemover } from './features/distribuidora/distribuidora-remover/distribuidora-remover';
import { DistribuidoraModificar } from './features/distribuidora/distribuidora-modificar/distribuidora-modificar';

export const routes: Routes = [
    {path: 'distribuidora/agregar', component:DistribuidoraAgregar},
    {path: 'distribuidora/remover', component:DistribuidoraRemover},
    {path: 'distribuidora/modificar', component:DistribuidoraModificar}
];

// const routes_distribuidora: Routes = [
//     {path: '/distribuidora/agregar', component:DistribuidoraAgregar},
//     {path: '/distribuidora/remover', component:DistribuidoraRemover},
//     {path: '/distribuidora/modificar', component:DistribuidoraModificar}
// ]

// routes.push(...routes_distribuidora)


