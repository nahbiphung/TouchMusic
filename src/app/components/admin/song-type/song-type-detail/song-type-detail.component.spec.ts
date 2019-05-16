import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongTypeDetailComponent } from './song-type-detail.component';

describe('SongTypeDetailComponent', () => {
  let component: SongTypeDetailComponent;
  let fixture: ComponentFixture<SongTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
