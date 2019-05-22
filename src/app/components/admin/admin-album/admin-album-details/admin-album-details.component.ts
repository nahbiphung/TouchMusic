import { Component, OnInit } from '@angular/core';
import { AdminAlbumService } from '../../../../services/admin-album.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-album-details',
  templateUrl: './admin-album-details.component.html',
  styleUrls: ['./admin-album-details.component.scss']
})
export class AdminAlbumDetailsComponent implements OnInit {

  private thisFile = null;
  private fileName = '';
  downLoadURL: any;
  imageUrl: any;
  uploadPercent: Observable<number>;
  getPerformer: AngularFirestoreCollection<any>;
  getUser: AngularFirestoreCollection<any>;
  listPerformer: Performer[];
  listUser: User[];

  constructor(
    public afs: AngularFirestore,
    public albumService: AdminAlbumService,
    private storage: AngularFireStorage,
    public dialogRef: MatDialogRef<AdminAlbumDetailsComponent>
  ) { }

  ngOnInit() {
    this.albumService.getAlbum();

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
  }

  onclickClearForm() {
    this.albumService.formReset();
  }

  onSelectFile(event: any) {
    this.thisFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(this.thisFile);
    reader.onload = (e) => {
      this.albumService.formAlbum.controls.image.setValue(reader.result);
    };
  }

  onSubmit() {
    if (this.albumService.formAlbum.valid) {
      if (!this.albumService.formAlbum.controls.$key.value) {
        if (this.fileName) {
          const filePath = 'images/album/' + this.fileName;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.thisFile);
          // observe percentage changes
          this.uploadPercent = task.percentageChanges();
          task.snapshotChanges().pipe(
            finalize(() => {
              this.downLoadURL = fileRef.getDownloadURL();
              this.downLoadURL.subscribe((url) => {
                if (url) {
                  this.imageUrl = url;
                  console.log(this.imageUrl);
                  console.log('thanh cong');
                  // set image to dowloadURL cause it now from storage
                  this.albumService.formAlbum.controls.image.setValue(this.imageUrl);
                  // now add
                  this.albumService.createAlbum();
                  this.onClose();
                }
              });
            })
          )
            .subscribe();
        } else {
          alert('Please add image before Submit');
          this.albumService.formReset();
        }
      } else {
        if (this.fileName) {
          if (this.albumService.imageURL != null) {
            if (this.albumService.imageURL.slice(8, 23) === 'firebasestorage') {
              this.storage.storage.refFromURL(this.albumService.imageURL).delete();
            }
          }
          const filePath = 'images/album/' + this.fileName;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.thisFile);
          // observe percentage changes
          this.uploadPercent = task.percentageChanges();
          task.snapshotChanges().pipe(
            finalize(() => {
              this.downLoadURL = fileRef.getDownloadURL();
              this.downLoadURL.subscribe((url) => {
                if (url) {
                  this.imageUrl = url;
                  console.log(this.imageUrl);
                  console.log('thanh cong');
                  // set image to dowloadURL cause it now from storage
                  this.albumService.formAlbum.controls.image.setValue(this.imageUrl);
                  this.albumService.updateAlbum();
                  this.onClose();
                }
              });
            })
          )
            .subscribe();
        } else {
          this.albumService.updateAlbum();
          this.onClose();
        }
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
