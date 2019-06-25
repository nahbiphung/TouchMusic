import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCheckUploadSongComponent } from './admin-check-upload-song.component';

describe('AdminCheckUploadSongComponent', () => {
  let component: AdminCheckUploadSongComponent;
  let fixture: ComponentFixture<AdminCheckUploadSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCheckUploadSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCheckUploadSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
