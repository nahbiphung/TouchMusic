import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { PerformerService } from '../../../../services/performer.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-performer-details',
  templateUrl: './admin-performer-details.component.html',
  styleUrls: ['./admin-performer-details.component.scss']
})
export class AdminPerformerDetailsComponent implements OnInit {

  getCountry: AngularFirestoreCollection<any>;
  listCountry: Country[];
  constructor(
    public afs: AngularFirestore,
    public performerService: PerformerService,
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

  onSubmit() {
    if (this.performerService.formPerformer.valid) {
      if (!this.performerService.formPerformer.controls.$key.value) {
        this.performerService.createPerformer();
      } else {
        this.performerService.updatePerformer();
      }
    }
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }
}
