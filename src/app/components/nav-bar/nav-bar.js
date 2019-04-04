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

function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        })

        $('.modal-title').html('Register with');
    })
}
function showLoginForm(){
    $('.registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');
        })

        $('.modal-title').html('Login with');
    })
}

function openLoginModal(){
    showLoginForm();
}
function openRegisterModal(){
    showRegisterForm();
}


