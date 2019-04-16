import { Component, OnInit, ViewChild, ElementRef, AfterContentChecked } from '@angular/core';
import { IImage } from 'ng-simple-slideshow/src/app/modules/slideshow/IImage';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SongService } from 'src/app/services/song.service';

// firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, AfterContentChecked {
  collectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  public song: Observable<any[]>;

  private imageSources: (string | IImage)[];
  private imageTypeMusic: object;
  private logo: string;
  private playlistSong = [];
  private backgroundImage: string;
  private loadingSpinner: boolean;
  private imagePlaylist: string;


  // Variables
  private isPlay: boolean;
  private duration: number;
  private currentTime: number;
  private audio: any;
  private isShuffle: boolean;
  private isLoop: boolean;
  private currentSong: number;

  constructor(
    private http: HttpClient,
    public songService: SongService,
    private db: AngularFirestore) {
    this.isPlay = false;
    this.audio = new Audio();
    this.duration = 0;
    this.currentSong = 0;
    this.isShuffle = false;
    this.loadingSpinner = true;
    this.songService.duration = 0;
    this.songService.currentSong = 0;
  }

  ngOnInit() {
    // get playlist song
    this.collectionData = this.db.collection('TopPlaylist');
    this.collectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.playlistSong = res;
        this.songService.playlistSongForWelcome = this.playlistSong;
      }
    }, (err) => {
      console.log('error');
    });

    // get images
    this.collectionData = this.db.collection('imagesForView');
    this.collectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.imageSources = [
          {
            url: res[0].slideshow1,
            backgroundPosition: 'center'
          },
          {
            url: res[0].slideshow2,
            backgroundPosition: 'center'
          },
          {
            url: res[0].slideshow3,
            backgroundPosition: 'center'
          }
        ];
        this.imageTypeMusic = {
          type1: res[0].musicType1,
          type2: res[0].musicType2,
          type3: res[0].musicType3
        };
        this.logo = res[0].logo;
        this.backgroundImage = res[0].backgroundImage;
        this.imagePlaylist = res[0].playlist;
      }
      this.loadingSpinner = false;
    }, (error) => {
      console.log('error');
    });
  }

  ngAfterContentChecked() {
  }

  private onClickSong(data: any) {
    // this.duration = 0;
    // this.currentSong = this.playlistSong.findIndex(x => x.title === data.title);
    // this.audio.src = data.url;
    // this.audio.title = data.title;
    // this.audio.setAttribute('id', 'playing');
    // this.audio.load();
    // this.isPlay = true;
    // this.onSelectPlayOrPauseSong();

    this.songService.playSong(data);
    this.songService.audio.src = data.url;
    this.songService.audio.title = data.title;
    this.songService.audio.author = data.author;
    this.songService.audio.load();
    this.songService.isPlay = true;
    this.songService.PlayOrPauseForWelcome();
  }


  private onSelectPlayOrPauseSong() {
    // if (this.audio.src) {
    //   if (!this.audio.paused) {
    //     this.audio.pause();
    //     this.isPlay = false;
    //   } else {
    //     this.audio.play();
    //     this.isPlay = true;
    //   }
    //   this.audio.addEventListener('timeupdate', () => {
    //     this.duration = (this.audio.currentTime / this.audio.duration) * 100;
    //     if (this.audio.ended) {
    //       if (this.isLoop) {
    //         this.onSelectPlayForward();
    //       } else {
    //         const index = this.playlistSong.findIndex(x => x.title === this.audio.title);
    //         if (index === this.playlistSong.length - 1) {
    //           this.isPlay = false;
    //           this.duration = 0;
    //         } else {
    //           this.onSelectPlayForward();
    //         }
    //       }
    //     }
    //   });
    // } else {
    //   this.audio.src = this.playlistSong[0].url;
    //   this.audio.title = this.playlistSong[0].title;
    //   this.audio.setAttribute('id', 'playing');
    //   this.audio.load();
    //   this.isPlay = true;
    //   this.onSelectPlayOrPauseSong();
    // }


    this.songService.PlayOrPauseForWelcome();
  }

  private onSelectPlayBackward() {
    // this.currentSong = this.playlistSong.findIndex(x => x.title === this.audio.title);
    // this.currentSong--;
    // if (this.currentSong < 0) {
    //   this.currentSong = this.playlistSong.length - 1;
    // }
    // this.audio.src = this.playlistSong[this.currentSong].url;
    // this.audio.title = this.playlistSong[this.currentSong].title;
    // this.audio.load();
    // this.onSelectPlayOrPauseSong();

    this.songService.PlayBackwardForWelcome();
  }

  private onSelectPlayForward() {
    // this.currentSong = this.playlistSong.findIndex(x => x.title === this.audio.title);
    // this.currentSong++;
    // if (this.currentSong > this.playlistSong.length - 1) {
    //   this.currentSong = 0;
    // }
    // this.audio.src = this.playlistSong[this.currentSong].url;
    // this.audio.title = this.playlistSong[this.currentSong].title;
    // this.audio.load();
    // this.onSelectPlayOrPauseSong();

    this.songService.PlayForwardForWelcome();
  }

  private onSelectLoopSongs() {
    const loop = document.getElementById('loop');
    this.songService.isLoop = !this.songService.isLoop;
    if (this.songService.isLoop) {
      loop.classList.add('color-yellow');
    } else {
      loop.classList.remove('color-yellow');
    }
  }

  private onSelectShuffleSongs(data: any) {
    const shuffle = document.getElementById('shuffle');
    this.songService.isShuffle = !this.songService.isShuffle;
    if (this.songService.isShuffle) {
      this.songService.playlistSongForWelcome = this.shuffler(data);
      shuffle.classList.add('color-yellow');
    } else {
      this.playlistSong.sort((a, b) => {
        const nameA = a.title.toUpperCase();
        const nameB = b.title.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      shuffle.classList.remove('color-yellow');
    }
  }

  private shuffler(data: any): any[] {
    let ctr = data.length;
    let temp;
    let index;

    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      console.log(index);
      ctr--;
      temp = data[ctr];
      data[ctr] = data[index];
      data[index] = temp;
    }
    return data;
  }

  private drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlistSong, event.previousIndex, event.currentIndex);
  }

  private moveCurrentTime(event: any) {
    this.songService.audio.currentTime = (event.value / 100) * this.songService.audio.duration;
  }
}
