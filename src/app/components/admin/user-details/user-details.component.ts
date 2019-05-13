import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
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
              public dialogRef: MatDialogRef<UserDetailsComponent>
    // private dialogRef: MatDialogRef<UserDetailsComponent>
  ) { }

  ngOnInit() {
    this.userService.getUsers();
  }

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

  onSubmit() {
    if (this.userService.formUser.valid) {
      this.userService.updateUser(this.userService.formUser.value);
      this.onClose();
    }
  }

  onClose() {
    this.userService.initializeFormGroup();
    this.dialogRef.close();
  }

}
