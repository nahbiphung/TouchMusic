// nav toggle
$(document).ready(function(){
    $('.menu-toggle').click(function(){
        $('nav').toggleClass('active');
    })
})

// scroll effect
$(window).on('scroll',function(){
    if($(window).scrollTop()){
        $('header').addClass('scroll-effect');
    }
    else
    {
        $('header').removeClass('scroll-effect');
    }
})