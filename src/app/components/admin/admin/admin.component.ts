import { AuthService } from '../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public isLogin: boolean;
  public email: string;
  public name: string;
  public avt: string;
  public displayName: string;

  constructor(private authService: AuthService,
              private toast: ToastrService,
              private http: HttpClient) {
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
        this.displayName = user.displayName;
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

  // make a callon Server
  getInfoFromServer() {
    return this.http.get('http://localhost:3001/newsongzingmp3').subscribe((res) => {
      console.log(res);
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
