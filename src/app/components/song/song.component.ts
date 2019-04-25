import { Component, OnInit, AfterContentChecked } from '@angular/core';
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
export class SongComponent implements OnInit, AfterContentChecked {
  imageColectionData: AngularFirestoreCollection<any>;
  imageDocumentData: AngularFirestoreDocument<any>;

  colectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  data: any;
  private loadingSpinner: boolean;
  private avatar: any[];
  private isPlay: boolean;
  private videoSong: boolean;
  private cmtContent: string;
  private song: Song;
  private postComment: boolean;
  private pageIndex: number;
  private pageSize: number;
  private lowValue: number;
  private highValue: number; 

  constructor(private db: AngularFirestore, private route: ActivatedRoute, private songService: SongService) {
    this.loadingSpinner = true;
    this.isPlay = true;
    this.videoSong = false;
    this.postComment = false;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.lowValue = 0;
    this.highValue = 5;
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
        this.data.comment.forEach(e => {
          e.stringPostDate = e.postDate.toDate().toLocaleString();
        });
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

  ngAfterContentChecked(): void {

  }

  private getPaginatorData(event: any) {
    console.log(event);
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
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
    });
    this.db.collection('Song').doc(this.data.id).update(this.data).then(res => {
      this.cmtContent = '';
    });
  }

  private cancel() {
    this.cmtContent = '';
  }
}
