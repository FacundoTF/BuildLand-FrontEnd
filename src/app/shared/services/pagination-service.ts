import { Injectable, OnInit, signal } from '@angular/core';

@Injectable()
export class PaginationService {
  firstPage = signal(false);
  lastPage = signal(false);
  currentPage = signal(0);

  incrementarPagina() {
    this.currentPage.update((pagina) => pagina + 1);
  }

  decrementarPagina() {
    this.currentPage.update((pagina) => pagina - 1);
  }

  resetearPagina() {
    this.firstPage.set(false);
    this.lastPage.set(false);
    this.currentPage.set(0);
  }
}
