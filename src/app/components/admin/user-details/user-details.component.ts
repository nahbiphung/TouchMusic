import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  private thisFile = null;
  private fileName = '';
  private fileSrc: any;
  downLoadURL: any;
  imageUrl: any;
  uploadPercent: Observable<number>;

  constructor(private userService: UserService,
              private storage: AngularFireStorage,
              private toastr: ToastrService,
    // private dialogRef: MatDialogRef<UserDetailsComponent>
  ) { }

  ngOnInit() {}

  onSelectFile(event: any) {
    // console.log(event);
    // console.log(event.target.value);
    this.thisFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(this.thisFile);
    reader.onload = (e) => {
      this.userService.formUser.controls.photoURL.setValue(reader.result);
      // console.log(this.fileSrc);
    };
    // console.log(this.fileName);
  }

  onclickClearForm() {
    this.userService.initializeFormGroup();
    // const a = this.userService.formUser.controls.birthday.value;
    // console.log(a);
    // console.log(this.userService.formUser.controls.birthday.value);
  }
  // onSubmitAddUser() {
  //   const filePath = 'images/avartar/' + this.fileName;
  //   const fileRef = this.storage.ref(filePath);
  //   const task = this.storage.upload(filePath, this.thisFile);
  //   // observe percentage changes
  //   this.uploadPercent = task.percentageChanges();
  //   task.snapshotChanges().pipe(
  //     finalize(() => {
  //       this.downLoadURL = fileRef.getDownloadURL();
  //       this.downLoadURL.subscribe((url) => {
  //         if (url) {
  //           this.imageUrl = url;
  //           console.log(this.imageUrl);
  //           console.log('thanh cong');

  //           this.photoURL = this.imageUrl;
  // tslint:disable-next-line:max-line-length
  //           this.authService.registerUser2(this.email, this.password, this.firstName, this.lastName, this.birthday, this.phone, this.photoURL, this.subscriber, this.admin);
  //           this.resetForm();
  //         }
  //       });
  //     })
  //   )
  //     .subscribe();
  // }


}
