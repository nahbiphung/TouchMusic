import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLoadingComponent } from './ui-loading.component';

describe('UiLoadingComponent', () => {
  let component: UiLoadingComponent;
  let fixture: ComponentFixture<UiLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
