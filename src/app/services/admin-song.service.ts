import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminSongService {

  listSong: AngularFirestoreCollection<any>;
  constructor(
    private afs: AngularFirestore
  ) { }

  formSong: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    name: new FormControl(''),
    albumId: new FormControl(''),
    imageSong: new FormControl(''),
    mp3Url: new FormControl(''),
    performerId: new FormControl(''),
    video: new FormControl(''),
    like: new FormControl(''),
    vieww: new FormControl(''),
    lyric: new FormControl(''),
    countryId: new FormControl(''),
    userId: new FormControl(''),
  });

  getSong() {
    this.listSong = this.afs.collection('Song');
    return this.listSong.snapshotChanges();
  }
}
