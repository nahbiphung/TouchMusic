import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  slides = [
    {img: 'https://picsum.photos/200/300?image=981'},
    {img: 'https://picsum.photos/200/300?image=982'},
    {img: 'https://picsum.photos/200/300?image=983'},
    {img: 'https://picsum.photos/200/300?image=984'},
    {img: 'https://picsum.photos/200/300?image=985'},
    {img: 'https://picsum.photos/200/300?image=986'},
    {img: 'https://picsum.photos/200/300?image=987'},
    {img: 'https://picsum.photos/200/300?image=988'}
  ];

  slideSongConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 800,
    nextArrow: '.nextSong',
    prevArrow: '.prevSong'
  };

  slideVideoConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 800,
    nextArrow: '.nextVid',
    prevArrow: '.prevVid'
  };

  slideAlbumConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 800,
    nextArrow: '.nextAbl',
    prevArrow: '.prevAbl'
  };

  addSlide() {
    this.slides.push({img: 'https://picsum.photos/200/300?image=989'});
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

  constructor() { }

  ngOnInit() {
  }
}
