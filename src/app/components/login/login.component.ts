import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public hide: boolean;
  public email: string;
  public password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService) {
    this.hide = true;
  }

  ngOnInit() {
  }

  onSubmitLogin() {
    this.authService.loginEmail(this.email, this.password)
      .then(res => {

      }).catch(err => {
        console.log(err);
        this.toast.error(err.message, 'Error');
        this.router.navigate(['/welcome']);
      }).finally(() => {
        location.reload();
      });
  }

  onClickGoogleLogin() {
    this.authService.loginGoogle()
      .then(res => {
        this.authService.closeModal();
        this.toast.success('Dang nhap thanh cong', 'Success');
        this.router.navigate(['/home']);
      }).catch(err => {
        console.log(err);
        this.toast.error(err.message, 'Error');
        this.router.navigate(['/welcome']);
      });
  }

  onClickFacebookLogin() {
    this.authService.loginFacebook()
      .then(res => {
        this.authService.closeModal();
        this.toast.success('Dang nhap thanh cong', 'Success');
        this.router.navigate(['/home']);
      }).catch(err => {
        console.log(err);
        this.toast.error(err.message, 'Error');
        this.router.navigate(['/welcome']);
      });
  }

  onClickTwitterLogin() {
    alert('Comming soon');
  }
}
