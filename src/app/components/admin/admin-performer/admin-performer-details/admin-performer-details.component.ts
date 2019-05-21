import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { PerformerService } from '../../../../services/performer.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-performer-details',
  templateUrl: './admin-performer-details.component.html',
  styleUrls: ['./admin-performer-details.component.scss']
})
export class AdminPerformerDetailsComponent implements OnInit {

  private thisFile = null;
  private fileName = '';
  downLoadURL: any;
  imageUrl: any;
  uploadPercent: Observable<number>;
  getCountry: AngularFirestoreCollection<any>;
  listCountry: Country[];

  constructor(
    public afs: AngularFirestore,
    public performerService: PerformerService,
    private storage: AngularFireStorage,
    public dialogRef: MatDialogRef<AdminPerformerDetailsComponent>
  ) { }

  ngOnInit() {
    this.getCountry = this.afs.collection('Country');
    this.getCountry.snapshotChanges().subscribe(arr => {
      this.listCountry = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Country;
      });
    });
  }

  onclickClearForm() {
    this.performerService.formReset();
  }

  onSelectFile(event: any) {
    this.thisFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(this.thisFile);
    reader.onload = (e) => {
      this.performerService.formPerformer.controls.image.setValue(reader.result);
    };
  }

  onSubmit() {
    if (this.performerService.formPerformer.valid) {
      if (!this.performerService.formPerformer.controls.$key.value) {
        if (this.fileName) {
          const filePath = 'images/performer/' + this.fileName;
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
                  this.performerService.formPerformer.controls.image.setValue(this.imageUrl);
                  // now add
                  this.performerService.createPerformer();
                  this.onClose();
                }
              });
            })
          )
            .subscribe();
        } else {
          alert('Please add image before Submit');
          this.performerService.formReset();
        }
      } else {
        if (this.fileName) {
          if (this.performerService.imageURL != null) {
            if (this.performerService.imageURL.slice(8, 23) === 'firebasestorage') {
              this.storage.storage.refFromURL(this.performerService.imageURL).delete();
            }
          }
          const filePath = 'images/performer/' + this.fileName;
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
                  this.performerService.formPerformer.controls.image.setValue(this.imageUrl);
                  this.performerService.updatePerformer();
                  this.onClose();
                }
              });
            })
          )
            .subscribe();
        } else {
          this.performerService.updatePerformer();
          this.onClose();
        }
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
