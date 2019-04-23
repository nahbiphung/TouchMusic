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
    this.collectionData = this.db.collection('Song');
    this.collectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.playlistSong = res;
        this.songService.playlistSongForWelcome = this.playlistSong;
      }
    }, (err) => {
      console.log('error');
    });

    // post data in to Song Collection
    const currentDate = new Date();
    // this.db.collection('Song').add({
    //   id: '',
    //   like: 0,
    // tslint:disable-next-line: max-line-length
    //   mp3Url: 'https://firebasestorage.googleapis.com/v0/b/touchmusic-2707e.appspot.com/o/music%2FSomethingJustLikeThis-TheChainsmokersColdplay-5337136.mp3?alt=media&token=7396eeba-9c84-46dd-9e0b-ecd6a8f39adf',
    //   name: 'Something Just like this',
    //   author: 'TheChainsmokers, Coldplay',
    //   video: '',
    //   view: 0,
    //   albumId: this.db.doc('Album/' + 'euhbPdWw3WUXWVdJZkjp').ref,
    //   comment: [
    //     {
    //       content: 'Have been we a book of old',
    //       like: 0,
    //       postDate: currentDate,
    //       userId: this.db.doc('users/3cYwzOHvCHZp82JAzeG9RTkKCWh2').ref,
    //     }
    //   ],
    //   countryId: this.db.doc('Country/juKnFfsaewZiPXAeCTni').ref,
    //   performerId: this.db.doc('Performer/444aMwurKPLwFUvxPFOy').ref,
    //   songTypeId: this.db.doc('SongType/MgrFP9KSLSzDmSDlSKGN').ref,
    //   userId: this.db.doc('users/3cYwzOHvCHZp82JAzeG9RTkKCWh2').ref,
    // }).then(res => {
    //   console.log('success');
    //   this.db.collection('Song').doc(res.id).update({
    //     id: res.id
    //   });
    // }).catch(error => {
    //   console.log('error');
    // }).finally(() => {
    //   console.log('Thêm Thành Công');
    // });
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
    this.songService.PlayOrPause();
  }

  private drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlistSong, event.previousIndex, event.currentIndex);
  }

  private selectedAction() {
    this.songService.playlistSong = this.playlistSong;
    this.isPlay = !this.isPlay;
    this.songService.PlayOrPause();
  }


}
