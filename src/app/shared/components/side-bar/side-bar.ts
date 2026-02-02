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
import { DialogService } from '../../services/dialog.service';

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
  private dialogService = inject(DialogService);

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
          `#Permissions > #G-${entidadPermiso}`,
        ) as HTMLElement;
        if (entidadContenedorGestion) {
          const btnGestion = entidadContenedorGestion.querySelector(
            `#Permissions > #G-${entidadPermiso} > .OpcionGestion`,
          ) as HTMLElement;
          if (btnGestion) {
            btnGestion.style.display = 'flex';
          }

          const entidadBtnNoDesplegable = document.querySelector(
            `#Permissions #G-${entidadPermiso} > #${permiso}.OpcionNoPlegable`,
          ) as HTMLElement;
          if (entidadBtnNoDesplegable) {
            entidadBtnNoDesplegable.style.display = 'flex';
            entidadBtnNoDesplegable.classList.add('activado');
          }
          const elementoBtnDesplegable = document.querySelector(
            `#Permissions #G-${entidadPermiso} > #${permiso}.Opcion`,
          ) as HTMLElement;
          if (elementoBtnDesplegable) {
            elementoBtnDesplegable.style.display = 'none';
            elementoBtnDesplegable.classList.add('activado');
          }
        }
      });
    }
  }
  ToogleGestion(id: string) {
    this.setActiveButton(id);
    console.log(id);
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
    this.setActiveButton('A-Di');
    this.router.navigate(['/base-page/distribuidora/agregar']).catch(() => {
      this.dialogService
        .showMessage('Error', 'Hubo un error al entrar en esta página')
        .subscribe();
    });
  }
  RemoverDistribuidora() {
    this.setActiveButton('R-Di');
    this.router.navigate(['/base-page/distribuidora/remover']).catch(() => {
      this.dialogService
        .showMessage('Error', 'Hubo un error al entrar en esta página')
        .subscribe();
    });
  }
  ModificarDistribuidora() {
    this.setActiveButton('M-Di');
    this.router.navigate(['/base-page/distribuidora/modificar']).catch(() => {
      this.dialogService
        .showMessage('Error', 'Hubo un error al entrar en esta página')
        .subscribe();
    });
  }
  AgregarPersonaFisica() {
    this.setActiveButton('A-Pf');
    this.router.navigate(['/base-page/persona-fisica/agregar']).catch(() => {
      this.dialogService
        .showMessage('Error', 'Hubo un error al entrar en esta página')
        .subscribe();
    });
  }
  RemoverPersonaFisica() {
    this.setActiveButton('R-Pf');
    this.router.navigate(['/base-page/persona-fisica/remover']).catch(() => {
      this.dialogService
        .showMessage('Error', 'Hubo un error al entrar en esta página')
        .subscribe();
    });
  }
  ModificarPersonaFisica() {
    this.setActiveButton('M-Pf');
    this.router.navigate(['/base-page/persona-fisica/modificar']).catch(() => {
      this.dialogService
        .showMessage('Error', 'Hubo un error al entrar en esta página')
        .subscribe();
    });
  }
  RealizarPresupuesto() {
    this.setActiveButton('Z-Pr');
    this.router.navigate(['/base-page/presupuesto/realizar']).catch(() => {
      this.dialogService
        .showMessage('Error', 'Hubo un error al entrar en esta página')
        .subscribe();
    });
  }
  RecibirPresupuesto() {
    this.setActiveButton('Y-Pr');
    this.router.navigate(['/base-page/presupuesto/recibir']).catch(() => {
      this.dialogService
        .showMessage('Error', 'Hubo un error al entrar en esta página')
        .subscribe();
    });
  }
  ReporteProductosMasSolicitados() {
    this.setActiveButton('P-X');
    this.router
      .navigate(['base-page/reporte/productos-mas-solicitados'])
      .catch(() => {
        this.dialogService
          .showMessage('Error', 'Hubo un error al entrar en esta página')
          .subscribe();
      });
  }
  CerrarSesion() {
    this.usuarioServicio.cerrarSesion();
  }
}
