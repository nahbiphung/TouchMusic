import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCrawlingComponent } from './admin-crawling.component';

describe('AdminCrawlingComponent', () => {
  let component: AdminCrawlingComponent;
  let fixture: ComponentFixture<AdminCrawlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCrawlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCrawlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
