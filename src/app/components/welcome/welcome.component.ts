import { Component, OnInit, ViewChild, ElementRef, AfterContentChecked } from '@angular/core';
import { IImage } from 'ng-simple-slideshow/src/app/modules/slideshow/IImage';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, AfterContentChecked {
  private imageSources: (string | IImage)[] = [
    {
      url: 'assets/images/classical-music-1838390_1920.jpg',
      href: 'https://www.apple.com/',
      backgroundPosition: 'center'
    },
    {
      url: 'assets/images/concert-768722_1920.jpg',
      href: 'https://www.apple.com/',
      backgroundPosition: 'center'
    },
    {
      url: 'assets/images/streets-1284394_1920.jpg',
      href: 'https://www.apple.com/',
      backgroundPosition: 'center'
    }
  ];

  private playlistSong = [
    {
      title: 'Tuy Am',
      author: 'NhatNguyen Remix, Xesi',
      url: './../../../assets/music/mp3/Tuy-Am-Masew-x-NhatNguyen-Remix-Xesi.mp3',
    }, {
      title: 'Bua Yeu',
      author: 'Bich Phuong',
      url: './../../../assets/music/mp3/Bua Yeu - Bich Phuong.mp3',
    }, {
      title: 'Thu Cho Anh',
      author: 'Trang',
      url: './../../../assets/music/mp3/Thu Cho Anh - Trang.mp3',
    }, {
      title: 'Doi la Giac Mo',
      author: 'My Tam',
      url: './../../../assets/music/mp3/Doi La Giac Mo - My Tam.mp3',
    }, {
      title: 'Muon Ruou To Tinh',
      author: 'Emily, BigDaddy',
      url: './../../../assets/music/mp3/MuonRuouToTinh-EmilyBigDaddy-5871420.mp3',
    }, {
      title: 'Something Just like this',
      author: 'TheChainsmokers, Coldplay',
      url: './../../../assets/music/mp3/SomethingJustLikeThis-TheChainsmokersColdplay-5337136.mp3',
    }
  ];

  // Variables
  private isPlay: boolean;
  private duration: number;
  private currentTime: number;
  private audio: any;
  private isShuffle: boolean;
  private isLoop: boolean;
  private currentSong: number;

  constructor(private http: HttpClient) {
    this.isPlay = false;
    this.audio = new Audio();
    this.duration = 0;
    this.currentSong = 0;
    this.isShuffle = false;
  }

  ngOnInit() {
  }

  ngAfterContentChecked() {
  }

  private onClickSong(data: any) {
    this.duration = 0;
    this.currentSong = this.playlistSong.findIndex(x => x.title === data.title);
    this.audio.src = data.url;
    this.audio.title = data.title;
    this.audio.setAttribute('id', 'playing');
    this.audio.load();
    this.isPlay = true;
    this.onSelectPlayOrPauseSong();
  }


  private onSelectPlayOrPauseSong() {
    if (this.audio.src) {
      if (!this.audio.paused) {
        this.audio.pause();
        this.isPlay = false;
      } else {
        this.audio.play();
        this.isPlay = true;
      }
      this.audio.addEventListener('timeupdate', () => {
        this.duration = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.audio.ended) {
          if (this.isLoop) {
            this.onSelectPlayForward();
          } else {
            const index = this.playlistSong.findIndex(x => x.title === this.audio.title);
            if (index === this.playlistSong.length - 1) {
              this.isPlay = false;
              this.duration = 0;
            } else {
              this.onSelectPlayForward();
            }
          }
        }
      });
    } else {
      this.audio.src = this.playlistSong[0].url;
      this.audio.title = this.playlistSong[0].title;
      this.audio.setAttribute('id', 'playing');
      this.audio.load();
      this.isPlay = true;
      this.onSelectPlayOrPauseSong();
    }
  }

  private onSelectPlayBackward() {
    this.currentSong = this.playlistSong.findIndex(x => x.title === this.audio.title);
    this.currentSong--;
    if (this.currentSong < 0) {
      this.currentSong = this.playlistSong.length - 1;
    }
    this.audio.src = this.playlistSong[this.currentSong].url;
    this.audio.title = this.playlistSong[this.currentSong].title;
    this.audio.load();
    this.onSelectPlayOrPauseSong();
  }

  private onSelectPlayForward() {
    this.currentSong = this.playlistSong.findIndex(x => x.title === this.audio.title);
    this.currentSong++;
    if (this.currentSong > this.playlistSong.length - 1) {
      this.currentSong = 0;
    }
    this.audio.src = this.playlistSong[this.currentSong].url;
    this.audio.title = this.playlistSong[this.currentSong].title;
    this.audio.load();
    this.onSelectPlayOrPauseSong();
  }

  private onSelectLoopSongs() {
    const loop = document.getElementById('loop');
    this.isLoop = !this.isLoop;
    if (this.isLoop) {
      loop.classList.add('color-yellow');
    } else {
      loop.classList.remove('color-yellow');
    }
  }

  private onSelectShuffleSongs(data: any) {
    const shuffle = document.getElementById('shuffle');
    this.isShuffle = !this.isShuffle;
    if (this.isShuffle) {
      this.playlistSong = this.shuffler(data);
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
    this.audio.currentTime = (event.value / 100) * this.audio.duration;
  }
}
