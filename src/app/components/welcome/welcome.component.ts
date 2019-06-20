import { Component, OnInit, ViewChild, ElementRef, AfterContentChecked, AfterViewInit, AfterContentInit } from '@angular/core';
import { IImage } from 'ng-simple-slideshow/src/app/modules/slideshow/IImage';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SongService } from 'src/app/services/song.service';

// firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  collectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  public song: Observable<any[]>;
  getPerformer: AngularFirestoreCollection<any>;

  private imageSources: (string | IImage)[];
  private imageTypeMusic: object;
  private logo: string;
  private playlistSong = [];
  private backgroundImage: string;
  public loadingSpinner: boolean;
  private imagePlaylist: string;
  private listCountryMusic = [];
  private listVideo = [];
  private lengthDate: LengthOfDate;
  private emailFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  private firstnameFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(30),
  ]);
  private passwordFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(30),
    Validators.minLength(6),
  ]);
  private lastnameFormControl: FormControl = new FormControl('', [
    Validators.maxLength(30),
    Validators.required,
  ]);
  private phoneFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(0)[0-9]{9}$'),
  ]);
  private dateFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);


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
    private db: AngularFirestore,
    public authService: AuthService,
    public toastr: ToastrService) {
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
    this.getPerformer = this.db.collection('Performer');
    this.getPerformer.valueChanges().subscribe(resPerformer => {
      // get playlist song
      this.collectionData = this.db.collection('Song');
      this.collectionData.valueChanges().subscribe((res) => {
        if (res) {
          this.playlistSong = res;
          for (const data of this.playlistSong) {
            const arrAuthor = [];
            for (const auth of data.author) {
              const authorName = resPerformer.filter(e => e.id === auth.id);
              arrAuthor.push(authorName[0].name);
            }
            if (arrAuthor.length >= 2) {
              data.author = arrAuthor[0] + ', ' + arrAuthor[1];
            } else if (arrAuthor.length === 1) {
              data.author = arrAuthor[0];
            }
          }
          this.songService.playlistSongForWelcome = this.playlistSong;
        }
      }, (err) => {
        console.log('error');
      });
    });
    // get song types
    this.collectionData = this.db.collection('Country');
    this.collectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.listCountryMusic = res;
      }
    }, (err) => {
      console.log('error');
    });

    // get video
    this.collectionData = this.db.collection('Video');
    this.collectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.listVideo = res;
        setTimeout(() => {
          if (this.listVideo.length !== 0) {
            this.listVideo.forEach((e: any) => {
              const video: any = document.getElementById(e.id);
              video.muted = true;
              console.log(e);
            });
          }
        });
      }
    });

    this.lengthDate = {
      min: new Date(1790, 0, 1),
      max: new Date(),
    };

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
    this.songService.audio.src = data.mp3Url;
    this.songService.audio.name = data.name;
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
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
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

  private register() {
    this.loadingSpinner = true;
    if (this.validateInfo()) {
      this.authService.registerUser(this.emailFormControl.value,
        this.passwordFormControl.value,
        this.firstnameFormControl.value,
        this.lastnameFormControl.value,
        this.dateFormControl.value,
        this.phoneFormControl.value,
        '',
        true)
        .then(res => {
        }).catch(err => {
          this.toastr.warning(err.message, 'Warning');
          this.loadingSpinner = false;
        }).finally(() =>
        location.reload());
    } else {
      this.toastr.error('Some field is invalid');
      this.loadingSpinner = false;
    }
  }

  validateInfo(): boolean {
    if (this.emailFormControl.errors || this.passwordFormControl.errors ||
      this.firstnameFormControl.errors || this.lastnameFormControl.errors ||
      this.phoneFormControl.errors || this.dateFormControl.errors) {
        return false;
      }
    return true;
  }
}

export interface LengthOfDate {
  min: Date;
  max: Date;
}
