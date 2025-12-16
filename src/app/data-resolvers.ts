import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { PresupuestoServicio } from './shared/services/presupuesto/presupuesto-servicio';
import { CategoriaService } from './shared/services/categoria/categoria-service';
import { inject } from '@angular/core';
import { ReturnSearchResponse } from './shared/services/return-search-response';

export const presupuestoResolver: ResolveFn<
  ReturnSearchResponse
> = async () => {
  return await inject(PresupuestoServicio).obtenerPresupuestos();
};

export const categoriasResolver: ResolveFn<ReturnSearchResponse> = async () => {
  return await inject(CategoriaService).traerCategorias();
};

export const presupuestoDetalleResolver: ResolveFn<ReturnSearchResponse> = (
  route: ActivatedRouteSnapshot,
) => {
  const presupuestoServicio = inject(PresupuestoServicio);
  const idPresupuestoString = route.paramMap.get('IdPresupuesto');
  const idPresupuesto = idPresupuestoString
    ? parseInt(idPresupuestoString, 10)
    : 0;
  return presupuestoServicio.obtenerPresupuestosDetalles(idPresupuesto);
};
