import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SongService } from 'src/app/services/song.service';
@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  imageColectionData: AngularFirestoreCollection<any>;
  imageDocumentData: AngularFirestoreDocument<any>;

  colectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  data: Song;
  private loadingSpinner: boolean;
  private avatar: any[];
  private isPlay: boolean;
  private videoSong: boolean;
  private cmtContent: string;
  private song: any;
  constructor(private db: AngularFirestore, private route: ActivatedRoute, private songService: SongService) {
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

    const param = this.route.snapshot.paramMap.get('id');
    this.documentData = this.db.collection('Song').doc(param);
    this.documentData.valueChanges().subscribe((res) => {
      if (res) {
        this.data = res;
      }
      this.loadingSpinner = false;
    });

    // this.data = this.route.paramMap.pipe(
    //   switchMap(p => {
    //     const title = p.get('title');
    //     return this.db.collection('TopPlayList').doc('1LBd5A0E8hd7qrxLTRUz').valueChanges();
    //   })
    // );
    // console.log(this.data);
  }

  private playSong() {
    this.isPlay = !this.isPlay;
    this.songService.playlistSong = [];
    this.songService.playlistSong.push(this.data);
    this.songService.audio.src = this.data.mp3Url;
    this.songService.audio.name = this.data.name;
    this.songService.audio.author = this.data.author;
    this.songService.PlayOrPause();
  }

  private submit() {
    const date = new Date();
    this.data.comment.unshift({
      content: this.cmtContent,
      like: 0,
      postDate: date,
      subComment: null,
      userId: 'Phu Nguyen,'
    })
    this.db.collection('Song').doc(this.data.id).update(this.data);
  }

  private changeToDate(data: Date): string {
    return data.toJSON();
  }
}
