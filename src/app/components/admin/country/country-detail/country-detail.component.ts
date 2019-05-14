import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../../../services/country.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {

  private thisFile = null;
  private fileName = '';
  downLoadURL: any;
  imageUrl: any;
  uploadPercent: Observable<number>;

  constructor(
    private countryService: CountryService,
    private storage: AngularFireStorage,
    public dialogRef: MatDialogRef<CountryDetailComponent>
  ) { }

  ngOnInit() {
    this.countryService.getCountry();
  }

  onSelectFile(event: any) {
    this.thisFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(this.thisFile);
    reader.onload = (e) => {
      this.countryService.formCountry.controls.image.setValue(reader.result);
    };
  }

  onSubmit() {
    if (this.countryService.formCountry.valid) {
      if (!this.countryService.formCountry.get('$key').value) {
        if (this.fileName) {
          const filePath = 'images/logo/' + this.fileName;
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
                  this.countryService.formCountry.controls.image.setValue(this.imageUrl);
                  // now add
                  this.countryService.createCountry();
                  this.onClose();
                }
              });
            })
          )
            .subscribe();
        } else {
          alert('Please add image before Submit');
          this.countryService.formReset();
        }
      } else {
        if (this.fileName) {
          const filePath = 'images/logo/' + this.fileName;
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
                  this.countryService.formCountry.controls.image.setValue(this.imageUrl);
                  // now add
                  this.countryService.updateCountry();
                  this.onClose();
                }
              });
            })
          )
            .subscribe();
        } else {
          this.countryService.updateCountry();
          this.onClose();
        }
      }
    }
  }

  onClose() {
    this.countryService.formReset();
    this.dialogRef.close();
  }
}
