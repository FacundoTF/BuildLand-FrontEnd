import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReseteandoClave } from './reseteando-clave';

describe('ReseteandoClave', () => {
  let component: ReseteandoClave;
  let fixture: ComponentFixture<ReseteandoClave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReseteandoClave],
    }).compileComponents();

    fixture = TestBed.createComponent(ReseteandoClave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
