import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  public audio: any;
  public isPlay: boolean;

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
  }
  // TODO: create play or pause function()
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
    }
  }
}
