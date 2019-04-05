import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IImage } from 'ng-simple-slideshow/src/app/modules/slideshow/IImage';
// import { OptionsPlayer, PlaylistData } from 'audio-player-ng/audio-player-ng/classes/interfaces';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
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
  // options: OptionsPlayer;
  // playlist: Observable<PlaylistData>;

  constructor(private http: HttpClient) {
    // this.options = {
    //   width: 300,
    //   oscFillStyle: 'hsl(290, 45%, 49%)',
    //   oscStrokeStyle: 'hsl(110, 100%, 49%)'
    // };
    // const path = './../../../assets/music/Tuy-Am-Masew-x-NhatNguyen-Remix-Xesi.mp3'; // the playlist url
    // this.playlist = this.http.get<PlaylistData>(path);
  }

  ngOnInit() {
  }

}
