import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibirPresupuesto } from './recibir-presupuesto';

describe('RecibirPresupuesto', () => {
  let component: RecibirPresupuesto;
  let fixture: ComponentFixture<RecibirPresupuesto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecibirPresupuesto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecibirPresupuesto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
