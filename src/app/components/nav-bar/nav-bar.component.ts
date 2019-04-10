import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private isLogin: boolean;
  public email: string;
  public firstName: string;
  public lastName: string;
  public photoLink: string;

  constructor(
    private authService: AuthService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe( auth => {
      if (auth) {
        this.isLogin = true;
        this.email = auth.email;
        this.firstName = auth.firstName;
        this.lastName = auth.lastName;
        this.photoLink = auth.photoURL;
      } else {
        this.isLogin = false;
      }
    });
  }

  onClickLogout() {
    this.authService.logout();
    this.toast.success('Logout thanh cong', 'Logout');
  }
}
