//Global var
var CRUMINA = {};

(function ($) {

	// USE STRICT
	"use strict";

	//----------------------------------------------------/
	// Predefined Variables
	//----------------------------------------------------/
	var $document = $(document),
		$body = $('body'),
		$pie_chart = $('.pie-chart'),
		$progress_bar = $('.crumina-skills-item'),
		$mainContent = $('.main-content-wrapper'),
		$topbar = $('.top-bar');

	/* begin Back to Top button  */
	//Scroll to top.
	$('.back-to-top').on('click', function () {
		$('html,body').animate({
			scrollTop: 0
		}, 1200);
		return false;
	});
	/* end begin Back to Top button  */


	/* -----------------------------
* Sliders and Carousels
* ---------------------------*/

	CRUMINA.Swiper = {
		$swipers: {},
		init: function () {
			var _this = this;
			$('.swiper-container').each(function (idx) {
				var $self = $(this);
				var id = 'swiper-unique-id-' + idx;
				$self.addClass(id + ' initialized').attr('id', id);
				$self.closest('.crumina-module').find('.swiper-pagination').addClass('pagination-' + id);

				_this.$swipers[id] = new Swiper('#' + id, _this.getParams($self, id));
				_this.addEventListeners(_this.$swipers[id]);
			});
		},
		getParams: function ($swiper, id) {
			var params = {
				parallax: true,
				breakpoints: false,
				keyboardControl: true,
				setWrapperSize: true,
				preloadImages: true,
				updateOnImagesReady: true,
				prevNext: ($swiper.data('prev-next')) ? $swiper.data('prev-next') : false,
				changeHandler: ($swiper.data('change-handler')) ? $swiper.data('change-handler') : '',
				direction: ($swiper.data('direction')) ? $swiper.data('direction') : 'horizontal',
				mousewheel: ($swiper.data('mouse-scroll')) ? {
					releaseOnEdges: true
				} : false,
				slidesPerView: ($swiper.data('show-items')) ? $swiper.data('show-items') : 1,
				slidesPerGroup: ($swiper.data('scroll-items')) ? $swiper.data('scroll-items') : 1,
				spaceBetween: ($swiper.data('space-between') || $swiper.data('space-between') == 0) ? $swiper.data('space-between') : 20,
				centeredSlides: ($swiper.data('centered-slider')) ? $swiper.data('centered-slider') : false,
				autoplay: ($swiper.data('autoplay')) ? {
					delay: parseInt($swiper.data('autoplay'))
				} : false,
				autoHeight: ($swiper.hasClass('auto-height')) ? true : false,
				loop: ($swiper.data('loop') == false) ? $swiper.data('loop') : true,
				effect: ($swiper.data('effect')) ? $swiper.data('effect') : 'slide',
				pagination: {
					type: ($swiper.data('pagination')) ? $swiper.data('pagination') : 'bullets',
					el: '.pagination-' + id,
					clickable: true
				},
				coverflow: {
					stretch: ($swiper.data('stretch')) ? $swiper.data('stretch') : 0,
					depth: ($swiper.data('depth')) ? $swiper.data('depth') : 0,
					slideShadows: false,
					rotate: 0,
					modifier: 2
				},
				fade: {
					crossFade: ($swiper.data('crossfade')) ? $swiper.data('crossfade') : true
				}
			};

			if (params['slidesPerView'] > 1) {
				params['breakpoints'] = {
					// when window width is >= 320px
					320: {
						slidesPerView: 1,
						slidesPerGroup: 1
					},
					580: {
						slidesPerView: 2,
						slidesPerGroup: 2
					},
					769: {
						slidesPerView: params['slidesPerView'],
						slidesPerGroup: params['slidesPerView']
					}

				};
			}

			return params;
		},
		addEventListeners: function ($swiper) {
			var _this = this;
			var $wrapper = $swiper.$el.closest('.crumina-module-slider');

			//Prev Next clicks
			if ($swiper.params.prevNext) {
				$wrapper.on('click', '.swiper-btn-next, .swiper-btn-prev', function (event) {
					event.preventDefault();
					var $self = $(this);

					if ($self.hasClass('swiper-btn-next')) {
						$swiper.slideNext();
					} else {
						$swiper.slidePrev();
					}
				});
			}

			//Thumb/times clicks
			$wrapper.on('click', '.slider-slides .slides-item', function (event) {
				event.preventDefault();
				var $self = $(this);
				if ($swiper.params.loop) {
					$swiper.slideToLoop($self.index());
				} else {
					$swiper.slideTo($self.index());
				}
			});

			//Times clicks
			$wrapper.on('click', '.time-line-slides .slides-item', function (event) {
				event.preventDefault();
				var $self = $(this);
				_this.changes.timeLine($swiper, $wrapper, _this, $self.index());
			});

			//Run handler after change slide
			$swiper.on('slideChange', function () {
				var handler = _this.changes[$swiper.params.changeHandler];
				if (typeof handler === 'function') {
					handler($swiper, $wrapper, _this, this.realIndex);
				}
			});
		},
		changes: {
			'thumbsParent': function ($swiper, $wrapper) {
				var $thumbs = $wrapper.find('.slider-slides .slides-item');
				$thumbs.removeClass('swiper-slide-active');
				$thumbs.eq($swiper.realIndex).addClass('swiper-slide-active');
			},
			'timeParent': function ($swiper, $wrapper, main, index) {
				var timeSwiperId = $wrapper.find('.swiper-time-line').attr('id');
				var $timeSwiper = main.$swipers[timeSwiperId];
				$timeSwiper.slideTo(index);
				main.changes.timeLine($timeSwiper, $wrapper, main, index);
			},
			'timeLine': function ($swiper, $wrapper, main, index) {
				var $times = $swiper.$el.find('.swiper-slide');
				var $active = $times.eq(index);

				if ($active.hasClass('time-active')) {
					return;
				}

				$times.removeClass('time-active');
				$active.addClass('time-active').removeClass('visited');
				$active.prevAll('.swiper-slide').addClass('visited');
				$active.nextAll('.swiper-slide').removeClass('visited');
			}
		}
	};


	CRUMINA.resizeSwiper = function (swiper) {
		swiper = (swiper) ? swiper : $(this)[0].swiper;

		var activeSlideHeight = swiper.slides.eq(swiper.activeIndex).find('> *').outerHeight();

		var $pagination = $(swiper.container).find('.slider-slides'),
			$pagination_height = ($pagination.length) ? $pagination.height() : 0;

		if ($(swiper.container).hasClass('pagination-vertical')) {
			var headlineHeights = swiper.slides.map(function () {
				return $(this).find('> *').height();
			}).get();

			var maxHeadLineHeight = Math.max.apply(Math, headlineHeights);
			swiper.container.css({height: maxHeadLineHeight + 'px'});
			swiper.update(true)
		}

		if ($pagination_height > 0) {
			swiper.container.css('paddingBottom', $pagination_height + 'px');
			swiper.onResize();
		}

		if ($(swiper.container).hasClass('auto-height')) {
			swiper = (swiper) ? swiper : $(this)[0].swiper;
			swiper.container.css({height: activeSlideHeight + 'px'});
			swiper.onResize();
		}

		CRUMINA.mainSliderHeight();
	};

	CRUMINA.mainSliderHeight = function () {
		setTimeout(function () {
			$('.swiper-container.js-full-window').each(function () {

				var $slider = $(this),
					$pagination = $slider.find('.main-slider-slides'),
					$pagination_height = ($pagination.length) ? $pagination.height() : 0,
					winHei = $(window).height(),
					$sliderSpaceOffsetTop = $mainContent.offset().top,
					$sliderSlide = ('.main-slider .container');

				$($sliderSlide).imagesLoaded().done(function () {

					var $sliderSlideHeight = $($sliderSlide).outerHeight();

					if ($sliderSlideHeight > winHei - $pagination_height - $sliderSpaceOffsetTop) {
						$slider.css('min-height', 'auto').css('height', 'auto');
						$slider.find('> .swiper-wrapper').css('min-height', 'auto').css('height', 'auto');
					} else {
						$slider.css('min-height', winHei - $sliderSpaceOffsetTop + 'px').css('height', winHei - $sliderSpaceOffsetTop + 'px');
						$slider.find('> .swiper-wrapper').css('min-height', winHei - $pagination_height - $sliderSpaceOffsetTop + 'px').css('height', winHei - $pagination_height - $sliderSpaceOffsetTop + 'px');
					}

				});

			});
		}, 300);
	};


	/* -----------------------
	 * Pie chart Animation
	 * --------------------- */
	CRUMINA.pieCharts = function () {
		if ($pie_chart.length) {
			$pie_chart.each(function () {
				$(this).waypoint(function () {
					let current_cart = $(this.element);
					let startColor = current_cart.data('start-color');
					let endColor = current_cart.data('end-color');
					let counter = current_cart.data('value') * 100;

					current_cart.circleProgress({
						thickness: 16,
						size: 320,
						startAngle: -Math.PI / 4 * 2,
						emptyFill: '#fff',
						lineCap: 'round',
						fill: {
							gradient: [startColor, endColor],
							gradientAngle: Math.PI / 4
						}
					}).on('circle-animation-progress', function (event, progress) {
						current_cart.find('.content').html(parseInt(counter * progress, 10) + '<span>%</span>'
						)
					}).on('circle-animation-end', function () {

					});
					this.destroy();

				}, {offset: '90%'});
			});
		}
	};

	/* -----------------------
	 * Progress bars Animation
	 * --------------------- */
	CRUMINA.progresBars = function () {
		if ($progress_bar.length) {
			$progress_bar.each(function () {
				$(this).waypoint(function () {
					$(this.element).find('.skills-item-meter-active').fadeTo(300, 1).addClass('skills-animate');
					this.destroy();
				}, {offset: '90%'});
			});
		}
	};


	/* -----------------------------
	 * Quantity Input
	 * ---------------------------*/

	$('.quantity-plus').on('click', function () {
		let val = parseInt($(this).prev('input').val());
		$(this).prev('input').val(val + 1).change();
		return false;
	});

	$('.quantity-minus').on('click', function () {
		let val = parseInt($(this).next('input').val());
		if (val !== 1) {
			$(this).next('input').val(val - 1).change();
		}
		return false;
	});

	/* -----------------------------
	 * Select2 Initialization
	 * https://select2.org/getting-started/basic-usage
	 * ---------------------------*/

	CRUMINA.select2Init = function () {
		$('.crumina--select').select2();
	};

	/* -----------------------------
	 * Toggle Top bar on click
	 * ---------------------------*/
	CRUMINA.toggleBar = function () {
		$topbar.toggleClass('open');
		$body.toggleClass('overlay-enable');
		return false;
	};

	/* -----------------------------
	 * On Click Functions
	 * ---------------------------*/

	//top bar
	$(".top-bar-link").on('click', function () {
		CRUMINA.toggleBar();
	});
	$('.top-bar-close').on('click', function () {
		CRUMINA.toggleBar();
	});

	/* -----------------------
	 * COUNTER NUMBERS
	 * --------------------- */

	CRUMINA.counters = function () {
		const counterValueItem = $('.counter-value');

		counterValueItem.each(function () {
			const _this = $(this);

			_this.waypoint(function () {
				let counterValue = _this.data('count'),
					counterDuration = _this.data('duration') ? _this.data('duration') : 2000;

				var counterAnimation = anime({
					targets: this.element,
					innerHTML: counterValue,
					easing: 'linear',
					round: 1,
					duration: counterDuration,
				});
				this.destroy()
			}, {
				offset: '100%'
			});
		});
	};


	/* -----------------------
	 * Animation For SVG SIGNATURE
	 * --------------------- */

	CRUMINA.animateSignature = function () {
		var $animateIcon = $('.js-animate-icon');

		$animateIcon.each(function () {
			var _this = $(this);

			_this.waypoint(function () {
				anime({
					targets: 'path',
					strokeDashoffset: [anime.setDashoffset, 0],
					easing: "easeInOutCubic",
					duration: 1500,
					delay: 300,
					opacity: 1,
					begin: function (anim) {
						var letters = _this.find("path"), i;

						for (i = 0; i < letters.length; ++i) {
							letters[i].setAttribute("stroke", "currentColor");
							letters[i].setAttribute("fill", "none");
						}
					}
				});

				this.destroy()
			}, {
				offset: '100%'
			})
		});
	};


	/* -----------------------
	* Bootstrap helpers and improvements
	* --------------------- */

	CRUMINA.bootestrapHelper = function () {
		$('#popup-search').on('shown.bs.modal', function () {
			$('.search-popup-input').trigger('focus')
		});
	};

	/* -----------------------
	* Masonry Layout
	* --------------------- */

	CRUMINA.masonryLayout = function () {
		if($('.grid').length){
			var $grid = $('.grid').masonry({
				// options...
				itemSelector: '.grid-item'
			});

			$grid.imagesLoaded().progress( function() {
				$grid.masonry('layout');
			});
		}else {return}
	};

	/* -----------------------
    * Animation For SECTION Elements
    * --------------------- */

	CRUMINA.animateSection = function () {
		var mobileWidthBase = 600;

		if($(window).innerWidth() > mobileWidthBase){
			var sectionAnime = $('.section-anime-js');
			sectionAnime.each(function () {
				var _this = $(this);

				_this.waypoint(function () {

					var elementsfadeInUp= new Array();
					var elfadeInUp = _this.find('.element-anime-fadeInUp-js');

					for (var i = 0; i<elfadeInUp.length; i++) {
						elementsfadeInUp.push(elfadeInUp[i]);
					}

					var elementsOpacity= new Array();
					var elOpacity = _this.find('.element-anime-opacity-js');

					for (var i = 0; i<elOpacity.length; i++) {
						elementsOpacity.push(elOpacity[i]);
					}

					var tl = anime.timeline({
						easing: 'easeOutCirc',
						duration: 1000
					});

					tl
						.add({
							targets: _this[0],
							opacity: 1
						})
						.add({
							targets: elementsfadeInUp,
							translateY: [150, 0],
							duration: 500,
							opacity: 1,
							delay: anime.stagger(100) // increase delay by 100ms for each elements.
						}, "-=750")
						.add({
							targets: elementsOpacity,
							duration: 1000,
							opacity: 1,
							delay: anime.stagger(70) // increase delay by 70ms for each elements.
						});

					this.destroy();

				}, {
					offset: '80%'
				})

			});
		} else {
			var sectionAnime = $('.section-anime-js');
			sectionAnime.each(function () {
				var _this = $(this);

				_this.waypoint(function () {

					var elementsfadeInUp= new Array();
					var elfadeInUp = _this.find('.element-anime-fadeInUp-js');

					for (var i = 0; i<elfadeInUp.length; i++) {
						elementsfadeInUp.push(elfadeInUp[i]);
					}

					var elementsOpacity= new Array();
					var elOpacity = _this.find('.element-anime-opacity-js');

					for (var i = 0; i<elOpacity.length; i++) {
						elementsOpacity.push(elOpacity[i]);
					}

					var tl = anime.timeline({
						easing: 'easeOutCirc',
						duration: 500
					});

					tl
						.add({
							targets: _this[0],
							opacity: 1
						})
						.add({
							targets: elementsfadeInUp,
							translateY: [150, 0],
							duration: 500,
							opacity: 1,
							delay: anime.stagger(500) // increase delay by 70ms for each elements.
						}, "-=750")
						.add({
							targets: elementsOpacity,
							duration: 1000,
							opacity: 1,
							delay: anime.stagger(70) // increase delay by 70ms for each elements.
						});

					this.destroy();

				}, {
					offset: '90%'
				})

			});
		}
	};


	// Fix the submenu on the right side
	CRUMINA.fixMainMenu = function (){
		const mobileWidthBase = 992;
		var submenus = $('.navigation-menu').children("li").find(".navigation-dropdown");

		if($(window).innerWidth() > mobileWidthBase){
			var menu_width = $("body").outerWidth(true);

			for(var i = 0; i < submenus.length; i++){
				var submenusPosition = $(submenus[i]).css("display", "block").offset().left;

				if($(submenus[i]).outerWidth() + submenusPosition > menu_width){
					$(submenus[i]).addClass("navigation-dropdown-left");
				}else{
					if(menu_width == $(submenus[i]).outerWidth() || (menu_width - $(submenus[i]).outerWidth()) < 20){
						$(submenus[i]).addClass("navigation-dropdown-left");
					}
					if(submenusPosition + $(submenus[i]).outerWidth() < menu_width){
						$(submenus[i]).addClass("navigation-dropdown-right");
					}
				}

				/*$(submenus[i]).css("display", "none");*/
			}
		}
	};

	$document.ready(function () {
		CRUMINA.fixMainMenu();
		CRUMINA.select2Init();
		CRUMINA.pieCharts();
		CRUMINA.progresBars();
		CRUMINA.counters();
		CRUMINA.Swiper.init();
		CRUMINA.mainSliderHeight();
		CRUMINA.animateSignature();
		CRUMINA.bootestrapHelper();
		CRUMINA.masonryLayout();
		CRUMINA.animateSection();
	});

	$(window).on('resize', function () {
		setTimeout(function () {
			CRUMINA.mainSliderHeight();
		}, 300);
		CRUMINA.fixMainMenu();
	});

})(jQuery);