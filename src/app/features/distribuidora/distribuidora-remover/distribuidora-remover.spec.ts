import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribuidoraRemover } from './distribuidora-remover';

describe('DistribuidoraRemover', () => {
  let component: DistribuidoraRemover;
  let fixture: ComponentFixture<DistribuidoraRemover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistribuidoraRemover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistribuidoraRemover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
