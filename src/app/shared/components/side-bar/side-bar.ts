import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar {
  private router = inject(Router)
  
  ToogleGestion(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const buttons = element.querySelectorAll('.Opcion');
      buttons.forEach(element => {
        (element as HTMLElement).style.display = (element as HTMLElement).style.display === 'none' ? 'block' : 'none';
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
}
