(function($) {
    "use strict";

    // Preloader
    $(window).on('load', function() {
        $('.preloader').fadeOut('slow');
    });

    // Sticky Header
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 100) {
            $('.header-navigation').addClass('sticky');
        } else {
            $('.header-navigation').removeClass('sticky');
        }
    });

    // Mobile Menu Toggle
    $('.navbar-toggler').on('click', function() {
        $(this).toggleClass('active');
        $('.theme-nav-menu').toggleClass('active');
        $('.offcanvas__overlay').toggleClass('active');
    });

    $('.offcanvas__overlay, .btn-close').on('click', function() {
        $('.navbar-toggler').removeClass('active');
        $('.theme-nav-menu').removeClass('active');
        $('.offcanvas__overlay').removeClass('active');
    });

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Counter Up
    if ($('.counter').length) {
        $('.counter').counterUp({
            delay: 10,
            time: 2000
        });
    }


    // Hero Slider
    if ($('.hero-slider').length) {
        $('.hero-slider').slick({
            dots: true,
            infinite: true,
            speed: 1000,
            fade: true,
            cssEase: 'linear',
            autoplay: true,
            autoplaySpeed: 5000,
            arrows: false,
            pauseOnHover: false
        });
    }

    // Smooth Scroll for Anchors
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });

    // Back to top button
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 600) {
            $('.scroll-up').addClass('active');
        } else {
            $('.scroll-up').removeClass('active');
        }
    });

    $('.scroll-up').on('click', function() {
        $('html, body').animate({scrollTop: 0}, 600);
        return false;
    });

})(jQuery);
