import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetallesPresupuesto } from './ver-detalles-presupuesto';

describe('VerDetallesPresupuesto', () => {
  let component: VerDetallesPresupuesto;
  let fixture: ComponentFixture<VerDetallesPresupuesto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerDetallesPresupuesto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDetallesPresupuesto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
