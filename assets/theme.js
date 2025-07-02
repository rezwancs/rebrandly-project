const getMousePos = (e) => {
    var pos = e.currentTarget.getBoundingClientRect();
    return {
        x: e.clientX - pos.left,
        y: e.clientY - pos.top,
    };
};

const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;
if (typeof window.Shopify == "undefined") {
    window.Shopify = {};
}

function pad2(number) {
    return (number < 10 ? "0" : "") + number;
}
var documentScrollTop = document.documentElement.scrollTop;
var DOMAnimations = {
    slideUp: function(element, duration = 500) {
        return new Promise(function(resolve, reject) {

            element.style.height = element.offsetHeight + 'px';
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            window.setTimeout(function() {
                element.style.display = 'none';
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
                resolve(false);
            }, duration)
        })
    },

    slideDown: function(element, duration = 500) {

        return new Promise(function(resolve, reject) {

            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;

            if (display === 'none')
                display = 'block';

            element.style.display = display;
            let height = element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            element.offsetHeight;
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.style.height = height + 'px';
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            window.setTimeout(function() {
                element.style.removeProperty('height');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
            }, duration)
        })
    },

    slideToggle: function(element, duration = 500) {
        if (window.getComputedStyle(element).display === 'none') {
            return this.slideDown(element, duration);
        } else {
            return this.slideUp(element, duration);
        }
    },

    classToggle: function(element, className) {

        if (element.classList.contains(className)) {

            element.classList.remove(className)


        } else {

            element.classList.add(className)
        }
    }
}

if (!Element.prototype.fadeIn) {
    Element.prototype.fadeIn = function() {
        let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
            func = typeof arguments[0] === 'function' ? arguments[0] : (
                typeof arguments[1] === 'function' ? arguments[1] : null
            );

        this.style.opacity = 0;
        this.style.filter = "alpha(opacity=0)";
        this.style.display = "inline-block";
        this.style.visibility = "visible";

        let $this = this,
            opacity = 0,
            timer = setInterval(function() {
                opacity += 50 / ms;
                if (opacity >= 1) {
                    clearInterval(timer);
                    opacity = 1;

                    if (func) func('done!');
                }
                $this.style.opacity = opacity;
                $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
            }, 50);
    }
}

if (!Element.prototype.fadeOut) {
    Element.prototype.fadeOut = function() {
        let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
            func = typeof arguments[0] === 'function' ? arguments[0] : (
                typeof arguments[1] === 'function' ? arguments[1] : null
            );

        let $this = this,
            opacity = 1,
            timer = setInterval(function() {
                opacity -= 50 / ms;
                if (opacity <= 0) {
                    clearInterval(timer);
                    opacity = 0;
                    $this.style.display = "none";
                    $this.style.visibility = "hidden";

                    if (func) func('done!');
                }
                $this.style.opacity = opacity;
                $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
            }, 50);
    }
}


Shopify.bind = function(fn, scope) {
    return function() {
        return fn.apply(scope, arguments);
    };
};

Shopify.setSelectorByValue = function(selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
        var option = selector.options[i];
        if (value == option.value || value == option.innerHTML) {
            selector.selectedIndex = i;
            return i;
        }
    }
};

Shopify.addListener = function(target, eventName, callback) {
    target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on' + eventName, callback);
};

Shopify.postLink = function(path, options) {
    options = options || {};
    var method = options['method'] || 'post';
    var params = options['parameters'] || {};

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
    this.countryEl = document.getElementById(country_domid);
    this.provinceEl = document.getElementById(province_domid);
    this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

    Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler, this));

    this.initCountry();
    this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
    initCountry: function() {
        var value = this.countryEl.getAttribute('data-default');
        Shopify.setSelectorByValue(this.countryEl, value);
        this.countryHandler();
    },

    initProvince: function() {
        var value = this.provinceEl.getAttribute('data-default');
        if (value && this.provinceEl.options.length > 0) {
            Shopify.setSelectorByValue(this.provinceEl, value);
        }
    },

    countryHandler: function(e) {
        var opt = this.countryEl.options[this.countryEl.selectedIndex];
        var raw = opt.getAttribute('data-provinces');
        var provinces = JSON.parse(raw);

        this.clearOptions(this.provinceEl);
        if (provinces && provinces.length == 0) {
            this.provinceContainer.style.display = 'none';
        } else {
            for (var i = 0; i < provinces.length; i++) {
                var opt = document.createElement('option');
                opt.value = provinces[i][0];
                opt.innerHTML = provinces[i][1];
                this.provinceEl.appendChild(opt);
            }

            this.provinceContainer.style.display = "";
        }
    },

    clearOptions: function(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    },

    setOptions: function(selector, values) {
        for (var i = 0, count = values.length; i < values.length; i++) {
            var opt = document.createElement('option');
            opt.value = values[i];
            opt.innerHTML = values[i];
            selector.appendChild(opt);
        }
    }
};

function shippingEstimates() {
    if (Shopify && Shopify.CountryProvinceSelector) {
        var country = document.getElementById("shippingCountry");
        if (!country) {
            return false;
        }
        var shipping = new Shopify.CountryProvinceSelector(
            "shippingCountry",
            "shippingProvince", {
                hideElement: "shippingProvinceContainer",
            }
        );

        setupEventListeners();
    }
}

function setupEventListeners() {
    var button = document.getElementById("getShippingEstimates");
    if (button) {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            $("#ShippingWrapperResponse")
                .html("")
                .removeClass("success")
                .removeClass("error")
                .hide();
            var shippingAddress = {};
            shippingAddress.zip = jQuery("#shippingZip").val() || "";
            shippingAddress.country = jQuery("#shippingCountry").val() || "";
            shippingAddress.province = jQuery("#shippingProvince").val() || "";
            getCartShippingRates(shippingAddress);
        });
    }
}

var getCartShippingRates = function(shippingAddress) {
    var params = {
        type: "POST",
        url: "/cart/shipping_rates.json",
        data: jQuery.param({ shipping_address: shippingAddress }),
        success: function(data) {
            _render(data.shipping_rates);
        },
        error: _onError,
    };
    jQuery.ajax(params);
};
var _fullMessagesFromErrors = function(errors) {
    var fullMessages = [];
    jQuery.each(errors, function(attribute, messages) {
        jQuery.each(messages, function(index, message) {
            fullMessages.push(message);
        });
    });
    return fullMessages;
};
var _onError = function(XMLHttpRequest, textStatus) {
    var data = eval("(" + XMLHttpRequest.responseText + ")");
    feedback = _fullMessagesFromErrors(data).join(", ") + ".";
    $("#ShippingWrapperResponse")
        .html('<div class="no-bg form-message__wrapper error"><div class="form-message__title" tabindex="-1">' + errorCross + '<div class="errors"><ul><li>' + feedback + '</li></ul></div></div></div>')
        .show();
};
var _render = function(response) {
    if (response && response.length > 0) {
        var html = ' <div class="no-bg form-message__wrapper success" role="status" tabindex="-1" autofocus><div class="form-message__title" tabindex="-1"><ul>';
        response.forEach(function(shipping) {
            html += `<li><span>
        <strong>${
          shipping.name
        }: </strong>${Shopify.formatMoney(
          shipping.price * 100,
          moneyFormat
        )}</span></li>`;
        });
        html += "</ul></div></div>";
        $("#ShippingWrapperResponse").html(html).show();
    } else {
        $("#ShippingWrapperResponse")
            .html('<div class="no-bg form-message__wrapper error"><div class="form-message__title" tabindex="-1">' + errorCross + '<div class="errors"><ul><li>' + notAvailableLabel + "</li></ul></div></div></div>")
            .show();
    }
};


function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

if (typeof Shopify === "undefined") { Shopify = {}; }
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = "",
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = format || this.money_format;

        if (typeof cents == "string") {
            cents = cents.replace(".", "");
        }

        function defaultOption(opt, def) {
            return typeof opt == "undefined" ? def : opt;
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ",");
            decimal = defaultOption(decimal, ".");

            if (isNaN(number) || number == null) {
                return 0;
            }

            number = (number / 100.0).toFixed(precision);

            var parts = number.split("."),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
                cents = parts[1] ? decimal + parts[1] : "";

            return dollars + cents;
        }

        switch (formatString.match(placeholderRegex)[1]) {
            case "amount":
                value = formatWithDelimiters(cents, 2);
                break;
            case "amount_no_decimals":
                value = formatWithDelimiters(cents, 0);
                break;
            case "amount_with_comma_separator":
                value = formatWithDelimiters(cents, 2, ".", ",");
                break;
            case "amount_no_decimals_with_comma_separator":
                value = formatWithDelimiters(cents, 0, ".", ",");
                break;
            case "amount_no_decimals_with_space_separator":
                value = formatWithDelimiters(cents, 0, " ", " ");
                break;
        }

        return formatString.replace(placeholderRegex, value);
    };
}


function focusableElements(wrapper) {
    if(!wrapper) return false;
    let elements = Array.from(
        wrapper.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe")
    );
    return elements;
}
const listFocusElements = {};
var previousFocusElement = '';

function focusElementsRotation(wrapper) {
    stopFocusRotation();
    let elements = focusableElements(wrapper);
    if(elements == false) return false;
    let first = elements[0];
    first.focus();
    let last = elements[elements.length - 1];
    listFocusElements.focusin = (e) => {
        if (
            e.target !== wrapper &&
            e.target !== last &&
            e.target !== first
        )
            return;

        document.addEventListener('keydown', listFocusElements.keydown);
    };

    listFocusElements.focusout = function() {
        document.removeEventListener('keydown', listFocusElements.keydown);
    };

    listFocusElements.keydown = function(e) {
        if (e.code.toUpperCase() !== 'TAB') return;
        if (e.target === last && !e.shiftKey) {
            e.preventDefault();
            first.focus();
        }
        if ((e.target === wrapper[0] || e.target === first) && e.shiftKey) {
            e.preventDefault();
            last.focus();
        }
    };

    document.addEventListener('focusout', listFocusElements.focusout);
    document.addEventListener('focusin', listFocusElements.focusin);
}

function stopFocusRotation() {
    document.removeEventListener('focusin', listFocusElements.focusin);
    document.removeEventListener('focusout', listFocusElements.focusout);
    document.removeEventListener('keydown', listFocusElements.keydown);
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 27) {
        let drawers = document.querySelectorAll('[data-side-drawer]');
    }
});

function initAllSliders(section = document) {
    let sliderElements = section.querySelectorAll('[data-theme-slider]');
    Array.from(sliderElements).forEach(function(element) {
        if (jQuery(element).is("[data-desktop-only]")) {
            if ($(window).width() >= 768) {
                if (!jQuery(element).hasClass("flickity-enabled")) {
                    sliderInit(element);
                }
            } else {
                if (jQuery(element).hasClass("flickity-enabled")) {
                    jQuery(element).flickity("destroy");
                }
            }
        } else {
            if (!jQuery(element).hasClass("flickity-enabled")) {
                sliderInit(element);
            } else {
                jQuery(element).flickity("resize");
            }
        }
    })
}

function sliderInit(element, slideIndex) {
    let selector = element;
    if (element.nodeType) {
        selector = jQuery(element)
    }
    var optionContainer = selector.attr("data-theme-slider");
    if (optionContainer) {
        selector.on('ready.flickity',function(){
            if(selector[0].hasAttribute('data-slide-show')){
                let activeSlide = selector[0].querySelector('.slideshow__item.is-selected')
                if (activeSlide) {           
                    setTimeout(() => {
                        activeSlide.classList.add('is-animated')
                    }, 500);
                }
            }
        })
        var options = JSON.parse(optionContainer);
        if (selector.hasClass("flickity-enabled")) {
            selector.flickity("resize");
           
        } else {
            if (slideIndex) {
                selector
                    .not(".flickity-enabled")
                    .flickity(options)
                    .flickity("select", slideIndex);
            } else {
                selector.not(".flickity-enabled").flickity(options)
                setTimeout(function() {
                    selector.flickity("resize");
                }, 500)
            }
        }
        window.addEventListener("resize", (event) => {
            setTimeout(function() {
                selector.flickity("resize");
            }, 500)
        });
        selector.on("change.flickity", function(event, index) {
            if (selector[0].hasAttribute('data-custom-slider-animation')) {
                let activeSlide = selector[0].querySelector('.slideshow__item.is-selected')
                if (activeSlide) {
                    let slideStyles = getComputedStyle(activeSlide);
                    let background = slideStyles.getPropertyValue('--backgroundColor');
                    selector[0].style.background = background;
                }
            }
            selector[0].querySelectorAll(".yv-youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
                video.contentWindow.postMessage(
                    '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
                    "*"
                );
            });
            selector[0].querySelectorAll(".yv-vimeo-video,iframe[src*='player.vimeo.com']").forEach((video) => {
                video.contentWindow.postMessage('{"method":"pause"}', "*");
            });
            selector[0]
                .querySelectorAll("video:not(.videoBackgroundFile)")
                .forEach((video) => video.pause());
            if (selector[0].hasAttribute('data-spotlight-slider')) {
                let parentSection = selector[0].closest('.shopify-section');
                let prevActive = parentSection.querySelector('.active[data-spot-point]');
                if (prevActive) {
                    prevActive.classList.remove('active');
                    let currentActive = parentSection.querySelector('[data-spot-point][data-spot-index="' + index + '"]');
                    if (currentActive) {
                        currentActive.classList.add('active')
                    }
                }
            }
            if(selector[0].hasAttribute('data-slide-show')){
                let activeSlide = selector[0].querySelector('.is-animated:not(.is-selected)')
                let currentActiveSlide = selector[0].querySelector('.slideshow__item.is-selected')
                if (activeSlide) {             
                    activeSlide.classList.remove('is-animated')
                }
                if (currentActiveSlide) {             
                    currentActiveSlide.classList.add('is-animated')
                }
            }

        });
        if(selector[0].hasAttribute('data-hover-slider')) {
            let mainSection = selector.closest('.shopify-section');
            let navs = mainSection.find('[data-hover-trigger]');
            $(navs).on('mouseover click', function(event) {
                event.preventDefault();
                $(navs).parent().removeClass('active');
                $(this).parent().addClass('active')
                var index = parseInt($(this).data('index'));
                selector.flickity('select', index)
            })
        }
        let selectorProgressBar = selector[0].nextElementSibling;
        if (selectorProgressBar && selectorProgressBar.classList.contains('slider-progress-bar')) {
            selector.on('scroll.flickity', function(event, progress) {
                progress = Math.max(0, Math.min(1, progress));
                selectorProgressBar.style.setProperty('--progress-bar-width', (progress * 100 + '%'));
            });
        }
  
    }
}
window.addEventListener("resize", (event) => {
    setTimeout(function() {
        let sliderElements = document.querySelectorAll('[data-theme-slider]');
        Array.from(sliderElements).forEach(function(selector) {
            if (jQuery(selector).is("[data-desktop-only]")) {
                if ($(window).width() >= 768) {
                    if (!jQuery(selector).hasClass("flickity-enabled")) {
                        sliderInit(selector);
                    }
                } else {
                    if (jQuery(selector).hasClass("flickity-enabled")) {
                        jQuery(selector).flickity("destroy");
                    }
                }
            } else {
                if (!jQuery(selector).hasClass("flickity-enabled")) {
                    sliderInit(selector);
                } else {
                    jQuery(selector).flickity("resize");
                }
            }
        })
    }, 500)
});



function initBeforeAfter(section = document) {
    let cursors = section.querySelectorAll(".before-after__drag-point");
    setTimeout(() => {
        Array.from(cursors).forEach(function(cursor) {
            beforeAfterImage(cursor);
        });
    }, 500);
}

function beforeAfterImage(cursor) {
    const _parentSection = cursor.closest(".shopify-section");
    if (!cursor.offsetParent) {
        return false;
    }
    let pointerDown = false;
    let _offsetX = (_currentX = 0);
    let minOffset = -cursor.offsetLeft - 0 ;
    if(rtlStatus){
        minOffset = -cursor.offsetLeft - 0 - cursor.offsetWidth;
    }
    let maxOffset = cursor.offsetParent.clientWidth + minOffset;
    _parentSection.addEventListener("pointerdown", function(event) {
        if (
            event.target === cursor ||
            event.target.closest(".before-after__drag-point") === cursor
        ) {
            _initialX = event.clientX - _offsetX;
            pointerDown = true;
        }
    });
    _parentSection.addEventListener("pointermove", function(event) {
        if (!pointerDown) {
            return;
        }
        _currentX = Math.min(Math.max(event.clientX - _initialX, minOffset), (maxOffset));
        _offsetX = _currentX;
        _currentX = _currentX.toFixed(1);
        _parentSection.style.setProperty(
            "--imageClipPosition",
            `${_currentX}px`
        );
    });
    _parentSection.addEventListener("pointerup", function(event) {
        pointerDown = false;
    }); 
    window.addEventListener("resize", function() {
        if (!cursor.offsetParent) {
            return false;
        }
        minOffset = -cursor.offsetLeft - 0;
        if(rtlStatus){
            minOffset = -cursor.offsetLeft - 0 - cursor.offsetWidth;
        }
        maxOffset = cursor.offsetParent.clientWidth + minOffset;
        _currentX = Math.min(Math.max(minOffset, _currentX), (maxOffset))

        _parentSection.style.setProperty(
            "--imageClipPosition",
            `${_currentX}px`
        );
    });
}

function onScrollSectionVisible() {
    $(window).on("scroll", function() {
        $("section").each(function() {
            if (isOnScreen($(this))) {
                $(this).addClass("section-in-view");
            }
            if($(this).hasClass('map-section')){
              if (animationStatus) {
                  if (AOS) {
                      AOS.refreshHard()
                  }
              }
            }
        });
        $("[data-timeline-item]").each(function() {
            if (isOnScreen($(this))) {
                $(this).addClass("active");
            }
        });
        document.querySelectorAll(".yv-youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
            if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
                video.contentWindow.postMessage(
                    '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
                    "*"
                );
            }
        });
        document.querySelectorAll(".yv-vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
            if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
                video.contentWindow.postMessage('{"method":"pause"}', "*");
            }
        });
        document.querySelectorAll("video").forEach((video) => {
            if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
                video.pause();
            }
        });
    });
}

function isOnScreen(elem, form) {
    if (elem.length == 0) {
        return;
    }
    var $window = $(window);
    var viewport_top = $window.scrollTop();
    var viewport_height = $window.height();
    var viewport_bottom = viewport_top + viewport_height;
    var $elem = $(elem);
    var top = $elem.offset().top;
    var height = $elem.height();
    var bottom = top + height;

    return (
        (top >= viewport_top && top < viewport_bottom) ||
        (bottom > viewport_top && bottom <= viewport_bottom) ||
        (height > viewport_height &&
            top <= viewport_top &&
            bottom >= viewport_bottom)
    );
}

function getAllDetails(section = document) {
    var details = section.querySelectorAll('details');
    Array.from(details).forEach(function(detail) {
    if(detail.hasAttribute('data-store-heading')) return false;
        detailsInit(detail);
    });
}
const createMarker = (map,position) => {
        return new google.maps.Marker({
          position: position,
          map: map
        });
      };
const markers = [];
const updateMap = (map,latitude, longitude) => {
        map.setCenter({ lat: latitude, lng: longitude });
        map.setZoom(15);
        markers.forEach(marker => marker.setMap(null));
        const position = { lat: latitude, lng: longitude };
        const marker = createMarker(map,position);
        markers.push(marker);
      };
function detailsInit(detail,map,geocoder) {
    let detailParent = detail.closest('.details-box-outer');
    if (!detailParent) return false;
    let others = detailParent.querySelectorAll('details')
    detail.addEventListener("toggle", (event) => {
        let detailParentSection = detail.closest('.shopify-section');
        if (detail.open) {
            others.forEach((other) => {
                if (other !== detail) {
                    other.removeAttribute("open");
                }
            });
            if(detail.hasAttribute('data-store-heading')){
                let activeMedia = detailParentSection.querySelector('.store-locator__img.active');
                if(activeMedia){
                    activeMedia.classList.remove('active');
                    activeMedia.classList.add('hidden');
                }
                let getMediaRef = detail.getAttribute('data-media');
                let currentMedia = detailParentSection.querySelector('#'+getMediaRef);
                if(currentMedia){
                    currentMedia.classList.remove('hidden');
                    currentMedia.classList.add('active');
                }
              let currentLocation = detail.getAttribute('data-map');
              let mapSelector = detailParentSection.querySelector('.store-locator__map');
              if(currentLocation != ''){
                if(mapSelector){
                  mapSelector.classList.remove('hidden')
                }
                let geoDetail = getGeoDetails(geocoder,currentLocation);
                geoDetail.then(function(currentLocation){
                  if (geoDetail != null) {
                    updateMap(map,currentLocation[0],currentLocation[1]);
                  }
                })
              }
              else{
                if(mapSelector){
                  mapSelector.classList.add('hidden')
                }
              }
            }
        }
    });
}

document.addEventListener("shopify:section:load", function(section) {
    _sectionLoadEvent(section);
});

function _sectionLoadEvent(section) {
    let target = section.target;
    initAllSliders(target);
    if (animationStatus) {
        if (AOS) {
            AOS.refreshHard()
        }
    }

    if (target.querySelector("[data-map-container]")) {
        checkMapApi(target.querySelector("[data-map-container]"));
    }
    if (target.querySelector("[data-stacked-testimonials-carousel]")) {
        stackedTestimonialsInit(target.querySelector("[data-stacked-testimonials-carousel]"));
    }
    if (target.querySelector(".cart__estimation")) {
        shippingEstimates(target)
    }

    keyPressPreventElements(target);
    animatedTextSelectors(target)
    cookiesBanner();
    ageVerificationInit();
    slideShowAnimation(target);

    recentlyViewedProducts();
    /* product options */
    productOptionInit(target);
    getAtcElements(target);
    colorSwatchChanged(target);
    productGridImageSlider(target);
    productMedia3dModel(target);
    socialSharingEvent(target)
        /* cart update */
    cartNoteUpdate(target);
    cartNoteDrawerInt(target);
    getCartItemRemoveElements(target);
    /* Quick view */
    quickViewElements(target);
    /* Quantity Change buttons */
    getQuantityElement(target);
    /* All Drawer  */
    sideDrawerEventsInit(target);
    /* Detail disclousre */
    detailDisclouserInit(target);
    /* Marquee Text */
    marqueeTextAutoplay(target);
    marqueeTextScroll(target);
    /* Collections Carousel */
    collectionCarousel(target);
    /* SplitSlider */
    heroSlider(target);
    onYouTubeIframeAPIReady(target);
    initBeforeAfter(target);
    videoAnimateSection(target);
    localizationElements(target);
    countdownWrapper(target);
    initStickyAddToCart(target);
    tabsContentWrapper(target);
    getAllDetails(target);
    copyToClipboard(target);
    sortByCloseOutside(target);
    productMediaClose(target);
    timelineSelectors(target)
}

document.addEventListener("shopify:section:unload", function(section) {
    // _sectionUnLoadEvent(section);
});

function _sectionUnLoadEvent(section) {
    let target = section.target;
    // Re-initilize the sliders of loaded section start
    let sliders = target.querySelectorAll('[data-theme-slider]')
    Array.from(sliders).forEach(function(slider) {
            if (slider.classList.contains('flickity-enabled')) {
                slider.flickity('destroy')
            }
        })
        // Re-initilize the sliders of loaded section end

    // Re-initilize the dropdown of loaded section start
    let details = document.querySelectorAll('details');
    Array.from(details).forEach(function(detail) {
        detailsInit(detail);
    });
    // Re-initilize the dropdown of loaded section end
}
document.addEventListener("shopify:block:select", function(block) {
    // _sectionUnLoadEvent(section);
    let target = block.target;
    let slider = target.closest('[data-theme-slider].flickity-enabled')
    if (slider) {
        let index = Array.from(target.parentElement.children).indexOf(target);
        let sliderElement = Flickity.data(slider)
        sliderElement.select(index)
    }
    let splitSlider = target.closest('[data-split-slider]')
    if (splitSlider) {
        setTimeout(function() {
            target.click()
        }, 500)
    }


    // tabbedCollection
    if (target.classList.contains("tab-item")) {
        setTimeout(function() {
            target.querySelector("a.tab-link").click()
        }, 500)
    }
    if (target.hasAttribute('data-store-heading')) {
   
        setTimeout(function() {
            target.querySelector('summary').click()
        }, 500)
    }
    

    // collection carousel
    let collectioncarousel = target.closest('.featured-collection-list__scrollbar');
    if (collectioncarousel) {
        if (window.innerWidth > 1024) {
            if (collectioncarousel.hasAttribute('data-circle-carousel')) {

                //     var rotationArray=["177","197","213","231","249","269","286","300","324","340"];

                //     let index = Array.from(target.parentElement.children).indexOf(target);
                //     let parent = target.parentElement;
                //     console.log(parent)

                //     setTimeout(() => {
                //         // $(".featured-collection-list__scrollbar").css("")
                //        $(".featured-collection-list__scrollbar").css({
                //             'transform': 'rotate(-' + rotationArray[index] + 'deg)'
                //         });
                //         $(".center-circle").css({
                //             'transform': 'rotateZ(' + rotationArray[index] + 'deg)'
                //         })
                //         setTimeout(() => {

                //             let currentActive = parent.querySelector('[data-horizontal-element].active-collection');
                //             if (currentActive) {
                //                 currentActive.classList.remove('active-collection');
                //             }
                //             parent.querySelector('[data-index="'+index+'"]').classList.add('active-collection')

                //         }, 1000);
                // }, 500);
            } else {
                let index = Array.from(target.parentElement.children).indexOf(target);
                let decreaseWidth = target.clientWidth * ((index + 1) * 0.1);
                if (index > 5) {
                    decreaseWidth = target.clientWidth * ((index + 1) * 0.2);
                }
                setTimeout(() => {
                    window.scrollTo(0, (target.offsetLeft + target.closest('.featured-collection-list-section').offsetTop - decreaseWidth))
                    setTimeout(() => {
                        let parent = target.parentElement;
                        let currentActive = parent.querySelector('[data-horizontal-element].active');
                        if (currentActive) {
                            if (currentActive != target) {
                                currentActive.classList.remove('active');
                                target.classList.add('active');
                            }
                        } else {
                            target.classList.add('active')
                        }
                    }, 1000);
                }, 500);
            }
        } else {
            let _target = $(target)
            let _targetParent = _target.parent();
            _targetParent.scrollLeft(
                _targetParent.scrollLeft() +
                _target.position().left
            );
        }
    }
    // testimonials stacked
    let stackedTestimonials = target.closest('[data-stacked-testimonials-carousel]');
    if (stackedTestimonials) {
        let sliderOffset = 20;
        // Tablet and Mobile Only
        if (window.innerWidth < 768) {
            sliderOffset = 8;
        }
        $(stackedTestimonials).find(".active").removeClass("active");
        let slideWidth = $(target).outerWidth() - sliderOffset;
        let allTestimonials = target.parentElement.children;
        let currentIndex = Array.from(allTestimonials).indexOf(target);
        Array.from(allTestimonials).forEach(function(testimonial, index) {
            if (index <= currentIndex) {
                let slideMove = -(slideWidth * index);
                if(rtlStatus){
                    slideMove = slideWidth * index;
                }
                if (index == currentIndex) {
                    target.classList.add('active');
                }
                testimonial.classList.add("animating");
                $(stackedTestimonials).find(".testimonial__slider-item.animating ~ .testimonial__slider-item, .testimonial__slider-item.animating").css("transform", `translateX(${slideMove}px)`);
                testimonial.classList.remove("animating");
            }
        })
    }
});

function resizeVideos(selector) {
    // Find all YouTube and Vimeo videos
    var $allVideos = $(document).find("iframe[src*='www.youtube.com'], iframe[src*='player.vimeo.com']");
    if (selector) {
        $allVideos = $(document).find('#' + selector)
    }
    // Figure out and save aspect ratio for each video
    $allVideos.each(function() {
        if ($(this).hasClass('product-media') || $(this).closest('p').length > 0 || $(this).closest('.rte').length > 0 || $(this).closest('.rich-text-editor-content').length > 0 || $(this).attr('data-autoplay') == 'false') return false;
        $(this).attr('data-aspectRatio', this.height / this.width);
    });
    // When the window is resized
    $(window).resize(function() {
        // Resize all videos according to their own aspect ratio
        $allVideos.each(function() {
            if ($(this).hasClass('product-media') || $(this).closest('p').length > 0 || $(this).closest('.rte').length > 0 || $(this).closest('.rich-text-editor-content').length > 0 || $(this).attr('data-autoplay') == 'false') return false;
            let $el = $(this);
            let $parent = $el.parent();
            // Get parent width of this video
            let currentWidth = $parent.parent().width();
            let currentHeight = $parent.parent().height();
            let newHeight = currentWidth * $el.attr('data-aspectRatio');
            let newwidth = currentHeight / $el.attr('data-aspectRatio');
            if (newHeight > currentHeight) {
                $parent.width(currentWidth).height(newHeight);
            } else {
                $parent.width(newwidth).height(currentHeight);
            }
        });
        // Kick off one resize to fix all videos on page load
    }).resize();
}

window.addEventListener('resize', resizeVideos(), false)

var ytApiLoaded = false;
let yvYouTubeVideos = document.querySelectorAll(".youtubeAutoPlayVideo");
if (yvYouTubeVideos.length > 0) {
    loadYTScript()
}

function loadYTScript() {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    ytApiLoaded = true;
}
var apiloaded = null;

function initMaps(section = document) {
    let mapSelectors = section.querySelectorAll('[data-map-container]');
    Array.from(mapSelectors).forEach(function(selector) {
        createMap(selector);
    })
}

function checkMapApi(selector, section = document) {
    let mapSelectors = section.querySelectorAll('[data-map-container]');
    let mapAddress = false;
    if (selector) {
        if (selector.getAttribute('data-location') != '' || selector.getAttribute('data-location') != null) {
            mapAddress = true
        }
    }
    Array.from(mapSelectors).forEach(function(selector) {
        if (selector.getAttribute('data-location') != '' || selector.getAttribute('data-location') != null) {
            mapAddress = true
        }
    })
    if (!mapAddress) return false;
    if (selector || mapSelectors.length > 0) {
        if (apiloaded === "loaded") {
            if (selector) {
                createMap(selector);
            } else {
                initMaps(section);
            }
        } else {
            if (apiloaded !== "loading") {
                apiloaded = "loading";
                if (
                    typeof window.google === "undefined" ||
                    typeof window.google.maps === "undefined"
                ) {
                    var script = document.createElement("script");
                    script.onload = function() {
                        apiloaded = "loaded";
                        if (selector) {
                            createMap(selector);
                        } else {
                            initMaps(section);
                        }
                    };
                    script.src =
                        "https://maps.googleapis.com/maps/api/js?key=" + googleMapApiKey;
                    document.head.appendChild(script);
                }
            }
        }
    }
}


function createMap(selector) {
    var geocoder = new google.maps.Geocoder();
    var address = jQuery(selector).data("location");
    var mapStyle = jQuery(selector).data("map-style");
    geocoder.geocode({ address: address }, function(results, status) {
        if (results != null) {
            var options = {
                zoom: 17,
                backgroundColor: "none",
                center: results[0].geometry.location,
                mapTypeId: mapStyle,
            };
            var map = (this.map = new google.maps.Map(selector, options));
            var center = (this.center = map.getCenter());
            var marker = new google.maps.Marker({
                map: map,
                position: map.getCenter(),
            });
            window.addEventListener("resize", function() {
                setTimeout(function() {
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(center);
                }, 250);
            });
            let parentSection = selector.closest('.shopify-section');
            var details = parentSection.querySelectorAll('details');
            Array.from(details).forEach(function(detail) {
                detailsInit(detail,map,geocoder);
            });
        }
    });
}

async function getGeoDetails(geocoder,address){
  let getAddress = new Promise(function(resolve, reject) {
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
          // console.log(results);
          resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
      } else {
          reject(new Error('Couldnt\'t find the location ' + address));
      }
    })
  })
  return await getAddress;
}

function onYouTubeIframeAPIReady(section = document) {
    if (ytApiLoaded == false) {
        loadYTScript()
        return false;
    }
    let youTubeVideos = section.querySelectorAll(".youtubeAutoPlayVideo");
    Array.from(youTubeVideos).forEach(function(video) {
        let divId = video.getAttribute("id");
        let vidId = video.dataset.id;
        youTubeVideoReady(divId, vidId, video);
    });
}

function youTubeVideoReady(divId, vidId, video) {
    let vidAutoplay = 0;
    let vidControls = 1;
    if (video.getAttribute('data-autoplay') == 'true' || video.getAttribute('data-autoplay') == null) {
        vidAutoplay = 1;
        vidControls = 0;
    }
    let player = new YT.Player(divId, {
        videoId: vidId,
        playerVars: {
            showinfo: 0,
            controls: vidControls,
            fs: 0,
            rel: 0,
            height: "100%",
            width: "100%",
            iv_load_policy: 3,
            html5: 1,
            loop: 1,
            autoplay: vidAutoplay,
            playsinline: 1,
            modestbranding: 1,
            disablekb: 1,
            wmode: "opaque",
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

function onPlayerReady(event) {
    if (event.target.g.getAttribute('data-autoplay') == 'true' || event.target.g.getAttribute('data-autoplay') == null) {
        event.target.mute();
        event.target.playVideo();
    }
    resizeVideos(event.target.g.id)
}

function onPlayerStateChange(event) {
    if (event.target.g.getAttribute('data-autoplay') == 'true' || event.target.g.getAttribute('data-autoplay') == null) {
        if (event.data == 0) {
            event.target.playVideo();
        }
    }
}

function vimeoVideoReady(section) {
    let vimeoVideos = document.querySelectorAll(".vimeoAutoPlayVideo");
    if (section) {
        let target = section.target;
        vimeoVideos = target.querySelectorAll(".vimeoAutoPlayVideo");
    }
    Array.from(vimeoVideos).forEach(function(video) {
        fetch('https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F' + encodeURIComponent(video.dataset.id)).
        then(response => {
            if (!response.ok) {
                throw new Error("HTTP error! Status: ".concat(response.status));
            }
            return response.json();
        }).
        then(response => {
            if (response.width && response.height) {
                video.width = response.width;
                video.height = response.height;
                resizeVideos(video.id)
            }
        });
    });
}
/* Side Drawer open/close start */
function sideDrawerEventsInit(section = document) {
    let sideDrawerOpenElements = section.querySelectorAll("[data-side-drawer-open]");
    Array.from(sideDrawerOpenElements).forEach(function(element) {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            let drawerElement = element.getAttribute('href');
            let sideDrawer = document.querySelector(drawerElement);
            if (sideDrawer) {
                if (sideDrawer.classList.contains('popup')) {
                    sideDrawer.classList.add('popup--visible');
                    // sideDrawer.style.display = 'block';
                    sideDrawer.fadeIn(500)
                } else {
                    sideDrawer.classList.add('sd-sidebar--visible');
                }
                previousFocusElement = element;
                setTimeout(() => {
                    focusElementsRotation(sideDrawer);
                }, 500);
                document.querySelector('body').classList.add('no-scroll')
            }

        });
    });
    let sideDrawerCloseElements = section.querySelectorAll("[data-side-drawer-close]");
    Array.from(sideDrawerCloseElements).forEach(function(element) {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            let sideDrawer = element.closest('[data-side-drawer]');
            if (sideDrawer) {
                sideDrawer.classList.remove('sd-sidebar--visible', 'popup--visible');
                if (sideDrawer.classList.contains('popup')) {
                    sideDrawer.fadeOut(500)
                }
                if (sideDrawer.classList.contains('video-banner__placeholder')) {
                    sideDrawer.fadeOut(100)
                }
                if (!document.querySelector('body').classList.contains('menu-open')) {
                    document.querySelector('body').classList.remove('no-scroll')
                }
                if (document.querySelector('body').classList.contains('quickview-open')) {
                    document.querySelector('body').classList.remove('quickview-open')
                }
                stopFocusRotation();
                if (previousFocusElement) {
                    previousFocusElement.focus();
                }
                previousFocusElement = '';
                setTimeout(function() {
                    if (sideDrawer.classList.contains('quickview-popup')) {
                        sideDrawer.querySelector('.popup-body-inner').innerHTML = quickViewPreLoadGif;
                    }
                }, 700)
                if (sideDrawer.classList.contains('address-sidebar')) {
                    let addressForm = sideDrawer.querySelector('form');
                    if (addressForm) {
                        addressForm.reset();
                    }
                }
            }
        });
    });

    let sideDrawers = section.querySelectorAll("[data-side-drawer]");
    Array.from(sideDrawers).forEach(function(mousemovearea) {
        mousemovearea.addEventListener("mousemove", function(event) {
            if ($(window).width() > 1021) {
                let newpos = getMousePos(event);
                let positionX = newpos.x;
                let positionY = newpos.y;
                if (rtlStatus) {
                    positionX = -window.innerWidth + newpos.x;
                }
                if (mousemovearea.querySelector('[data-moving-cursor] .overlay-close')) {
                    mousemovearea.querySelector('[data-moving-cursor] .overlay-close').style.translate = `${positionX}px ${positionY}px`;
                }
            }
        })
    });

}
/* Side Drawer open/close end */

// Product recommendation start 
function productRecommendations() {
    const productRecommendationsSections = document.querySelectorAll(
        "[product-recommendations]"
    );
    Array.from(productRecommendationsSections).forEach(function(
        productRecommendationsSection
    ) {
        productRecommendationsInit(productRecommendationsSection);
    });
}

function productRecommendationsInit(productRecommendationsSection) {
    const url = productRecommendationsSection.dataset.url;

    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const html = document.createElement("div");
            html.innerHTML = text;
            const recommendations = html.querySelector("[product-recommendations]");
            if (recommendations && recommendations.innerHTML.trim().length) {
                productRecommendationsSection.innerHTML = recommendations.innerHTML;
                productRecommendationsSection.closest('.shopify-section').style.display = 'block'
                let slider = productRecommendationsSection.querySelector(
                    "[data-theme-slider]"
                );
                if (slider) {
                    let sliderId = slider.getAttribute("id");
                    if (!slider.classList.contains("flickity-enabled")) {
                        if (slider.classList.contains("data-desktop-only")) {
                            if (window.innerWidth > 767) {
                                sliderInit($("#" + sliderId));
                            }
                        } else {
                            sliderInit($("#" + sliderId));
                        }
                    }
                }
                quickViewElements(productRecommendationsSection);
                colorSwatchChanged(productRecommendationsSection);
                productGridImageSlider(productRecommendationsSection);
                getAtcElements(productRecommendationsSection);
                if (animationStatus) {
                    if (AOS) {
                        AOS.refreshHard()
                    }
                }
            }
        })
        .catch((e) => {
            console.error(e);
        });
}
document.addEventListener(
    "shopify:section:load",
    productRecommendations,
    false
);
// Product recommendation end

// Split stirng

function buttonTextSplit(selector, buttonText){ 
    selector.innerText='';
    for (let letter of buttonText) {
        let span = document.createElement('span');
        span.innerText = letter.trim() === '' ? '\xa0': letter;
        span.classList.add('char');
        selector.append(span);
    }

}
// Product options changes start
function productOptionInit(section = document) {
    let productContainers = section.querySelectorAll('[product-content-wrapper]');
    Array.from(productContainers).forEach(function(container) {
        let select = container.querySelectorAll('.selectBtn');
        let option = container.querySelectorAll('.option');
        let index = 1;

        select.forEach((a) => {
            a.addEventListener('click', (b) => {
                let next = b.target.nextElementSibling;
                next.classList.toggle('toggle');
                next.style.zIndex = index++;
            });
        });
        option.forEach((a) => {
            a.addEventListener('click', (b) => {
                b.target.parentElement.classList.remove('toggle');
                let parent = b.target.closest('.custom-select').children[0];
                parent.setAttribute('data-type', b.target.getAttribute('data-type'));
                parent.innerText = b.target.innerText;
            });
        });
        let selectIds = container.querySelectorAll('[name="id"]');
        Array.from(selectIds).forEach(function(selectId) {
            selectId.removeAttribute("disabled");
        });
        var productOptions = container.getElementsByClassName("productOption");
        if (productOptions.length > 0) {
            var options = [];
            let optionStyle = 'select';
            let eventType = "click";
            let productPageSection = container.closest(".shopify-section");
            let currentfieldsets = Array.from(container.querySelectorAll(".product-loop-variants"));
            let productDetail = '';
            if (container.querySelector('[type="application/json"][data-name="main-product"]')) {
                productDetail = JSON.parse(
                    container.querySelector(
                        '[type="application/json"][data-name="main-product"]'
                    ).textContent
                );
            }
            let productOptionsWithValues = '';
            if (container.querySelector('[type="application/json"][data-name="main-product-options"]')) {
                productOptionsWithValues = JSON.parse(
                    container.querySelector(
                        '[type="application/json"][data-name="main-product-options"]'
                    ).textContent
                );
            }
            let productvariantInventory = '';
            let variantInventory = '';
            if (container.querySelector('[type="application/json"][data-name="main-product-inventories"]')) {
                productvariantInventory = JSON.parse(
                    container.querySelector(
                        '[type="application/json"][data-name="main-product-inventories"]'
                    ).textContent
                );
            }
            if (productDetail != '' && productOptionsWithValues != '') {
                options = currentfieldsets.map((fieldset) => {
                    return Array.from(fieldset.querySelectorAll("input")).find((radio) => radio.checked).value;

                });
                var selectedVariant = getSelectedVariantData(options, "options", container, productDetail, productOptionsWithValues);
                updateOptionsAvailability(productDetail, productOptionsWithValues, selectedVariant, currentfieldsets)
                updateBackInStock(selectedVariant,container);
                let inventoryBar = container.querySelector(
                    "[data-product-inventory-bar-wrapper]"
                );
                if (inventoryBar && productvariantInventory != '') {
                    variantInventory = productvariantInventory.find((variant) => {
                        return variant.id == selectedVariant.id;
                    });
                    inventoryBar.classList.remove("hidden");
                    updateInventroyBar(
                        variantInventory.inventory_quantity,
                        variantInventory.inventory_policy,
                        selectedVariant
                    );
                }
            }
            setTimeout(() => {
                updateStickyBarOptions(container)
            }, 500);
            Array.from(productOptions).forEach(function(productOption) {
                productOption.addEventListener(eventType, () => {
                    setTimeout(() => {
                        var _productParent = productOption.closest("[product-content-wrapper]");
                        let optionValue = productOption.value;
                        let optionName = productOption.getAttribute("name");
                        let selectedOptionTextParent = productOption.closest('.product-option-selector')
                        if (selectedOptionTextParent) {
                            let selectedOptionText = selectedOptionTextParent.querySelector('[selected-option-value]')
                            if (selectedOptionText) {
                                selectedOptionText.textContent = optionValue;
                            }
                        }
                        const fieldsets = Array.from(_productParent.querySelectorAll(".product-loop-variants"));

                        options = fieldsets.map((fieldset) => {
                            return Array.from(fieldset.querySelectorAll("input")).find((radio) => radio.checked).value;
                        });
                        let optionParent = productOption.closest(".product-loop-variants")
                        if (optionParent) {
                            let prevActiveOption = optionParent.querySelector('li.variant_option.selected');
                            if (prevActiveOption) {
                                prevActiveOption.classList.remove('selected');
                            }
                            if (productOption.closest('li.variant_option')) {
                                productOption.closest('li.variant_option').classList.add('selected')
                            }
                        }
                        if (productDetail == '') {
                            return false;
                        }
                        var selectedVariant = getSelectedVariantData(options, "options", _productParent, productDetail, productOptionsWithValues);
                        updateBackInStock(selectedVariant,_productParent);
                        updateOptionsAvailability(productDetail, productOptionsWithValues, selectedVariant, fieldsets)
                        var priceContainer = _productParent.querySelector(
                            "[data-price-wrapper]"
                        );
                        var _productSection = _productParent.closest(".shopify-section");
                        updatePrice(_productSection, priceContainer, selectedVariant, true);
                        let stickyWrapper = _productSection.querySelector('.product__viewbar');
                        if (stickyWrapper) {
                            let stickyPriceWrapper = stickyWrapper.querySelector('.product-prizebox');
                            if (stickyPriceWrapper) {
                                updatePrice(_productSection, stickyPriceWrapper, selectedVariant, true);
                            }
                        }
                        pickUpAvialabiliy(_productSection, selectedVariant)

                        let variantSku = "";

                        if (selectedVariant && selectedVariant.sku) {
                            variantSku = selectedVariant.sku;
                        }
                        let errorWrappers =
                            productPageSection.querySelectorAll(".productErrors");
                        if (errorWrappers) {
                            Array.from(errorWrappers).forEach(function(errorWrapper) {
                                errorWrapper.querySelector('[data-error-text]').innerHTML = "";
                                errorWrapper.style.display = "none";
                            });
                        }
                        let variantSkuContainer = _productParent.querySelector(
                            "[data-variant-sku]"
                        );
                        if (variantSkuContainer) {
                            variantSkuContainer.innerHTML = variantSku;
                        }

                        var paymentButtonWrapper = _productParent.querySelector("[data-atc-wrapper]");
                        if (paymentButtonWrapper) {
                            var paymentButton = paymentButtonWrapper.querySelector("[data-atc-button-text]");
                        }
                        if (stickyWrapper) {
                            var stickyPaymentButtonWrapper = _productSection.querySelector("[data-sticky-atc-wrapper]");
                            if (stickyPaymentButtonWrapper) {
                                var stickypaymentButton = stickyPaymentButtonWrapper.querySelector("[data-atc-button-text]");
                            }
                        }
                        if (selectedVariant != undefined) {
                            if (_productParent.querySelector("shopify-payment-terms")) {
                                _productParent.querySelector(
                                    "shopify-payment-terms"
                                ).style.display = "block";
                            }
                            let allVariantIdInputs = _productParent.querySelectorAll('[name="id"]');
                            Array.from(allVariantIdInputs).forEach(function(variantIdInput) {
                                if (selectedVariant.id != variantIdInput.value) {
                                    variantIdInput.value = selectedVariant.id;
                                    variantIdInput.dispatchEvent(new Event("change", { bubbles: true }));
                                }
                            });
                            if (_productParent.querySelector("shopify-payment-terms")) {
                                _productParent.querySelector(
                                    "shopify-payment-terms"
                                ).style.display = "block";
                            }
                            if (productPageSection) {
                                let getStickyImage = productPageSection.closest(".shopify-section").querySelector('[data-sticky-image]');
                                if (getStickyImage) {
                                    if (selectedVariant.featured_image != null) {
                                        getStickyImage.src = selectedVariant.featured_image.src + "&width=100";
                                    }
                                }
                            }
                            updateVariantImage(selectedVariant, _productParent)
                            var baseUrl = window.location.pathname;
                            if (baseUrl.indexOf("/products/") > -1) {
                                var _updateUrl = baseUrl + "?variant=" + selectedVariant.id;
                                window.history.replaceState({}, null, _updateUrl);
                            }

                            let inventoryBar = _productParent.querySelector(
                                "[data-product-inventory-bar-wrapper]"
                            );
                            variantInventory = productvariantInventory.find((variant) => {
                                return variant.id == selectedVariant.id;
                            });
                            if (inventoryBar) {
                                inventoryBar.classList.remove("hidden");
                                updateInventroyBar(
                                    variantInventory.inventory_quantity,
                                    variantInventory.inventory_policy,
                                    selectedVariant
                                );
                            }
                            if (selectedVariant.available == true) {

                                if (paymentButtonWrapper) {
                                    paymentButtonWrapper.removeAttribute("disabled");
                                }
                                if (stickyPaymentButtonWrapper) {
                                    stickyPaymentButtonWrapper.removeAttribute("disabled");
                                }
                                if (paymentButtonWrapper && paymentButton) {
                                    if (
                                        preorderStatus &&
                                        variantInventory.inventory_policy == "continue" &&
                                        variantInventory.inventory_quantity <= 0
                                    ) {
                                        //paymentButton.innerHTML = preorderText;
                                        buttonTextSplit(paymentButton,preorderText)
                                    } else {
                                        //paymentButton.innerHTML = addToCartText;
                                        buttonTextSplit(paymentButton,addToCartText)
                                        //paymentButton.innerHTML = '<span>' + paymentButton.addToCartText.trim().split('').join('</span><span>') + '</span>'
                                    }
                                }
                                if (stickyPaymentButtonWrapper && stickypaymentButton) {
                                    if (
                                        preorderStatus &&
                                        variantInventory.inventory_policy == "continue" &&
                                        variantInventory.inventory_quantity <= 0
                                    ) {
                                        stickypaymentButton.innerHTML = preorderText;
                                    } else {
                                        buttonTextSplit(stickypaymentButton,addToCartText)
                                       // stickypaymentButton.innerHTML = addToCartText;
                                       //stickypaymentButton.innerHTML = '<span>' + stickypaymentButton.addToCartText.trim().split('').join('</span><span>') + '</span>'
                                    }
                                }

                            } else {

                                if (paymentButtonWrapper) {
                                    paymentButtonWrapper.setAttribute("disabled", true);
                                }
                                if (paymentButtonWrapper && paymentButton) {
                                    paymentButton.innerHTML = soldOutText;
                                }
                                if (stickyPaymentButtonWrapper) {
                                    stickyPaymentButtonWrapper.setAttribute("disabled", true);
                                }
                                if (stickyPaymentButtonWrapper && stickypaymentButton) {
                                    stickypaymentButton.innerHTML = soldOutText;
                                }
                            }
                        } else {
                            let inventoryBar = _productParent.querySelector(
                                "[data-product-inventory-bar-wrapper]"
                            );
                            if (inventoryBar) {
                                inventoryBar.classList.add("hidden");
                            }
                            if (_productParent.querySelector("shopify-payment-terms")) {
                                _productParent.querySelector(
                                    "shopify-payment-terms"
                                ).style.display = "none";
                            }
                            if (paymentButtonWrapper) {
                                paymentButtonWrapper.setAttribute("disabled", true);
                            }
                            if (stickyPaymentButtonWrapper) {
                                stickyPaymentButtonWrapper.setAttribute("disabled", true);
                            }
                            if (paymentButtonWrapper && paymentButton) {
                                paymentButton.innerHTML = unavailableText;
                            }
                            if (stickyPaymentButtonWrapper && stickypaymentButton) {
                                stickypaymentButton.innerHTML = unavailableText;
                            }
                        }
                        updateStickyBarOptions(container)
                    }, 100);
                });
                document.addEventListener('click', function(event) {
                    if (productOption.closest(".custom-select")) {
                        var isClickInside = productOption.closest(".custom-select").contains(event.target);
                        if (!isClickInside) {
                            productOption.parentElement.classList.remove('toggle');
                        }
                    }
                });
            
            });
        }
      
    });
}

function updateBackInStock(variant,container){
    if(container){
        let backInStockWrapper = container.querySelector('[data-back-in-stock]')
        if(backInStockWrapper){
            let backInStockVariant = container.querySelector('[data-variant-title]')
            let backInStockVariantUrl = container.querySelector('[data-variant-url]')
            if (variant != undefined) {
                let baseUrl = window.location.pathname;
                if (baseUrl.indexOf("/products/") > -1) {
                    let _updateUrl = baseUrl + "?variant=" + variant.id+"&contact_posted=true";
                    backInStockVariantUrl.value =  _updateUrl;
                }
                backInStockVariant.value = variant.name;
                if(variant.available){
                    if(!Shopify.designMode){
                        backInStockWrapper.classList.add('hidden')
                    }
                }
                else{
                    backInStockWrapper.classList.remove('hidden')
                }
            }
            else{
                if(!Shopify.designMode){
                    backInStockWrapper.classList.add('hidden')
                }
            }
        }
    }
}

function updateStickyBarOptions(container){

    if(document.querySelector("[data-sticky-products-wrapper]") && container.querySelector(".product-option-selector-box")){
            let getproductoptionsHtmls = container.querySelector(".product-option-selector-box").innerHTML;
            let optionscontainer = document.querySelector("[data-sticky-products-wrapper] .product-option-selector-box");
            let divContent = document.createElement('div');
            divContent.innerHTML = getproductoptionsHtmls;
            let optionsId = divContent.querySelectorAll(".productOption");
            Array.from(optionsId).forEach(function(option){
              let optionsId = option.getAttribute("id");
                optionsId="sticky-"+optionsId;
                option.setAttribute("id",optionsId);
                option.setAttribute("name","sticky-"+option.getAttribute("name"));
                option.removeAttribute("form");
                option.removeAttribute("checked");
                option.previousElementSibling.setAttribute("for",optionsId);
                if(option.parentElement.classList.contains('selected')){
                    option.setAttribute("checked",true);
                }
            })
            optionscontainer.innerHTML = divContent.innerHTML;
            stickyProductOptions();


    }
}

/* get variant based on selected options start */
function getSelectedVariantData(options, type, selector, allVariants, productOptions) {
    let currentVariant = allVariants.find((variant) => {
        if (type === "options") {
            return !variant.options
                .map((option, index) => {
                    return options[index] === option;
                })
                .includes(false);
        }
        if (type === "id") {
            return variant.id == options;
        }
    });
    if (!currentVariant) {
        return getFirstAvailableVariant(options, type, selector, allVariants);
    } else {
        return currentVariant;
    }
}

function getFirstAvailableVariant(options, type, selector, allVariants) {
    let availableVariant = null,
        slicedCount = 0;
    do {
        options.pop();
        slicedCount += 1;
        availableVariant = allVariants.find((variant) => {
            return variant["options"].slice(0, variant["options"].length - slicedCount).every((value, index) => value === options[index]);
        });
    } while (!availableVariant && options.length > 0);
    if (availableVariant) {
        let fieldsets = Array.from(selector.querySelectorAll(".product-loop-variants"));
        fieldsets.forEach((fieldset, index) => {
            let option = fieldset.querySelector('input[value="' + availableVariant['options'][index] + '"]')
            if (option && option.checked == false) {
                option.click();
                if (option.hasAttribute('custom-dropdown')) {
                    option.closest('.custom-select').querySelector('.selectBtn').textContent = availableVariant['options'][index]
                    option.closest('.custom-select').querySelector('.selectBtn').setAttribute('data-type', availableVariant['options'][index])
                }
            }
        });
    }
    return availableVariant;
}
function stickyProductOptions(section=document){
    let productContainers = section.querySelectorAll('[data-sticky-products-wrapper]');
    Array.from(productContainers).forEach(function(container) {
        let select = container.querySelectorAll('.selectBtn');
        let option = container.querySelectorAll('.option');
        let index = 1;
        select.forEach((a) => {
            a.addEventListener('click', (b) => {
                let next = b.target.nextElementSibling;
                next.classList.toggle('toggle');
                next.style.zIndex = index++;
            });
        });
        var stickyProductOptions = container.getElementsByClassName("productOption");
        if (stickyProductOptions.length > 0) {
            Array.from(stickyProductOptions).forEach(function(productOption) {
                productOption.addEventListener("click", () => {
                   let optionId=productOption.getAttribute("id");
                   optionId =optionId.replace(/^sticky-/, '');
                   document.querySelector("#"+optionId).click();
                })
            })

        }
    }) 
}

/* get variant based on selected options end */
const classAddToSelector = (selector, valueIndex, available, combinationExists) => {
    const optionValue = Array.from(selector.querySelectorAll(".productOption"))[valueIndex];

    if (optionValue.hasAttribute('custom-dropdown')) {
        optionValue.nextElementSibling.classList.toggle("hidden", !combinationExists);
        optionValue.nextElementSibling.classList.toggle("not-available", !available);
    } else {
        optionValue.parentElement.classList.toggle("hidden", !combinationExists);
        optionValue.classList.toggle("not-available", !available);
    }
};

function updateOptionsAvailability(product, productOptions, selectedVariant, optionSelectors) {
    if (!selectedVariant) {
        return;
    }
    if (optionSelectors && optionSelectors[0]) {
        // console.log(productOptions)
        productOptions[0]["values"].forEach((value, valueIndex) => {
            const combinationExists = product.some((variant) => variant["option1"] === value && variant),
            availableVariantExists = product.some((variant) => variant["option1"] === value && variant["available"]);
            classAddToSelector(optionSelectors[0], valueIndex, availableVariantExists, combinationExists);
            if (optionSelectors[1]) {
                productOptions[1]["values"].forEach((value2, valueIndex2) => {
                    const combinationExists2 = product.some((variant) => variant["option2"] === value2 && variant["option1"] === selectedVariant["option1"] && variant),
                        availableVariantExists2 = product.some((variant) => variant["option2"] === value2 && variant["option1"] === selectedVariant["option1"] && variant["available"]);
                    classAddToSelector(optionSelectors[1], valueIndex2, availableVariantExists2, combinationExists2);
                    if (optionSelectors[2]) {
                        productOptions[2]["values"].forEach((value3, valueIndex3) => {
                            const combinationExists3 = product.some((variant) => variant["option3"] === value3 && variant["option1"] === selectedVariant["option1"] && variant["option2"] === selectedVariant["option2"] && variant),
                                availableVariantExists3 = product.some((variant) => variant["option3"] === value3 && variant["option1"] === selectedVariant["option1"] && variant["option2"] === selectedVariant["option2"] && variant["available"]);
                            classAddToSelector(optionSelectors[2], valueIndex3, availableVariantExists3, combinationExists3);
                        });
                    }
                });
            }
        });
    }
}
/* Update inventory bar start */
function updateInventroyBar(variantQty, variantPolicy, variant) {
    let productInventoryBar = document.querySelector("[data-product-inventory-bar-wrapper]");
    if (productInventoryBar) {
        let quantity = productInventoryBar.querySelector(
            "[data-inventory-bar]"
        ).dataset.quantity;
        if (variantQty >= 0 && variantPolicy != '') {
            quantity = variantQty;
            if (
                quantity > 0 &&
                quantity <= minInventroyQty &&
                variantPolicy == "deny"
            ) {
                productInventoryBar.classList.remove("hidden");
                productInventoryBar.classList.remove("full-inventory");
                productInventoryBar.classList.add("low-inventory");
                let quantityHtml = `<strong> ${variantQty} </strong>`;
                let newStatus = invLowStatus.replace(
                    "||inventory||",
                    quantityHtml
                );
                productInventoryBar.querySelector("[data-inventory-message]").innerHTML =
                    newStatus;
                productInventoryBar
                    .querySelector("[data-inventory-bar]")
                    .classList.remove("hide-bar");
                letBarWidth = (parseInt(variantQty) * 100) / (minInventroyQty * 1.5);
                productInventoryBar
                    .querySelector("[data-inventory-bar]")
                    .setAttribute(
                        "style",
                        "--inventroyBarWidth:" + letBarWidth + "%;--inventroyBarColor:var(--error-color)"
                    );
            } else if (quantity >= 0 && variant.available == true) {
                productInventoryBar.classList.remove("hidden");
                productInventoryBar.classList.remove("low-inventory");
                productInventoryBar.classList.add("full-inventory");
                productInventoryBar.querySelector("[data-inventory-message]").innerHTML =
                    invAvailableStatus;
                productInventoryBar
                    .querySelector("[data-inventory-bar]")
                    .classList.add("hide-bar");
                productInventoryBar
                    .querySelector("[data-inventory-bar]")
                    .setAttribute("style", "--inventroyBarWidth:100%;--inventroyBarColor:var(--success-color)");

            } else {
                productInventoryBar.classList.add("hidden");
            }
            productInventoryBar
                .querySelector("[data-inventory-bar]")
                .setAttribute("data-quantity", variantQty);
        } else if (quantity && quantity > 0 && quantity <= minInventroyQty) {
            letBarWidth = (parseInt(quantity) * 100) / (minInventroyQty * 1.5);
            productInventoryBar
                .querySelector("[data-inventory-bar]")
                .setAttribute(
                    "style",
                    "--inventroyBarWidth:" + letBarWidth + "%;--inventroyBarColor:var(--error-color)"
                );
        } else {
            productInventoryBar.classList.add("hidden");
        }
    }
}
/* Update inventory bar end */
/* Update pickUp availability start */
function pickUpAvialabiliy(parentSection, variant) {
    let pickupSection = parentSection.querySelector('[data-pickup-availability]');
    let pickupContent = parentSection.querySelector('[ data-pickup-availability-content]');
    let pickupDrawer = parentSection.querySelector('[data-pickup-location-list]');
    if (pickupSection) {
        if (variant != undefined && variant.available == true) {
            var rootUrl = pickupSection.dataset.rootUrl;
            var variantId = variant.id;
            if (!rootUrl.endsWith("/")) {
                rootUrl = rootUrl + "/";
            }
            var variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

            fetch(variantSectionUrl)
                .then((response) => response.text())
                .then((text) => {
                    var pickupAvailabilityHTML = new DOMParser().parseFromString(text, "text/html").querySelector(".shopify-section");
                    let currentVariantPickupContent = pickupAvailabilityHTML.querySelector('[data-pickup-availability-content]');
                    let currentVariantPickuplist = pickupAvailabilityHTML.querySelector('[data-pickup-location-list]');
                    pickupContent.innerHTML = currentVariantPickupContent ? currentVariantPickupContent.innerHTML : '';
                    pickupDrawer.innerHTML = currentVariantPickuplist ? currentVariantPickuplist.innerHTML : '';
                    if (currentVariantPickupContent.innerHTML != '') {
                        pickupSection.setAttribute('available', '')
                    } else {
                        pickupSection.removeAttribute('available')
                    }
                    sideDrawerEventsInit(parentSection)
                })
                .catch((e) => {});
        } else {
            pickupContent.innerHTML = '';
            pickupDrawer.innerHTML = '';
            pickupSection.removeAttribute('available')
        }
    }
}
/* Update pickUp availability End */
/* Update variant image in gallery based on selected variant start */

function updateVariantImage(variant, productParent) {
    if (variant.featured_media) {
        let variantMediaId = variant.featured_media.id;
        let variantMedia = productParent.querySelector('#productMedia-' + variantMediaId);
        let mediaParent = productParent.querySelector('[data-product-main-media]');
        if (variantMedia && mediaParent) {
            if (mediaParent.classList.contains('flickity-enabled')) {
                let index = Array.from(variantMedia.parentElement.children).indexOf(variantMedia);
                let slider = Flickity.data(mediaParent)
                slider.select(index)
            } else {
                let childCount = mediaParent.children.length;
                let firstChild = mediaParent.firstChild;
                if (childCount > 1) {
                    mediaParent.insertBefore(variantMedia, firstChild)
                }
            }
        }
    }

}

/* Update variant image in gallery based on selected variant end */
/* update the price based on selected variant start */
function updatePrice(productSection, priceContainer, selectedVariant, showSaved) {
    var showSavedAmount = "";
    var savedAmountStyle = "";
    var priceHtml = "";
    if (priceContainer) {
        if (selectedVariant != undefined) {
            var compareAtPrice = parseInt(selectedVariant.compare_at_price);
            var comparePriceSelectors = priceContainer.querySelectorAll('[data-compare-price]');
            var price = parseInt(selectedVariant.price);
            var priceSelectors = priceContainer.querySelectorAll('[data-actual-price]');
            var savingPercentage = Math.round((compareAtPrice - price) * 100 / compareAtPrice) + "% " + saleOffText;
            var savingPercentageSelector = productSection.querySelectorAll('[data-price-saving]');
            var unitPriceSelectors = priceContainer.querySelectorAll('[data-unit-price]');
            var soldoutTextSelectors = priceContainer.querySelectorAll('[data-soldout-text]');
            Array.from(priceSelectors).forEach(function(priceSelector){
                priceSelector.innerHTML = Shopify.formatMoney(price, moneyFormat);
            })

            Array.from(comparePriceSelectors).forEach(function(comparePriceSelector){
            if (compareAtPrice > price) {
                if (comparePriceSelector) {
                    comparePriceSelector.innerHTML = Shopify.formatMoney(compareAtPrice, moneyFormat);
                    comparePriceSelector.classList.remove('hidden');
                    Array.from(savingPercentageSelector).forEach(function(spSelector) {
                        spSelector.innerHTML = savingPercentage;
                        spSelector.classList.remove('hidden');
                    })
                }
            } else {
                comparePriceSelector.innerHTML = Shopify.formatMoney(compareAtPrice, moneyFormat);
                comparePriceSelector.classList.add('hidden');
                Array.from(savingPercentageSelector).forEach(function(spSelector) {
                    spSelector.innerHTML = savingPercentage;
                    spSelector.classList.add('hidden');
                })
            }
        })

        Array.from(unitPriceSelectors).forEach(function(unitPriceSelector){
            if (unitPriceSelector) {
                if (selectedVariant.unit_price_measurement) {
                    var unitpriceText = Shopify.formatMoney(selectedVariant.unit_price, moneyFormat) + " / ";
                    unitpriceText +=
                        selectedVariant.reference_value == 1 ? "" : selectedVariant.unit_price_measurement.reference_value;
                    unitpriceText += selectedVariant.unit_price_measurement.reference_unit + "</p>";
                    unitPriceSelector.innerHTML = unitpriceText;
                    unitPriceSelector.classList.remove('hidden');
                } else {
                    unitPriceSelector.classList.add('hidden');
                }
            }
            Array.from(soldoutTextSelectors).forEach(function(soldoutTextSelector){
            if (soldoutTextSelector) {
                if (selectedVariant.available != true) {
                    soldoutTextSelector.innerHTML = soldOutText;
                } else {
                    soldoutTextSelector.innerHTML = '';
                }
            }
            })
        })
    }
    }
}
/* update the price based on selected variant end */


/* update the price based on selected variant end */
function productGiftOptions(section = document) {
    let giftCardWrappers = section.querySelectorAll('[data-gift-card-box]');
    Array.from(giftCardWrappers).forEach(function(giftCard) {
        let jsCheck = giftCard.querySelector('[data-js-gift-card-selector]')
        if (jsCheck) {
            jsCheck.disabled = false;
            jsCheck.addEventListener('click', function() {
                let giftCardContent = giftCard.querySelector('[data-gift-card-content]');
                if (jsCheck.checked) {
                    DOMAnimations.slideDown(giftCardContent, 500);
                } else {
                    DOMAnimations.slideUp(giftCardContent, 500);
                    let formErrorWrapper = giftCard.querySelector('.form-message__wrapper');
                    if (formErrorWrapper) {
                        formErrorWrapper.classList.add('hidden')
                        let formErrorMessage = formErrorWrapper.querySelector('.error-message');
                        if (formErrorMessage) {
                            formErrorMessage.innerHTML = '';
                        }
                    }
                }
            })
        }
        let noJsCheck = giftCard.querySelector('[data-no-js-gift-card-selector]')
        if (noJsCheck) {
            noJsCheck.disabled = true;
        }

    })

}

// Product options changes end
/* Quick view start */
function quickViewElements(section = document) {
    let quickviewElements = section.querySelectorAll(".quickView-action-link");
    Array.from(quickviewElements).forEach(function(element) {
        initQuickViewAction(element);
    });
}

function initQuickViewAction(element) {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        var _url = element.getAttribute("href");
        if (_url.indexOf("?") > -1) {
            _url = _url.split("?");
            _url = _url[0];
        }
        var productUrl = _url + '?section_id=product-quick-view';
        element.classList.add('disabled')
        let popContainer = document.querySelector('.quickview-popup');
        document.querySelector('body').classList.add('quickview-open')
        popContainer.querySelector('.popup-body-inner').innerHTML = quickViewPreLoadGif;
        setTimeout(function() {
            if (window.innerWidth > 767) {
                document.querySelector('.quickview-popup').classList.add('popup--visible')
                document.querySelector('.quickview-popup').fadeIn(500)
                document.querySelector('body').classList.add('no-scroll')
            } else {
                document.querySelector('.quickview-popup').fadeIn(100)
                setTimeout(() => {
                    document.querySelector('.quickview-popup').classList.add('popup--visible')
                    document.querySelector('body').classList.add('no-scroll')
                }, 150);
            }
            element.classList.remove('disabled')
        }, 500)
        fetch(productUrl)
            .then((response) => response.text())
            .then((text) => {
                var sectionInnerHTML = new DOMParser()
                    .parseFromString(text, "text/html")
                    .querySelector(".shopify-section");
                if (popContainer) {
                    setTimeout(function() {
                        // document.querySelector('body').classList.add('quickview-open')
                        popContainer.querySelector('.popup-body-inner').innerHTML = sectionInnerHTML.innerHTML;
                        setTimeout(function() {
                            let quickViewHeader = popContainer.querySelector('.quickview__header');
                            let quickViewDetail = popContainer.querySelector('.quickview-popup__detail.sticky-item');
                            previousFocusElement = element.closest('[data-product-grid]').querySelector('a.product-title');
                            focusElementsRotation(popContainer);
                            if (quickViewHeader && quickViewDetail) {
                                quickViewDetail.style.top = quickViewHeader.clientHeight + 'px'
                            }
                            element.classList.remove('disabled')
                            marqueeTextAutoplay(popContainer)
                            if (Shopify.PaymentButton) {
                                Shopify.PaymentButton.init();
                            }
                            productOptionInit()
                            getAtcElements(popContainer);
                            getQuantityElement(popContainer);
                            productMedia3dModel(popContainer);
                            cartNoteDrawerInt(popContainer);
                            productMediaClose(popContainer);
                        }, 500)
                    }, 1000)
                }
            })
            .catch((e) => {});
    });
}

/* Quick view end */
/* Quantity change start */
function getQuantityElement(section = document) {
    let quantityElements = section.querySelectorAll("[data-quantity-wrapper]");
    Array.from(quantityElements).forEach(function(element) {
        initQuantityAction(element);
    });
}

function initQuantityAction(element) {
    let quantityInput = element.querySelector('[data-quantity-input]')
    let quantityIncrement = element.querySelector('[data-quantity-increment]')
    let quantityDecrement = element.querySelector('[data-quantity-decrement]')
    quantityInput.onkeydown = function(e) {
        if (!((e.keyCode > 95 && e.keyCode < 106) ||
                (e.keyCode > 47 && e.keyCode < 58) ||
                e.keyCode == 8 ||
                e.keyCode == 9 ||
                (e.keyCode > 36 && e.keyCode < 41))) {
            // return false;
        }
    }
    if (quantityInput.classList.contains('ajax-cart-update')) {
        quantityInput.addEventListener('change', (event) => {
            setTimeout(function() {
                let currentValue = parseInt(quantityInput.value);
                let section = quantityInput.closest('[data-cart-wrapper]');
                quantityInput.closest('[data-cart-item]').classList.add('disabled')
                let line = quantityInput.dataset.line;
                changeCartItem(line, currentValue, section, quantityInput.closest('[data-cart-item]'))
            }, 500)
        });

    }
    quantityIncrement.addEventListener('click', (event) => {
        event.preventDefault();
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
        if (quantityInput.classList.contains('ajax-cart-update')) {
            quantityUpdate(quantityInput)
        }
    });
    quantityDecrement.addEventListener('click', (event) => {
        event.preventDefault();
        let currentValue = parseInt(quantityInput.value);
        let updatedValue = currentValue - 1;
        if (updatedValue > 0) {
            quantityInput.value = updatedValue;
        }
        if (quantityDecrement.classList.contains('ajax-cart-update')) {
            quantityInput.value = updatedValue;
            quantityUpdate(quantityInput)
        }
    });
}

/* Quantity change start */
function quantityUpdate(quantityInput) {
    let section = quantityInput.closest('[data-cart-wrapper]');
    quantityInput.closest('[data-cart-item]').classList.add('disabled')
    let qty = parseInt(quantityInput.value);
    let line = quantityInput.dataset.line;
    changeCartItem(line, qty, section, quantityInput.closest('[data-cart-item]'))
}

/* Cart start */
/* Cart change item event start */

changeCartItem = function(line, quantity, section, cartItem) {
    let sectionId = section.dataset.section;
    let allErrorSelectors = section.querySelectorAll('.cart-item-error');
    Array.from(allErrorSelectors).forEach(function(errorSelector) {
        errorSelector.querySelector('[data-error-text]').innerHTML = cart.message;
        errorSelector.style.display = 'none';
    })
    const body = JSON.stringify({
        line,
        quantity,
        sections: [sectionId]
    });
    fetch(cartChangeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
            body
        })
        .then((response) => {
            return response.text();
        })
        .then((state) => {
            const cart = JSON.parse(state);
            if (cart.status) {
                if (cartItem.querySelector('.cart-item-error')) {
                    let quantityWrappers = cartItem.querySelectorAll('.quantity-input');
                    cartItem.querySelector('[data-error-text]').innerHTML = cart.message;
                    cartItem.querySelector('.cart-item-error').style.display = 'block';
                    Array.from(quantityWrappers).forEach(function(quantity) {
                        quantity.value = quantity.getAttribute('data-previous-value')
                    })
                    cartItem.classList.remove('disabled')
                }
                return false;
            }
            let itemCountWrapper = section.querySelector('[data-cart-item-count]')
            if (itemCountWrapper) {
                itemCountWrapper.innerHTML = "(" + cart.item_count + ")";
            }
            // if (cart.item_count > 0) {
            // }
            cartCountUpdate(cart.item_count);

            if (cart.sections) {
                cartContentUpdate(cart, section, sectionId)
            }
            // cartNoteDrawerInt(section);

        })
};
/* Cart change item event end */

/* Cart items update event start */
cartContentUpdate = function(cart, section, sectionId) {
        let updatedCartHtml = new DOMParser().parseFromString(cart.sections[sectionId], 'text/html');
        if (cart.item_count > 0 || cart.quantity > 0) {
            section.querySelector('[data-cart-form]').innerHTML = updatedCartHtml.querySelector('[data-cart-form]').innerHTML;
            section.querySelector('[data-cart-prices]').innerHTML = updatedCartHtml.querySelector('[data-cart-prices]').innerHTML;
            if(updatedCartHtml.querySelector('[data-gift-wrap]')){
                section.querySelector('[data-gift-wrap]').innerHTML = updatedCartHtml.querySelector('[data-gift-wrap]').innerHTML;
            }
            if(updatedCartHtml.querySelector('[data-free-shipping-container]')){
                section.querySelector('[data-free-shipping-container]').innerHTML = updatedCartHtml.querySelector('[data-free-shipping-container]').innerHTML;
            }
            if (section.querySelector('[data-cart-note-wrapper]')) {
                section.querySelector('[data-cart-note-wrapper]').innerHTML = updatedCartHtml.querySelector('[data-cart-note-wrapper]').innerHTML;
            }
            if (sectionId == 'ajax-cart') {
                section.querySelector('[data-cart-total-price]').innerHTML = updatedCartHtml.querySelector('[data-cart-total-price]').innerHTML;
            }
            getQuantityElement(section);
            getCartItemRemoveElements(section);
            cartNoteDrawerInt(section);
            cartNoteUpdate();
        } else {
            section.innerHTML = updatedCartHtml.querySelector('[data-cart-wrapper]').innerHTML;
            if (sectionId == 'ajax-cart') {
                section.classList.add('empty-mini-cart')
            }
        }

    }
    /* Cart items update event end */

/* Cart item remove start */
function getCartItemRemoveElements(section = document) {
    let cartItemRemoveElements = section.querySelectorAll("[data-cart-item-remove]");
    Array.from(cartItemRemoveElements).forEach(function(element) {
        initCartItemRemove(element);
    });
}

function cartCountUpdate(itemCount) {
    let cartCountSelectors = document.querySelectorAll('[data-header-cart-count]')
    Array.from(cartCountSelectors).forEach(function(cartCountSelector) {
        if (itemCount > 0) {
            if (itemCount > 99) {
                cartCountSelector.textContent = ''
            } else {
                cartCountSelector.textContent = itemCount
            }
            cartCountSelector.classList.remove('hidden')
        } else {
            cartCountSelector.textContent = ''
            cartCountSelector.classList.add('hidden')
        }
    })
}

function initCartItemRemove(element) {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        let section = element.closest('[data-cart-wrapper]');
        element.closest('[data-cart-item]').classList.add('disabled')
        let line = element.dataset.line;
        changeCartItem(line, 0, section, element.closest('[data-cart-item]'));

    });

}
/* Cart item remove end */
/* Cart item add start */
function getAtcElements(section = document) {
    let cartAtcElements = section.querySelectorAll("[data-add-to-cart]");
    Array.from(cartAtcElements).forEach(function(element) {
        initATC(element);
    });
    let cartDrawerCloseElements = section.querySelectorAll("[data-cart-drawer-close]");
    Array.from(cartDrawerCloseElements).forEach(function(element) {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            let cartDrawer = element.closest('[data-cart-drawer]');
            cartDrawer.classList.remove('sd-sidebar--visible');
            document.querySelector('body').classList.remove('no-scroll');
        });
    });


}

function initATC(element) {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        let form = element.closest('form');
        element.classList.add('loading');
        let formParent = element.closest('.shopify-section');
        if (!form) {
            let productFrom = formParent.querySelector('.main-product-form');
            if (productFrom) {
                let atcButton = productFrom.querySelector("[data-add-to-cart]");
                if (atcButton) {
                    previousFocusElement = element;
                    atcButton.click();
                }
            }
            return false;
        }
        if (formParent.querySelector('.productErrors')) {
            formParent.querySelector('.productErrors').style.display = 'none';
            formParent.querySelector('[data-error-text]').innerHTML = '';
        }
        let giftCardWrapper = formParent.querySelector('[data-gift-card-box]');
        if (giftCardWrapper) {
            let errormessageWrapper = giftCardWrapper.querySelector('[data-gift-card-errors]');
            let errorMessage = errormessageWrapper.querySelector('.error-message')
            errormessageWrapper.classList.add('hidden')
            errorMessage.innerHTML = '';
            // giftCardErrors
        }
        addItemToCart(formParent, form, element);
        cartNoteDrawerInt();
    });
}

function addItemToCart(formParent, form, element) {
    const config = {
        method: 'POST',
        headers: {
            'X-Requested-With': `XMLHttpRequest`,
            'Accept': `application/javascript`
        }
    };
    const formData = new FormData(form);
    let sectionId = 'ajax-cart';
    let section = '';
    var baseUrl = window.location.pathname;
    if (baseUrl.indexOf("/cart") > -1) {
        let cartSection = document.querySelector('[data-cart-wrapper]');
        section = cartSection;
        if (cartSection) {
            sectionId = cartSection.dataset.section;
        }
    }
    config.body = formData;
    formData.append('sections', [sectionId]);
    fetch(cartAddUrl, config)
        .then((response) => {
            return response.text();
        })
        .then((state) => {
            const cart = JSON.parse(state);
            setTimeout(() => {
                element.classList.remove('loading');
                let stickyATC = formParent.querySelector('[data-sticky-atc-wrapper]');
                if (stickyATC) {
                    stickyATC.classList.remove('loading');
                }
            }, 100);

            if (cart.status) {
                if (cart.errors) {
                    let giftCardWrapper = formParent.querySelector('[data-gift-card-box]');
                    if (giftCardWrapper && cart.errors['email']) {
                        let errormessageWrapper = giftCardWrapper.querySelector('[data-gift-card-errors]');
                        let giftCardEmail = formParent.querySelector('[type=email]');
                        let errorMessage = errormessageWrapper.querySelector('.error-message')
                        errorMessage.innerHTML = giftCardEmail.dataset.attr + ' ' + cart.errors['email'];
                        errormessageWrapper.classList.remove('hidden')
                            // giftCardErrors
                    }
                } else if (formParent.querySelector('.productErrors')) {
                    formParent.querySelector('[data-error-text]').innerHTML = cart.description;
                    formParent.querySelector('.productErrors').style.display = 'block';
                    if (isOnScreen(formParent.querySelector('.productErrors'))) {
                        return false;
                    }
                    var scrollDiv = document.querySelector('.productErrors').offsetTop;
                    window.scrollTo({ top: scrollDiv, behavior: 'smooth' });
                }
                return false;
            }
            let updatedCartHtml = new DOMParser().parseFromString(cart.sections[sectionId], 'text/html').querySelector('.shopify-section');
            let updatedCartContent = updatedCartHtml.querySelector('[data-cart-wrapper]');
            if (baseUrl.indexOf("/cart") > -1) {
                // if (cart.item_count > 0) {
                // }
                let cartCount = parseInt(updatedCartContent.getAttribute('data-item-count'))
                cartCountUpdate(cartCount);
                section.innerHTML = updatedCartHtml.innerHTML;
                setTimeout(() => {
                    if (cartCount > 0) {
                        getQuantityElement(section);
                        getCartItemRemoveElements(section);
                    }
                }, 500);
                var scrollDiv = section.offsetTop;
                window.scrollTo({ top: scrollDiv, behavior: 'smooth' });
            } else {
                let cartDrawer = document.querySelector('[data-cart-drawer]');
                let cartItemCount = parseInt(updatedCartContent.getAttribute('data-item-count'))
                if (cartDrawer) {
                    if (formParent.classList.contains('quickview-popup__content')) {
                        document.querySelector('.quickview-popup').classList.remove('popup--visible')
                        document.querySelector('body').classList.remove('quickview-open')
                        document.querySelector('.quickview-popup').style.display = 'none'
                    }
                    let cartbody = cartDrawer.querySelector('[data-cart-drawer-body]');
                    cartbody.innerHTML = updatedCartHtml.innerHTML;
                    if (document.querySelector('[data-header-cart-count]')) {
                        document.querySelector('[data-header-cart-count]').innerHTML = cartItemCount;
                    }
                    document.querySelector('body').classList.add('no-scroll')
                    cartDrawer.classList.add('sd-sidebar--visible');
                    if (previousFocusElement == '') {
                        previousFocusElement = element;
                    }
                    setTimeout(() => {
                        focusElementsRotation(document.querySelector('[data-cart-drawer]'));
                    }, 500);
                    if (cartItemCount > 0) {
                        getQuantityElement(cartDrawer);
                        getCartItemRemoveElements(cartDrawer);
                    }
                    cartCountUpdate(cartItemCount);
                    cartNoteDrawerInt(cartDrawer);
                    cartNoteUpdate();
                }
            }
        })
}
/* Cart item add end */
/* Cart note update start*/
function cartNoteUpdate() {
    let cartNoteElements = document.querySelectorAll('[data-cart-note]')
    var cartNoteTyping;
    Array.from(cartNoteElements).forEach(function(element) {
        element.addEventListener('keydown', (event) => {
            clearTimeout(cartNoteTyping);
        });
        element.addEventListener('keyup', (event) => {
            clearTimeout(cartNoteTyping);
            cartNoteTyping = setTimeout(function() {
                const body = JSON.stringify({
                    note: element.value
                });
                fetch(cartUpdateUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
                        body
                    })
                    .then((response) => {
                        return response.text();
                    })
            }, 1000);
        });
    })
}

/* cart note open */
function cartNoteDrawerInt(section = document) {
    let cartNoteHead = section.querySelectorAll(".leave-order-note");
    Array.from(cartNoteHead).forEach(function(element) {
        element.querySelector(".order-Note").addEventListener("click", (event) => {
            if (element.classList.contains('active')) {
                element.classList.remove("active");
                setTimeout(() => {
                    element.querySelector(".order-note-content").style.display = 'none';
                    focusElementsRotation(element.closest("[data-cart-drawer]"));
                    element.querySelector(".order-Note").focus();
                }, 500);
            } else {
                element.querySelector(".order-note-content").style.display = 'block';
                setTimeout(() => {
                    element.classList.add("active");
                    focusElementsRotation(element.querySelector(".order-note-content"));
                }, 100);
            }
        });
        document.addEventListener("click", (event) => {
            if (!element.contains(event.target) && !event.target.classList.contains('quantity-input')) {
                element.classList.remove('active');
                setTimeout(() => {
                    element.querySelector(".order-note-content").style.display = 'none';
                    focusElementsRotation(element.closest("[data-cart-drawer]"));
                }, 500);
            }
        });

        element.querySelector("[data-note-close]").addEventListener("click", (event) => {
            event.preventDefault();
            if (element.classList.contains('active')) {
                element.classList.remove("active");
                setTimeout(() => {
                    element.querySelector(".order-note-content").style.display = 'none';
                    focusElementsRotation(element.closest("[data-cart-drawer]"));
                    element.querySelector(".order-Note").focus();
                }, 500);
            }
        });

    });

}

/* cart note end */
/* hamburger nemu for mobile header */
function menuHamburgerEventInt() {
    let hamburgerElements = document.querySelectorAll('[data-mobile-hamburger]');
    let bodyElement = document.querySelector('body');
    let mainheader = document.querySelector('header');
    let stickyElement = 'false';
    if (mainheader && mainheader.hasAttribute("data-header-sticky")) {
        stickyElement = mainheader.getAttribute("data-header-sticky")
    }
    Array.from(hamburgerElements).forEach(function(hamburgerElement) {
        hamburgerElement.addEventListener("click", function(event) {
            event.preventDefault();
            let timeout = 10;
            if (hamburgerElement.classList.contains('mobile-dock-link') && document.querySelector('header').classList.contains('sticky-header-hidden')) {
                timeout = 850
                document.querySelector('header').classList.remove('sticky-header-hidden')
            }
            if (hamburgerElement.classList.contains('mobile-dock-link') && stickyElement == 'false') {
                document.querySelector('.header').classList.add("sticky");
                document.querySelector('body').classList.add('sticky-header');
            }
            setTimeout(() => {
                let navBarElements = document.querySelectorAll(".dropdown"),
                    menubarElement = document.querySelector('[data-menu-items]');
                if (bodyElement.classList.contains('menu-open')) {
                    bodyElement.classList.remove('no-scroll', 'menu-open');
                    menubarElement.classList.remove('menu-sidebar-visible');
                    Array.from(navBarElements).forEach(function(navbarElement) {
                        if (navbarElement.classList.contains('active')) {
                            navbarElement.classList.remove('active');
                        }
                    })
                    if (stickyElement == 'false') {
                        document.querySelector('.header').classList.remove("sticky");
                        document.querySelector('body').classList.remove('sticky-header');
                    }
                } else {
                    bodyElement.classList.add('no-scroll', 'menu-open');
                    menubarElement.classList.add('menu-sidebar-visible');
                }

            }, timeout);
        })
        window.addEventListener("resize", function() {
            if (window.innerWidth > 991 && bodyElement.classList.contains('menu-open')) {
                bodyElement.classList.remove('menu-open', 'no-scroll');
                document.querySelector('[data-menu-items]').classList.remove('menu-sidebar-visible');
            }
        })
    })

}
document.addEventListener("shopify:section:load", menuHamburgerEventInt, false);

function dropdownMenuItems() {
    let navBarElements = document.querySelectorAll(".menu-dropdwon");
    let navBarbackElemets = document.querySelectorAll("[data-menu-navbarback]");
    Array.from(navBarElements).forEach(function(navBarElement) {
        navBarElement.parentElement.classList.remove('active');
        navBarElement.addEventListener("click", function(event) {
            event.target.parentElement.classList.add('active');
        })
    })
    Array.from(navBarbackElemets).forEach(function(navBarbackElement) {
        navBarbackElement.addEventListener("click", function(event) {
            event.target.closest('.dropdown.active').classList.remove('active');
        })
    })

}
document.addEventListener("shopify:section:load", dropdownMenuItems, false);

function colorSwatchChanged(section = document) {
    let gridSwatchTriggers = section.querySelectorAll("[grid-color-option]");
    Array.from(gridSwatchTriggers).forEach(function(element) {
        element.addEventListener("mouseover", function(event) {
            let productGrid = element.closest('[data-product-grid]');
            let gridMainImage = productGrid.querySelector('[data-main-image]')
            let gridOtherImage = productGrid.querySelector('[data-more-images]')
            let gridSliderNav = productGrid.querySelector('[data-slider-nav]')
            let moreImageElement = element.querySelector('script');
            if (moreImageElement) {
                let moreImageWrapper = new DOMParser()
                    .parseFromString(JSON.parse(moreImageElement.textContent), "text/html")
                let colorMainImage = moreImageWrapper.querySelector('[data-color-main-image]');
                let colorMoreImage = moreImageWrapper.querySelector('[data-color-more-images]');
                let colorSliderNav = moreImageWrapper.querySelector('[data-slider-nav]')
                if (colorMainImage && gridMainImage) {
                    gridMainImage.innerHTML = colorMainImage.innerHTML
                }
                if (colorMoreImage && gridOtherImage) {
                    gridOtherImage.innerHTML = colorMoreImage.innerHTML
                }
                if (colorSliderNav && gridSliderNav) {
                    gridSliderNav.innerHTML = colorSliderNav.innerHTML
                }
                productGridImageSlider(productGrid)
            }
        })
        element.addEventListener("click", function(event) {
            let url = element.getAttribute('data-url');
            if (url) {
                let finalUrl = window.location.origin + url;
                window.location.href = finalUrl
            }
        })
    })

}

function __marqueeScrollBar(selector) {
    var marqueeElement = selector;
    var marqueeParent = marqueeElement.closest('.shopify-section');
    var position = marqueeParent.getBoundingClientRect();
    var elementPosition = marqueeElement.getBoundingClientRect();
    var Elewidth = position.width;
    if (isOnScreen(marqueeParent)) {

        let speed = parseInt(marqueeElement.getAttribute('data-marquee-speed'))
        if (window.innerWidth < 768 && marqueeElement.hasAttribute('data-marquee-speed-mobile')) {
            speed = parseInt(marqueeElement.getAttribute("data-marquee-speed-mobile"));
        }
        if (marqueeElement.classList.contains('rtl-direction')) {
            var marqueepsoition = -(Elewidth / 2) + elementPosition.top;
            marqueeElement.style.transform = `translate3d(${(marqueepsoition / speed) * 10}px, 0px, 0px)`;
        } else {
            var marqueepsoition = (Elewidth / 2) - elementPosition.top;
            marqueeElement.style.transform = `translate3d(${marqueepsoition / speed * 10}px, 0px, 0px)`;
        }
    }
}

function marqueeTextScroll(section = document) {
    let marqueeElements = section.querySelectorAll('[data-marquee-on-scroll]');
    Array.from(marqueeElements).forEach((element) => {
        window.addEventListener('scroll', function() {
            __marqueeScrollBar(element);
        });
    });
}

function marqueeTextAutoplay(section = document) {
    let marqueeElements = section.querySelectorAll('[data-marquee-text]');
    Array.from(marqueeElements).forEach((element) => {
        if (!element.querySelector("[data-marque-node]")) return false;
        let resizedMobile = false;
        let resizedDesktop = false;
        marqueeTextAutoplayInit(element)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767 && resizedDesktop == false) {
                marqueeTextAutoplayInit(element)
                resizedDesktop = true;
                resizedMobile = false;
            } else if (window.innerWidth < 768 && resizedMobile == false) {
                marqueeTextAutoplayInit(element)
                resizedMobile = true;
                resizedDesktop = true;
            }
        });
    });
}

function marqueeTextAutoplayInit(element) {
    let scrollingSpeed = parseInt(element.getAttribute("data-marquee-speed") || 15);
    if (window.innerWidth < 768 && element.hasAttribute('data-marquee-speed-mobile')) {
        scrollingSpeed = parseInt(element.getAttribute("data-marquee-speed-mobile"));
    }
    const contentWidth = element.clientWidth,
        node = element.querySelector("[data-marque-node]"),
        nodeWidth = node.clientWidth;
    // windowWidth = window.innerWidth;
    let slowFactor = 1 + (Math.max(1600, contentWidth) - 375) / (1600 - 375);
    element.parentElement.style.setProperty("--animation-speed", `${(scrollingSpeed * slowFactor * nodeWidth / contentWidth).toFixed(3)}s`);

}


/* Product Media 3D model start */
var productMediaModel = {
    loadShopifyXR() {
        Shopify.loadFeatures([{
                name: 'shopify-xr',
                version: '1.0',
                onLoad: this.setupShopifyXR.bind(this),
            },
            {
                name: 'model-viewer-ui',
                version: '1.0',
                onLoad: (function() {
                    document.querySelectorAll('.product-model-item').forEach((model) => {
                        let model3D = model.querySelector('model-viewer')
                        model.modelViewerUI = new Shopify.ModelViewerUI(model3D);
                        model3D.addEventListener('shopify_model_viewer_ui_toggle_play', function(evt) {
                            model.querySelectorAll('.close-product-model').forEach(el => {
                                el.classList.remove('hidden');
                            });
                            let productSliderParent = model.closest('[data-product-main-media]');
                            if (productSliderParent && productSliderParent.classList.contains('flickity-enabled')) {
                                let productSlider = Flickity.data(productSliderParent)
                                productSlider.options.draggable = false;
                                productSlider.updateDraggable();
                            }
                        }.bind(this));

                        model3D.addEventListener('shopify_model_viewer_ui_toggle_pause', function(evt) {
                            model.querySelectorAll('.close-product-model').forEach(el => {
                                el.classList.add('hidden');
                            });
                            let productSliderParent = model.closest('[data-product-main-media]');
                            if (productSliderParent && productSliderParent.classList.contains('flickity-enabled')) {
                                let productSlider = Flickity.data(productSliderParent)
                                productSlider.options.draggable = true;
                                productSlider.updateDraggable();
                            }
                        }.bind(this));

                        model.querySelectorAll('.close-product-model').forEach(el => {
                            el.addEventListener('click', function() {
                                if (model3D) {
                                    model.modelViewerUI.pause();
                                }
                            }.bind(this))
                        });

                    });

                })
            }
        ]);
    },

    setupShopifyXR(errors) {
        if (!errors) {
            if (!window.ShopifyXR) {
                document.addEventListener('shopify_xr_initialized', () =>
                    this.setupShopifyXR()
                );
                return;
            }
            document.querySelectorAll('[id^="product3DModel-"]').forEach((model) => {
                window.ShopifyXR.addModels(JSON.parse(model.textContent));
            });
            window.ShopifyXR.setupXRElements();
        }
    },
};

function productMedia3dModel(section = document) {
    let productModel = section.querySelectorAll('[id^="product3DModel-"]');
    if (productMediaModel && productModel.length > 0) {
        productMediaModel.loadShopifyXR();
    }
}

function productGridImageSlider(section = document) {
    let gridSlides = section.querySelectorAll('[data-grid-slide-change]');
    let gridPrevNextNavButtons = section.querySelectorAll('[ data-prev-next-slide]');
    Array.from(gridSlides).forEach((slide) => {
        slide.addEventListener("click", (event) => {
            let slideId = slide.dataset.index;
            let productGrid = slide.closest('[data-product-grid]');
            let productGridSlideNavs = productGrid.querySelectorAll('[data-grid-slide-change]');
            let prevArrow = productGrid.querySelector('[data-prev-slide]')
            let nextArrow = productGrid.querySelector('[data-next-slide]')
            let activeSlide = productGrid.querySelector('#' + slideId);
            if (activeSlide) {
                let allSlides = productGrid.querySelectorAll('.product-slider__item');
                Array.from(allSlides).forEach((otherSlide) => {
                    otherSlide.style.display = 'none';
                });
                Array.from(productGridSlideNavs).forEach((element) => {
                    if (element != slide) {
                        element.classList.remove('active');
                    }
                });
                activeSlide.style.display = 'block';
                slide.classList.add('active');
                let previousNav = slide.previousElementSibling;
                let nextNav = slide.nextElementSibling;
                if (previousNav) {
                    if (previousNav.hasAttribute('data-prev-slide')) {
                        prevArrow.classList.add('disabled')
                    } else {
                        prevArrow.classList.remove('disabled')
                    }
                }
                if (nextNav) {
                    if (nextNav.hasAttribute('data-next-slide')) {
                        nextArrow.classList.add('disabled')
                    } else {
                        nextArrow.classList.remove('disabled')
                    }
                }
            }
        });
    });
    Array.from(gridPrevNextNavButtons).forEach((Element) => {
        Element.addEventListener("click", (event) => {
            event.preventDefault();
            if (Element.classList.contains('disabled')) return false;
            let navParent = Element.closest('[data-slider-nav]')
            let activeNav = navParent.querySelector('[data-grid-slide-change].active');
            let allNav = navParent.querySelectorAll('[data-grid-slide-change]');
            let nextNav = activeNav.nextElementSibling;
            let prevNav = activeNav.previousElementSibling;
            if (activeNav) {
                if (Element.hasAttribute('data-prev-slide')) {
                    if (!(prevNav.hasAttribute('data-prev-slide'))) {
                        prevNav.click();
                    } else {
                        allNav[allNav.length - 1].click()
                    }
                } else if (Element.hasAttribute('data-next-slide')) {
                    if (!(nextNav.hasAttribute('data-next-slide'))) {
                        nextNav.click();
                    } else {
                        allNav[0].click()
                    }
                }
            }
        });
    });
}

function isElementVisible(el, Width, Height) {
    var rect = el.getBoundingClientRect(),
        vWidth = Width || doc.documentElement.clientWidth,
        vHeight = Height || doc.documentElement.clientHeight,
        efp = function(x, y) { return document.elementFromPoint(x, y) };

    // Return false if it's not in the viewport
    if (rect.right < 0 || rect.bottom < 0 ||
        rect.left > vWidth || rect.top > vHeight)
        return false;

    // Return true if any of its four corners are visible
    return (
        el.contains(efp(rect.left, rect.top)) ||
        el.contains(efp(rect.right, rect.top)) ||
        el.contains(efp(rect.right, rect.bottom)) ||
        el.contains(efp(rect.left, rect.bottom))
    );
}

function debounce(func) {
    var timer;
    return function(event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 1000, event);
    };
}
const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return partiallyVisible ?
            ((top > 0 && top < innerHeight) ||
                (bottom > 0 && bottom < innerHeight)) &&
            ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth)) :
            top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    }
    //Collection Carousel 
function collectionCarousel(section = document) {
    var winScrollTop = $(window).scrollTop();
    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;
    var sceneClass = 'featured-collection-list__outer';
    var sceneActiveClass = sceneClass + '--active';
    var sceneEndedClass = sceneClass + '--ended';
    var $horizontalScrollSections = $('.featured-collection-list-section');
    var mainSelectors = section.querySelectorAll(".horizontal-scroll-section");
    var mainsection = '';
    var outerbox = ''
    var elementHalfWidth = (winWidth / 2);
    if (winWidth > 1024) {
        $horizontalScrollSections.each(function(i, el) {
            if ($(this).find(".horizontal-scroll-section").get(0).hasAttribute('data-collection-selector')) {
                mainsection = $(this);
                mainsection.data('elDomcont', mainsection.get(0));
                outerbox = $(this).find(".featured-collection-scroll-outerbox");
                outerbox.data('elDom', outerbox.get(0));
                setUpHorizontalScroll(outerbox, elementHalfWidth);
                setScene(outerbox, mainsection, winHeight);
                if ($(this).find(".horizontal-scroll-section").get(0).hasAttribute('data-collection-selector') && $(this).find(".horizontal-scroll-section").get(0).hasAttribute('data-collection-carousel')) {
                    collectionScrollItem(elementHalfWidth, winHeight)
                } else if (!$(this).find(".featured-collection-list__scrollbar").hasClass("collection-scroll-event-false")) {
                    collectionRotateItem(winHeight)
                }
            }
        });

    }
    $(window).on('resize', debounce(function() {
        winHeight = window.innerHeight;
        winWidth = window.innerWidth;
        winScrollTop = $(window).scrollTop();
        elementHalfWidth = (winWidth / 2);
        if (winWidth > 1024) {
            $horizontalScrollSections.each(function(i, el) {
                if ($(this).find(".horizontal-scroll-section").get(0).hasAttribute('data-collection-selector')) {
                    mainsection = $(this);
                    mainsection.data('elDomcont', mainsection.get(0));
                    outerbox = $(this).find(".featured-collection-scroll-outerbox");
                    outerbox.data('elDom', outerbox.get(0));
                    setUpHorizontalScroll(outerbox, winWidth, elementHalfWidth);
                    setScene(outerbox, mainsection, winHeight);
                    if ($(this).find(".horizontal-scroll-section").get(0).hasAttribute('data-collection-selector') && $(this).find(".horizontal-scroll-section").get(0).hasAttribute('data-collection-carousel')) {
                        collectionScrollItem(elementHalfWidth, winHeight)
                    } else if (!$(this).find(".featured-collection-list__scrollbar").hasClass("collection-scroll-event-false")) {
                        collectionRotateItem(winHeight)
                    }

                }
            });

        } else {
            Array.from(mainSelectors).forEach(function(mainSelector) {
                if (mainSelector.hasAttribute("data-collection-selector")) {
                    mainSelector.querySelector(".featured-collection-list__scrollbar").style.transform = `none`;
                    mainSelector.style.height = 'auto';
                    mainSelector.querySelector(".featured-collection-list__outer").style.background = '';
                    mainSelector.querySelector(".featured-collection-list__outer").classList.remove('featured-collection-list__outer--active');

                }

            })
        }
    }));

    function setScene($el, mainsection, winHeight) {
        if (!$el) return false;
        if (!document.querySelector(".featured-collection-list-section")) return false;
        var bounding = $el.data('elDom').getBoundingClientRect();
        var bound = mainsection.data('elDomcont').getBoundingClientRect();
        if (bounding.top > winHeight) {
            $el.find('.featured-collection-list__outer').removeClass(sceneActiveClass);
        } else {
            if (bounding.top <= 0) {
                $el.find('.featured-collection-list__outer').addClass(sceneActiveClass);
            }
            if (bounding.top > 0) {
                $el.find('.featured-collection-list__outer').removeClass(sceneActiveClass);
            }
            if (bound.bottom < (winHeight)) {
                $el.find('.featured-collection-list__outer').addClass(sceneEndedClass);
                $el.find('.featured-collection-list__outer').removeClass(sceneActiveClass);
            }
            if (bound.bottom > (winHeight)) {

                $el.find('.featured-collection-list__outer').removeClass(sceneEndedClass);
            }
        }
    }

    function setUpHorizontalScroll($el, winWidth, elementHalfWidth) {
        if (!$el) return false;
        var $contentWrapper = $el.find('.featured-collection-list__scrollbar');
        var contentWrapperDom = $contentWrapper.get(0);
        $el.data('contentWrapper', $contentWrapper);
        $el.data('contentWrapperDom', contentWrapperDom);
        var contentWrapperScrollWidth = $el.data('contentWrapperDom').scrollWidth;
        $el.data('contentWrapperScrollWidth', contentWrapperScrollWidth);
        var rightMax = $el.data('contentWrapperScrollWidth') - winWidth / 2;
        var height = $el.data('contentWrapperScrollWidth');
        var rightMaxMinus = -(rightMax);
        $el.data('maxrotation', Number(360))
        $el.data('rightMax', Number(rightMaxMinus));
        $el.data('initalized', false);
        $el.css('height', height);
        $el.data('outerHeight', $el.outerHeight());
        $el.data('offsetTop', $el.offset().top);
        $el.data('initalized', true);
        $el.data('transformX', elementHalfWidth);

        if (animationStatus) {
            setTimeout(() => {
                if (AOS) {
                    AOS.refreshHard()
                }
            }, 1000);
        }

    }

    function transformBasedOnScrollHorizontalScroll($el, itemRight, elementHalfWidth, winHeight) {
        var amountScrolledContainer = winScrollTop - $el.data('offsetTop');
        var amountScrolledThrough = (amountScrolledContainer / ($el.data('outerHeight') - (winHeight - (elementHalfWidth))));
        var toTransform = (amountScrolledThrough * $el.data('contentWrapperScrollWidth'));
        var newwidth = elementHalfWidth - toTransform * parseFloat(itemRight);
        var toTransformMinus = newwidth;
        if (newwidth > elementHalfWidth) {
            newwidth = elementHalfWidth;
        }
        toTransformMinus = Math.max(newwidth, $el.data('rightMax'));
        $el.data('transformX', Number(toTransformMinus));
        if ($el.data('initalized') == true) {
            if (rtlStatus) {
                $el.data('contentWrapper').css({
                    'transform': 'translate3d(' + (-1.11 * parseInt($el.data('transformX'))) + 'px, 0, 0)'
                });
            } else {
                $el.data('contentWrapper').css({
                    'transform': 'translate3d(' + $el.data('transformX') + 'px, 0, 0)'
                });
            }
        }
    }

    function collectionScrollItem(elementHalfWidth, winHeight) {
        if (window.innerWidth > 1024) {
            $horizontalScrollSections.each(function(i, el) {
                var itemRight = $(this).find(".featured-collection-list__scrollbar").attr("data-item-right");
                mainsection = $(this);
                outerbox = $(this).find(".featured-collection-scroll-outerbox");
                mainsection.data('elDomcont', mainsection.get(0));
                outerbox.data('elDom', outerbox.get(0));
                setScene(outerbox, mainsection, winHeight);
                transformBasedOnScrollHorizontalScroll(outerbox, itemRight, elementHalfWidth, winHeight);

            });
            var elementarrayAll = [];
            let horizontalElements = section.querySelectorAll('.featured-collection-list__outer');
            Array.from(horizontalElements).forEach(function(element) {
                let viewPortElements = element.querySelectorAll("[data-horizontal-element]");
                Array.from(viewPortElements).forEach(function(viewPortEelement) {
                    if (isElementVisible(viewPortEelement, winWidth, winHeight)) {
                        elementarrayAll.push(viewPortEelement.getAttribute("data-index"));
                    }
                });
            });

            $("[data-horizontal-element]").each(function() {
                let parent = $(this).closest(".featured-collection-list-section");
                $(this).removeClass("active");
                if (elementarrayAll.length > 1) {

                    if (elementarrayAll.length == 3) {
                        parent.find("[data-index='" + elementarrayAll[1] + "']").addClass("active");
                        let color = parent.find("[data-index='" + elementarrayAll[1] + "']").attr("data-color")
                        parent.find(".featured-collection-list__outer").css("background", color);

                    } else {
                        parent.find("[data-index='" + elementarrayAll[0] + "']").addClass("active");
                        let color = parent.find("[data-index='" + elementarrayAll[0] + "']").attr("data-color")
                        parent.find(".featured-collection-list__outer").css("background", color);
                    }

                } else {

                    parent.find("[data-index='" + elementarrayAll[0] + "']").addClass("active");
                    let color = parent.find("[data-index='" + elementarrayAll[0] + "']").attr("data-color")
                    parent.find(".featured-collection-list__outer").css("background", color)

                }
            })

        }
    }

    // circle carousel 
    function transformRotateCircleScroll($el) {
        var pageoffset = (window.pageYOffset * Math.PI) / 180;
        pageoffset = pageoffset * 3.6;

        var transform = Math.max(pageoffset, $el.data('maxrotation'));
        if ($el.data('initalized') == true) {
            $el.data('contentWrapper').css({
                'transform': 'rotate(-' + pageoffset + 'deg)'
            });
            $el.data('contentWrapper').find(".center-circle").css({
                'transform': 'rotateZ(' + pageoffset + 'deg)'
            })
        }
    }

    function collectionRotateItem(winHeight) {
        if (winWidth > 1024) {
            $horizontalScrollSections.each(function(i, el) {
                mainsection = $(this);
                outerbox = $(this).find(".featured-collection-scroll-outerbox");
                mainsection.data('elDomcont', mainsection.get(0));
                outerbox.data('elDom', outerbox.get(0));
                setScene(outerbox, mainsection, winHeight);
                transformRotateCircleScroll(outerbox);
            });
            var elementarrayAll = [];
            let horizontalElements = section.querySelectorAll('.featured-collection-list__outer');
            Array.from(horizontalElements).forEach(function(element) {
                let viewPortElements = element.querySelectorAll("[data-horizontal-element]");
                Array.from(viewPortElements).forEach(function(viewPortEelement) {
                    if (elementIsVisibleInViewport(viewPortEelement)) {
                        elementarrayAll.push(viewPortEelement.getAttribute("data-index"));
                    }
                });
            });

            $("[data-horizontal-element]").each(function() {
                if (!$(this).closest(".featured-collection-list__scrollbar").hasClass("collection-scroll-event-false")) {
                    let parent = $(this).closest(".featured-collection-list-section");
                    $(this).removeClass("active-collection");
                    var collectionTitleSelector = parent.find(".main-collection-title");
                    // collectionTitleSelector.text('');
                    if (elementarrayAll.length > 1) {
                        if (elementarrayAll.length == 3) {
                            var getcollectionname = parent.find("[data-index='" + elementarrayAll[1] + "'] a.featured-collection-list__item-link").attr("aria-label");
                            collectionTitleSelector.text(getcollectionname);
                            parent.find("[data-index='" + elementarrayAll[1] + "']").addClass("active-collection");
                        } else if (elementarrayAll.length == 2) {
                            if (documentScrollTop < document.documentElement.scrollTop) {
                                var getcollectionname = parent.find("[data-index='" + elementarrayAll[0] + "'] a.featured-collection-list__item-link").attr("aria-label");
                                collectionTitleSelector.text(getcollectionname);
                                parent.find("[data-index='" + elementarrayAll[0] + "']").addClass("active-collection");
                            } else {
                                var getcollectionname = parent.find("[data-index='" + elementarrayAll[1] + "'] a.featured-collection-list__item-link").attr("aria-label");
                                collectionTitleSelector.text(getcollectionname);
                                parent.find("[data-index='" + elementarrayAll[1] + "']").addClass("active-collection");
                            }

                        } else if (elementarrayAll.length == 4) {
                            var getcollectionname = parent.find("[data-index='" + elementarrayAll[2] + "'] a.featured-collection-list__item-link").attr("aria-label");
                            collectionTitleSelector.text(getcollectionname);
                            parent.find("[data-index='" + elementarrayAll[2] + "']").addClass("active-collection");
                        } else {
                            var getcollectionname = parent.find("[data-index='" + elementarrayAll[0] + "'] a.featured-collection-list__item-link").attr("aria-label");
                            collectionTitleSelector.text(getcollectionname);
                            parent.find("[data-index='" + elementarrayAll[0] + "']").addClass("active-collection");
                        }
                    } else {
                        var getcollectionname = parent.find("[data-index='" + elementarrayAll[0] + "'] a.featured-collection-list__item-link").attr("aria-label");
                        collectionTitleSelector.text(getcollectionname);
                        parent.find("[data-index='" + elementarrayAll[0] + "']").addClass("active-collection");

                    }
                }

            })

        }
    }
    $(window).on('scroll', function() {
        if (window.innerWidth > 1024) {
            winScrollTop = $(window).scrollTop();
            $horizontalScrollSections.each(function(i, el) {
                if ($(this).find(".horizontal-scroll-section").get(0).hasAttribute('data-collection-selector') && $(this).find(".horizontal-scroll-section").get(0).hasAttribute('data-collection-carousel')) {
                    collectionScrollItem(elementHalfWidth, winHeight)
                } else if (!$(this).find(".featured-collection-list__scrollbar").hasClass("collection-scroll-event-false")) {
                    collectionRotateItem(winHeight)
                    documentScrollTop = document.documentElement.scrollTop;
                }
            })
        }
    });
}
//** Video Section */
function videoAnimateSection(section = document) {
    let videoElements = section.querySelectorAll('[data-zoom-section]');
    Array.from(videoElements).forEach((video) => {
        let element = $(video);
        let windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth;
        let videoElement = element.find('.video-zoom__overlay');
        element.css({
            height: windowHeight + parseInt(element.css('--inner-space-top')) + 'px',
            'max-height': windowHeight + parseInt(element.css('--inner-space-top')) + 'px',
            width: windowWidth + 'px',
            'max-width': '100%',
        });
        videoElement.css({
            height: windowHeight + 'px',
            'max-height': windowHeight + 'px'
        });
        let minScale = 0.5;
        let maxScale = 1;
        $(window).on('scroll', function() {
            let windowTop = $(window).scrollTop();
            let elementTop = videoElement.offset().top;
            let difference = elementTop - windowTop;
            if (isOnScreen(videoElement)) {
                if (difference > 0) {
                    let diffPercentage = Math.max(minScale, Math.min(maxScale, ((windowHeight - difference) / windowHeight)));
                    videoElement[0].style.transform = "scale(" + diffPercentage + ")";
                } else {
                    videoElement[0].style.transform = "scale(1)";
                }
                if (element.find('video')[0]) {
                    element.find('video')[0].play();
                }
            } else {
                if (element.find('video')[0]) {
                    element.find('video')[0].pause();
                }
            }
        });
        $(window).on('resize', function() {
            let element = $(video);
            let windowHeight = window.innerHeight;
            let windowWidth = window.innerWidth;
            element.css({
                height: windowHeight + parseInt(element.css('--inner-space-top')) + 'px',
                'max-height': windowHeight + parseInt(element.css('--inner-space-top')) + 'px',
                width: windowWidth + 'px',
                'max-width': '100%',
            });
            videoElement.css({
                height: windowHeight + 'px',
                'max-height': windowHeight + 'px'
            });
        })
    })
}

function slideShowAnimation(section = document) {
    let customArrows = section.querySelectorAll('[data-custom-slider-button]');
    Array.from(customArrows).forEach((arrow) => {
        arrow.addEventListener("click", (event) => {
            event.preventDefault();
            let section = arrow.closest('.shopify-section');
            let sliderElement = section.querySelector('.flickity-enabled[data-theme-slider]');
            if (sliderElement) {
                let activeSlide = sliderElement.querySelector('.slideshow__item.is-selected');
                if (activeSlide) {
                    activeSlide.classList.remove('is-selected')
                    setTimeout(function() {
                        if (arrow.classList.contains('previous')) {
                            sliderElement.querySelector('.flickity-button.previous').click()
                        } else {
                            sliderElement.querySelector('.flickity-button.next').click()
                        }
                    }, 800)
                }
            }
        });
    });
}

function spotlightSlideChange(section = document) {
    let spotPoints = section.querySelectorAll('[data-spot-point]');
    Array.from(spotPoints).forEach((spot) => {
        spot.addEventListener("click", (event) => {
            event.preventDefault();
            if (spot.classList.contains('active')) return false;
            let section = spot.closest('.shopify-section');
            let activeElement = section.querySelector('.active[data-spot-point]');
            if (activeElement) {
                activeElement.classList.remove('active')
                spot.classList.add('active')
                let sliderElement = section.querySelector('.flickity-enabled[data-theme-slider]');
                if (sliderElement) {
                    let index = parseInt(spot.getAttribute('data-spot-index'));
                    let slider = Flickity.data(sliderElement);
                    slider.select(index)
                }
            }
        });
    });
}

function tabsContentWrapper(section = document) {
    let tabHeadings = section.querySelectorAll('[data-tab-header]');
    Array.from(tabHeadings).forEach((tabHeading) => {
        tabHeading.addEventListener("click", (event) => {
            event.preventDefault();
            if (tabHeading.classList.contains('active')) return false;
            let tabsParent = tabHeading.closest('[data-tab-wrapper]');
            let activeTabContentSelector = tabHeading.getAttribute('href');
            let currentActiveTabheading = tabsParent.querySelector('.active[data-tab-header]');
            if (currentActiveTabheading) {
                currentActiveTabheading.classList.remove('active')
            }
            tabHeading.classList.add('active')

            let activeTabContentElement = tabsParent.querySelector(activeTabContentSelector);

            let allTabs = tabsParent.querySelectorAll('[data-tab-content]')
            if (activeTabContentElement) {
                if (tabHeading.parentElement.classList.contains('collection-tab')) {
                    let currentActiveTabContent = tabsParent.querySelector('.active[data-tab-content]')
                    if (currentActiveTabContent) {
                        if (currentActiveTabContent.classList.contains('collections-tab-content')) {
                            currentActiveTabContent.style.display = 'none';
                            currentActiveTabContent.classList.remove('active')
                        }
                    }
                    if (currentActiveTabheading) {
                        let currentText = currentActiveTabheading.textContent
                        currentActiveTabheading.textContent = currentText;
                    }
                    let activeText = tabHeading.textContent
                    tabHeading.innerHTML =`<strong>${activeText}</strong>`
                    activeTabContentElement.style.display = 'block';
                    activeTabContentElement.classList.add('active')
                    if (activeTabContentElement.querySelector("[data-theme-slider]")) {
                        let sliderElement = Flickity.data(activeTabContentElement.querySelector("[data-theme-slider].flickity-enabled"));
                        sliderElement.resize();
                    }
                } else {
                    Array.from(allTabs).forEach((tab) => {
                        if (tab != activeTabContentElement) {
                            tab.fadeOut(500);
                        }
                    });
                    setTimeout(() => {
                        activeTabContentElement.fadeIn(500);
                    }, 500);
                }
            }
        });
    });
}

function countdownWrapper(section = document) {
    let countdownParents = section.querySelectorAll('[data-countdown-timer]');
    Array.from(countdownParents).forEach((countdown) => {
        countdownInit(countdown)
    });
}

function countdownInit(selector) {
    let clearCountDown;
    var parent = selector;
    if (parent) {
        clearInterval(clearCountDown);
        var dateSelector = parent.querySelector(".dealDate");
        if (dateSelector) {
            const myArr = dateSelector.value.split("/");
            let _month = myArr[0];
            let _day = myArr[1];
            let _year = myArr[2];
            let _date = _month + "/" + _day + "/" + _year + " 00:00:00";
            let countDown = new Date(_date).getTime();
            var daySelector = parent.querySelector("[data-countdown-days]");
            var hourSelector = parent.querySelector("[data-countdown-hours]");
            var minSelector = parent.querySelector("[data-countdown-minutes]");
            var secSelector = parent.querySelector("[data-countdown-seconds]");
            if (daySelector && hourSelector && minSelector && secSelector) {
                clearCountDown = setInterval(function() {
                    let now = new Date().getTime(),
                        distance = countDown - now;
                    var leftDays = Math.floor(distance / day);
                    if (distance > 0) {
                        parent.classList.remove("hidden");
                        (daySelector.innerText = pad2(leftDays)),
                        (hourSelector.innerText = pad2(
                            Math.floor((distance % day) / hour)
                        )),
                        (minSelector.innerText = pad2(
                            Math.floor((distance % hour) / minute)
                        )),
                        (secSelector.innerText = pad2(
                            Math.floor((distance % minute) / second)
                        ));
                    } else {
                        let hideStatus = parent.getAttribute("data-hide-section");
                        if (hideStatus == "true") {
                            parent.classList.add("hidden");
                        }
                        (daySelector.innerText = "00"),
                        (hourSelector.innerText = "00"),
                        (minSelector.innerText = "00"),
                        (secSelector.innerText = "00");
                        clearInterval(clearCountDown);
                    }
                }, 0);
            }
        }
    }
};

function animatetime(last, nowon, parent) {
    for (var i = 0; i < nowon.length; i++) {
        if (last[i] != nowon[i]) {
            animate(i, nowon[i], parent);
        }
    }
}

function animate(index, number, parent) {
    var element = parent.getElementsByClassName("number")[index];
    if (!element) return false;
    var second = element.lastElementChild.cloneNode(true);
    second.innerHTML = number;
    element.appendChild(second);
    element.classList.add("move");
    setTimeout(function() {
        element.classList.remove("move");
    }, 500);
    setTimeout(function() {
        element.removeChild(element.firstElementChild);
    }, 500);
}

function socialSharingEvent(section = document) {
    let socialShareHeadings = section.querySelectorAll('.product-social__item');
    Array.from(socialShareHeadings).forEach((socialHeader) => {
        socialHeader.addEventListener("mouseover", (event) => {
            event.preventDefault();
            socialHeader.parentNode.classList.add('active')
        });

        document.addEventListener("mousemove", (event) => {

            if (!socialHeader.parentNode.contains(event.target)) {
                socialHeader.parentNode.classList.remove('active')
            }
        });
    });
}

class Accordion {
    constructor(el) {
        this.el = el;
        this.summary = el.querySelector('summary');
        this.content = el.querySelector('.detail-expand');
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.summary.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(e) {

        e.preventDefault();

        this.el.style.overflow = 'hidden';

        if (this.isClosing || !this.el.open) {
            this.open();

        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }

    shrink() {

        this.isClosing = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight}px`;
        if (this.animation) {

            this.animation.cancel();
        }
        // Start a WAAPI animation
        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(false);
        this.animation.oncancel = () => this.isClosing = false;
    }
    open() {
        this.el.style.height = `${this.el.offsetHeight}px`;
        this.el.open = true;
        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        // Set the element as "being expanding"
        this.isExpanding = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }
        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        this.animation.onfinish = () => this.onAnimationFinish(true);
        this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
        this.el.open = open;
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.el.style.height = this.el.style.overflow = '';
    }
}

function detailDisclouserInit(section = document) {
    let detailsElements = section.querySelectorAll('.detail-box');
    if (detailsElements) {
        Array.from(detailsElements).forEach((detailsElement) => {
  
            // new Accordion(detailsElement);
            if (detailsElement.classList.contains('sortby__box') || detailsElement.classList.contains('country-dropdown') || detailsElement.classList.contains('lang-dropdown')) {
                detailsElement.addEventListener("toggle", (event) => {
                 
                    if (detailsElement.open) {
                        /* the element was toggled open */
                        DOMAnimations.slideDown(event.target.querySelector(".detail-expand"), 500);
                    } else {
                        /* the element was toggled closed */
                        DOMAnimations.slideUp(event.target.querySelector(".detail-expand"), 300);
                
                    }
                });
            } else {
                new Accordion(detailsElement);
            }
        });
    }
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 27) {
        let hamburgerMenu = document.querySelector('.full-menu-sidebar.menu--visible');
        if (hamburgerMenu) {
            hamburgerMenu.classList.remove('menu--visible');
            setTimeout(function() {
                hamburgerMenu.style.display = "none";
            }, 850)
        }
        let activePopupDrawer = document.querySelector('[data-side-drawer].popup--visible')
        if (activePopupDrawer) {
            activePopupDrawer.classList.remove('popup--visible')
            if (activePopupDrawer.classList.contains('quickview-popup')) {
                activePopupDrawer.fadeOut(500)
            }
        }
        let activeSideDrawer = document.querySelector('[data-side-drawer].sd-sidebar--visible')
        if (activeSideDrawer) {
            activeSideDrawer.classList.remove('sd-sidebar--visible')
        }
        let activeSearchDrawer = document.querySelector('[data-side-drawer].search-drawer-active')
        if (activeSearchDrawer) {
            activeSearchDrawer.classList.remove('search-drawer-active')
        }
        document.querySelector('body').classList.remove('quickview-open', 'no-scroll', 'searchbar-open', 'tab-focus')
        stopFocusRotation();
        if (previousFocusElement) {
            previousFocusElement.focus();
        }
        let sortByClose = document.querySelector('.sortby__box');
        if (sortByClose) {
            sortByClose.querySelector('summary').click();
        }

        previousFocusElement = '';
    }
});

document.addEventListener('keyup', function(event) {
    if (event.keyCode == 9) {
        if (event.target.classList.contains('searchbar__input')) {
            document.querySelector('body').classList.add('tab-focus')
        } else {
            document.querySelector('body').classList.remove('tab-focus')
        }
    }
});

function localizationElements(section = document) {
    // var localizationDropdown = section.getElementsByClassName('lang-dropdown');
    // if (localizationDropdown) {
    //     Array.from(localizationDropdown).forEach(function(list) {
    //         list.addEventListener('click', () => {
    //             let currencyDropdown = list.closest('.country-dropdown.active');
    //             if (currencyDropdown) {
    //                 currencyDropdown.classList.remove('active');
    //             }
    //             var form = list.closest('form');
    //             form.submit();
    //         });
    //     });
    // }

    let localizationDropdown = section.querySelector('.lang-dropdown');
    if (localizationDropdown) {
        localizationDropdown.addEventListener('click', () => {
            // var form = localizationDropdown.closest('form');
            // form.submit();
            DOMAnimations.slideToggle(localizationDropdown.querySelector(".lang-dropdown-expand"), 300);

        });
        localizationDropdown.onkeydown = function(e) {
            if (e.keyCode == 13 || e.keyCode == 32) {
                localizationDropdown.click();
            }
        }
        section.addEventListener('click', (event) => {
            if (!localizationDropdown.parentNode.contains(event.target)) {
    
                DOMAnimations.slideUp(localizationDropdown.querySelector(".lang-dropdown-expand"), 300);
            }
        });
    }


    let currencyDropdown = section.querySelector('.country-dropdown');
    if (currencyDropdown) {
        currencyDropdown.addEventListener('click', () => {
            DOMAnimations.slideToggle(currencyDropdown.querySelector(".country-dropdown-expand"), 300);

        });
        currencyDropdown.onkeydown = function(e) {
            if (e.keyCode == 13 || e.keyCode == 32) {
                currencyDropdown.click();
            }
        }
        section.addEventListener('click', (event) => {
            if (!currencyDropdown.parentNode.contains(event.target)) {
                DOMAnimations.slideUp(currencyDropdown.querySelector(".country-dropdown-expand"), 300);
            }
        });
    }
}

function initStickyAddToCart(section = document) {
    let mainProductForm = section.querySelector('.main-product-form[action^="' + cartAdd + '"]');
    if (mainProductForm) {
        let formScrollTop = mainProductForm.offsetTop;
        let stickyBar = section.querySelector('.product__viewbar');
        if (stickyBar) {
            if (stickyBar.querySelector('.product__viewbar-close')) {
                stickyBar.querySelector('.product__viewbar-close').addEventListener('click', function(event) {
                    event.preventDefault();
                    stickyBar.style.display = 'none';
                })
            }
            window.addEventListener('scroll', function(event) {
                if (isOnScreen(mainProductForm, true) || window.scrollY < (formScrollTop + 100)) {
                    stickyBar.classList.add('hidden');
                } else {
                    stickyBar.classList.remove('hidden');
                }
            });
        }
    }
}

function productMediaClose(section = document) {
    let productMedia = section.querySelectorAll('[data-product-main-media]');
    Array.from(productMedia).forEach(function(mediaWrapper) {
        if (window.innerWidth > 767) return false;
        mediaWrapper.addEventListener('scroll', function() {
            mediaWrapper.querySelectorAll(".yv-youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
                let left = video.getBoundingClientRect().left;
                if (!(left > -50 && left < window.innerWidth - 100)) {
                    video.contentWindow.postMessage(
                        '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
                        "*"
                    );
                }
            });
            mediaWrapper.querySelectorAll(".yv-vimeo-video,iframe[src*='player.vimeo.com']").forEach((video) => {
                let left = video.getBoundingClientRect().left;
                if (!(left > -50 && left < window.innerWidth - 100)) {
                    video.contentWindow.postMessage('{"method":"pause"}', "*");
                }
            });
            mediaWrapper.querySelectorAll("video").forEach((video) => {
                let left = video.getBoundingClientRect().left;
                if (!video.hasAttribute("autoplay")) {
                    if (!(left > -50 && left < window.innerWidth - 100)) {
                        video.pause();
                    }
                }
            });
        })
    })
    $(".yv-product-slider").on("scroll", function() {});
}

function copyToClipboard(section = document) {
    let copyToClipboardWrappers = section.querySelectorAll('[data-copy-clipboard]');
    Array.from(copyToClipboardWrappers).forEach(function(selector) {
        var btnCopy = selector.querySelector('.copy-code-link');
        btnCopy.addEventListener('click', function() {
            var tempInput = document.createElement("input");
            tempInput.style = "position: absolute; left: -1000px; top: -1000px";
            tempInput.value = btnCopy.dataset.value;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            setTimeout(function() {
                btnCopy.classList.add('copied');
                var temp = setInterval(function() {
                    btnCopy.classList.remove('copied');
                    clearInterval(temp);
                }, 1000);
            }, 100)
            return false;
        });
    })
}

function sortByCloseOutside(section = document) {
    document.querySelector('body').addEventListener('click', function(event) {
        let sortByClose = section.querySelector('.sortby__box');
        if (sortByClose == event.target) return false;
        if (event.target.closest('.sortby__box')) return false;
        if (sortByClose && sortByClose.open) {
            sortByClose.querySelector('summary').click();
        }
    })
}

function stackedTestimonialsInit(selector) {
    let slideParent = $(selector).closest(selector);
    // Set this to 0 for slides to directly overlap
    let sliderOffset = 20;
    // Tablet and Mobile Only
    if (window.innerWidth < 768) {
        sliderOffset = 8;
    }
    // On page load
    $(selector).each(function(index) {
        $(this).find(".testimonial__slider-item").first().addClass("active");
    });
    // On arrow click
    slideParent.find(".slide_arrow").on("click", function(e) {
        e.preventDefault();
        // Set variables
        let slideWidth = slideParent.find(".testimonial__slider-item").eq(0).outerWidth() - sliderOffset;
        let currentSlide = slideParent.find(".testimonial__slider-item.active");
        // Update current slide
        slideParent.find(".active").removeClass("active");
        if ($(this).hasClass("next")) {
            // Update current slide if right
            if (currentSlide.next().length) {
                currentSlide.next().addClass("active");
            } else {
                slideParent.find(".testimonial__slider-item").eq(0).addClass("active");
                slideParent.find(".slide_arrow.next").addClass("disabled");
            }
        } else {
            // Update current slide if left
            if (currentSlide.prev().length) {
                currentSlide.prev().addClass("active");
            } else {
                slideParent.find(".testimonial__slider-item").eq(0).addClass("active");
                slideParent.find(".slide_arrow.previous").addClass("disabled");
            }
        }
        // Update arrows
        slideParent.find(".slide_arrow").removeClass("disabled");
        if (slideParent.find(".testimonial__slider-item.active").index() == slideParent.find(".testimonial__slider-item").first().index()) {
            slideParent.find(".slide_arrow.previous").addClass("disabled");
        }
        if (slideParent.find(".testimonial__slider-item.active").index() == slideParent.find(".testimonial__slider-item").last().index()) {
            slideParent.find(".slide_arrow.next").addClass("disabled");
        }
        // Figure out move distance
        let currentNumber = slideParent.find(".testimonial__slider-item.active").index();
        let slideMove = -(slideWidth * currentNumber);
        if(rtlStatus){
            slideMove = slideWidth * currentNumber;
        }
        slideParent.find(".testimonial__slider-item.active").addClass("animating");
        slideParent.find(".testimonial__slider-item.animating ~ .testimonial__slider-item, .testimonial__slider-item.animating").css("transform", `translateX(${slideMove}px)`);
        slideParent.find(".testimonial__slider-item.active").removeClass("animating");
    });
    // On window resize
    $(window).resize(function() {
        slideParent.find(".slide_arrow.next").removeClass("disabled");
        slideParent.find(".slide_arrow.previous").addClass("disabled");
        slideParent.find(".testimonial__slider-item.active").removeClass("active");
        slideParent.find(".testimonial__slider-item").first().addClass("active");
        slideParent.find(".testimonial__slider-item").css("transform", `translateX(0px)`);
    });
}

function stackedTestimonialsWrappers() {
    let stackedTestimonials = document.querySelectorAll('[data-stacked-testimonials-carousel]');
    Array.from(stackedTestimonials).forEach(function(selector) {
        stackedTestimonialsInit(selector)
    })
}

function hideBanner() {
    document.querySelector(".privacy__banner") && (document.querySelector(".privacy__banner").style.display = "none");
}

function showBanner() {
    document.querySelector(".privacy__banner") && (document.querySelector(".privacy__banner").style.display = "block");
}

function handleAccept(e) {
    window.Shopify.customerPrivacy.setTrackingConsent(true, hideBanner),
        document.addEventListener("trackingConsentAccepted", function() {
            console.log("trackingConsentAccepted event fired");
        });
}

function handleDecline() {
    window.Shopify.customerPrivacy.setTrackingConsent(!1, hideBanner);
}

function initCookieBanner() {
    const userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked(),
        userTrackingConsent = window.Shopify.customerPrivacy.getTrackingConsent();
    if (userCanBeTracked && userTrackingConsent === "no_interaction") {
        showBanner();
    }
}

function cookiesBanner() {
    window.Shopify.loadFeatures([{ name: "consent-tracking-api", version: "0.1" }], function(e) {
        if (e) throw e;
        initCookieBanner();
    });
}

function ageVerificationInit() {
    let ageVerificationContainer = document.querySelector('.age-verification-popup');
    if (ageVerificationContainer) {
        let ageVerifyWrapper = ageVerificationContainer.querySelector("[data-age-verification-container]");
        let ageDeclineWrapper = ageVerificationContainer.querySelector("[data-under-age-container]");
        let age_decline = ageVerificationContainer.querySelector("[data-under-age-button]");
        let age_accept = ageVerificationContainer.querySelector("[data-over-age-button]");
        let age_retry = ageVerificationContainer.querySelector("[data-age-decline-button]");
        let ageVerified = Cookies.get('ageVerified');
        if (ageVerified != 'true' && window.location.pathname.indexOf('/challenge') < 0) {
            ageVerificationContainer.classList.add('popup--visible');
            document.querySelector('body').classList.add('no-scroll')
        }
        if (age_accept) {
            age_accept.addEventListener('click', function(event) {
                event.preventDefault();
                ageVerificationContainer.classList.remove('popup--visible');
                document.querySelector('body').classList.remove('no-scroll');
                var date = new Date();
                date.setTime(date.getTime() + 15 * 24 * 60 * 60 * 1000);
                Cookies.set('ageVerified', 'true', { expires: date, path: '/' });
            })
        }
        if (age_decline) {
            age_decline.addEventListener('click', function(event) {
                event.preventDefault();
                if (ageVerifyWrapper && ageDeclineWrapper) {
                    ageVerifyWrapper.classList.add('hidden');
                    ageDeclineWrapper.classList.remove('hidden');
                }
            })
        }
        if (age_retry) {
            age_retry.addEventListener('click', function(event) {
                event.preventDefault();
                if (ageVerifyWrapper && ageDeclineWrapper) {
                    ageDeclineWrapper.classList.add('hidden');
                    ageVerifyWrapper.classList.remove('hidden');
                }
            })
        }
    }
}

function timelineSelectors(section = document) {
    let timelineSelectors = section.querySelectorAll('[data-timeline-selector]');
    Array.from(timelineSelectors).forEach(function(selector) {
        timelineInit(selector);
    });
}

function timelineInit(selector) {
    window.addEventListener('scroll', function(e) {
        if (isOnScreen($(selector))) {
            let final = selector.offsetHeight;
            let _top = selector.offsetTop;
            let _winbot = window.scrollY + (window.innerHeight / 2);
            let height = _winbot - _top;
            let progressBar = selector.querySelector('[data-timeline-progressbar]')
            if (progressBar) {
                if (height <= final) {
                    if (_winbot > _top) {
                        progressBar.style.setProperty(
                            "--timeline-height",
                            `${height}px`
                        );
                    } else {
                        progressBar.style.setProperty(
                            "--timeline-height",
                            `0px`
                        );
                    }
                }
            }
        }
    });
    window.addEventListener('resize', function(e) {
        let final = selector.offsetHeight;
        let progressBar = selector.querySelector('[data-timeline-progressbar]')
        if (progressBar) {
            let progressBarHeight = progressBar.scrollHeight;
            if (progressBarHeight > final) {
                progressBar.style.setProperty(
                    "--timeline-height",
                    `${final}px`
                );
            }
        }
    });
}

function animatedTextSelectors(section = document) {
    let timelineSelectors = section.querySelectorAll('[data-animation-box]');
    Array.from(timelineSelectors).forEach(function(selector) {
        animatedTextInit(selector);
    });
}

function animatedTextInit(selector) {
    window.addEventListener('scroll', function(e) {
        let windowTop = window.scrollY;
        let selectorTop = selector.offsetTop - (window.innerHeight * .5);
        let elements = selector.querySelectorAll('[data-animation-item]')
        let firstElement = selector.querySelector('[data-animation-first-item]');
        let initHeight = 0;
        let finalHeight = 0;
        if (firstElement) {
            initHeight = selector.offsetHeight;
            finalHeight = initHeight * (elements.length + 1);
        }
        if (isOnScreen($(selector)) && windowTop > selectorTop) {
            if (selector.classList.contains('applied')) return false;
            Array.from(elements).forEach(function(element, index) {
                // $(this).slideToggle("slow")
                element.animate({ opacity: [0, 1 - ((1 / (elements.length + 1)) * (index + 1))] }, { duration: 1000 })
                    .onfinish = (e) => {
                        e.target.effect.target.style.opacity = 1 - ((1 / (elements.length + 1)) * (index + 1));
                    };
            });
            selector.classList.add('active');
            selector.classList.add('applied');
            setTimeout(() => {
                Array.from(elements).forEach(function(element, index) {
                    // $(this).slideToggle("slow")
                    element.animate({ opacity: [1 - ((1 / (elements.length + 1)) * (index + 1)), 0] }, { duration: 1000 })
                        .onfinish = (e) => {
                            e.target.effect.target.style.opacity = 0;
                        };
                });
                selector.classList.remove('active');
            }, 2000);
        } else if (windowTop < selectorTop) {
            selector.classList.remove('applied');
            if (selector.classList.contains('active')) {
                Array.from(elements).forEach(function(element, index) {
                    // $(this).slideToggle("slow")
                    element.animate({ opacity: [1 - ((1 / (elements.length + 1)) * (index + 1)), 0] }, { duration: 1000 })
                        .onfinish = (e) => {
                            e.target.effect.target.style.opacity = 0;
                        };
                });
                selector.classList.remove('active');
            }
        }
    });
}

function recentlyViewedProducts() {
    let rvpWrappers = document.querySelectorAll('[data-recent-viewed-products]')
    Array.from(rvpWrappers).forEach(function(rvp) {
        let currentProduct = parseInt(rvp.dataset.product);
        let section = rvp.closest('.shopify-section');
        let cookieName = 'fame-recently-viewed-products';
        let rvProducts = JSON.parse(window.localStorage.getItem(cookieName) || '[]');
        if (!isNaN(currentProduct)) {
            if (!rvProducts.includes(currentProduct)) {
                rvProducts.unshift(currentProduct);
            }
            window.localStorage.setItem(cookieName, JSON.stringify(rvProducts.slice(0, 14)));

            if (rvProducts.includes(parseInt(currentProduct))) {
                rvProducts.splice(rvProducts.indexOf(parseInt(currentProduct)), 1);
            }
        }
        let currentItems = rvProducts.map((item) => "id:" + item).slice(0, 14).join(" OR ");
        fetch(rvp.dataset.section + currentItems)
            .then(response => response.text())
            .then(text => {
                const html = document.createElement('div');
                html.innerHTML = text;
                const recents = html.querySelector('[data-recent-viewed-products]');
                if (recents && recents.innerHTML.trim().length) {
                    rvp.innerHTML = recents.innerHTML;
                    rvp.closest('.shopify-section').classList.remove('hidden');
                    let slider = section.querySelector(
                        "[data-theme-slider]"
                    );
                    if (slider) {
                        let sliderId = slider.getAttribute("id");
                        if (!slider.classList.contains("flickity-enabled")) {
                            if (slider.classList.contains("data-desktop-only")) {
                                if (window.innerWidth > 767) {
                                    sliderInit($("#" + sliderId));
                                }
                            } else {
                                sliderInit($("#" + sliderId));
                            }
                        }
                    }
                    quickViewElements(section);
                    colorSwatchChanged(section);
                    productGridImageSlider(section);
                    getAtcElements(section);
                    if (animationStatus) {
                        if (AOS) {
                            AOS.refreshHard()
                        }
                    }
                }
            })
            .catch(e => {
                console.error(e);
            });
    })
}

function utils() {
    let calcMaxHeight = function (items) {
        let maxHeight = 0;
        items.forEach(item => {
            let h = item.clientHeight;
            maxHeight = h > maxHeight ? h : maxHeight;
        });
        return maxHeight;
    }
    function removeClasses(nodeList, cssClasses) {
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].classList.remove(...cssClasses);
        }
    }
    function addClasses(nodeList, cssClasses) {
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].classList.add(...cssClasses);
        }
    }
    function getIndex(items, attributeName){
         let activeIndex='';
          items.forEach(item => {
           if(item.classList.contains('active')){
             activeIndex=item.getAttribute(attributeName);
           }
        });
      return activeIndex
    }
    let requestInterval = function (fn, delay) {
        let requestAnimFrame = (function () {
            return window.requestAnimationFrame || function (callback, element) {
               // window.setTimeout(callback, 10 / 10);
            };
        })();

        let start = new Date().getTime(),
            handle = {};

        function loop() {
            let current = new Date().getTime(),
                delta = current - start;

            if (delta >= delay) {
                fn.call();
                start = new Date().getTime();
            }

            handle.value = requestAnimFrame(loop);
        }

        handle.value = requestAnimFrame(loop);
        return handle;
    };
    let clearRequestInterval = function (handle) {
        window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
            clearInterval(handle);
    };
    return {
        calcMaxHeight,
        removeClasses,
        getIndex,
        addClasses,
        requestInterval,
        clearRequestInterval
    }
}

function setHeight(holder, items) {
        let h = utils().calcMaxHeight(items);
        holder.style.height = `${h}px`;
}

function leadingZero() {
    return arguments[1] < 10 ? '0' + arguments[1] : arguments[1];
}
function setCurrent(slider) {
    slider.current.setAttribute("data-current", leadingZero `${slider.activeIndex + 1}`) ;
}
function sliderSlide(activeIndexValue,getindex,slider,heroSlider,waitForIdle){
    utils().removeClasses(slider.items, ['prev', 'active']);
      let prevItems = [...slider.items]
         .filter(item => {
             let prevIndex;
            prevIndex = activeIndexValue ;
            return item.dataset.index == prevIndex;
        });
     let activeItems = [...slider.items]
      .filter(item => {
          return item.dataset.index == getindex;
      });
     if(activeIndexValue > getindex){
         utils().addClasses(activeItems, ['animInLeft','active']);
         utils().addClasses(prevItems, ['prev','temp-active']);
         setTimeout(function(){
             utils().removeClasses(activeItems, ['animInLeft']);
             utils().removeClasses(prevItems, ['temp-active']);
         },1000)
     }else{
         utils().addClasses(activeItems, ['animInRight','active']); 
         utils().addClasses(prevItems, ['prev','temp-active']);
         setTimeout(function(){
             utils().removeClasses(activeItems, ['animInRight']);
             utils().removeClasses(prevItems, ['temp-active']);
         },1000)          
     }
    heroSlider.querySelector("[data-background]").style.backgroundColor = activeItems[0].getAttribute('data-color');
   setCurrent(slider);
   if(slider.main){
     let activeImageItem = slider.main.querySelector('.active');
     activeImageItem.addEventListener('transitionend', waitForIdle, {
         once: true
     });
   }    
}
function changeSlide(direction,slider,heroSlider,waitForIdle) {
    slider.idle = false;
    slider.hero.classList.remove('prev', 'next');
    if (direction == 'next') {
        slider.activeIndex = (slider.activeIndex + 1) % slider.total;
        slider.hero.classList.add('next');
    } else {
        slider.activeIndex = (slider.activeIndex - 1 + slider.total) % slider.total;
        slider.hero.classList.add('prev');
    }
    //reset classes
    utils().removeClasses(slider.items, ['prev', 'active']);
  
    //set prev  
    let prevItems = [...slider.items]
        .filter(item => {
            let prevIndex;
            if (slider.hero.classList.contains('prev')) {
                prevIndex = slider.activeIndex == slider.total - 1 ? 0 : slider.activeIndex + 1;
            } else {
                prevIndex = slider.activeIndex == 0 ? slider.total - 1 : slider.activeIndex - 1;
            }

            return item.dataset.index == prevIndex;
        });
    //set active
     let activeItems = [...slider.items]
        .filter(item => {
            return item.dataset.index == slider.activeIndex;
        });
     utils().addClasses(activeItems, ['animInRight','active']);
     utils().addClasses(prevItems, ['prev']);
     setTimeout(function(){
            utils().removeClasses(activeItems, ['animInRight']);
      },slider.interval)      
      heroSlider.querySelector("[data-background]").style.backgroundColor = activeItems[0].getAttribute('data-color');
      setCurrent(slider);
      if(slider.main){
          let activeImageItem = slider.main.querySelector('.active');
          activeImageItem.addEventListener('transitionend', waitForIdle, {
              once: true
          });
      } 
}
function stopAutoplay(slider) {
    slider.autoplay = false;
    utils().clearRequestInterval(slider.handle);
}

function navigation(heroSlider,slider,waitForIdle){
    let navigationBars = heroSlider.querySelectorAll("[data-slider-nav]");
    Array.from(navigationBars).forEach(function(navigationBar){
    navigationBar.addEventListener('click', e => {
      e.preventDefault();
      if(navigationBar.classList.contains('active')) return false;
      let activeIndexValue=parseInt(utils().getIndex(navigationBars,'data-nav-index'));
      utils().removeClasses(navigationBars, ['active']);
        navigationBar.classList.add('active')
        let getindex=parseInt(navigationBar.getAttribute("data-nav-index"));
        getindex=parseInt(getindex);
        slider.hero.classList.remove('prev', 'next');
        if(activeIndexValue > getindex){
             slider.hero.classList.add('prev');
        }else{
          slider.hero.classList.add('next');
        }
      sliderSlide(activeIndexValue,getindex,slider,heroSlider);
      });       
     }) 
}
function nextButton(heroSlider,slider,waitForIdle){
    let next = heroSlider.querySelector("[data-next_slide_btn]");
    if(next){
        next.addEventListener('click', e => {
            if (slider.idle) {
               // stopAutoplay();
                changeSlide('next',slider,heroSlider,waitForIdle,);
            }
        });  
    }
}
function previousButton(heroSlider,slider,waitForIdle){
    let prev = heroSlider.querySelector("[data-previous_slide_btn]");
    if(prev){
        prev.addEventListener('click', e => {
            if (slider.idle) {
                changeSlide('prev',slider,heroSlider,waitForIdle);
            }
        });
    }  
}
function touchControl(slider,heroSlider) {
    let touchStart = function (e) {
        slider.ts = parseInt(e.changedTouches[0].clientX);
        window.scrollTop = 0;
    }
    let touchMove = function (e) {
        let currentSlide = e.changedTouches[0];
        slider.tm = parseInt(currentSlide.clientX);
        let delta = slider.tm - slider.ts;
        currentSlideIndex = parseInt(currentSlide.target.dataset.index);
        window.scrollTop = 0;
        if(delta < 0){
            if(heroSlider.querySelector('[data-nav-index="'+(currentSlideIndex+1)+'"]')){
                heroSlider.querySelector('[data-nav-index="'+(currentSlideIndex+1)+'"]').click();
            }
        }
        else{
            if(heroSlider.querySelector('[data-nav-index="'+(currentSlideIndex-1)+'"]')){
                heroSlider.querySelector('[data-nav-index="'+(currentSlideIndex-1)+'"]').click();
            }
        }
    }

    slider.hero.addEventListener('touchstart', touchStart,
    { passive: true });
    slider.hero.addEventListener('touchmove', touchMove,
    { passive: true });
}
function sliderAutoplay(slider,heroSlider){
    if(slider.autoplayStatus == 'true'){
      let navigationBars = heroSlider.querySelectorAll("[data-slider-nav]");
      if(navigationBars.length < 2) return false;   
      let navigationBarsLength = navigationBars.length - 1;
      let current = 1;
      setInterval(function() {
        navigationBars[current].click();
        if(current == navigationBarsLength){
          current = 0;
        }
        else{
          current = current + 1;
        }
      },slider.autoplayInterval)
    }
}

function autoplay(slider,heroSlider,waitForIdle,initial) {
      slider.autoplay = true;
      slider.items = slider.hero.querySelectorAll('[data-index]');
      slider.total = slider.items.length / 2;
      let loop = () => changeSlide('next',slider,heroSlider,waitForIdle);
      initial && requestAnimationFrame(loop);
      slider.handle = utils().requestInterval(slider.interval);
  }
function loadingAnimation(slider,start) {
    slider.hero.classList.add('ready');
    start();
    slider.current.addEventListener('transitionend', start, {
        once: true
    });
}
 function init(slider,start) {
        if(slider.hero){
            loadingAnimation(slider,start);
        }  
} 
function loaded(slider) {
  slider.hero.classList.add('loaded');
}
function waitForIdle(slider) {
        !slider.autoplay && autoplay(false); //restart
        slider.idle = true;
}
function heroSlider(section=document) {
    let heroSliders=section.querySelectorAll("[data-split-slider]");
   heroSliders.forEach(function(heroSlider){
    let slider = { 
        hero: heroSlider.querySelector('[data-hero-slider]'),
        main: heroSlider.querySelector('[data-slides-main]'),
        aux: heroSlider.querySelector('[data-slides-aux]'),
        current: heroSlider.querySelector('[data-main-slider-nav]'),
        handle: null,
        idle: true,
        activeIndex: -1,
        autoplayStatus:`${heroSlider.dataset.autoplay}`,
        interval: 3500,
        autoplayInterval: parseInt(heroSlider.dataset.speed)
    };
   
    let start = function () {
        autoplay(slider,heroSlider,waitForIdle,true);
        stopAutoplay(slider);
        sliderAutoplay(slider,heroSlider);
        nextButton(heroSlider,slider,waitForIdle);
        previousButton(heroSlider,slider,waitForIdle);
        navigation(heroSlider,slider);
        if(window.innerWidth <= 1024) {
            touchControl();
        }
        if(slider.aux){
            slider.aux.addEventListener('transitionend', loaded(slider), {
                once: true
            });
        } 
    }
    init(slider,start);   
  })
}

function stickySlideContent(section=document){
    if(section.querySelector("[data-stciky-options-wrapper")){
        let stcikyIcon =section.querySelector("[data-stciky-options-wrapper]");
        let StickyContent =document.querySelector(".product-view__options")
        stcikyIcon.addEventListener("click",e => { 
            if(stcikyIcon.classList.contains("active")){
                stcikyIcon.classList.remove("active")
            }else{
                stcikyIcon.classList.add("active")
            }
                DOMAnimations.slideToggle(StickyContent, 500);
        })
    }
}
function contentLoad() {
    stickySlideContent();
    stackedTestimonialsWrappers();
    cookiesBanner();
    recentlyViewedProducts();
    onScrollSectionVisible();
    initAllSliders();
    sortByCloseOutside();
    getAllDetails();
    initBeforeAfter();
    resizeVideos();
    checkMapApi();
    sideDrawerEventsInit();
    productRecommendations();
    productOptionInit();
    stickyProductOptions();
    quickViewElements();
    getQuantityElement();
    getCartItemRemoveElements();
    getAtcElements();
    cartNoteUpdate();
    cartNoteDrawerInt();
    menuHamburgerEventInt();
    dropdownMenuItems();
    colorSwatchChanged();
    marqueeTextScroll();
    marqueeTextAutoplay();
    productMedia3dModel();
    productGridImageSlider();
    collectionCarousel();
    videoAnimateSection();
    slideShowAnimation();
    spotlightSlideChange();
    tabsContentWrapper();
    countdownWrapper();
    socialSharingEvent();
    detailDisclouserInit();
    localizationElements();
    initStickyAddToCart();
    productMediaClose();
    copyToClipboard();
    vimeoVideoReady();
    ageVerificationInit();
    timelineSelectors();
    animatedTextSelectors();
    productGiftOptions();
    shippingEstimates();
    heroSlider();
    keyPressPreventElements();
    $("body").on("click", "#gift_wrap", function() {
        let element = $(this)[0];
        let formParent = element.closest('[data-gift-wrap]');
        let form = formParent.querySelector('form')
        addItemToCart(formParent, form, element);
    });
}
function keyPressPreventElements(section = document){
  let formElements = section.querySelectorAll('form');
  Array.from(formElements).forEach(function(element){
    keyPressPreventInit(element)
  })
}
function keyPressPreventInit(element){
  element.addEventListener("keypress", (event) =>{
    let currentElement = event.target
        if (event.keyCode == 13)
        { 
            event.preventDefault();
            if(currentElement.classList.contains('ajax-cart-update')){
              var event = new Event('change');
              currentElement.dispatchEvent(event);
            }
        }
  });
}
document.addEventListener("DOMContentLoaded", contentLoad, false);