/**
 * BeeKind Preschool - Standard Footer & Form Scripts
 * Consolidated for site-wide consistency.
 */

$(function () {
    // Form Validation initialization
    if ($.fn.validate) {
        $('#contact_form').validate({
            submitHandler: function (form) {
                form_submit('contact_form');
            }
        });
        $('#quick_enquiry').validate({
            submitHandler: function (form) {
                form_submit('quick_enquiry');
            }
        });
    }

    // Reveal Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // Hero Slider Initialization (if present and not already handled)
    if ($('.hero-slider').length && $.fn.slick && !$('.hero-slider').hasClass('slick-initialized')) {
        $('.hero-slider').slick({
            dots: true,
            infinite: true,
            speed: 800,
            fade: true,
            cssEase: 'linear',
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: false,
            pauseOnFocus: false,
            arrows: false,
            adaptiveHeight: true
        });
    }

    // Custom Preloader Fallback
    const preloader = document.querySelector('.preloader img');
    if (preloader) {
    preloader.src = 'assets/images/logo-only.png';
        preloader.style.maxWidth = '150px';
    }
});

/**
 * Handles AJAX form submission
 * @param {string} form - The ID of the form to submit
 */
function form_submit(form) {
    const $form = $('#' + form);
    $form.find('.text-danger').text('');
    $form.find('button[type="submit"], input[type="submit"]').prop('disabled', true);
    
    const originalBtnText = $form.find('button[type="submit"]').html();
    $form.find('button[type="submit"]').html('loading...');

    var data = new FormData($form[0]);
    $.ajax({
        type: "POST",
        url: $form.attr('action'),
        data: data,
        mimeType: "multipart/form-data",
        contentType: false,
        cache: false,
        processData: false,
        success: function (response) {
            try {
                var formErrors = $.parseJSON(response);
                if (typeof formErrors == 'object') {
                    for (var key in formErrors) {
                        if (formErrors.hasOwnProperty(key)) {
                            if (key === 'success_msg_reload') {
                                window.location.reload();
                            } else if (key === 'success_msg_redirect') {
                                window.location.replace(formErrors[key]);
                            } else if (key === 'success_msg') {
                                if ($.notify) $.notify(formErrors[key], 'success');
                                else alert(formErrors[key]);
                                $form[0].reset();
                            } else {
                                $form.find('.' + key).text(formErrors[key]);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Error parsing form response:", e);
            }

            $form.find('button[type="submit"], input[type="submit"]').prop('disabled', false);
            $form.find('button[type="submit"]').html(originalBtnText);
            
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
        },
        error: function() {
            $form.find('button[type="submit"], input[type="submit"]').prop('disabled', false);
            $form.find('button[type="submit"]').html(originalBtnText);
            if ($.notify) $.notify('An error occurred. Please try again.', 'error');
        }
    });
    return false;
}

/**
 * Lazy loading strategy for Google reCAPTCHA
 */
(function () {
    let recaptchaLoaded = false;

    function isFormVisible() {
        const form = document.querySelector('form');
        if (!form) return false;
        const style = window.getComputedStyle(form);
        return style.display !== 'none' && style.visibility !== 'hidden' && form.offsetParent !== null;
    }

    function loadRecaptcha() {
        if (recaptchaLoaded || window.grecaptcha) return;
        if (!isFormVisible()) return;

        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        recaptchaLoaded = true;
    }

    function initRecaptchaLoadStrategy() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                if (isFormVisible()) loadRecaptcha();
            }, { timeout: 4000 });
        } else {
            setTimeout(() => {
                if (isFormVisible()) loadRecaptcha();
            }, 3000);
        }

        document.addEventListener('focusin', function (e) {
            if (e.target.closest('form') && isFormVisible()) {
                loadRecaptcha();
            }
        }, { once: true });

        document.addEventListener('shown.bs.modal', function () {
            if (isFormVisible()) {
                loadRecaptcha();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRecaptchaLoadStrategy);
    } else {
        initRecaptchaLoadStrategy();
    }
})();
