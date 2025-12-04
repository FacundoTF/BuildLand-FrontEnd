import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaFisicaModificar } from './persona-fisica-modificar';

describe('PersonaFisicaModificar', () => {
  let component: PersonaFisicaModificar;
  let fixture: ComponentFixture<PersonaFisicaModificar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaFisicaModificar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaFisicaModificar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
