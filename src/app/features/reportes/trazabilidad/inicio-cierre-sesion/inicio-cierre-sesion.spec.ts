import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioCierreSesion } from './inicio-cierre-sesion';

describe('InicioCierreSesion', () => {
  let component: InicioCierreSesion;
  let fixture: ComponentFixture<InicioCierreSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioCierreSesion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioCierreSesion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
