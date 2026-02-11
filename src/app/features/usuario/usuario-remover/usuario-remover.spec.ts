import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioRemover } from './usuario-remover';

describe('UsuarioRemover', () => {
  let component: UsuarioRemover;
  let fixture: ComponentFixture<UsuarioRemover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioRemover],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioRemover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
