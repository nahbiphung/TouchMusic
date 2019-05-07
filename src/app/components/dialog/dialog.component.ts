import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../profile/profile.component';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  private collectionData: AngularFirestoreCollection<any>;
  private documentData: AngularFirestoreDocument<any>;
  private uploadProgress: number;
  private loadImage: any;
  private haveImage: boolean;
  private name: string;
  private imagePreview: string;
  private isAvatar: boolean;
  private isCreateNewFaList: boolean;
  private isAddToFaList: boolean;
  private faPlaylist: FavoriteList[];
  private panelOpenState: boolean;
  private loadingSpinner: boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private db: AngularFirestore) {
    this.haveImage = false;
    this.uploadProgress = 0;
    this.name = '';
    this.isAvatar = false;
    this.isCreateNewFaList = false;
    this.panelOpenState = true;
    this.loadingSpinner = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data.selector === 'A') {
      this.isAvatar = true;
      this.onFileSelected(this.data.data);
      this.loadingSpinner = false;
    } else if (this.data.selector === 'B') {
      this.isCreateNewFaList = true;
      this.loadingSpinner = false;
    } else if (this.data.selector === 'C') {
      this.isAddToFaList = true;
      this.collectionData = this.db.collection('FavoritePlaylist',
        query => query.where('userId', 'array-contains', this.data.currentUser));
      this.collectionData.valueChanges().subscribe((res) => {
        if (res) {
          this.faPlaylist = res;
          this.loadingSpinner = false;
        }
      });
    }
  }

  private onFileSelected(event: any) {
    this.loadImage = event.target.files[0];
    if (this.loadImage) {
      this.haveImage = true;
      const copyThis = this;
      const previewImage = new FileReader();
      previewImage.onload = function (e: any) {
        copyThis.imagePreview = e.currentTarget.result;
      };
      previewImage.readAsDataURL(this.loadImage);

    } else {
      this.haveImage = false;
    }
  }

  private createNewPlaylist() {
    // get data of falist
    const falist: FavoriteList = new FavoriteList();
    falist.userId = this.data.currentUser;
    falist.name = this.name;
    const storageRef = firebase.storage().ref('images/' + this.loadImage.name);

    // upload file
    const task = storageRef.put(this.loadImage);
    const copyThis = this;
    // update progress bar
    task.on('state_changed',
      function then(snapshot) {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        copyThis.uploadProgress = percent;
        console.log(copyThis.uploadProgress)
      },
      function wrong(error) {
        console.log(error);
      },
      function complete() {
        task.snapshot.ref.getDownloadURL().then((res) => {
          falist.image = res;
          copyThis.db.collection('FavoritePlaylist').add({
            name: falist.name,
            userId: falist.userId,
            details: [],
            image: res,
            id: ''
          }).then((result) => {
            falist.userId = result.id;
            copyThis.db.collection('FavoritePlaylist').doc(result.id).update({
              id: result.id,
            });
            if (copyThis.isCreateNewFaList) {
              copyThis.dialogRef.close(falist);
            } else {
              this.resetForm();
            }
          }).catch((error) => {
            console.log('error when add collection' + error);
          });
        });
      }
    );
  }

  private resetForm() {
    this.loadImage = {};
    this.imagePreview = '';
    this.name = '';
  }

  private uploadNewAvatar() {
    const storageRef = firebase.storage().ref('images/' + this.loadImage.name);
    // upload file
    const task = storageRef.put(this.loadImage);
    const copyThis = this;
    // update progress bar
    task.on('state_changed',
      function then(snapshot) {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        copyThis.uploadProgress = percent;
        console.log(copyThis.uploadProgress)
      },
      function wrong(error) {
        console.log(error);
      },
      function complete() {
        task.snapshot.ref.getDownloadURL().then((res) => {
          if (res) {
            copyThis.db.collection('users').doc(copyThis.data.currentUser.id).update({
              photoURL: res
            }).then(() => {
              copyThis.dialogRef.close(copyThis.loadImage);
            });
          }
        });
      }
    );
  }

  private addSongtofaList(data: FavoriteList) {
    this.loadingSpinner = true;
    let duplicateSong = false;
    data.details.forEach(e => {
      if (e.id === this.data.data.id) {
        duplicateSong = true;
      }
    });
    if (!duplicateSong) {
      // nghĩa là ko bị trùng bài hát
      this.documentData = this.db.collection('FavoritePlaylist').doc(data.id);
      this.documentData.update({
        details: firebase.firestore.FieldValue.arrayUnion({
            author: this.data.data.author,
            id: this.data.data.id,
            mp3Url: this.data.data.mp3Url,
            name: this.data.data.name,
          })
      }).then(() => {
        this.loadingSpinner = false;
        this.dialogRef.close();
      });
    }
  }

}

export class FavoriteList {
  id: string;
  image: string;
  name: string;
  userId: string;
  details: [{
    author: string;
    id: string;
    mp3Url: string;
    name: string;
  }];
}
