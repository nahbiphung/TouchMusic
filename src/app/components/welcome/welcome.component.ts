import { Component, OnInit } from '@angular/core';
import { IImage } from 'ng-simple-slideshow/src/app/modules/slideshow/IImage';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  private imageSources: (string | IImage)[] = [
    {
      url: 'assets/images/classical-music-1838390_1920.jpg',
      href: 'https://www.apple.com/',
      backgroundPosition: 'center'
    },
    {
      url: 'assets/images/concert-768722_1920.jpg',
      href: 'https://www.apple.com/',
      backgroundPosition: 'center'
    },
    {
      url: 'assets/images/streets-1284394_1920.jpg',
      href: 'https://www.apple.com/',
      backgroundPosition: 'center'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
