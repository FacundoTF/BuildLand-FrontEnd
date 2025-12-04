import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSecret } from './submit-secret';

describe('SubmitSecret', () => {
  let component: SubmitSecret;
  let fixture: ComponentFixture<SubmitSecret>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitSecret]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitSecret);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
