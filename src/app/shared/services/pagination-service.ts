import { Injectable, OnInit, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService implements OnInit {
  ngOnInit(): void {
    this.resetearPagina();
  }
  paginaActual = signal(0);

  incrementarPagina() {
    this.paginaActual.update((pagina) => pagina + 1);
  }

  decrementarPagina() {
    this.paginaActual.update((pagina) => (pagina > 1 ? pagina - 1 : pagina));
  }

  resetearPagina() {
    this.paginaActual.set(0);
  }
}
