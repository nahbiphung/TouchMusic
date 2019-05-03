import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

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
  constructor(private userService: UserService,
              private storage: AngularFireStorage,
    // private dialogRef: MatDialogRef<UserDetailsComponent>
  ) { }

  ngOnInit() {
    this.userService.getUsers();
  }

  onclickClearForm() {
    this.userService.form.reset();
    this.userService.initializeFormGroup();
  }

  onSelectFile(event: any) {
    // console.log(event);
    this.thisFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(this.thisFile);
    reader.onload = (e) => {
      this.fileSrc = reader.result;
      // console.log(this.fileSrc);
    };
    // console.log(this.fileName);

    const filePath = 'images/avartar/' + this.fileName;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.thisFile);
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downLoadURL = fileRef.getDownloadURL();
        this.downLoadURL.subscribe((url) => {
          if (url) {
            this.imageUrl = url;
            console.log(this.imageUrl);
            console.log('thanh cong');
          }
        });
      })
    )
    .subscribe();
  }

  uploadFile() {
  }

  onSubmit() {
    if (this.userService.form.valid) {
      this.userService.photoURL = this.imageUrl;
      this.userService.addUser(this.userService.form.value);
      this.userService.form.reset();
      this.userService.initializeFormGroup();
    }
  }
}
