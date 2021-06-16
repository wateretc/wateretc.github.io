// Browser detection for when you get desperate. A measure of last resort.

// http://rog.ie/post/9089341529/html5boilerplatejs
// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }

// Uncomment the below to use:
// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);


var first = true;

function initPage(){
    $(".menu").click(function(){
        $(this).parent("nav").toggleClass('open');
    });


    $("#map-overlay").scroll( function() {
        if ($(this).find("header .icon").is(":visible"))
            $(this).find("header .icon").fadeOut(250);
    });

    var swiperOps = {
        slidesPerView: 'auto', 
        spaceBetween: 20,
        // freeMode: true,
        // freeModeSticky: true,
        centeredSlides: true,
        initialSlide: 0,
        navigation: {
            nextEl: '.next',
            prevEl: '.prev',
        },
        mousewheel: {
            forceToAxis: true,
            releaseOnEdges: true,
            invert: true,
        }
    };

    if ($("body").hasClass("project")) {
        var swipers = [];

        $('.swiper-container').each( function(i) {
            var swiper = new Swiper($(this)[0], swiperOps);
            $(this).attr('id', 's' + i);
            swipers.push(swiper);

            $(this).imagesLoaded( function() {
                swiper.slideToLoop(0);
            });
        });

        // determine whether the nav icons should be white on load
        var top_height = $(".top-image").height() - ($(".home").position().top + $(".home").outerHeight() / 2);
        var scrolltop = $(window).scrollTop();
        if (scrolltop < top_height || scrolltop < 100)
            $(".top").addClass("switch");

        $(window).scroll( function() {
            scrolltop = $(window).scrollTop();
            if (scrolltop >= top_height && scrolltop <= top_height + 200)
                $(".top").removeClass("switch");
            else if (scrolltop < top_height)
                $(".top").addClass("switch");
            // console.log(scrolltop, top_height);
        });

        $(window).resize( function() {
            top_height = $(".top-image").height() - ($(".home").position().top + $(".home").outerHeight() / 2);
        });

        $(".main figure img").not(".news-items img").click( function() {
            $(".image-expand figure").html( $(this).clone() );
            $(".image-expand").addClass("open").attr("aria-hidden", "false");
            $("body").addClass("noscroll");
        });

        $("main .swiper-container img").click( function() {
            var swiper = $(this).parent().parent().parent(".swiper-container");
            var sid = swiper.attr("id").substring(1,2);
            $(".image-expand figure").html( swiper.clone() );

            var expandedSwiper = new Swiper ('.image-expand .swiper-container', swiperOps);
            expandedSwiper.slideTo( swipers[sid].clickedIndex, 0);
            $(".image-expand").addClass("open").attr("aria-hidden", "false");
            $("body").addClass("noscroll");
        });

        $(".image-expand .close").click( function() {
            $(".image-expand").removeClass("open").attr("aria-hidden", "true");
            $("body").removeClass("noscroll");
        });


        // vimeo custom scale

        $(".video").each( function() {
            var iframe = $(this).find("iframe");

            if (iframe.attr("width") && iframe.attr("height")) {
                var w = iframe.attr("width");
                var h = iframe.attr("height");
                var aspect = h/w * 100;
                $(this).css("padding-bottom", aspect + "%");
            }
        });
    }

    $(".info-table .expand").click(function(){
        var info = $(this).parent();
        info.toggleClass('open');
        
        if (info.hasClass("open")) {
            var maxHeight = 0;
            info.find(".more").children().each( function() {
                maxHeight = maxHeight + $(this).outerHeight(true);
            });
            info.find(".more").css("max-height", maxHeight);
        }
        else
            info.find(".more").css("max-height", "");
    });


    // "read more"

    $(".project .main a.more").click( function() {
        var short = $(this).parent(".text-short");
        short.hide();
        short.next(".text-full").addClass("open");
    });

    $(".project .main a.less").click( function() {
        var full = $(this).parent(".text-full");
        full.removeClass("open");
        full.prev(".text-short").show();
    });

    // var more = '<a href="#" class="more">Read more</a>';
    // var words = $(".text-before").html().split(' ');
    // var before_num = getBeforeWords();

    // var text_before;
    // $(words).each( function(i) {
    //     if (i == before_num)
    //         text_before += words[i] + ' fuck';
    //     else
    //         text_before += words[i] + ' ';

    // });

    // $(".text-before").html(text_before);
}

var intervalId;

function initPano() {
    // Set up Street View and initially set it visible. Register the
    // custom panorama provider function. Set the StreetView to display
    // the custom panorama 'reception' which we check for below.

    var el = document.getElementById('map');

    var panorama = new google.maps.StreetViewPanorama(
        el, {pano: 'studio', visible: true});
    panorama.registerPanoProvider(getCustomPanorama);

    // var changed = 0;
    // observeDOM( el, function(m){ 
    //     changed++;

    //     if (changed > 6) {
    //         $("#static").hide();
    //     }
    // });

    var pov = panorama.getPov();
    var pov_adjust = 0;
    var speed_adjust = 0;

    var ww = $(window).width();
    var contact_height = $(".contact").outerHeight();
    var scroll = 0;
    var setpan = true;

    pov.heading = 102;
    panorama.setPov({
        heading: 102,
        pitch: pov.pitch,
        zoom: pov.zoom,
    });

    if (ww >= 480) {
        $(document).trigger("mousemove");
        setpan = false;
    }

    panorama.setOptions({
        disableDefaultUI: true,
        showRoadLabels: false,
        panControl: true,
        panConrolOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        scrollwheel: false
    });


    // document.onmousemove = function(e) {
    //     if (e.pageX > ww*0.2 && e.pageX < ww*0.8) {
    //         var posX = map_range(e.pageX, 0, ww, 0, 180) + pov_adjust;

    //         panorama.setPov({
    //             heading: posX,
    //             pitch: pov.pitch,
    //             zoom: pov.zoom,
    //         });

    //         pov.heading = posX;
    //     }
    //     else if (e.pageX <= ww*0.2) {
    //         speed_adjust = map_range(e.pageX, 0, ww*0.2, -0.15, 0);
    //     }
    //     else {
    //         speed_adjust = map_range(e.pageX, ww*0.8, ww, 0, 0.15);
    //     }
    // }


    // function pan(amount){
    //     pov.heading = pov.heading + amount + speed_adjust;

    //     panorama.setPov({
    //         heading: pov.heading,
    //         pitch: pov.pitch,
    //         zoom: pov.zoom,
    //     });

    //     pov_adjust += amount += speed_adjust;
    //     // console.log(speed_adjust);
    // }

    // $(".pan-left").hover(function (e) {
    //     var intervalDelay = 20;
    //     intervalId = setInterval( function() { pan(-0.25) }, intervalDelay);
    // }, function () {
    //     clearInterval(intervalId);
    // });

    // $(".pan-right").hover(function (e) {
    //     var intervalDelay = 20;
    //     intervalId = setInterval( function() { pan(0.25) }, intervalDelay);
    // }, function () {
    //     clearInterval(intervalId);
    // });

    // $("#map-overlay").scroll( function() {
    //     if (ww > 480) {
    //         scroll = $("#map-overlay").scrollTop() - (contact_height/2);

    //         if (scroll > 0) {

    //             pov.pitch = map_range(scroll, 0, contact_height/2, 0, -15);

    //             panorama.setPov({
    //                 heading: pov.heading,
    //                 pitch: pov.pitch,
    //                 zoom: pov.zoom,
    //             });
    //         }
    //     }
    // });

    $(window).resize( function() {
        ww = $(window).width();
    });

    // $("#motion-alert").addClass("on");

    $("body").click( function() {
    // panorama.addListener('pov_changed', function() {
        console.log("clicked");
        if (first) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(response => {
                    console.log(response);
                    if (response == 'granted') {
                        initPano();
                    }
                }).catch(console.error);
            }
            first = false;
        }
    });



    // check if gyroscope is present on homepage
    // if ($("body").hasClass("home")) {
        // var probablyTouch = false;
        // var gyroPresent = false;

        // var cookie_name = 'tankhouse-motion-setting';
        // $go = $.cookie(cookie_name);

        // window.addEventListener('mouseover', function onFirstHover() {
        //     probablyTouch = true;
        //     window.removeEventListener('mouseover', onFirstHover, false);
        // }, false);

        // window.addEventListener("devicemotion", function(event){
        //     if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
        //         gyroPresent = true;
        // });

        // window.setTimeout(function() {
        //     if (!probablyTouch && !gyroPresent && ww <= 1024) {// && $go == null) {
                // $("#motion-alert").addClass("on");
                // $.cookie(cookie_name, 'cooked', { path: '/', expires: 90 });
        //     }
        // }, 3000);


        // $("#motion-alert").addClass("on");

        // $("#motion-alert .icon").click( function() {
        //     $("#motion-alert").removeClass("on");
    //     });
    // }
}

// Construct the appropriate StreetViewPanoramaData given
// the passed pano IDs.
function getCustomPanorama(pano) {
    return {
        location: {
            pano: 'studio',
            description: 'Tankhouse Studio'
        },
        links: [],
        // The text for the copyright control.
        copyright: '&copy; TH',
        // The definition of the tiles for this panorama.
        tiles: {
            tileSize: new google.maps.Size(4096, 2048),
            worldSize: new google.maps.Size(4096, 2048),
            // The heading in degrees at the origin of the panorama
            // tile set.
            centerHeading: 0,
            getTileUrl: getCustomPanoramaTileUrl
        }
    };
};

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function initMap() {
    var map;
    var styledMapType = new google.maps.StyledMapType(
        // https://snazzymaps.com/style/65265/simple
    [{"featureType":"all","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"saturation":"-100"},{"weight":"4.06"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"gamma":"2.29"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#f5f5f5"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"invert_lightness":true}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#dadada"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"color":"#e30713"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"visibility":"on"},{"saturation":"0"},{"lightness":"6"}]},{"featureType":"poi.park","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"hue":"#ff0000"},{"lightness":"-60"},{"saturation":"-3"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#a2a2a2"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d7d7d7"},{"lightness":"-6"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"saturation":"-100"},{"visibility":"off"}]}],
    {name: 'Styled Map'});

    map = new google.maps.Map(document.getElementById('map'), {
        disableDefaultUI: true,
    });

    setCenterZoom(map);

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
}

// var observeDOM = (function(){
//   var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

//   return function( obj, callback ){
//     if( !obj || !obj.nodeType === 1 ) return; // validation

//     if( MutationObserver ){
//       // define a new observer
//       var obs = new MutationObserver(function(mutations, observer){
//           callback(mutations);
//       })
//       // have the observer observe foo for changes in children
//       obs.observe( obj, { childList:true, subtree:true });
//     }
    
//     else if( window.addEventListener ){
//       obj.addEventListener('DOMNodeInserted', callback, false);
//       obj.addEventListener('DOMNodeRemoved', callback, false);
//     }
//   }
// })();
