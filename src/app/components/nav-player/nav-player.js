$(document).ready(function(){
    $('.volume-icon').mouseover(function(){
        $('.volume').css('display','block')
    });

    $('.volume-icon').mouseleave(function(){
        $('.volume').css('display','none')
    });
})