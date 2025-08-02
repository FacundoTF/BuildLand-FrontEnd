import { TestBed } from '@angular/core/testing';

import { DistribuidoraServicio } from './distribuidora-servicio';

describe('DistribuidoraServicio', () => {
  let service: DistribuidoraServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistribuidoraServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
