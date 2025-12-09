import { ResolveFn } from '@angular/router';
import { PresupuestoServicio } from './shared/services/presupuesto/presupuesto-servicio';
import { CategoriaService } from './shared/services/categoria/categoria-service';
import { inject } from '@angular/core';
import { ReturnSearchResponse } from './shared/services/return-search-response';
import { lastValueFrom } from 'rxjs';

export const presupuestoResolver: ResolveFn<
  ReturnSearchResponse
> = async () => {
  return await inject(PresupuestoServicio).obtenerPresupuestos();
};

export const categoriasResolver: ResolveFn<ReturnSearchResponse> = async () => {
  return await inject(CategoriaService).traerCategorias();
};
