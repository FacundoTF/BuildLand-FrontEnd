import { Injectable } from '@angular/core';
import { ConjuntoGrupoPermiso } from '../../core/entities/conjuntoGrupoPermiso/conjunto-grupo-permiso';
import { Usuario } from '../../core/entities/usuario/usuario';
import { Grupo } from '../../core/entities/grupo/grupo';
import { Permiso } from '../../core/entities/permiso/permiso';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  iniciarSesion(correoElectronico: string, clave: string): Usuario | null {
    // Lógica para iniciar sesión
    console.log(`Iniciando sesión para el usuario: ${correoElectronico}`);
    return null; // o un objeto Usuario según la lógica
  }

  revisarPermisos(
    elementos: ConjuntoGrupoPermiso[],
    objetivo: Permiso | Grupo
  ): boolean {
    let encontrado = false;
    // Lógica para revisar permisos
    for (const element of elementos) {
      // Lógica para revisar permisos en cada elemento
      if (element instanceof Grupo) {
        // Verificar si el grupo contiene el permiso o grupo objetivo
        let permisoEncontrado = false;
        let grupoEncontrado = false;

        if (objetivo instanceof Permiso) {
          permisoEncontrado = element.permisos.some(
            (permiso: Permiso) => permiso.nombre === objetivo.nombre
          );
        }
        if (objetivo instanceof Grupo) {
          grupoEncontrado = element.grupos.some(
            (grupo: Grupo) => grupo.nombre === objetivo.nombre
          );
        }
        if (permisoEncontrado || grupoEncontrado) {
          console.log(`Permiso o grupo encontrado en: ${element.nombre}`);
          encontrado = true;
          break;
        } else {
          // Llamada recursiva para revisar grupos anidados
          if (this.revisarPermisos(element.grupos, objetivo)) {
            console.log(
              `Permiso o grupo encontrado en grupo anidado de: ${element.nombre}`
            );
            return true;
          }
        }
      } else if (element instanceof Permiso) {
        if (element.nombre === objetivo.nombre) {
          console.log(`Permiso encontrado: ${element.nombre}`);
          encontrado = true;
          break;
        } else {
          console.log(`Permiso no encontrado: ${element.nombre}`);
        }
      }
    }
    return encontrado;
  }
}
