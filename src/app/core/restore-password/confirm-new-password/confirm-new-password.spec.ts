import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNewPassword } from './confirm-new-password';

describe('ConfirmNewPassword', () => {
  let component: ConfirmNewPassword;
  let fixture: ComponentFixture<ConfirmNewPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmNewPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmNewPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
