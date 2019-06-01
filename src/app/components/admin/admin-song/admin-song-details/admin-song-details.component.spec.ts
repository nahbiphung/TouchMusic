import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSongDetailsComponent } from './admin-song-details.component';

describe('AdminSongDetailsComponent', () => {
  let component: AdminSongDetailsComponent;
  let fixture: ComponentFixture<AdminSongDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSongDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSongDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
