import { AuthService } from '../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import * as cherrio from 'cheerio';
// import * as request from 'request';

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
  private displayName: string;

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
    // const request = require('request');
    // request('https://www.nhaccuatui.com/', (error, respone, html) => {
    //   if (html) {
    //     const $ = cherrio.load(html);
    //     const site = $('.title');
    //     const output = site.text();
    //     console.log(output);
    //   }
    // });
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
