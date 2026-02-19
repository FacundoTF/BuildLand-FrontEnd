import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosSolicitados } from './productos-solicitados';

describe('ProductosSolicitados', () => {
  let component: ProductosSolicitados;
  let fixture: ComponentFixture<ProductosSolicitados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosSolicitados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosSolicitados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
