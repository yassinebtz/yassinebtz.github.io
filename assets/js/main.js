/*
=================================================================
  MAIN JAVASCRIPT - YASSINE BOUTAOUZA PORTFOLIO
=================================================================
*/

(function($) {
    'use strict';

    // Preloader
    $(window).on('load', function() {
        $('#preloader').fadeOut('slow', function() {
            $(this).remove();
        });

        // Initialize AOS animations
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom'
        });

        // Initialize skills progress bars
        animateSkillBars();
    });

    // Document Ready
    $(document).ready(function() {
        // Initialize Typed.js
        if ($('#typed').length) {
            new Typed('#typed', {
                strings: $('#typed-strings').children('span').map(function() {
                    return $(this).text();
                }).get(),
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                startDelay: 1000,
                loop: true,
                smartBackspace: true,
                cursorChar: '|'
            });
        }

        // Initialize Particles.js
        if ($('#particles-js').length) {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: { enable: true, value_area: 800 }
                    },
                    color: { value: themeColors() },
                    shape: {
                        type: "circle",
                        stroke: { width: 0, color: "#000000" },
                        polygon: { nb_sides: 5 }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: themeColors()[0],
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 400, line_linked: { opacity: 1 } },
                        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                        repulse: { distance: 200, duration: 0.4 },
                        push: { particles_nb: 4 },
                        remove: { particles_nb: 2 }
                    }
                },
                retina_detect: true
            });
        }

        // Initialize Lightbox
        if (typeof lightbox !== 'undefined') {
            lightbox.option({
                'resizeDuration': 200,
                'wrapAround': true,
                'disableScrolling': true,
                'fadeDuration': 300
            });
        }

        // Navbar on scroll
        $(window).on('scroll', function() {
            let scroll = $(window).scrollTop();
            if (scroll >= 100) {
                $('.navbar').addClass('affix');
            } else {
                $('.navbar').removeClass('affix');
            }

            // Back to top button visibility
            if (scroll >= 500) {
                $('.back-to-top').addClass('active');
            } else {
                $('.back-to-top').removeClass('active');
            }
        });

        // Smooth scrolling
        $('a.nav-link, .scroll-down a, .back-to-top').on('click', function(event) {
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 70
                }, 800, function() {
                    window.location.hash = hash;
                });
            }
        });

        // Theme Toggler
        $('#theme-toggle-btn').on('click', function() {
            $('html').toggleClass('dark-mode');
            localStorage.setItem('darkMode', $('html').hasClass('dark-mode'));
            
            // Update particles colors
            updateParticlesColors();
        });

        // Check for saved theme preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            $('html').addClass('dark-mode');
            updateParticlesColors();
        }

        // Load RSS feed
        loadRssFeed();
    });

    // Get theme colors for particles
    function themeColors() {
        return $('html').hasClass('dark-mode') 
            ? ['#7c73ff', '#ff4081', '#26c6da'] 
            : ['#6c63ff', '#f50057', '#00bcd4'];
    }

    // Update particles colors when theme changes
    function updateParticlesColors() {
        if (window.pJSDom && window.pJSDom[0]) {
            const colors = themeColors();
            window.pJSDom[0].pJS.particles.color.value = colors;
            window.pJSDom[0].pJS.particles.line_linked.color = colors[0];
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    // Animate skill bars
    function animateSkillBars() {
        $('.skill-item').each(function() {
            const $this = $(this);
            
            // Check if element is in viewport
            const isInViewport = function() {
                const elementTop = $this.offset().top;
                const elementBottom = elementTop + $this.outerHeight();
                const viewportTop = $(window).scrollTop();
                const viewportBottom = viewportTop + $(window).height();
                return elementBottom > viewportTop && elementTop < viewportBottom;
            };
            
            // Animate when in viewport
            if (isInViewport()) {
                $this.find('.progress-bar').css('width', $this.find('.progress-bar').attr('style').split(':')[1]);
            }
        });
    }

    // Load RSS Feed from Zataz
    function loadRssFeed() {
        const rssFeedURL = "https://www.zataz.com/feed/";
        const proxyURL = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssFeedURL);
        
        $.ajax({
            url: proxyURL,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                const items = data.items;
                let tableContent = '';
                
                // Limit to 5 items
                const limitedItems = items.slice(0, 5);
                
                limitedItems.forEach(function(item) {
                    const title = item.title;
                    let description = item.description;
                    // Strip HTML and limit description length
                    description = $('<div>').html(description).text();
                    description = description.substring(0, 100) + '...';
                    
                    tableContent += `
                        <tr>
                            <td><strong>${title}</strong></td>
                            <td>${description}</td>
                            <td><a href="${item.link}" class="rss-link" target="_blank">Lire</a></td>
                        </tr>
                    `;
                });
                
                $('#rss-table-body').html(tableContent);
            },
            error: function() {
                $('#rss-table-body').html('<tr><td colspan="3" class="text-center">Impossible de charger les articles. Veuillez réessayer plus tard.</td></tr>');
            }
        });
    }

})(jQuery);
