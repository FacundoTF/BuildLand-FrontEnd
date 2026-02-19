import { TestBed } from '@angular/core/testing';
import { Dialog } from './dialog';

describe('Dialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialog],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Dialog);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
