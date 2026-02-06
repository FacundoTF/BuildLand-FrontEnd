import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesPerdidasGanadas } from './cotizaciones-perdidas-ganadas';

describe('CotizacionesPerdidasGanadas', () => {
  let component: CotizacionesPerdidasGanadas;
  let fixture: ComponentFixture<CotizacionesPerdidasGanadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotizacionesPerdidasGanadas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotizacionesPerdidasGanadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
