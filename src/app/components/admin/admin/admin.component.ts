import { AuthService } from '../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  private isLogin: boolean;
  private email: string;
  private name: string;
  private avt: string;
  private haveName: boolean;

  constructor(private authService: AuthService,
              private toast: ToastrService) {
               }

  ngOnInit() {

    const a = document.getElementById('nav-bar');
    a.setAttribute('style', 'display: none;');

    const b = document.getElementById('nav-player');
    b.setAttribute('style', 'display: none;');

    this.authService.getAuth().subscribe((user) => {
      if (user) {
        this.isLogin = true;
        this.email = user.email;
        if (user.firstName === null && user.lastName === null) {
          this.haveName = false;
        } else {
          this.haveName = true;
          this.name = user.firstName + ' ' + user.lastName;
        }
        if (user.photoURL === null) {
          this.avt = 'https://ui-avatars.com/api/?name=' + this.email;
        } else {
          this.avt = user.photoURL;
        }
      } else {
        this.isLogin = false;
      }
    });
  }

  onclickLogout() {
    this.authService.logout();
    const a = document.getElementById('nav-bar');
    a.setAttribute('style', 'display: block;');

    const b = document.getElementById('nav-player');
    b.setAttribute('style', 'display: block;');
    this.toast.success('Logout Success');
  }
}
