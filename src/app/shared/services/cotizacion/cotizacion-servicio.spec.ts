import { TestBed } from '@angular/core/testing';

import { CotizacionServicio } from './cotizacion-servicio';

describe('CotizacionServicio', () => {
  let service: CotizacionServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotizacionServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
