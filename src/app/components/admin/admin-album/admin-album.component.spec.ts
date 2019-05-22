import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAlbumComponent } from './admin-album.component';

describe('AdminAlbumComponent', () => {
  let component: AdminAlbumComponent;
  let fixture: ComponentFixture<AdminAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
