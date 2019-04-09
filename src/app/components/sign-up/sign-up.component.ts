import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, AfterContentChecked {


  private hide: boolean;

  // set datetime for picker register
  private datetime: boolean;

  private email: string;
  private password: string;
  private firstName: string;
  private lastName: string;
  private birthday: Date;
  private phone: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public toastr: ToastrService
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
    this.authService.registerUser(this.email, this.password, this.firstName, this.lastName, this.birthday, this.phone)
      .then(res => {

      }).catch(err => {
        this.toastr.warning(err.message, 'Warning');
        console.log(err);
      });
  }
}
