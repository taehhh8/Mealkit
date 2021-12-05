// pc
var popArray = [];
var popOpenScroll = [];
var stickyItem = [];
var swiperItem = [];
var youtube = [];
var popAniSpeed = 300;
var popZindex = 10000;
var $dim;
var $besongFlag;

var fflow = function() {
	var common = {
		init : function() {
			$wrap = $("#wrap");
			$dim = $("#dimmed");
			/*common.header();*/
			common.queryString();
			common.btnPopup();
			common.radio();
			common.inputDelBtn();
			common.accordion();
			common.tab();
			common.textarea();
			common.countNum();
			common.paycheck();
			common.pageCtr();
			common.starScore();
			common.swiper();
			common.swiperScroll();
			common.postCode();
			common.popupFocusLoop();
			common.checkBox();
			common.video();
			common.imgError();
			/*common.floating();*/
			common.totalSearch();
			common.minCartToggle();
			common.mCustomScrollbar();
			common.fileUp();
			//common.datepicker();
			common.datepicker();
			/*common.select();*/
			common.loading();
		},

		loading : function(show){
			if (show == null) return;
			if (show){
				$("#loading").addClass("show");
			} else {
				$("#loading").removeClass("show");
			}
		},

		select : function(){
			$("select").each(function(i){
				var zIdx = 100 - i;
				var $select = $(this);
				if (!$select.closest(".select").length) {
					var selectClass = $select.attr("class") == null ? "" : $select.attr("class");
					var selectStyle = $select.attr("style") == null ? "" : $select.attr("style");
					$select.wrap("<div class='select "+ selectClass +"' style='"+ selectStyle +" z-index:"+zIdx+"'></div>");
					$select.after("<div class='select_list'><ul></ul></div>");
					$select.after("<button type='button' class='value'></button>");
				} 
				$select.siblings(".select_list").find("ul").empty();
				$select.find("option").each(function(idx){
					$select.siblings(".select_list").find("ul").append("<li><button type='button'>"+$(this).text()+"</button></li>");
					if ( $(this).prop("selected") ){
						$select.siblings(".value").text($(this).text());
					}
				});
			});
			$(".select").each(function(){
				var $this = $(this);
				var $select = $this.find("select");
				var $val = $this.find("button.value");
				$val.off("click.select").on("click.select", function(e){
					if (!$this.hasClass("active")){
						toggleSelect($this, true);
					} else {
						toggleSelect($this, false);
					}
				});
				$select.off("focusin.select").on("focusin.select", function(){
					$val.focus();
				});
				$(this).find("ul button").off("click.select").on("click.select", function(){
					toggleSelect($this, false)
					$val.text($(this).text()).focus();
					$select.find("option:eq("+$(this).parent().index()+")").prop("selected", true);
					$select.change();
				});
				$("html, .ui-datepicker-trigger").off("click.select").on("click.select", function(e){
					toggleSelect($(".select").not($(e.target).closest(".select")), false);
				});
			});
			function toggleSelect($this, toggle) {
				var $select = $this.find("select");
				var $val = $this.find("button.value");
				var $list = $this.find(".select_list");
				if (toggle){
					$list.find("li button").removeClass("active");
					$list.find("li:eq("+$select.find("option:selected").index()+") button").addClass("active");
					$list.stop().slideDown(200, function(){
						$select.siblings(".select_list").mCustomScrollbar({
							advanced:{
								autoScrollOnFocus:false,
								updateOnContentResize:true
							}
						});
					});
					$this.addClass("active");
				} else {
					$list.stop().slideUp(200);
					$this.removeClass("active");
				}
			};
		},

		/*datepicker : function(){
			var $dataPicker = $("[data-datepicker]");

			$( ".cal_data" ).each(function(){
				$dataPicker.datepicker({
					monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
					monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
					dayNames: [ "일", "월", "화", "수", "목", "금", "토" ],
					dayNamesShort: [ "일", "월", "화", "수", "목", "금", "토" ],
					dayNamesMin:[ "일", "월", "화", "수", "목", "금", "토" ],
					dateFormat: 'yy.mm.dd',
					showMonthAfterYear: true,
					showOn: "both",
					defaultDate: 0,
					firstDay: 0,
					constrainInput: true 
				});}
			);

			$(".period_cal").each(function(){
				var $today = new Date();
				var $month =($today .getMonth()-1) - $today .getDate();
				$dataPicker.datepicker("setDate",'0');
				$dataPicker.eq(0).datepicker("setDate",$month);

			});
		},*/

		datepicker : function(){
			$.datepicker.regional['ko'] = {
				buttonImage: "/front_pc/images/ico_datepicker.png",
			    buttonImageOnly: true,
			    buttonText: "Select date",
//				closeText: '닫기',
				prevText: '이전달',
				nextText: '다음달',
				currentText: '오늘', 
				monthNames: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'],
				monthNamesShort: ['1월','2월','3월','4월','5월','6월', '7월','8월','9월','10월','11월','12월'],
				dayNames: ['일','월','화','수','목','금','토'],
				dayNamesShort: ['일','월','화','수','목','금','토'],
				dayNamesMin: ['일','월','화','수','목','금','토'],
				weekHeader: '주',
				dateFormat: 'yy.mm.dd',
				firstDay: 0, 
				isRTL: false, 
				showMonthAfterYear: true, 
				yearSuffix: '년',
				showOn: "button",
				buttonText: "날짜선택",
			};
			$.datepicker.setDefaults($.datepicker.regional['ko']);
			$(".check-cal__data").each(function (){
				var $this = $(this);
				var $input = $this.find("input[type='text']");
				var max = $input.data("maxdate");
				var min = $input.data("mindate");
				var cleave = new Cleave($input, {
					date: true,
					datePattern: ['Y', 'm', 'd']
				});
				$input.datepicker({maxDate:max, minDate:min});
				if ( $this.closest(".check-cal").length ) {
					var minMax = $this.nextAll(".check-cal__data").length ? "minDate" : "maxDate";
					var $siblingsIpt = $this.siblings(".check-cal__data").find("input[type='text']");
					$input.off("change.date").on("change.date", function() {
						var getDate = $(this).datepicker("getDate");
						$siblingsIpt.datepicker( "option", minMax, getDate );
					});
				}
			});
			
			
		},

		minCartToggle : function(active){
			var $miniCart = $("#dvMiniCart");
			if ($(".item_detail_wrap").length) {
				$miniCart.removeClass("fade_out").addClass("bottom");
				$miniCart.show(0, function(){
					if (active != null && !active){
						$miniCart.removeClass("active");
						$dim.stop().fadeOut(400, function(){
							$dim.css({"opacity":"0.5"});
						});
						popArray.pop();
					} else if (active != null && active){
						if (!$miniCart.hasClass("active")){
							$miniCart.css({"z-index":popZindex}).addClass("active");
							$dim.css({"z-index":$miniCart.css("z-index")-1}).stop().fadeTo(400, 0.2);
							popArray.push({
								"popup" : $miniCart,
								"zIndex" : popZindex,
							});
							popZindex = popZindex+100;
						}
					}
				});
			}
			$miniCart.find(".btn_minicart_toggle").off("click.minicartToggle").on("click.minicartToggle", function(){
				common.minCartToggle(!$miniCart.hasClass("active"));
			});
		},

		totalSearch : function(active){
			if (active){
				$(".total_search_layer").fadeIn(200);
			} else {
				$(".total_search_layer").fadeOut(200);
			}
			$("html, .ui-datepicker-trigger").off("click.totalSearch").on("click.totalSearch", function(e){
				if (!$(e.target).closest(".total_search").length && !$(e.target).hasClass("btn_icon_delete")){
					$(".total_search_layer").fadeOut(200);
				}
			});
		},

		video : function(){
			if ((typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') && !$("script[src='https://www.youtube.com/player_api']").length) {
				var tag = document.createElement('script');
				tag.src = "https://www.youtube.com/player_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				//firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				window.onYouTubePlayerAPIReady = function() {
					onLoadYouTubePlayer();
				};
			} else {
				window.onYouTubePlayerAPIReady = function() {
					onLoadYouTubePlayer();
				};
			}
			// onLoadYouTubePlayer();
			function onLoadYouTubePlayer(){
				$(".video .video_frame").each(function(i){
					var $this = $(this).closest(".video");
					var $cover = $(".cover", $this);
					var $btn = $(".video_play", $this);
					var $frame = $(this);
					var videoId = $frame.data("video-id");
					var player;
					if (videoId == null) return;
					$frame.html('<iframe src="https://www.youtube.com/embed/'+videoId+'?enablejsapi=1&showinfo=0&rel=0" data-video-idx="'+i+'" id="video'+i+'" allowfullscreen></iframe>')
					try { 
						player = new YT.Player("video"+i, {
							videoId: videoId,
							events: {
								'onReady': onPlayerReady,
							}
						});
						youtube.push(player);
						function onPlayerReady() {
							$btn.off("click.play").on("click.play", function(){
								$btn.fadeOut(700);
								$cover.fadeOut(700);
								player.playVideo();
							});
						}
						
					} catch (err) {
						alert(err);
					}
				});
			}
		},

		itemDetail : function(){
			$(".item_detail_wrap").each(function(){
				var $this = $(this);
				var $header = $(".header_wrap");
				$(window).off("scroll.itemDetail").on("scroll.itemDetail", function(){
					var a = $this.offset().top - 80;
					var b = $this.offset().top + $this.outerHeight() - $(".item_detail_slide", $this).outerHeight() - 80;
					var scrollTop = $(this).scrollTop();
					if ( scrollTop < a ){
						$this.removeClass("bottom fixed");
					} else {
						$this.addClass("fixed");
						if (scrollTop > b){
							$this.addClass("bottom");
						} else {
							$this.removeClass("bottom");
						}
					}
				}).scroll();
				var fixed = $(".item_detail_slide", this)
			});
		},
		mCustomScrollbar : function(){
			$("[data-custom-scroll]:visible").each(function(){
				if (!$(this).hasClass("hasScroll")){
					$(this).addClass("hasScroll").mCustomScrollbar();
				} else {
					$("[data-custom-scroll]").mCustomScrollbar("update");
				}
			});
		},
		header : function(){
			//$("#gnb > li > a").off("click.header").on("click.header", function(){if ($(this).siblings("ul").length) return false;});
			$("#gnb li").on("focusin.header mouseenter.header").on("focusin.header mouseenter.header", function(e){
				$(this).find("> a").addClass("hover");
				if ($(this).find("ul").length){
					$(this).find("ul").stop().fadeIn(100);
					$("#header").addClass("gnb_open");
				}
			}).off("focusout.header mouseleave.header").on("focusout.header mouseleave.header", function(e){
				$(this).find("> a").removeClass("hover");
				if ($(this).find("ul").length){
					$(this).find("ul").stop().fadeOut(100);
					$("#header").removeClass("gnb_open");
				}
			});
			var lastScrollTop = 0;
			$(window).off("scroll.header resize.header").on("scroll.header resize.header", function(e){
				var st = $(this).scrollTop();
				var limit = (st > lastScrollTop) ? 40 : 500;
				$(".header_wrap").css({"left": -$(this).scrollLeft()+"px"});
				if ($dim.css("display") == "block") return;
				if (st > limit){
					$("#header").attr("data-sticky", "");
				} else {
					$("#header").removeAttr("data-sticky");
				}
				lastScrollTop = st;
			}).scroll();
		},
		postCode : function(){ // 주소 찾기
			var element_wrap = document.getElementById('zipAreaFrame');
			function daumPostcode($item) {
				new daum.Postcode({
					oncomplete: function(data) {
						// 한 지번에 다수 도로명을 가질 경우 기본 도로명 주소 사용 -BJH
						var fullAddr = data.roadAddress == "" ? data.autoRoadAddress : data.roadAddress;
						var extraAddr = '';
						if(data.addressType === 'R'){
							if(data.bname !== ''){
								extraAddr += data.bname;
							}
							if(data.buildingName !== ''){
								extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
							}
							fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
						}
						//if ($item != null){
						var deliveryBool = false;
						if(parent.infoinputShippingType == '6' || parent.infoinputShippingType == '7'
							|| parent.infoinputShippingType == '11' || parent.infoinputShippingType == '16') {
							if (parent.infoinputShippingType == '6') {
								if(parent.infoinputCompanyId != '1') {
									deliveryBool = true;
								}
								if (parent.holyYn == 'Y') {
									deliveryBool = false;
								}
							} else if (parent.infoinputShippingType == '16' && parent.holyYn == 'Y'){
								deliveryBool = false;
							} else {
								deliveryBool = true;
							}
						}
							if(deliveryBool) {
								$item.find("[data-address-postcode]").val(data.zonecode);
								$item.find("[data-address-text]").val(fullAddr);
								$item.find("[data-address-bcode]").val(data.bcode);
								$item.find("[data-address-text2]").focus();
								common.popupClose($("#zipCodeLayer"), null, $item.find("[data-address-text2]"));
							} else {
								//배송가능지역 조회
								var deliveryAreaYN = true;
								try {
									 // 실행할 코드
									deliveryAreaYN = parent.fnDeliveryChk(data.zonecode, data.bcode); // popupDeliveryListController.js
								}
								catch(error) {
									 // 에러시 코드
								}
								finally {
									
								}							

								if(deliveryAreaYN == true){
									$item.find("[data-address-postcode]").val(data.zonecode);
									$item.find("[data-address-text]").val(fullAddr);
									$item.find("[data-address-bcode]").val(data.bcode);
									$item.find("[data-address-text2]").focus();
									common.popupClose($("#zipCodeLayer"), null, $item.find("[data-address-text2]"));
									
									//새벽배송여부체크
									if(parent.infoinputShippingType != '5' && parent.infoinputShippingType != '15')
									{
										var deliveryInfo = {'VISIT_TYPE_CD' : '', 'MSG_TRANS_TYPE_CD' : '', 'RECIP_ADDR1' : fullAddr};
										parent.dawnAddrChk(data.zonecode, data.bcode, deliveryInfo);
									}
								}else{
									var sMsg = '';
									if(parent.infoinputShippingType == '5' || parent.infoinputShippingType == '15'
										|| (parent.infoinputShippingType == '6' && parent.holyYn == 'Y')
										|| (parent.infoinputShippingType == '16' && parent.holyYn == 'Y'))
									{
										for(i=0; i<parent.HBSSItemArray.rows.length; i++)
										{
											if(parent.HBSSItemArray.rows[i].HBSS_DELIVERY_YN == 'N')
											{
												sMsg = sMsg + parent.HBSSItemArray.rows[i].IL_ITEM_NM + '<br>';
											}
										}
										fnAlert(sMsg + "위 상품은 해당 지역 배송이 불가합니다.");
									}
									else
									{
										fnAlert("고객님 죄송합니다.<br><br>선택하신 주소지는<br>택배사 사정으로 배송이 불가합니다.");
									}
								}
							}

						//} else {
							common.popupClose($("#zipCodeLayer"));
						//}
					},
					width : '100%',
					height : 'auto',
				}).embed(element_wrap, {
					autoClose:false,
				});
			}
			$("[data-address-btn]").off("click.zipOepn").on("click.zipOepn", function(){
				var $this = $(this);
				$besongFlag = $this.data('dawm-yn') == 'y' ? true : false;
				
				common.popupOpen($("#zipCodeLayer"), null, $(this));
				daumPostcode($(this).closest("[data-address-wrap]"));
				
			});
		},
		starRang : function(){ // 별점
			$(".star_range").each(function(){
				var $range = $("input[type='text']", this);
				var $state = $(".star_state", this);
				var select = $( "#minbeds" );
				var slider = $(".star_write .inner_star", this).slider({
					value: $range.val(),
					min: 1,
					max: 5,
					step: 1,
					range: "min",
					change: function( event, ui ) {
						$range.val(ui.value);
						switch(ui.value) { // value 5 : 아주 좋음 / value 4 : 좋음 / value 3 : 보통 / value 2 : 별로 / value 1 : 아주 별로
							case 1: $state.text("아주 별로");
								break;
							case 2: $state.text("별로");
								break;
							case 3: $state.text("보통");
								break;
							case 4: $state.text("좋음");
								break;
							case 5: $state.text("아주 좋음");
								break;
							default: return;
								break;
						}
					},
				}).change();
			});
		},
		swiperDestroy : function(objId){
			$.each(swiperItem, function(i, item){
				var targetId = $(item.wrapper).attr("id") || $(item.container).attr("id");
				if (objId === targetId ){
					var $target = $(item.container);
					$target.find(".swiper-button-prev, .swiper-button-next").off("click.swiper");
					$target.removeAttr("data-swiper");
					$target.find(".swiper-pagination").empty();
					$target.find(".swiper-wrapper").removeAttr("style");
					$target.find(".swiper-slide-duplicate").remove();
					item.destroy();
					swiperItem[i] = null;
				}
			});
			$.each(swiperItem, function(i, item){
				if (item === null) swiperItem.splice(i,1);
			});
		},
		swiper : function(){
			$("[data-swiper_group]").each(function(){
				var $this = $(this);
				var slidesPerView = $this.attr("data-swiper_group") == "" ? 1 : $this.attr("data-swiper_group") * 1;
				if ($this.closest(".fflow_pick").length){
					var slidesLength = 1;
				} else {
					var slidesLength = slidesPerView
				}
				if ($this.data("swiper") || $this.find(".swiper-slide").length <= slidesLength) return;
				var $slider = $this.find(".swiper-slide:not('.swiper-slide-duplicate')");
				var total = $slider.length;
				$slider.each(function(idx){
					$(this).attr("data-slide_idx", idx+1);
				});
				$this.attr("data-swiper", true);
				var loop = $this.attr("data-swiper_loop") == "false" ? false : true;
				var center = $this.attr("data-swiper_center") == "true" ? true : false;
				var autoplay = $this.attr("data-swiper_autoplay") !== null ? $this.attr("data-swiper_autoplay") : null;
				var loopAdditionalSlides = center ? 10:0; 
				var $prevEl = $this.find(".swiper-button-prev");
				var $nextEl = $this.find(".swiper-button-next");
				var pagination = $this.find(".swiper-pagination").length ? $this.find(".swiper-pagination")[0] : null;
				//var paginationType = $(this).attr("data-swiper_pagingtype") != "fraction" ? "bullets" :  "fraction";
				var $current = $this.find(".swiper-pagination-current");
				var $total = $this.find(".swiper-pagination-total");
				function currentChk(swiper){
					var $active = $(swiper.activeSlide());
					var current = swiper.activeLoopIndex + 1;
					$current.text(current);
					$total.text(total);
					if (!loop){
						if (current == 1) {
							$prevEl.addClass("disable");
						} else {
							$prevEl.removeClass("disable");
						};
						if (current + slidesPerView -1 == total) {
							$nextEl.addClass("disable");
						} else {
							$nextEl.removeClass("disable");
						}
					}
					$.each(swiper.slides, function(i, t){
						if ($(t).data("slide_idx") == current){
							$(t).attr("data-active", "");
						} else {
							$(t).removeAttr("data-active");
						}
					});

					$(swiper.wrapper).find("[data-video-idx]").each(function(){
						var idx = $(this).attr("data-video-idx");
						try{
							youtube[idx].pauseVideo();
						}
						catch (err){
						
						}
					});

					/*if ($active.find(".fflow_pick_item_sub").length){
						$this.closest(".fflow_pick_swiper").addClass("case1");
					} else {
						$this.closest(".fflow_pick_swiper").removeClass("case1")
					}*/
				}
				var mySwiper = new Swiper(this, {
					onSlideChangeStart : function(swiper){
						currentChk(swiper);
					},
					onSlideChangeEnd : function(swiper){
						currentChk(swiper);
					},
					onTouchEnd : function(swiper){
						currentChk(swiper);
					},
					onInit : function(swiper){
						currentChk(swiper);
						setTimeout(function(){
							if ($this.hasClass("item_detail_slide")){
								$(".swiper-pagination-switch", $this).each(function(idx){
									$(this).html($slider[idx].html());
								});
							}
						}, 100);
					},
					calculateHeight:false,
					resistance:"100%",
					speed: 400,
					slidesPerView:slidesPerView,
					loop:loop,
					loopAdditionalSlides: loopAdditionalSlides,
					roundLengths: true,
					pagination: pagination,
					paginationClickable: true,
					centeredSlides: center,
					autoplay: autoplay,
					autoplayDisableOnInteraction : false,
					//visibilityFullFit:true,
					//calculateHeight:true,
					//eventTarget : 'container',
					//watchActiveIndex:true,
				});
				$prevEl.off("click.swiper").on("click.swiper", function(e){
					e.preventDefault()
					mySwiper.swipePrev();
				});
				$nextEl.off("click.swiper").on("click.swiper", function(e){
					e.preventDefault()
					mySwiper.swipeNext();
				});
				swiperItem.push(mySwiper);
			});
		},
		swiperScroll : function(){
			$("[data-swiper_scroll]").each(function(){
				var swiper = new Swiper(this, {
					slidesPerView: 'auto',
					freeMode: true,
				});
			});
		},
		starScore : function(){
			$(".set_star").each(function(){
				var $star = $(".score", this);
				var $txt = $(".txt > strong", this);
				var score = $(this).data("score");
				$star.css({"width": score * 20+"%"});
				$txt.text(score);
			});
		},
		inputDelBtn : function(){
			$("input[type='text'][data-del-btn]").each(function(){
				if (!$(this).siblings(".del").length) return;
				var $this = $(this);
				var $del = $this.siblings(".del");
				function valChk(){
					if ($this.val() != ""){
						$del.show();
					} else {
						$del.hide();
					}
				}
				valChk();
				$this.off("input.delChk").on("input.delChk", function(){
					valChk();
				});
				$del.off("click.delChk").on("click.delChk", function(){
					$this.val("").focus();
					$del.hide();
				});
			});
		},
		queryString : function(){
			var a = window.location.search.substr(1).split('&');
			if (a == "") return;
			var b = {}; 
			for (var i = 0; i < a.length; i++) { 
				var p=a[i].split('=');
				if (p.length != 2) continue; 
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
			} 
			return b;
		},
		pageCtr : function(){
			if (!common.queryString()) return;
			var pram = common.queryString();
			if (pram['pop']){
				common.popupOpen($("#" + pram['pop']) , 0);
			}
			if (pram['tab']){
				$("[href='#"+pram['tab']+"'], [data-target='#"+pram['tab']+"']").trigger("click");
			}
		},
		popupFocusLoop : function(){
			/*$(".layer_wrap").each(function(){
				var $this = $(this);
				var loopItem = $("<span tabindex='0' class='loopitem'>&nbsp;</span>");
				var focusItem = $this.find("a, input, button, select, textarea, [tabindex]"); 
				$this.append(loopItem).prepend(loopItem.clone(true));
				$(".loopitem", $this).first().on("focusin", function(e){
					if(e.shiftKey && e.keyCode == 9) {
						e.preventDefault();
						$(focusItem[focusItem.length-1]).focus();
					}
				});
				$(focusItem[focusItem.length-1]).on("keydown", function(e){
					if(!e.shiftKey && e.keyCode == 9) {
						e.preventDefault();
						$(focusItem[0]).focus();
					}
				});
			})*/
		},
		popupOpen : function($target, speed, openItem){
			/*if (!$target.length || $target.hasClass("active")) return;
			speed = (speed == null) ?  popAniSpeed : speed;
			if ($target.attr("id")=="dvMiniCart") $target.removeClass("bottom");
			$target.hide().addClass("active").css({"z-index":popZindex}).stop().fadeIn(speed, function(){
				if ($target.outerHeight() % 2 != "0"){
					$target.addClass("clear_blur");
				}
			}).focus();
			$dim.css({"z-index":$target.css("z-index")-1}).stop().fadeIn(speed);
			if (!popArray.length){
				popOpenScroll = [$(window).scrollTop(), $(window).scrollLeft()];
				$wrap.addClass("fade_out").scrollTop(popOpenScroll[0]).scrollLeft(popOpenScroll[1]);
				setTimeout(function(){
					$("#floating.bottom, #history.bottom").css({
						"position":"fixed",
						"bottom":$(window).height()-$("#footer").offset().top+"px"
					});
				},0);
			}
			popArray.push({
				"popup" : $target,
				"zIndex" : popZindex,
			});
			popZindex = popZindex+100;
			common.mCustomScrollbar();*/
			// 프론트엔드 수정
			if (!$target.length || $target.hasClass("active")) return;
			var aniSpeed = (speed ==="undefined") ?  popAniSpeed : speed;
			var $fadeItem = ($(".layer_wrap.active, .pop_wrap.active").length) ? $(popArray[popArray.length-1].obj) : $(".wrap");
			var $layerHeader = $(".sticky [data-sticky_inner], .layer_header, .layer_btn", $fadeItem);
			var $layerBottom = $(".mini_cart_wrap, .sys_pop_btn_inner", $fadeItem);
			var $dim = $(".mask");
			popArray.push({
				"obj" : $target,
				"fadeItem" : $fadeItem,
				"scrollTop" : $(window).scrollTop()
			});
			$target.addClass("active").css({"z-index":popZindex}).stop().fadeIn(aniSpeed);
			$dim.css({"z-index":$target.css("z-index")-1}).stop().fadeIn(aniSpeed);
			popZindex = popZindex+100;
		},
		popupClose : function($target, speed, openItem){
			/*if (!$target.length || !$target.is(":visible")) return;
			if (!$dim.length){
				//console.log("dim 없음")
			}
			speed = (speed == null) ?  popAniSpeed : speed;
			$target.removeClass("active").stop().fadeOut(speed, function(){
				if ($(".item_detail_wrap").length && $target.attr("id")=="dvMiniCart") {
					$target.css({"z-index":"9000"}).show().addClass("fade_out bottom");
				}
			});
			popArray.pop();
			if (popArray.length){
				//console.log(1)
				var thisCase = $("#dvMiniCart").hasClass("bottom") ? "case2" : "case1";
				$("#popup_wrap").addClass(thisCase);
				$dim.stop(true,true).fadeOut(speed, function(){
					if (popArray.length) $dim.show().css({"z-index":popArray[popArray.length-1].zIndex - 1 });
					$("#popup_wrap").removeClass(thisCase);
				});
			} else {
				$dim.stop(true,true).fadeOut(speed, function(){
					//console.log(thisCase)
					$("#popup_wrap").removeClass(thisCase);
					$wrap.removeClass("fade_out");
					$("html, body").scrollTop(popOpenScroll[0]).scrollLeft(popOpenScroll[1]);
				});
			}*/
			// 프론트엔드 수정
			if (!$target.length) return;
			var aniSpeed = (speed ==="undefined") ?  popAniSpeed : speed;
			var popUpScrollTop = $(window).scrollTop();
			var $layerHeader = $(".layer_header", $target);
			var $layerBottom = $(".sys_pop_btn_inner", $target);
			var $dim = $(".mask");
			popZindex = popZindex-100;
			if (popArray.length == 1){
				if($(".mini_cart_wrap.on").length >= 1) {
					$dim.css({"z-index":"9010"});
				} else {
					$dim.stop().fadeOut(aniSpeed);
				}
			} else {
				$dim.css({"z-index":$target.css("z-index")-101});
			}
			$target.removeClass("active").addClass("fade_out");
			$target.stop().fadeOut(aniSpeed, function(){
				$target.removeClass("fade_out");
				//$dim.stop().fadeOut(aniSpeed);
				
				$.each(popArray, function (i, val) {
					if(val != undefined){
						if ($(val.obj).attr("id") === $target.attr("id")) {
							popArray.splice(i, 1);
							return;
						}
					}
				});
			});
		},
		btnPopup : function(){
			$("[data-popup_open]").off("click.openPop").on("click.openPop",function(){
				var target = $("#"+$(this).data("popup_open"));
				common.popupOpen($(target),null,$(this));
			});
			$("[data-popup_close]").off("click.closePop").on("click.closePop",function(){
				var target = ($(this).data("popup_close") == "" ) ? $(this).closest(".layer_wrap") : $("#"+$(this).data("popup_close"));
				common.popupClose($(target));
			});
			$(document).off("keyup.esc").on("keyup.esc", function(e){
				if (e.keyCode == "27" && popArray.length){
					common.popupClose($(popArray[popArray.length-1].popup))
				}
			});
		},
		tab : function(){
			$("[data-tab]").each(function(){
				var $this = $(this);
				$("a", this).off("click.tabClick").on("click.tabClick", function(e){
					e.preventDefault();
					var $target = $(this).attr("href") || $(this).data("target");
					$this.find("a").removeClass("active");
					$(this).addClass("active");
					$($target).show().siblings(".tab_cont").hide();
				});
			});
		},
		accordion : function(){
			$("[data-acd-title]").each(function(){
				var $acd = $(this).closest("[data-acd]");
				var $tit = $(this);
				var $cont = $($tit.attr("href"));
				var custom1 = $acd.data("acd") == "custom1" ? true:false;
				$tit.off("click.acdEvent").on("click.acdEvent",function(e){
					e.preventDefault();
					acdChk($tit.hasClass("on"), 400);
				});
				acdChk(!$tit.hasClass("on"), 0);
				function acdChk(chk, acdSpeed){
					if(chk){
						$tit.removeClass("on");
						$acd.removeClass("on");
						$cont.stop(true,true).slideUp(acdSpeed);
					}else{
						$tit.addClass("on");
						$acd.addClass("on");
						$cont.stop(true,true).slideDown(acdSpeed, function(){
							common.mCustomScrollbar();
						});
						if(custom1){
							$acd.siblings("[data-acd]").each(function(){
								var $acd = $(this)
								var $tit = $(this).find("[data-acd-title]");
								var $cont = $($tit.attr("href"));
								$tit.removeClass("on");
								$acd.removeClass("on");
								$cont.stop(true,true).slideUp(acdSpeed);
							});
						}
					}
				}
			});
		},
		checkBox : function(){
			/*var $check = $("input[type='checkbox']"),
				$checkAll = $("input[type='checkbox'][data-all-chk]");

			//all check
			$checkAll.off("change.allChk").on("change.allChk", function(){
				var $allCheck = $(this).attr("name");
				if($(this).prop("checked")){
					$("input[name="+$allCheck+"]").prop("checked", true).parents(".checks").addClass("on")
				}else{
					$("input[name="+$allCheck+"]").prop("checked", false).parents(".checks").removeClass("on")
				}
			}).change();

			function chageCheck($obj){
				if($obj.prop("checked")){
					$obj.parents(".checks, label, .like").addClass("on");
				}else{
					$obj.parents(".checks, label, .like").removeClass("on");
				};
			};
			$check.off("change.chk").on("change.chk",function(e){
				if ($(this).hasClass("disabled")) return false;
				chageCheck($(this));
			}).change();*/
		},

		radio : function(){
			$("input[type='radio']").off("change.chk").on("change.chk",function(){
				var name = $(this).attr("name");
				radio(name);
			});
			radio();
			function radio(name){
				var $target = (name == null) ? $("input[type='radio']") : $("input[type='radio'][name='"+name+"']");
				$target.each(function(){
					var id = $(this).attr("id");
					if ($(this).prop("checked")){
						$(this).parents("label, .checks").addClass("on");
						$("label[for='"+id+"']").addClass("on");
					} else {
						$(this).parents("label, .checks").removeClass("on");
						$("label[for='"+id+"']").removeClass("on");
					}
				});
			}
		},

		paycheck : function(){
			var $tabBtn = $("[data-js='paytab']").find("span"),
				$radio =  $("[data-js='paytab']").find("input[type='radio']");
			$tabBtn.off("click.paytab").on("click.paytab", function(){
				var $target = $(this).attr("data-tab");
				$("#"+$target).addClass("on").siblings(".tab_con").removeClass("on");
			});
			function chageRadio(obj){
				if($(obj).prop("checked")){
					$("input[type='radio'][name="+$(obj).attr('name')+"]").parent(".paycheck").removeClass("on");
					$(obj).parent(".paycheck").addClass("on");
				}
			};
			$radio.off("change.chk").on("change.chk",function(){
				chageRadio($(this));
			}).each(function(){
				chageRadio($(this));
			});
		},
		countNum : function(){
			$(".prd_length").each(function(){
				var $num = $("input", this);
				var $up = $(".btn_st1_plus", this);
				var $down = $(".btn_st1_minus", this);
				var max = $num.attr("max") ? $num.attr("max") : 9999;
				$up.off("click.countNum").on("click.countNum", function(){
					count = Math.min($num.val()*1+1, max);
					$num.val(count).change();
				});
				$down.off("click.countNum").on("click.countNum", function(){
					count = Math.max($num.val()*1-1, 1);
					$num.val(count).change();
				});
			});
		},
		imgError:function(){
			$("img").on("error", function(){
				$(this).attr("src", "/pc/greating/images/no_item_img.jpg");
			});
		},
		floating : function(){
			var $floating = $("#history, #floating");
			$(window).off("scroll.floating resize.floating").on("scroll.floating resize.floating", function(){
				var st = $(this).scrollTop();
				var limit = $("#footer").offset().top - $(window).height();
				//$stickyHistory.css({"left": -$(this).scrollLeft()});
				if (st >= limit){
					$floating.css({
						"position":"absolute",
						"bottom":$("#footer").outerHeight()+"px"
					}).addClass("foot_type");
				} else {
					$floating.css({
						"position":"fixed",
						"bottom":"0px"
					}).removeClass("foot_type");
				}
			}).resize();
			$("#floating").each(function(){
				$layer = $(".floating_bnr_wrap", this);
				$btnOpen = $(".floating_bnr_open", this);
				$btnClose = $(".btn_close", $layer);
				$btnOpen.off("click.floating").on("click.floating",function(){
					$layer.show()
					$btnClose.focus();
				});
				$btnClose.off("click.floating").on("click.floating",function(){
					$layer.hide();
					$btnOpen.focus();
				});
				$("html, .ui-datepicker-trigger").off("click.floating").on("click.floating", function(e){
					if ( !$(e.target).closest("#floating").length ) $layer.hide();
				});
			});
		},
		fileUp : function(){
			$(".file_box").each(function(){
				var $this = $(this);
				var $text = $this.find("p");
				var $btnDel = $this.find(".btn_icon_delete");
				var $input = $this.find("input[type='file']");
				$input.off("change.fileUp input.fileUp").on("change.fileUp input.fileUp", function() {
					var filename = $(this).val().split("\\").pop();
					$this.addClass("up");
					$text.text(filename);
					if($(this).val() == ""){
						$this.removeClass("up");
						$text.text("선택된 파일이 없습니다.");
					}else{
						$this.addClass("up");
						$text.text(filename);
					}
				})
				$btnDel.off("click.fileUp").on("click.fileUp", function(){
					$input.val("").change();
				});
			});
		},
		textarea : function(){
			function fnChkByte(obj, maxByte, count){
				var str = obj.val();
				var str_len = str.length;
				var rbyte = 0;
				var rlen = 0;
				var one_char = "";
				var str2 = "";
				for(var i=0; i<str_len; i++){
					one_char = str.charAt(i);
					if(escape(one_char).length > 4){
						rbyte += 2;
					}else{
						rbyte++;
					}
					if(rbyte <= maxByte){
						rlen = i+1;
					}
				}

				if(rbyte > maxByte){
					str2 = str.substr(0,rlen);
					obj.val(str2);
					//console.log(str2)
					fnChkByte(obj, maxByte, count);
				}else{
					count.html(rbyte)
				}
			}
			$(".count_text_box").each(function(){
				var $textarea = $(this).find("textarea");
				var $count = $(this).find(".text_count span");
				var $max = $textarea.attr("maxlength") == null ? $textarea.data("maxlength") : $textarea.attr("maxlength");
				$textarea.removeAttr("maxlength").attr("data-maxlength", $max);
				$textarea.off("input.count").on("input.count", function(){
					fnChkByte($textarea, $max, $count);
				}).keydown();
			});

		},
		paymentSelect : function(){
			$(".payment_select input").on("change", function(){
				var id = $(this).attr("id");
				if ( $(this).prop("checked") ){
					$(".payment_cont[data-payment_cont="+id+"]").show().siblings(".payment_cont").hide();
				}
			}).change();
		},
	}
	return common;
}();

$(document).ready(function() {
	fflow.init();
});
