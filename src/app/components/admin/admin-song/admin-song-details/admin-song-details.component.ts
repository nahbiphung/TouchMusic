import { Component, OnInit } from '@angular/core';
import { AdminSongService } from '../../../../services/admin-song.service';
import { FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-song-details',
  templateUrl: './admin-song-details.component.html',
  styleUrls: ['./admin-song-details.component.scss']
})
export class AdminSongDetailsComponent implements OnInit {

  getPerformer: AngularFirestoreCollection<any>;
  getUser: AngularFirestoreCollection<any>;
  getAlbum: AngularFirestoreCollection<any>;
  getCountry: AngularFirestoreCollection<any>;
  getSongType: AngularFirestoreCollection<any>;
  listPerformer: Performer[];
  listUser: User[];
  listAlbum: Album[];
  listCountry: Country[];
  listSongType: SongType[];

  constructor(
    private songService: AdminSongService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.songService.getSong();

    this.getUser = this.afs.collection('users');
    this.getUser.snapshotChanges().subscribe(arr => {
      this.listUser = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as User;
      });
    });

    this.getPerformer = this.afs.collection('Performer');
    this.getPerformer.snapshotChanges().subscribe(arr => {
      this.listPerformer = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Performer;
      });
    });

    this.getAlbum = this.afs.collection('Album');
    this.getAlbum.snapshotChanges().subscribe(arr => {
      this.listAlbum = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Album;
      });
    });

    this.getCountry = this.afs.collection('Country');
    this.getCountry.snapshotChanges().subscribe(arr => {
      this.listCountry = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Country;
      });
    });

    this.getSongType = this.afs.collection('SongType');
    this.getSongType.snapshotChanges().subscribe(arr => {
      this.listSongType = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as SongType;
      });
    });
  }

  onClickAddComment() {
    const control = this.songService.formSong.controls.comment as FormArray;
    control.push(this.songService.addComment());
  }

  onClickRemoveComment(index: number) {
    (this.songService.formSong.get('comment') as FormArray).removeAt(index);
  }

  onClickAddSubComment(ix: number) {
    const control = (this.songService.formSong.controls.comment as FormArray).at(ix).get('subComment') as FormArray;
    control.push(this.songService.addSubComment());
  }

  onClickRemoveSubComment(ix: number, iy: number) {
    const control = (this.songService.formSong.controls.comment as FormArray).at(ix).get('subComment') as FormArray;
    control.removeAt(iy);
  }

  onSelectMp3(event: any) {
    console.log(event);
  }

  onSelectVideo(event: any) {
    console.log(event);
  }

  onSubmit() {
    console.log('submit');
  }
}
