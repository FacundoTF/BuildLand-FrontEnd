import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibirCotizacion } from './recibir-cotizacion';

describe('RecibirCotizacion', () => {
  let component: RecibirCotizacion;
  let fixture: ComponentFixture<RecibirCotizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecibirCotizacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecibirCotizacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
