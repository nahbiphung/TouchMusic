import { Injectable } from '@angular/core';
import { database } from 'firebase';
import { DriverService } from 'selenium-webdriver/remote';

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

  constructor() {
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
        if (x.url === data.url) {
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
        this.timeUpdateForPlayer();
        if (this.audio.ended) {
          if (this.isLoop) {
            this.PlayForward();
          } else {
            const index = this.playlistSong.findIndex(x => x.title === this.audio.title);
            if (index === this.playlistSong.length - 1) {
              this.isPlay = false;
              this.duration = 0;
            } else {
              this.PlayForward();
            }
          }
        }
      });
    }
  }

  public PlayBackward() {
    this.currentSong = this.playlistSong.findIndex(x => x.title === this.audio.title);
    this.currentSong--;
    if (this.currentSong < 0) {
      this.currentSong = this.playlistSong.length - 1;
    }
    this.audio.src = this.playlistSong[this.currentSong].url;
    this.audio.title = this.playlistSong[this.currentSong].title;
    this.audio.author = this.playlistSong[this.currentSong].author;
    this.audio.load();
    this.PlayOrPause();
  }

  public PlayForward() {
    this.currentSong = this.playlistSong.findIndex(x => x.title === this.audio.title);
    this.currentSong++;
    if (this.currentSong > this.playlistSong.length - 1) {
      this.currentSong = 0;
    }
    this.audio.src = this.playlistSong[this.currentSong].url;
    this.audio.title = this.playlistSong[this.currentSong].title;
    this.audio.author = this.playlistSong[this.currentSong].author;
    this.audio.load();
    this.PlayOrPause();
  }

  public timeUpdateForPlayer() {
    const cur = document.getElementById('curTime-nav');
    const dur = document.getElementById('durTime-nav');

    const getTime = (this.audio.currentTime / this.audio.duration) * 100;
    const curMin = Math.floor(this.audio.currentTime / 60);
    const curSec = Math.floor(this.audio.currentTime - curMin * 60);
    const durMin = Math.floor(this.audio.duration / 60);
    const durSec = Math.floor(this.audio.duration - durMin * 60);

    // TODO: unlock this to run ok

    // if (curMin < 10) { curMin = '0' + curMin; }
    // if (curSec < 10) { curSec = '0' + curSec; }
    // if (durMin < 10) { durMin = '0' + durMin; }
    // if (durSec < 10) { durSec = '0' + durSec; }

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
        this.timeUpdateForWelcome();
        this.timeUpdateForPlayer();
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
    }
  }

  public timeUpdateForWelcome() {
    const cur = document.getElementById('curTime');
    const dur = document.getElementById('durTime');

    const getTime = (this.audio.currentTime / this.audio.duration) * 100;
    const curMin = Math.floor(this.audio.currentTime / 60);
    const curSec = Math.floor(this.audio.currentTime - curMin * 60);
    const durMin = Math.floor(this.audio.duration / 60);
    const durSec = Math.floor(this.audio.duration - durMin * 60);

    // TODO: unlock this to run ok

    // if (curMin < 10) { curMin = '0' + curMin; }
    // if (curSec < 10) { curSec = '0' + curSec; }
    // if (durMin < 10) { durMin = '0' + durMin; }
    // if (durSec < 10) { durSec = '0' + durSec; }

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
    this.audio.src = this.playlistSongForWelcome[this.currentSong].url;
    this.audio.title = this.playlistSongForWelcome[this.currentSong].title;
    this.audio.author = this.playlistSongForWelcome[this.currentSong].author;
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
    this.audio.src = this.playlistSongForWelcome[this.currentSong].url;
    this.audio.title = this.playlistSongForWelcome[this.currentSong].title;
    this.audio.author = this.playlistSongForWelcome[this.currentSong].author;
    this.audio.load();
    this.PlayOrPause();
  }

  public findIndexWelcome() {
    let i = 0;
    for (i; i < this.playlistSongForWelcome.length; i++) {
      if (this.playlistSongForWelcome[i].title === this.audio.title) {
        this.index = i;
        return this.index;
      }
    }
  }
}
