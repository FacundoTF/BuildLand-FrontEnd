import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrupoModificar } from './grupo-modificar';

describe('GrupoModificar', () => {
  let component: GrupoModificar;
  let fixture: ComponentFixture<GrupoModificar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoModificar],
    }).compileComponents();

    fixture = TestBed.createComponent(GrupoModificar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
