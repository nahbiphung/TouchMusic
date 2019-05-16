import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongTypeComponent } from './song-type.component';

describe('SongTypeComponent', () => {
  let component: SongTypeComponent;
  let fixture: ComponentFixture<SongTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
