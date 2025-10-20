import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribuidoraAgregar } from './distribuidora-agregar';

describe('DistribuidoraAgregar', () => {
  let component: DistribuidoraAgregar;
  let fixture: ComponentFixture<DistribuidoraAgregar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistribuidoraAgregar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistribuidoraAgregar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
