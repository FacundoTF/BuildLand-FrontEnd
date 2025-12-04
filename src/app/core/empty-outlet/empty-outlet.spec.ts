import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyOutlet } from './empty-outlet';

describe('EmptyOutlet', () => {
  let component: EmptyOutlet;
  let fixture: ComponentFixture<EmptyOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyOutlet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyOutlet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
