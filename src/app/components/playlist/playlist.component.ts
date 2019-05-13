import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';

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
  private albumInfo: Album;
  private countryInfo: Country;
  private favoritePlaylist: FavoriteList;
  private isPlay: boolean;
  private videoSong: boolean;
  private isAlbum: boolean;
  constructor(private db: AngularFirestore, public songService: SongService, private route: ActivatedRoute) {
    this.loadingSpinner = true;
    this.isPlay = true;
    this.videoSong = false;
    this.isAlbum = true;
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
    const getDetectRoute = this.route.snapshot.url[1].path;
    const getParams = this.route.snapshot.paramMap.get('id');
    if (getDetectRoute === 'favoritePlaylist') {
      this.isAlbum = false;
      this.documentData = this.db.collection('FavoritePlaylist').doc(getParams);
      this.documentData.valueChanges().subscribe((res: FavoriteList) => {
        if (res) {
          this.playlistSong = res.details;
          this.favoritePlaylist = res;
        }
      }, (error) => {
        console.log('error');
      });
    } else if (getDetectRoute === 'album') {
      // get album info
      this.documentData = this.db.collection('Album').doc(getParams);
      this.documentData.valueChanges().subscribe((res: Album) => {
        if (res) {
          this.albumInfo = res;
        }
      });
      // get song in album
      this.collectionData = this.db.collection('Song',
        que => que.where('albumId', '==', getParams));
      this.collectionData.valueChanges().subscribe((res: Song[]) => {
        if (res) {
          this.playlistSong = res;
        }
      }, (error) => {
        console.log('error');
      });
    } else if (getDetectRoute === 'country') {
      // get country info
      this.documentData = this.db.collection('Country').doc(getParams);
      this.documentData.valueChanges().subscribe((res: Country) => {
        if (res) {
          this.countryInfo = res;
        }
      });
      this.isAlbum = false;
      // get song in country
      this.collectionData = this.db.collection('Song',
        que => que.where('countryId', '==', getParams));
      this.collectionData.valueChanges().subscribe((res: Song[]) => {
        if (res) {
          this.playlistSong = res;
        }
      }, (error) => {
        console.log('error');
      });
    }
  }

  private onClickSong(data: any) {
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
