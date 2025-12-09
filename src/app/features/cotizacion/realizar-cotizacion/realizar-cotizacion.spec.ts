import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarCotizacion } from './realizar-cotizacion';

describe('RealizarCotizacion', () => {
  let component: RealizarCotizacion;
  let fixture: ComponentFixture<RealizarCotizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizarCotizacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizarCotizacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
