import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private db: AngularFirestore,
    public songService: SongService
  ) { }
  slideSongConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 800,
    nextArrow: '.nextSong',
    prevArrow: '.prevSong'
  };

  slideVideoConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 800,
    nextArrow: '.nextVid',
    prevArrow: '.prevVid'
  };

  slideAlbumConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 800,
    nextArrow: '.nextAbl',
    prevArrow: '.prevAbl'
  };

  colectionAlbums: AngularFirestoreCollection<any>;
  colectionSongs: AngularFirestoreCollection<any>;
  colectionUsers: AngularFirestoreCollection<any>;
  colectionPlaylist: AngularFirestoreCollection<any>;
  documentAlbum: AngularFirestoreDocument<any>;
  private topPlaylist = [];
  private albums = [];
  private songs = [];
  private users = [];
  private likeSongs = [];
  private historySongs = [];
  private album: any;
  private lastItem: any;
  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

  ngOnInit() {
    this.colectionPlaylist = this.db.collection('TopPlaylist');
    this.colectionPlaylist.valueChanges().subscribe((res) => {
      if (res) {
        this.topPlaylist = res;
      }
    }, (error) => {
      console.log(error);
    });
    // colectionAlbums
    this.colectionAlbums = this.db.collection('Album');
    this.colectionAlbums.valueChanges().subscribe((res) => {
      if (res) {
        this.albums = res;
      }
    }, (error) => {
      console.log(error);
    });
    // colectionSongs
    this.colectionSongs = this.db.collection('Song');
    this.colectionSongs.valueChanges().subscribe((res) => {
      if (res) {
        this.songs = res;
      }
    }, (error) => {
        console.log(error);
    });
    // colectionUser
    this.colectionUsers = this.db.collection('users', ref => ref.orderBy('email').limit(3));
    this.colectionUsers.valueChanges().subscribe((res) => {
      if (res) {
        this.users = res;
        console.log(res);
        this.lastItem = res[res.length - 1];
        console.log(this.lastItem);
      }
    }, (error) => {
        console.log(error);
    });
    // Song like
    this.colectionSongs = this.db.collection('Song', ref => ref.orderBy('name').limit(3));
    this.colectionSongs.valueChanges().subscribe((res) => {
      if (res) {
        this.likeSongs = res;
      }
    }, (error) => {
        console.log(error);
    });
    // History song
    this.colectionSongs = this.db.collection('Song', ref => ref.limit(3));
    this.colectionSongs.valueChanges().subscribe((res) => {
      if (res) {
        this.historySongs = res;
      }
    }, (error) => {
        console.log(error);
    });
  }

  clickNext3User() {
    this.colectionUsers = this.db.collection('users', ref => ref.orderBy('email').limit(5));
    this.colectionUsers.valueChanges().subscribe((res) => {
      if (res) {
        this.users = res;
        console.log(res);
      }
    }, (error) => {
      console.log(error);
    });
  }
}
