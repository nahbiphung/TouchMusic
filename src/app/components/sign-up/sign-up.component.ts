import { Component, OnInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, AfterContentChecked {

  private datetime: boolean;

  constructor() {
    this.datetime = false;
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

}
