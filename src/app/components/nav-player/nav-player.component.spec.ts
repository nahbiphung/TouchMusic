import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPlayerComponent } from './nav-player.component';

describe('NavPlayerComponent', () => {
  let component: NavPlayerComponent;
  let fixture: ComponentFixture<NavPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
