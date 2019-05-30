import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormControl, Validators, FormGroup, Form } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, AfterContentChecked {


  public hide: boolean;
  // const for upload img
  private thisFile = null;
  private fileName = '';
  public fileSrc: any;
  downLoadURL: any;
  imageUrl: any;
  uploadPercent: Observable<number>;
  // set datetime for picker register
  public datetime: boolean;

  // private email = new FormControl('', Validators.required);
  // private password = new FormControl('', [Validators.required , Validators.minLength(8)]);
  // private firstName = new FormControl('', Validators.required);
  // private lastName = new FormControl('', Validators.required);
  // private birthday = new FormControl('', Validators.required);
  // private phone = new FormControl('', Validators.required);
  private photoURL: '';

  formSignUp: FormGroup = new FormGroup({
    $key: new FormControl(null),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.minLength(8)),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    birthday: new FormControl(''),
    phone: new FormControl('', [Validators.required, Validators.minLength(8)]),
    // photoURL: new FormControl('', Validators.required)
  });

  constructor(
    public authService: AuthService,
    public router: Router,
    public toastr: ToastrService,
    private storage: AngularFireStorage,
  ) {
    this.datetime = false;
    this.hide = true;
  }

  ngOnInit() {
  }

  ngAfterContentChecked(): void {
    if (this.datetime) {
      const e = document.querySelector('.cdk-overlay-container');
      if (e) {
        e.setAttribute('style', `z-index:1051 !important`);
        this.datetime = false;
      }
    }
  }

  onSubmitAddUser() {
    if (this.formSignUp.valid) {
      if (this.fileName) {
        const filePath = 'images/avartar/' + this.fileName;
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

                this.photoURL = this.imageUrl;
                // tslint:disable-next-line:max-line-length
                this.authService.registerUser(this.formSignUp.controls.email.value, this.formSignUp.controls.password.value, this.formSignUp.controls.firstName.value, this.formSignUp.controls.lastName.value, this.formSignUp.controls.birthday.value, this.formSignUp.controls.phone.value, this.photoURL);
              }
            });
          })
        )
          .subscribe();
      } else {
        // tslint:disable-next-line:max-line-length
        this.authService.registerUser(this.formSignUp.controls.email.value, this.formSignUp.controls.password.value, this.formSignUp.controls.firstName.value, this.formSignUp.controls.lastName.value, this.formSignUp.controls.birthday.value, this.formSignUp.controls.phone.value, this.photoURL);
      }
    }
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
  }

  resetForm() {
    this.formSignUp.controls.email.setValue('');
    this.formSignUp.controls.firstName.setValue('');
    this.formSignUp.controls.lastName.setValue('');
    this.formSignUp.controls.birthday.setValue(null);
    this.formSignUp.controls.phone.setValue('');
    // this.formSignUp.controls.photoURL.setValue('');
    this.photoURL = '';
    this.fileSrc = '';
  }
}
