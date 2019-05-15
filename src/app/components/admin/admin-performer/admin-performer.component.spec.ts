import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerformerComponent } from './admin-performer.component';

describe('AdminPerformerComponent', () => {
  let component: AdminPerformerComponent;
  let fixture: ComponentFixture<AdminPerformerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPerformerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPerformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
