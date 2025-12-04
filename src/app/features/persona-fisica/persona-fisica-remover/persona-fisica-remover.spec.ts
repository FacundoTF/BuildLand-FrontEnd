import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaFisicaRemover } from './persona-fisica-remover';

describe('PersonaFisicaRemover', () => {
  let component: PersonaFisicaRemover;
  let fixture: ComponentFixture<PersonaFisicaRemover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaFisicaRemover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaFisicaRemover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
