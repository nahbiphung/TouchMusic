import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  collectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  imageColectionData: AngularFirestoreCollection<any>;
  imageDocumentData: AngularFirestoreDocument<any>;
  private loadingSpinner: boolean;
  private avatar: any[];
  private playlistSong = [];
  private isPlay: boolean;
  private videoSong: boolean;
  constructor(private db: AngularFirestore, public songService: SongService) {
    this.loadingSpinner = true;
    this.isPlay = true;
    this.videoSong = false;
   }

  ngOnInit() {
    this.imageColectionData = this.db.collection('imagesForView');
    this.imageColectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.avatar = res[0];
      }
      this.loadingSpinner = false;
    }, (error) => {
      console.log('error');
      this.loadingSpinner = false;
    });

    // get playlist
    this.collectionData = this.db.collection('TopPlaylist');
    this.collectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.playlistSong = res;
        this.songService.playlistSongForWelcome = this.playlistSong;
      }
    }, (err) => {
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
    this.songService.audio.src = data.url;
    this.songService.audio.title = data.title;
    this.songService.audio.author = data.author;
    this.songService.audio.load();
    this.songService.isPlay = true;
    this.songService.PlayOrPauseForWelcome();
  }

  private drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlistSong, event.previousIndex, event.currentIndex);
  }

}
