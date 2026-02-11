import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificandoUsuario } from './modificando-usuario';

describe('ModificandoUsuario', () => {
  let component: ModificandoUsuario;
  let fixture: ComponentFixture<ModificandoUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificandoUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificandoUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
