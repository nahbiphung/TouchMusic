import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAlbumDetailsComponent } from './admin-album-details.component';

describe('AdminAlbumDetailsComponent', () => {
  let component: AdminAlbumDetailsComponent;
  let fixture: ComponentFixture<AdminAlbumDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAlbumDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAlbumDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
