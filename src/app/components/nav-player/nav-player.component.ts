import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-nav-player',
  templateUrl: './nav-player.component.html',
  styleUrls: ['./nav-player.component.css']
})
export class NavPlayerComponent implements OnInit {

  constructor(
    public songService: SongService
  ) {}

  ngOnInit() {
  }

  private onSelectPlayOrPauseSong() {
    this.songService.PlayOrPause();
  }
}
