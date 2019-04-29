import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

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
  private audio = new Audio();
  private dataSong: Song;
  private playlistForUser = [];

  private isPlay = false;
  private curTime: number;
  private click = 0;
  private curSrc: any;
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
    // get song in Albums
    this.colectionPlaylist = this.db.collection('Song', ref =>
      ref.where('albumId', '==', this.db.collection('Album').doc('fA8q7u7sfN7Lf6aLAxrq').ref));
    this.colectionPlaylist.valueChanges().subscribe((res) => {
      if (res) {
        this.playlistForUser = res;
      }
    }, (error) => {
      console.log(error);
    });

    this.colectionPlaylist = this.db.collection('Song', ref =>
      ref.where('albumId', '==', this.db.collection('Album').doc('euhbPdWw3WUXWVdJZkjp').ref));
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

  ngAfterViewInit() {
    // add event listener
    // setTimeout(() => {
    //   const songImg = document.querySelectorAll('.song-img');
    //   songImg.forEach(item => {
    //     console.log(item);
    //     item.addEventListener('mouseover', (event) => {
    //       const songId = event.srcElement.id;
    //       console.log(songId);
    //       const buttonPlay = document.querySelector('song-playButton');
    //       buttonPlay.classList.add('display-block');
    //     });
    //   });
    // }, 1500);
  }


  clickNext3User() {
    this.colectionUsers = this.db.collection('users');
    this.colectionUsers.valueChanges().subscribe((res) => {
      if (res) {
        this.users = [];
        let i = 0;
        while (i < 3) {
          this.users.push(res[Math.floor(Math.random() * res.length)]);
          i++;
          // TODO: còn bug bị trùng index khi generate hàm random()
        }
      }
    }, (error) => {
      console.log(error);
    });
  }
  // playlistForUser
  clickPlayPlaylistForUser() {
    if (this.songService.playlistSong.length !== 0) {
      if (this.songService.playlistSong[0].albumId.id !== this.playlistForUser[0].albumId.id) {
        this.songService.audio.pause();
        this.songService.playlistSong = this.playlistForUser;
        this.songService.audio.src = this.songService.playlistSong[0].mp3Url;
        this.songService.audio.name = this.songService.playlistSong[0].name;
        this.songService.audio.author = this.songService.playlistSong[0].author;
        this.songService.isPlay = false;
      }
    } else {
      this.songService.playlistSong = this.playlistForUser;
    }
    this.songService.PlayOrPause();
  }
  // topPlayList
  clickPlayTopPlaylist() {
    if (this.songService.playlistSong.length !== 0) {
      if (this.songService.playlistSong[0].albumId.id !== this.topPlaylist[0].albumId.id) {
        this.songService.audio.pause();
        this.songService.playlistSong = this.topPlaylist;
        this.songService.audio.src = this.songService.playlistSong[0].mp3Url;
        this.songService.audio.name = this.songService.playlistSong[0].name;
        this.songService.audio.author = this.songService.playlistSong[0].author;
        this.songService.isPlay = false;
      }
    } else {
      this.songService.playlistSong = this.topPlaylist;
    }
    this.songService.PlayOrPause();

  }

  clickPlayPlaylistDetailForUser(data: any) {
    // if.1: no src - if.2: this = curSrc - if.3: another src
    if (this.songService.audio.src === '') {
      this.curSrc = data.mp3Url;
      this.songService.playSong(data);
      this.songService.audio.src = data.mp3Url;
      this.songService.audio.name = data.name;
      this.songService.audio.author = data.author;
      this.songService.audio.load();
      this.songService.isPlay = true;
      this.songService.PlayOrPause();
      this.clickPlayorPause(this.songService.audio.src);
    } else if (this.curSrc === data.mp3Url) {
      this.clickPlayorPause(this.songService.audio.src);
    } else {
      this.click = 0;
      this.curTime = 0;
      this.curSrc = data.mp3Url;
      this.songService.playSong(data);
      this.songService.audio.src = data.mp3Url;
      this.songService.audio.name = data.name;
      this.songService.audio.author = data.author;
      this.songService.audio.load();
      this.songService.isPlay = true;
      this.isPlay = false;
      this.songService.PlayOrPause();
      this.clickPlayorPause(this.songService.audio.src);
    }
  }
  // if.src >>>> if.1 pass >>> if1.1: 1st time play curSong - if.1.2: 2nd play curSong start at curTime
  // if.1 false: curSong pause and get the curTime
  clickPlayorPause(src: any) {
    if (src) {
      if ((this.songService.isPlay === true || this.songService.isPlay === false) && this.isPlay === false) {
        if (this.click === 0) {
          this.songService.audio.play();
          // console.log('da play');
          this.songService.isPlay = true;
          this.isPlay = true;
          this.click += 1;
          return;
        } else {
          this.songService.audio.currentTime = this.curTime;
          this.songService.audio.play();
          // console.log('da play');
          this.songService.isPlay = true;
          this.isPlay = true;
          return;
        }
      } else {
        this.songService.audio.pause();
        this.curTime = this.songService.curTime;
        this.songService.audio.currentTime = this.curTime;
        console.log(this.songService.curTime);
        // console.log('da pause');
        this.songService.isPlay = false;
        this.isPlay = false;
      }
    } else {

    }
  }

  clickPlayAlbum(data: Album) {
    const a = this.db.collection('Song', ref => ref.where('albumId', '==', this.db.collection('Album').doc(data.id).ref));
    a.valueChanges().subscribe((res) => {
      if (res) {
        if (this.songService.playlistSong.length !== 0) {
          if (this.songService.playlistSong[0].albumId.id !== data.id) {
            this.songService.audio.pause();
            this.songService.playlistSong = res;
            this.songService.audio.src = this.songService.playlistSong[0].mp3Url;
            this.songService.audio.name = this.songService.playlistSong[0].name;
            this.songService.audio.author = this.songService.playlistSong[0].author;
            this.songService.isPlay = false;
          }
        } else {
          this.songService.playlistSong = res;
        }
        this.songService.PlayOrPause();
      }
    });

    // this.db.collection('Album').add({
    //   id: '',
    //   name: 'Album2',
    //   performerId: this.db.collection('Performer').doc('444aMwurKPLwFUvxPFOy').ref,
    //   userId: this.db.collection('users').doc('3cYwzOHvCHZp82JAzeG9RTkKCWh2').ref
    // }).then(res => {
    //   if (res) {
    //     this.db.collection('Album').doc(res.id).update({
    //       id: res.id,
    //     });
    //   }
    // });
  }
}
