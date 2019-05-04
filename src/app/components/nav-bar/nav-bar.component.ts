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
  public photoURL: string;
  public displayName: string;
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
        this.displayName = auth.displayName;
        // this.photoURL = auth.photoURL;
        if (auth.photoURL === null) {
          // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
          this.photoURL = 'https://ui-avatars.com/api/?name=' + this.email + '&size=45';
        } else {
          this.photoURL = auth.photoURL;
        }
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
