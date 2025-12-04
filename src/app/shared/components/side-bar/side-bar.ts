import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioServicio } from '../../services/usuario-servicio';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar implements OnInit {
  private router = inject(Router);
  private usuarioServicio = inject(UsuarioServicio);

  ngOnInit(): void {
    const permisos = sessionStorage.getItem('permisos');
    if (permisos) {
      const permisosArray = JSON.parse(permisos);
      console.log(permisosArray);

      permisosArray.forEach((element: object) => {
        const permiso = element.toString();
        let entidadPermiso = permiso.substring(2, 4);
        const entidadContenedorGestion = document.querySelector(
          `#Permissions #G-${entidadPermiso}`,
        ) as HTMLElement;
        if (entidadContenedorGestion) {
          const computedDisplay = window.getComputedStyle(
            entidadContenedorGestion,
          ).display;
          if (computedDisplay === 'block' || computedDisplay === 'none') {
            entidadContenedorGestion.style.display = 'flex';
          }
          const entidadBtnGestion = document.querySelector(
            `#Permissions #G-${entidadPermiso} > .OpcionNoPlegable`,
          ) as HTMLElement;
          if (entidadBtnGestion) {
            entidadBtnGestion.style.display = 'flex';
          }
        }
        const seccion = document.querySelector(
          `#${permiso}.Opcion`,
        ) as HTMLElement;
        if (seccion) {
          seccion.style.display = 'none';
          seccion.classList.add('activado');
        }
      });
    }
  }
  ToogleGestion(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const buttons = element.querySelectorAll('.Opcion.activado');
      buttons.forEach((element) => {
        const btn = element as HTMLElement;
        const currentDisplay = window.getComputedStyle(btn).display;
        btn.style.display = currentDisplay === 'none' ? 'flex' : 'none';
      });
    }
  }

  AgregarDistribuidora() {
    this.router.navigate(['/base-page/distribuidora/agregar']);
  }
  RemoverDistribuidora() {
    this.router.navigate(['/base-page/distribuidora/remover']);
  }
  ModificarDistribuidora() {
    this.router.navigate(['/base-page/distribuidora/modificar']);
  }
  AgregarPersonaFisica() {
    this.router.navigate(['/base-page/persona-fisica/agregar']);
  }
  RemoverPersonaFisica() {
    this.router.navigate(['/base-page/persona-fisica/remover']);
  }
  ModificarPersonaFisica() {
    this.router.navigate(['/base-page/persona-fisica/modificar']);
  }
  RealizarPresupuesto() {
    this.router.navigate(['/base-page/presupuesto/realizar']);
  }
  CerrarSesion() {
    const observable = this.usuarioServicio.cerrarSesion();
    observable.subscribe({
      next: () => {
        this.router.navigate(['/iniciar-sesion']);
      },
      error: (a) => {
        alert('Error al cerrar sesion: ' + JSON.stringify(a));
      },
    });
  }
}
