import { TestBed } from '@angular/core/testing';

import { PersonaFisica } from './persona-fisica';

describe('PersonaFisica', () => {
  let service: PersonaFisica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonaFisica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
