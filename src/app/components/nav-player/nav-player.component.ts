import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { SongService } from '../../services/song.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-nav-player',
  templateUrl: './nav-player.component.html',
  styleUrls: ['./nav-player.component.css']
})
export class NavPlayerComponent implements OnInit {

  private isPlaylistOpen: boolean;
  public playlist: any[];
  constructor(
    public songService: SongService
  ) {
    this.isPlaylistOpen = false;
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterContentChecked(): void {
    if (this.songService.playlistSong) {
      this.playlist = this.songService.playlistSong;
    }
  }

  onSelectPlayOrPauseSong() {
    this.songService.PlayOrPause();
  }

  onSelectPlayBackward() {
    this.songService.PlayBackward();
  }

  onSelectPlayForward() {
    this.songService.PlayForward();
  }

  moveCurrentTime(event: any) {
    this.songService.audio.currentTime = (event.value / 100) * this.songService.audio.duration;
  }

  moveCurrentVolume(event: any) {
    this.songService.audio.volume = (event.value);
    console.log(this.songService.audio.volume);
  }

  openPlaylist() {
    if (this.playlist) {
      this.isPlaylistOpen = !this.isPlaylistOpen;
      const element = document.getElementById('showPLaylist');
      if (this.isPlaylistOpen) {
        element.classList.remove('top-100');
      } else {
        element.classList.add('top-100');
      }
    }
  }

  startDragging(data: any) {
    setTimeout(() => {
      const getSong: any = document.getElementsByClassName('cdk-drag-preview');
      getSong[0].style.zIndex = '1030';
    }, );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.songService.playlistSong, event.previousIndex, event.currentIndex);
    this.playlist = this.songService.playlistSong;
  }

  onClickSong(data: any) {
    this.songService.playSong(data);
    this.songService.audio.src = data.mp3Url;
    this.songService.audio.name = data.name;
    this.songService.audio.author = data.author;
    this.songService.audio.load();
    this.songService.isPlay = true;
    this.songService.PlayOrPause();
  }
}
