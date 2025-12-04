import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribuidoraModificar } from './distribuidora-modificar';

describe('DistribuidoraModificar', () => {
  let component: DistribuidoraModificar;
  let fixture: ComponentFixture<DistribuidoraModificar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistribuidoraModificar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistribuidoraModificar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
