import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-nav-player',
  templateUrl: './nav-player.component.html',
  styleUrls: ['./nav-player.component.css']
})
export class NavPlayerComponent implements OnInit {


  isPlay: boolean;

  constructor(
    public songService: SongService
  ) {
    this.songService.audio = new Audio();
  }

  ngOnInit() {
  }

  private onSelectPlayOrPauseSong() {
    if (this.songService.audio.src) {
      if (!this.songService.audio.paused) {
        this.songService.audio.pause();
        this.isPlay = false;
        console.log('clicked play');
      } else {
        this.songService.audio.play();
        this.isPlay = true;
        console.log('clicked pause');
      }
    }
  }
}
