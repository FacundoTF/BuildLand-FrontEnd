import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { PresupuestoServicio } from './shared/services/presupuesto/presupuesto-servicio';
import { CategoriaService } from './shared/services/categoria/categoria-service';
import { CotizacionServicio } from './shared/services/cotizacion/cotizacion-servicio';
import { UsuarioServicio } from './shared/services/usuario-servicio';
import { GrupoServicio } from './shared/services/grupo/grupo-servicio';
import { inject } from '@angular/core';
import { ReturnSearchResponse } from './core/response-type/return-search-response';
import { ReturnPaginationResponse } from './core/response-type/return-pagination-response';

export const presupuestoResolver: ResolveFn<
  ReturnPaginationResponse
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

export const presupuestoDetallesCotizarResolver: ResolveFn<
  ReturnSearchResponse
> = () => {
  const presupuestoServicio = inject(PresupuestoServicio);
  return presupuestoServicio.obtenerDetallesParaCotizar();
};

export const cotizacionesResolver: ResolveFn<ReturnPaginationResponse> = (
  route: ActivatedRouteSnapshot,
) => {
  let idPresupuestoString = route.paramMap.get('IdPresupuesto');
  if (!idPresupuestoString) {
    idPresupuestoString = '';
  }
  return inject(CotizacionServicio).obtenerCotizaciones(
    parseInt(idPresupuestoString),
  );
};

export const categoriasDistribuidoraResolver: ResolveFn<
  ReturnSearchResponse
> = () => {
  return inject(CategoriaService).traerCategoriasDeDistribuidora();
};

export const usuarioPorEmailResolver: ResolveFn<ReturnSearchResponse> = (
  route: ActivatedRouteSnapshot,
) => {
  const usuarioServicio = inject(UsuarioServicio);
  const email = route.paramMap.get('email');
  return usuarioServicio.buscarUsuarioPorEmail(email);
};

export const gruposResolver: ResolveFn<ReturnSearchResponse> = () => {
  return inject(GrupoServicio).obtenerGrupos();
};

export const permisosResolver: ResolveFn<ReturnSearchResponse> = () => {
  return inject(GrupoServicio).obtenerPermisos();
};
