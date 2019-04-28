import { Injectable } from '@angular/core';
import { database } from 'firebase';
import { DriverService } from 'selenium-webdriver/remote';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  public audio: any;
  public isPlay: boolean;
  public duration: number;
  public currentSong: number;
  public playlistSong = [];
  public playlistSongForWelcome = [];
  public isLoop: boolean;
  public index: number;
  public isShuffle: boolean;
  public songInAray: any;

  constructor(private db: AngularFirestore) {
    this.audio = new Audio();
  }

  public getCurrentDataSong(data: any) {
    if (data) {
      console.log(data);
      return data;
    } else {
      console.log('khong thay DataSong');
    }
  }

  public playSong(data: any) {
    this.getCurrentDataSong(data);
    this.addSongDataToArr(data);
    console.log(this.playlistSong);
  }

  private addSongDataToArr(data: any) {
    let flag: boolean;
    flag = false;
    if (this.playlistSong.length <= 0) {
      this.playlistSong.push(data);
    } else {
      for (const x of this.playlistSong) {
        if (x.mp3Url === data.mp3Url) {
          console.log('Bai hat bi trung');
          flag = true;
          return;
        }
      }
      if (flag === false) {
        this.playlistSong.push(data);
      }
    }
  }

  public PlayOrPause() {
    if (this.audio.src) {
      if (!this.audio.paused) {
        this.audio.pause();
        this.isPlay = false;
        console.log('clicked play');
      } else {
        this.audio.play();
        this.isPlay = true;
        console.log('clicked pause');
      }
      this.audio.addEventListener('timeupdate', () => {
        this.duration = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.audio.currentTime && this.audio.duration) {
          this.timeUpdateForPlayer();
        }
        if (this.audio.ended) {
          if (this.isLoop) {
            this.PlayForward();
          } else {
            const index = this.playlistSong.findIndex(x => x.name === this.audio.name);
            if (index === this.playlistSong.length - 1) {
              this.isPlay = false;
              this.duration = 0;
            } else {
              this.PlayForward();
            }
          }
        }
      });
    } else {
      this.audio.src = this.playlistSong[0].mp3Url;
      this.audio.name = this.playlistSong[0].name;
      this.audio.author = this.playlistSong[0].author;
      this.audio.setAttribute('id', 'playing');
      this.audio.load();
      this.isPlay = true;
      this.PlayOrPause();
    }
  }

  public PlayBackward() {
    this.currentSong = this.playlistSong.findIndex(x => x.name === this.audio.name);
    this.currentSong--;
    if (this.currentSong < 0) {
      this.currentSong = this.playlistSong.length - 1;
    }
    this.audio.src = this.playlistSong[this.currentSong].mp3Url;
    this.audio.name = this.playlistSong[this.currentSong].name;
    this.audio.author = this.playlistSong[this.currentSong].author;
    this.audio.load();
    this.PlayOrPause();
  }

  public PlayForward() {
    this.currentSong = this.playlistSong.findIndex(x => x.name === this.audio.name);
    this.currentSong++;
    if (this.currentSong > this.playlistSong.length - 1) {
      this.currentSong = 0;
    }
    this.audio.src = this.playlistSong[this.currentSong].mp3Url;
    this.audio.name = this.playlistSong[this.currentSong].name;
    this.audio.author = this.playlistSong[this.currentSong].author;
    this.audio.load();
    this.PlayOrPause();
  }

  public timeUpdateForPlayer() {
    const cur = document.getElementById('curTime-nav');
    const dur = document.getElementById('durTime-nav');

    const getTime = (this.audio.currentTime / this.audio.duration) * 100;
    let curMin = Math.floor(this.audio.currentTime / 60).toString();
    // tslint:disable-next-line:radix
    let curSec = Math.floor(this.audio.currentTime - parseInt(curMin) * 60).toString();
    let durMin = Math.floor(this.audio.duration / 60).toString();
    // tslint:disable-next-line:radix
    let durSec = Math.floor(this.audio.duration - parseInt(durMin) * 60).toString();
    // tslint:disable-next-line:radix
    if (parseInt(curMin) < 10) {
      curMin = '0' + curMin;
    }
    // tslint:disable-next-line:radix
    if (parseInt(curSec) < 10) {
      curSec = '0' + curSec;
    }
    // tslint:disable-next-line:radix
    if (parseInt(durMin) < 10) {
      durMin = '0' + durMin;
    }
    // tslint:disable-next-line:radix
    if (parseInt(durSec) < 10) {
      durSec = '0' + durSec;
    }
    // for view count
    if (curMin === '00' && curSec === '10') {
      this.playlistSong.forEach(e => {
        if (e.mp3Url === this.audio.src) {
          e.view++;
          this.db.collection('Song').doc(e.id).update({
            view: firebase.firestore.FieldValue.increment(1)
          });
        }
      });
    }
    cur.innerHTML = curMin + ':' + curSec;
    dur.innerHTML = durMin + ':' + durSec;
  }

  // Use at Welcome Page
  public PlayOrPauseForWelcome() {
    if (this.audio.src) {
      if (!this.audio.paused) {
        this.audio.pause();
        this.isPlay = false;
        console.log('clicked play');
      } else {
        this.audio.play();
        this.isPlay = true;
        console.log('clicked pause');
      }
      this.audio.addEventListener('timeupdate', () => {
        this.duration = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.audio.currentTime && this.audio.duration) {
          this.timeUpdateForWelcome();
          this.timeUpdateForPlayer();
        }
        if (this.audio.ended) {
          if (this.isLoop) {
            this.PlayForwardForWelcome();
          } else {
            this.findIndexWelcome();
            const indexW = this.index;
            if (indexW === this.playlistSongForWelcome.length - 1) {
              this.isPlay = false;
              this.duration = 0;
            } else {
              this.PlayForwardForWelcome();
            }
          }
        }
      });
    } else {
      this.audio.src = this.playlistSongForWelcome[0].mp3Url;
      this.audio.name = this.playlistSongForWelcome[0].name;
      this.audio.author = this.playlistSongForWelcome[0].author;
      this.addSongDataToArr(this.playlistSongForWelcome[0]);
      this.audio.setAttribute('id', 'playing');
      this.audio.load();
      this.isPlay = true;
      this.PlayOrPauseForWelcome();
    }
  }

  public timeUpdateForWelcome() {
    const cur = document.getElementById('curTime');
    const dur = document.getElementById('durTime');

    const getTime = (this.audio.currentTime / this.audio.duration) * 100;
    let curMin = Math.floor(this.audio.currentTime / 60).toString();
    // tslint:disable-next-line:radix
    let curSec = Math.floor(this.audio.currentTime - parseInt(curMin) * 60).toString();
    let durMin = Math.floor(this.audio.duration / 60).toString();
    // tslint:disable-next-line:radix
    let durSec = Math.floor(this.audio.duration - parseInt(durMin) * 60).toString();

    // tslint:disable-next-line:radix
    if (parseInt(curMin) < 10) {
      curMin = '0' + curMin;
    }
    // tslint:disable-next-line:radix
    if (parseInt(curSec) < 10) {
      curSec = '0' + curSec;
    }
    // tslint:disable-next-line:radix
    if (parseInt(durMin) < 10) {
      durMin = '0' + durMin;
    }
    // tslint:disable-next-line:radix
    if (parseInt(durSec) < 10) {
      durSec = '0' + durSec;
    }
    cur.innerHTML = curMin + ':' + curSec;
    dur.innerHTML = durMin + ':' + durSec;
  }

  public PlayBackwardForWelcome() {
    this.findIndexWelcome();
    this.currentSong = this.index;
    this.currentSong--;
    if (this.currentSong < 0) {
      this.currentSong = this.playlistSongForWelcome.length - 1;
    }
    this.audio.src = this.playlistSongForWelcome[this.currentSong].mp3Url;
    this.audio.name = this.playlistSongForWelcome[this.currentSong].name;
    this.audio.author = this.playlistSongForWelcome[this.currentSong].author;
    this.addSongDataToArr(this.playlistSongForWelcome[this.currentSong]);
    this.audio.load();
    this.PlayOrPause();
  }

  public PlayForwardForWelcome() {
    this.findIndexWelcome();
    this.currentSong = this.index;
    this.currentSong++;
    if (this.currentSong > this.playlistSongForWelcome.length - 1) {
      this.currentSong = 0;
    }
    this.audio.src = this.playlistSongForWelcome[this.currentSong].mp3Url;
    this.audio.name = this.playlistSongForWelcome[this.currentSong].name;
    this.audio.author = this.playlistSongForWelcome[this.currentSong].author;
    this.addSongDataToArr(this.playlistSongForWelcome[this.currentSong]);
    this.audio.load();
    this.PlayOrPause();
  }

  public findIndexWelcome() {
    let i = 0;
    for (i; i < this.playlistSongForWelcome.length; i++) {
      if (this.playlistSongForWelcome[i].name === this.audio.name) {
        this.index = i;
        return this.index;
      }
    }
  }
}
