import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaFisicaAgregar } from './persona-fisica-agregar';

describe('PersonaFisicaAgregar', () => {
  let component: PersonaFisicaAgregar;
  let fixture: ComponentFixture<PersonaFisicaAgregar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaFisicaAgregar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaFisicaAgregar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
