import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerformerDetailsComponent } from './admin-performer-details.component';

describe('AdminPerformerDetailsComponent', () => {
  let component: AdminPerformerDetailsComponent;
  let fixture: ComponentFixture<AdminPerformerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPerformerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPerformerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
