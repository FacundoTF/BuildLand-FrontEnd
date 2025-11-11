import { TestBed } from '@angular/core/testing';

import { PresupuestoServicio } from './presupuesto-servicio';

describe('PresupuestoServicio', () => {
  let service: PresupuestoServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresupuestoServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
