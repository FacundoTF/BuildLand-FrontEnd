import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasFisicas } from './personas-fisicas';

describe('PersonasFisicas', () => {
  let component: PersonasFisicas;
  let fixture: ComponentFixture<PersonasFisicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonasFisicas],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonasFisicas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
