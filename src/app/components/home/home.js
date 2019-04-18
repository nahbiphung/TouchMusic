$(document).ready(function(){
    $('.galery-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        speed: 800,
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
        responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                speed: 800,
                prevArrow: $('.prev'),
                nextArrow: $('.next'),
              }
            }
        ]
      });

    $('.song-back-img').mouseover(function(){
        $('.song-playButton').css('display','block')
    });

    $('.song-back-img').mouseleave(function(){
        $('.song-playButton').css('display','none')
    });
})