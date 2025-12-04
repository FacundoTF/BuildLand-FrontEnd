import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarPresupuesto } from './realizar-presupuesto';

describe('RealizarPresupuesto', () => {
  let component: RealizarPresupuesto;
  let fixture: ComponentFixture<RealizarPresupuesto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizarPresupuesto],
    }).compileComponents();

    fixture = TestBed.createComponent(RealizarPresupuesto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
