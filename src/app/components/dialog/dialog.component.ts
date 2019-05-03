import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../profile/profile.component';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  private uploadProgress: number;
  private loadImage: any;
  private haveImage: boolean;
  private name: string;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private db: AngularFirestore) {
    this.haveImage = false;
    this.uploadProgress = 0;
    this.name = '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  private onFileSelected(event: any) {
    this.loadImage = event.target.files[0];
    if (this.loadImage) {
      this.haveImage = true;
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
            copyThis.dialogRef.close(falist);
          }).catch((error) => {
            console.log('error when add collection' + error);
          });
        });
      }
    );
  }

}

export class FavoriteList{
  id: string;
  image: string;
  name: string;
  userId: string;
  details: [{
    song: string;
  }];
}
