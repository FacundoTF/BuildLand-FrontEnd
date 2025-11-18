import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar {
  private router = inject(Router);

  ToogleGestion(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const buttons = element.querySelectorAll('.Opcion');
      buttons.forEach((element) => {
        const btn = element as HTMLElement;
        const currentDisplay = window.getComputedStyle(btn).display;
        btn.style.display = currentDisplay === 'none' ? 'block' : 'none';
      });
    }
  }

  AgregarDistribuidora() {
    this.router.navigateByUrl('distribuidora/agregar');
  }
  RemoverDistribuidora() {
    this.router.navigateByUrl('distribuidora/remover');
  }
  ModificarDistribuidora() {
    this.router.navigateByUrl('distribuidora/modificar');
  }
  AgregarPersonaFisica() {
    this.router.navigateByUrl('persona-fisica/agregar');
  }
  RemoverPersonaFisica() {
    this.router.navigateByUrl('persona-fisica/remover');
  }
  ModificarPersonaFisica() {
    this.router.navigateByUrl('persona-fisica/modificar');
  }
  RealizarPresupuesto() {
    this.router.navigateByUrl('presupuesto/realizar');
  }
}
