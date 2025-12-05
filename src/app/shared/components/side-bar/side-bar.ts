import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioServicio } from '../../services/usuario-servicio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-bar',
  imports: [MatButtonModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBar implements OnInit {
  private router = inject(Router);
  private usuarioServicio = inject(UsuarioServicio);

  activeButton = signal<string | null>(null);

  setActiveButton(buttonId: string) {
    this.activeButton.set(buttonId);
  }

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
    this.setActiveButton('A-DI');
    this.router.navigate(['/base-page/distribuidora/agregar']).catch(() => {
      alert('Hubo un error al entrar en esta página');
    });
  }
  RemoverDistribuidora() {
    this.setActiveButton('R-DI');
    this.router.navigate(['/base-page/distribuidora/remover']).catch(() => {
      alert('Hubo un error al entrar en esta página');
    });
  }
  ModificarDistribuidora() {
    this.setActiveButton('M-DI');
    this.router.navigate(['/base-page/distribuidora/modificar']).catch(() => {
      alert('Hubo un error al entrar en esta página');
    });
  }
  AgregarPersonaFisica() {
    this.setActiveButton('A-PF');
    this.router.navigate(['/base-page/persona-fisica/agregar']).catch(() => {
      alert('Hubo un error al entrar en esta página');
    });
  }
  RemoverPersonaFisica() {
    this.setActiveButton('R-PF');
    this.router.navigate(['/base-page/persona-fisica/remover']).catch(() => {
      alert('Hubo un error al entrar en esta página');
    });
  }
  ModificarPersonaFisica() {
    this.setActiveButton('M-PF');
    this.router.navigate(['/base-page/persona-fisica/modificar']).catch(() => {
      alert('Hubo un error al entrar en esta página');
    });
  }
  RealizarPresupuesto() {
    this.setActiveButton('R-Pr');
    this.router.navigate(['/base-page/presupuesto/realizar']).catch(() => {
      alert('Hubo un error al entrar en esta página');
    });
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
