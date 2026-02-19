import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoRemover } from './grupo-remover';

describe('GrupoRemover', () => {
  let component: GrupoRemover;
  let fixture: ComponentFixture<GrupoRemover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoRemover],
    }).compileComponents();

    fixture = TestBed.createComponent(GrupoRemover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
