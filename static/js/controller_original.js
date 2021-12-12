'use strict';

//로딩바 일괄 처리
/*
$(document).ready(function (){
   setTimeout(function (){
        $('.progress-bar').fadeOut( 1000 );
    },800);
});
*/

//http://noritersand.tistory.com/378
String.prototype.string = function (len) {
	var s = '',
		i = 0;
	while (i++ < len) {
		s += this;
	}
	return s;
};
String.prototype.zf = function (len) {
	return '0'.string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
	return this.toString().zf(len);
};
Date.prototype.oFormat = function (f) {
	if (!this.valueOf()) return ' ';

	var weekName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
	var shotWeekName = ['일', '월', '화', '수', '목', '금', '토'];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|e|hh|mm|ss|a\/p)/gi, function ($1) {
		switch ($1) {
			case 'yyyy':
				return d.getFullYear();
			case 'yy':
				return (d.getFullYear() % 1000).zf(2);
			case 'MM':
				return (d.getMonth() + 1).zf(2);
			case 'dd':
				return d.getDate().zf(2);
			case 'E':
				return weekName[d.getDay()];
			case 'e':
				return shotWeekName[d.getDay()];
			case 'HH':
				return d.getHours().zf(2);
			case 'hh':
				return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case 'mm':
				return d.getMinutes().zf(2);
			case 'ss':
				return d.getSeconds().zf(2);
			case 'a/p':
				return d.getHours() < 12 ? '오전' : '오후';
			default:
				return $1;
		}
	});
};

/**
 * 비동기 사용자 함수
 * @param opt
 *
 * opt.method : 전송방식 기본값 POST (생략가능)
 * opt.url    : 서버호출 URL
 * opt.timeout: 타임아웃 시간 기본값 30초 (생략가능)
 * opt.params : 서버전달 파라미터
 * opt.async  : ajax 비동기/동기 처리 여부
 * opt.success: 입력/수정/삭제 성공 후 호출해야할 콜백함수 입력. 특이사항이 아니면 함수명은 변경하지 않고 사용한다.
 */
function fnAjax(opt) {
	try {
		if (opt && opt.url && !getStorageData(opt.url)) {
			if (!opt.overlap) {
				setStorageData(opt.url, true);
			}

			if (!opt.params) {
				opt['params'] = new Object();
			}
			$.ajax({
				type: opt.method ? 'GET' : 'POST',
				dataType: 'json',
				timeout: opt.timeout ? opt.timeout : 300000,
				url: opt.url,
				data: opt.params,
				async: opt.async == undefined ? true : opt.async,
				beforeSend: function (xhr, settings) {},
				success: function (data, status, xhr) {
					setStorageData(opt.url, false);

					if (fnDefCallback(data, opt)) {
						if (typeof opt.success === 'function') opt.success(data);
					}
				},
				error: function (xhr, status, strError) {
					//ajax Error

					setStorageData(opt.url, false);

					console.log(xhr.readyState, strError);
					// location.href = '/login/login';
				},
				complete: function () {
					if (opt.complete != undefined) opt.complete();
				},
			});
		}
	} catch (e) {
		location.href = '/error/serviceError';
	} finally {
	}
}

/**
 * 파일업로드 비동기 사용자 함수
 * @param opt
 *
 * opt.form    : 파일업로드 Form ID
 * opt.fileUrl : 파일업로드 공통 URL.('/fileUpload.json') 특이사항이 아니면 URL 변경없이 사용한다. (생략가능)
 * opt.url     : 파일업로드 성공 후에 호출할 URL
 * opt.params  : 파일업로드 성공 후에 호출할 URL 파라미터 정보
 * opt.success : 입력/수정/삭제 성공 후 호출해야할 콜백함수 입력. 특이사항이 아니면 함수명은 변경하지 않고 사용한다.
 */
function fnAjaxSubmit(opt) {
	try {
		var enctype = $('#' + opt.form).attr('enctype');

		if (enctype.indexOf('multipart') >= 0) {
			$('#' + opt.form).ajaxSubmit({
				dataType: 'json',
				cache: false,
				url: opt.fileUrl == undefined ? '/comn/fileUpload' : '/comn' + opt.fileUrl,
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				success: function (data) {
					if (fnDefCallback(data, opt)) {
						$.extend(opt.params, { addFile: JSON.stringify(data['addFile']) });

						fnAjax({
							url: opt.url,
							params: opt.params,
							success: opt.success,
						});
					}
				},
			});
		}
	} catch (e) {
		location.href = '/error/serviceError';
	} finally {
	}
}
/**
 *  Ajax 콜백 메세지 함수
 */
function fnDefCallback(data, opt) {
	if (data.RETURN_CODE == '000000000' || data.RETURN_CODE == '000010000') {
		return true;
	}
	switch (data.RETURN_CODE) {
		// 세션 예외 메세지
		case '000000400':
			try {
				//parent.document.location.href = '/view/login.json';
				// parent.document.location.href = '/login/login';
			} catch (e) {
				//location.href = '/view/login.json';
				// location.href = '/login/login';
			}
			break;
		// 권한 예외 메세지
		case '400000001':
		case '400000002':
			fnKendoMessage({
				message: data.RETURN_MSG,
				ok: function (e) {
					location.href = '/ur.html';
				},
			});
			break;
		//주문 예외 메세지
		case '900000001':
		case '900000000':
		case '900000010':
			fnAlert(data.RETURN_MSG);
			break;
		case '900000050':
			fnAlert(data.RETURN_MSG, function (e) {
				locationCartPage();
			});
			break;
		case '999999999':
			location.href = '/error/serviceError';
			break;
		default:
			if (typeof opt.errorFn === 'function') {
				fnAlert(data.RETURN_MSG, opt.errorFn);
			} else {
				fnAlert(data.RETURN_MSG);
			}
			//location.href="/error/system";
			break;
	}

	return false;
}

var templateObjList = new Array();

function fnSetTemplate(id, templateObj) {
	templateObjList[id] = templateObj;
}

function fnGetTemplate(id) {
	return templateObjList[id];
}

/**
 * DATA 바인드 함수
 */
function fnDataBind(id, datas, targetObj) {
	var templateObj = templateObjList[id];
	var html = fnDataBindCompile(templateObj, datas);
	if (html) {
		var newObj;
		if (typeof targetObj == 'undefined') {
			newObj = $(html).insertBefore(templateObj);
		} else {
			newObj = $(html).appendTo(targetObj);
		}
		//이미지 처리
		newObj.find('img[data-original]').lazyload({ placeholder: '/mobile/greating/images/no_item_img.jpg', threshold: 2000 });
		$(window).trigger('scroll');
		//탬플릿 제거
		templateObj.remove();
	}
}

function fnDataBindCompile(templateObj, datas) {
	var html = undefined;
	if (templateObj.html()) {
		var template = Handlebars.compile(templateObj.html());
		html = template(datas);
		if (html.indexOf('nolazyload') == -1 && html.indexOf('swiper-slide') == -1 && html.indexOf('https://www.youtube.com/') == -1) {
			// html = html.replace(/ src=/g, ' data-original=');
		}
	}
	return html;
}

/**
 * 데이터 포멧 함수
 * toNumber     : 12345
 * toPrice      : 12,345
 */
function fnDataFormat(value, mode) {
	var output;
	if (!value) {
		return value;
	}
	switch (mode) {
		case 'toNumber':
			output = parseFloat(value.replace(/,/g, ''));
			if (isNaN(output)) output = 0;
			break;
		case 'toPrice':
			output = Math.ceil(value)
				.toString()
				.replace(/,/, '')
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			break;
	}
	return output;
}

function fnDiscountRate(marketPrice, paidPrice) {
	return Math.round(((marketPrice - paidPrice) / marketPrice) * 100);
}

function fnGetUrlParameter(name) {
	return (
		decodeURIComponent(
			(new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')
		) || null
	);
}

function fnHtmlSpecialCharsDecode(str) {
	if (typeof str == 'string') {
		str = str.replace(/&gt;/gi, '>');
		str = str.replace(/&lt;/gi, '<');
		str = str.replace(/&#039;/g, "'");
		str = str.replace(/&quot;/gi, '"');
		str = str.replace(/&amp;/gi, '&');
		str = str.replace(/&nbsp;/gi, '&nbsp;');
		/* must do &amp; last */
	}
	return str;
}

function fnRemoveHtmlTag(html) {
	return html.replace(/(<([^>]+)>)/gi, '');
}

function fnRemoveSpecialCharacters(obj) {
	var thisObject = obj;
	var str = thisObject.val();
	var isValid = true;
	// 모든 특수문자 제거
	//var pattern = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/gi;
	var pattern = /["@\#$%<>*\-_\’]/gi;
	if (pattern.test(str)) {
		obj.value = str.replace(pattern, '');
		thisObject.val(obj.value);
		isValid = false;
	}
	return isValid;
}

function fnGetBanner(bannerPosition, callbakFn, ilCtgryId) {
	if (ilCtgryId == undefined) {
		ilCtgryId = '';
	}
	// console.log(bannerPosition, callbakFn, ilCtgryId);
	fnAjax({
		url: '/comn/dp/banner/getDpBanner',
		params: {
			ST_CLASSIFICATION_ID_2DEPTH: JSON.stringify(bannerPosition),
			IL_CTGRY_ID: ilCtgryId,
		},
		overlap: true,
		success: function (data) {
			// console.log('banner3 :: ', data)
			var bannerArray = new Array();
			if (data.rows.length > 0) {
				$.each(data.rows, function (i, banner) {
					if (banner.detail.length > 0) {
						/*
                        if (banner.data.BANNER_TYPE == 'B') {//기본
	                        detail = banner.detail[0];
	                    } else {
	                        detail = banner.detail;
	                    }*/
						fnSetTemplate(
							'dvBannerTemplate' + banner.data.ST_CLASSIFICATION_ID_2DEPTH,
							$('.dvBannerTemplate[dvBannerPosition=' + banner.data.ST_CLASSIFICATION_ID_2DEPTH + ']')
						);
						//                        console.log(banner.data, banner.detail);
						fnDataBind('dvBannerTemplate' + banner.data.ST_CLASSIFICATION_ID_2DEPTH, {
							INFO: banner.data,
							DETAIL: banner.detail,
						});

						var bannerName;
						if (this.data.BANNER_NAME == '그리팅 테이블') {
							bannerName = '바른 레시피';
						} else if (this.data.BANNER_NAME == '그리팅 라이프') {
							bannerName = '푸드 라이브러리';
						} else {
							bannerName = this.data.BANNER_NAME;
						}

						// 배너 GA 태깅
						bannerArray.push({
							id: this.data.DP_BANNER_ID,
							name: bannerName,
						});
					}
				});
				fflow.init();

				// 배너 GA 태깅
				gtag('event', 'view_promotion', {
					"promotions": bannerArray,
				});
			}

			if (typeof callbakFn === 'function') {
				callbakFn();
			}
		},
		complete: function () {
			if ($('body').attr('id') == 'main' && bannerPosition[0] == 144) {
				hdFn.hdSlide('.slides__sec .main-slider', {
					arrows: true,
					autoplay: true,
					autoplaySpeed: 3000, // 5초에 한 번
					cssEase: 'linear',
					dots: true,
					appendDots: $('.main-controller'),
					fade: true,
					infinite: true,
					prevArrow: $('.slides__sec .btn__prev'),
					nextArrow: $('.slides__sec .btn__next'),
					speed: 500, // 루프 실행 속도
				});
			}
			if ($('body').attr('id') == 'main' && bannerPosition[0] == 145) {
				hdFn.hdSlide('.slides__sec .banner-slider', {
					arrows: false,
					autoplay: true,
					autoplaySpeed: 3000, // 5초에 한 번
					cssEase: 'linear',
					dots: true,
					appendDots: $('.banner-controller'),
					fade: true,
					infinite: true,
					speed: 500, // 루프 실행 속도
				});
			}
			if ($('body').attr('id') == 'main' && bannerPosition[0] == 771) {
				hdFn.hdSlide('.slides__sec .under-banner-slider', {
					arrows: false,
					autoplay: true,
					autoplaySpeed: 3000, // 5초에 한 번
					cssEase: 'linear',
					dots: true,
					appendDots: $('.under-banner-controller'),
					fade: true,
					infinite: true,
					speed: 500, // 루프 실행 속도
				});
			}
			
		},
	});
}

// alert 창
function fnAlert(msg, okCallBackFunction, okButtonName) {
	fnAlertController(msg, okCallBackFunction, okButtonName);
}

// alert2 창
function fnAlert2(ob, msg, check, hideYn) {
	//	$('.alertBox').remove();
	var parentOb = $('#' + ob).closest('.input-box');
	var msgBoxId = ob + 'Alert';
	var $msgTag = $('<p />', {
		id: msgBoxId,
		class: 'alertBox',
		text: msg,
	});

	// 이미 있는경우
	if (parentOb.find('.alertBox').length > 0 || hideYn == 'Y') {
		if (typeof hideYn != 'undefined') {
			$('#' + msgBoxId).remove();
		} else {
			$('#' + msgBoxId).text(msg);
		}
	} else {
		parentOb.append($msgTag);
	}

	parentOb.find('.alertBox').removeClass().addClass('alertBox');

	if (check == 'true') parentOb.find('.alertBox').addClass('success');
	else parentOb.find('.alertBox').addClass('fail');
}

// confirm 창
function fnConfirm(msg, okCallBackFunction, cancelButton, cancelCallBakFunction, okButtonName) {
	fnConfirmController(msg, okCallBackFunction, true, cancelCallBakFunction, okButtonName);
}
// confirm 창
function fnConfirm(msg, okCallBackFunction, cancelButton, cancelCallBakFunction, okButtonName, cancelButtonName) {
	fnConfirmController(msg, okCallBackFunction, true, cancelCallBakFunction, okButtonName, cancelButtonName);
}

// alert 창 controller
function fnAlertController(msg, okCallBackFunction, okButtonName) {
	if (!templateObjList['dvAlertLayerTemplate']) {
		fnSetTemplate('dvAlertLayerTemplate', $('#dvAlertLayerTemplate'));
	}

	$('#alert-layer').empty();
	fnDataBind('dvAlertLayerTemplate', { MSG: msg }, $('#alert-layer'));

	if (okButtonName) {
		$('#dvAlertOk').text(okButtonName);
	} else {
		$('#dvAlertOk').text('확인');
	}

	if (typeof okCallBackFunction == 'function') {
		$('#dvAlertOk').bind('click', function () {
			okCallBackFunction();
		});
	}

	$('#alert-layer')
		.find('.btn_area button')
		.bind('click', function () {
			// 닫기
			fflow.popupClose($('#alert-layer'));
		});

	// 열기
	fflow.popupOpen($('#alert-layer'));

	$('#dvAlertOk').focus();
}

// confirm 창 controller
function fnConfirmController(msg, okCallBackFunction, cancelButton, cancelCallBakFunction, okButtonName) {
	if (!templateObjList['dvConfirmLayerTemplate']) {
		fnSetTemplate('dvConfirmLayerTemplate', $('#dvConfirmLayerTemplate'));
	}

	$('#confirm-layer').empty();
	fnDataBind('dvConfirmLayerTemplate', { MSG: msg }, $('#confirm-layer'));

	if (cancelButton) {
		if (typeof cancelCallBakFunction == 'function') {
			$('#dvConfirmCancel').bind('click', function () {
				cancelCallBakFunction();
			});
		}
	} else {
		$('#confirm-layer').find('.btn_area').removeClass('half');
		$('#dvConfirmCancel').remove();
	}

	if (okButtonName) {
		$('#dvConfirmOk').text(okButtonName);
	} else {
		$('#dvConfirmOk').text('확인');
	}

	if (typeof okCallBackFunction == 'function') {
		$('#dvConfirmOk').one('click', function () {
			okCallBackFunction();
			modalPopUp.popupClose($(this));
		});
	}

	$('#confirm-layer')
		.find('.btn_area button')
		.bind('click', function () {
			// 닫기
			fflow.popupClose($('#confirm-layer'));
		});

	// 열기
	fflow.popupOpen($('#confirm-layer'));
}

// confirm 창 controller(취소 버튼 수정가능)
function fnConfirmController(msg, okCallBackFunction, cancelButton, cancelCallBakFunction, okButtonName, cancelButtonName) {
	if (!templateObjList['dvConfirmLayerTemplate']) {
		fnSetTemplate('dvConfirmLayerTemplate', $('#dvConfirmLayerTemplate'));
	}

	$('#confirm-layer').empty();
	fnDataBind('dvConfirmLayerTemplate', { MSG: msg }, $('#confirm-layer'));

	if (cancelButtonName) {
		$('#dvConfirmCancel').text(cancelButtonName);
	} else {
		$('#dvConfirmCancel').text('취소');
	}

	if (cancelButton) {
		if (typeof cancelCallBakFunction == 'function') {
			$('#dvConfirmCancel').bind('click', function () {
				cancelCallBakFunction();
			});
		}
	} else {
		$('#confirm-layer').find('.btn_area').removeClass('half');
		$('#dvConfirmCancel').remove();
	}
	
	if (okButtonName) {
		if (okButtonName == '재입고 알림') {
			$('.btn_close').css('visibility', 'visible');
			$('#dvConfirmOk').html("<i class='ico_notify-v2'></i> 재입고 알림");
		} else{
			$('#dvConfirmOk').text(okButtonName);
		}
		
		if (okButtonName == '교환주문하기') {
			$('.btn_close').css('visibility', 'visible');
//			$('#dvConfirmOk').html("<i class='ico_notify-v2'></i> 재입고 알림");
		} else{
			$('#dvConfirmOk').text(okButtonName);
		}
		
		if (okButtonName == '30초만에 본인인증하기') {
			$('.btn_close').css('visibility', 'visible');
//			$('#dvConfirmOk').html("<i class='ico_notify-v2'></i> 재입고 알림");
		} else{
			$('#dvConfirmOk').text(okButtonName);
		}
		
		if (okButtonName == '응모하기') {
			$('.btn_close').css('visibility', 'visible');
//			$('#dvConfirmOk').html("<i class='ico_notify-v2'></i> 교환주문하기");
		} else {
			$('#dvConfirmOk').text(okButtonName);
		}
	} else {
		$('#dvConfirmOk').text('확인');
	}

	if (typeof okCallBackFunction == 'function') {
		$('#dvConfirmOk').one('click', function () {
			okCallBackFunction();
			modalPopUp.popupClose($(this));
		});
	}
	
	$("#confirm-layer").find('.btn_close').bind('click',function() {
		// 닫기
		fflow.popupClose($("#confirm-layer"));
	});

	$('#confirm-layer')
		.find('.btn_area button')
		.bind('click', function () {
			// 닫기
			fflow.popupClose($('#confirm-layer'));
		});

	// 열기
	fflow.popupOpen($('#confirm-layer'));
}

//facebox 에 값을 전달할수가 없어 저장소 따로 만들어둠
var comnStorage = {};
function setStorageData(k, v) {
	comnStorage[k] = v;
}

function getStorageData(k) {
	return comnStorage[k];
}

/**
 * 오늘 날짜를 리턴한다.
 * @param String format
 */
function fnGetToday(fmt) {
	if (fmt == undefined) fmt = 'yyyy.MM.dd';
	return new Date().oFormat(fmt);
}

/**
 *  입력받은 날짜에  일수를 빼어 리턴한다.
 *  @param String 날짜 8자리
 *  @param String 일수
 *  @param String format
 */
function fnGetDayMinus(str, num, fmt) {
	if (fmt == undefined) fmt = 'yyyy.MM.dd';

	var d = str.replace(/\./g, '').replace(/\//g, '');
	var year = d.substring(0, 4);
	var month = d.substring(4, 6);
	var day = d.substring(6, 8);

	var dt = new Date(year, month, day);
	dt.setDate(dt.getDate() - num);

	year = dt.getFullYear();
	month = dt.getMonth();
	day = dt.getDate();
	////console.log( str + ' : -' + num + ' : ' + year +'-'+ month +'-'+ day );
	dt = new Date(year, month - 1, day);
	return dt.oFormat(fmt);
}

/**
 *  입력받은 날짜에  일수를 더하여 리턴한다.
 *  @param String 날짜 8자리
 *  @param String 일수
 *  @param String format
 */
function fnGetDayAdd(str, num, fmt) {
	if (fmt == undefined) fmt = 'yyyy.MM.dd';

	var d = str.replace(/\./g, '').replace(/\//g, '');
	var year = d.substring(0, 4);
	var month = d.substring(4, 6);
	var day = d.substring(6, 8);

	var dt = new Date(year, month, day);
	dt.setDate(dt.getDate() + num);

	year = dt.getFullYear();
	month = dt.getMonth();
	day = dt.getDate();
	////console.log( str + ' : +' + num + ' : ' + year +'-'+ month +'-'+ day );
	dt = new Date(year, month - 1, day);
	return dt.oFormat(fmt);
}

/**
 *  입력받은 날짜에  월을 빼어 리턴한다.
 *  @param String 날짜 8자리
 *  @param String 월수
 *  @param String format
 */
function fnGetMonthMinus(str, num, fmt) {
	if (fmt == undefined) fmt = 'yyyy.MM.dd';

	var d = str.replace(/\./g, '').replace(/\//g, '');
	var year = d.substring(0, 4);
	var month = d.substring(4, 6);
	var day = d.substring(6, 8);

	var dt = new Date(year, month, day);
	dt.setMonth(dt.getMonth() - num);

	year = dt.getFullYear();
	month = dt.getMonth().zf(2);
	day = dt.getDate().zf(2);

	if (month == '0' || month == '00') {
		month = 12;
		year = year - 1;
	}

	////console.log( 'month : ' + str + ' : +' + num + ' : ' + year +'-'+ month.zf(2) +'-'+ day.zf(2) );

	dt = new Date(year, month - 1, day);
	return dt.oFormat(fmt);
}

function SHA256(s) {
	var chrsz = 8;
	var hexcase = 0;

	function safe_add(x, y) {
		var lsw = (x & 0xffff) + (y & 0xffff);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xffff);
	}

	function S(X, n) {
		return (X >>> n) | (X << (32 - n));
	}

	function R(X, n) {
		return X >>> n;
	}

	function Ch(x, y, z) {
		return (x & y) ^ (~x & z);
	}

	function Maj(x, y, z) {
		return (x & y) ^ (x & z) ^ (y & z);
	}

	function Sigma0256(x) {
		return S(x, 2) ^ S(x, 13) ^ S(x, 22);
	}

	function Sigma1256(x) {
		return S(x, 6) ^ S(x, 11) ^ S(x, 25);
	}

	function Gamma0256(x) {
		return S(x, 7) ^ S(x, 18) ^ R(x, 3);
	}

	function Gamma1256(x) {
		return S(x, 17) ^ S(x, 19) ^ R(x, 10);
	}

	function core_sha256(m, l) {
		var K = new Array(
			0x428a2f98,
			0x71374491,
			0xb5c0fbcf,
			0xe9b5dba5,
			0x3956c25b,
			0x59f111f1,
			0x923f82a4,
			0xab1c5ed5,
			0xd807aa98,
			0x12835b01,
			0x243185be,
			0x550c7dc3,
			0x72be5d74,
			0x80deb1fe,
			0x9bdc06a7,
			0xc19bf174,
			0xe49b69c1,
			0xefbe4786,
			0xfc19dc6,
			0x240ca1cc,
			0x2de92c6f,
			0x4a7484aa,
			0x5cb0a9dc,
			0x76f988da,
			0x983e5152,
			0xa831c66d,
			0xb00327c8,
			0xbf597fc7,
			0xc6e00bf3,
			0xd5a79147,
			0x6ca6351,
			0x14292967,
			0x27b70a85,
			0x2e1b2138,
			0x4d2c6dfc,
			0x53380d13,
			0x650a7354,
			0x766a0abb,
			0x81c2c92e,
			0x92722c85,
			0xa2bfe8a1,
			0xa81a664b,
			0xc24b8b70,
			0xc76c51a3,
			0xd192e819,
			0xd6990624,
			0xf40e3585,
			0x106aa070,
			0x19a4c116,
			0x1e376c08,
			0x2748774c,
			0x34b0bcb5,
			0x391c0cb3,
			0x4ed8aa4a,
			0x5b9cca4f,
			0x682e6ff3,
			0x748f82ee,
			0x78a5636f,
			0x84c87814,
			0x8cc70208,
			0x90befffa,
			0xa4506ceb,
			0xbef9a3f7,
			0xc67178f2
		);
		var HASH = new Array(0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19);

		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
		m[l >> 5] |= 0x80 << (24 - (l % 32));
		m[(((l + 64) >> 9) << 4) + 15] = l;
		for (var i = 0; i < m.length; i += 16) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
			for (var j = 0; j < 64; j++) {
				if (j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));

				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}

			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}

	function str2binb(str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for (var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
		}
		return bin;
	}

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, '\n');
		var utftext = '';

		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}

	function binb2hex(binarray) {
		var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
		var str = '';
		for (var i = 0; i < binarray.length * 4; i++) {
			str +=
				hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
				hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
		}
		return str;
	}

	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

/**
 * validation="required "
 * required 필수
 *
 */
function fnValidation($obj) {
	fnValidation.result.success = true;
	fnValidation.result.resultMsg = '';

	$obj.find('[validation]').each(function () {
		var v = $(this).attr('validation');
		//필수값 체크
		if (v.indexOf('required') >= 0) {
			var verbTxt;
			switch (fnValidation.getElementType(this)) {
				case 'select':
					if ($(this).val() == null || !($(this).val().length > 0)) {
						verbTxt = ' 선택해 주세요.';
						//fnValidation.moveScroll( this );
						fnValidation.fail(fnValidation.josa($(this).attr('title'), '를') + verbTxt, $(this));
						return false;
					}
					break;
				case 'checkbox':
					if (!$(this).is(':checked')) {
						verbTxt = ' 체크해 주세요.';
						//fnValidation.moveScroll( this );
						fnValidation.fail(fnValidation.josa($(this).attr('title'), '를') + verbTxt, $(this));
						return false;
					}
					break;
				case 'text':
					if (!($(this).val().length > 0)) {
						verbTxt = ' 입력해 주세요.';
						//fnValidation.changeForcus( this );
						fnValidation.fail(fnValidation.josa($(this).attr('title'), '를') + verbTxt, $(this));
						return false;
					}
					break;
				case 'textarea':
					if (!($(this).val().length > 0)) {
						verbTxt = ' 입력해 주세요.';
						//fnValidation.changeForcus( this );
						fnValidation.fail(fnValidation.josa($(this).attr('title'), '를') + verbTxt, $(this));
						return false;
					}
					break;
			}
		}
		//이메일 형식 체크
		if (v.indexOf('email') >= 0 && $(this).val() != null && $(this).val().length > 0) {
			var emailVal = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
			if (emailVal.test($(this).val()) === false) {
				//fnValidation.changeForcus( this );
				fnValidation.fail(fnValidation.josa($(this).attr('title'), '은') + ' 이메일형식이 아닙니다.', $(this));
				return false;
			}
		}
	});

	return fnValidation.result;
}

fnValidation.result = {};
fnValidation.fail = function (msg, obj) {
	fnValidation.result.success = false;
	fnValidation.result.resultMsg = msg;
	fnValidation.result.obj = obj;
};
fnValidation.changeForcus = function (obj) {
	$(obj).focus();
};
fnValidation.moveScroll = function (obj) {
	var offset = $(obj).offset();
	$('html, body').animate({ scrollTop: offset.top - 200 }, 0);
};
fnValidation.josa = function (txt, josaText) {
	var code = txt.charCodeAt(txt.length - 1) - 44032;
	var cho = 19,
		jung = 21,
		jong = 28;
	var i1, i2, code1, code2;

	// 원본 문구가 없을때는 빈 문자열 반환
	if (txt.length == 0) return '';

	// 한글이 아닐때
	if (code < 0 || code > 11171) return txt;

	if (code % 28 == 0) return txt + fnValidation.josa.get(josaText, false);
	else return txt + fnValidation.josa.get(josaText, true);
};
fnValidation.josa.get = function (josa, jong) {
	// jong : true면 받침있음, false면 받침없음

	if (josa == '을' || josa == '를') return jong ? '을' : '를';
	if (josa == '이' || josa == '가') return jong ? '이' : '가';
	if (josa == '은' || josa == '는') return jong ? '은' : '는';
	if (josa == '와' || josa == '과') return jong ? '와' : '과';

	// 알 수 없는 조사
	return '**';
};
fnValidation.getElementType = function (obj) {
	if (obj.tagName.toLowerCase() == 'select') {
		return 'select';
	} else if (obj.tagName.toLowerCase() == 'input' && obj.type == 'checkbox') {
		return 'checkbox';
	} else if (obj.tagName.toLowerCase() == 'input' && (obj.type == 'text' || obj.type == 'number' || obj.type == 'password')) {
		return 'text';
	} else if (obj.tagName.toLowerCase() == 'textarea') {
		return 'textarea';
	}
};

// fflow 공통 - focus 이동
function fnFocusScrollChange(obj) {
	var $obj = obj;
	popArray[popArray.length - 1].scrollTop = popArray[popArray.length - 1].scrollTop + $obj.offset().top - $('.hd__header').outerHeight();
	$obj.focus();
}

function fnGetPageParam() {
	var vars = [],
		hash;
	var obj = new Object();
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		obj[hash[0]] = decodeURIComponent(hash[1]);
	}
	return obj;
}

function fnTagConvert(str) {
	try {
		str = str
			.replace(/&amp;/g, '&')
			.replace(/&gt;/g, '>')
			.replace(/&lt;/g, '<')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&nbsp;/gi, '&nbsp;');

		//--------------- XSS 방지 스크립트 처리 ----------------------------------------------
		//str.toLowerCase()
		str = str
			.replace(/javascript/g, 'x-javascript')
			.replace(/script/g, 'x-script')
			.replace(/iframe/g, 'x-iframe')
			.replace(/document/g, 'x-document')
			.replace(/vbscript/g, 'x-vbscript')
			.replace(/applet/g, 'x-applet')
			.replace(/embed/g, 'x-embed')
			.replace(/object/g, 'x-object')
			.replace(/frame/g, 'x-frame')
			.replace(/grameset/g, 'x-grameset')
			.replace(/layer/g, 'x-layer')
			.replace(/bgsound/g, 'x-bgsound')
			.replace(/alert/g, 'x-alert')
			.replace(/onblur/g, 'x-onblur')
			.replace(/onchange/g, 'x-onchange')
			.replace(/onclick/g, 'x-onclick')
			.replace(/ondblclick/g, 'x-ondblclick')
			.replace(/enerror/g, 'x-enerror')
			.replace(/onfocus/g, 'x-onfocus')
			.replace(/onload/g, 'x-onload')
			.replace(/onmouse/g, 'x-onmouse')
			.replace(/onscroll/g, 'x-onscroll')
			.replace(/onsubmit/g, 'x-onsubmit')
			.replace(/onunload/g, 'x-onunload');
		//--------------- XSS 방지 스크립트 처리 ----------------------------------------------
	} catch (e) {
		//console.log(e);
	} finally {
		return str;
	}
}

// 영문,숫자,특수문자 혼합하여 8자리~20자리 이내.(비밀번호 표준)
function chkPwd(str) {
	var pw = str;

	//
	if (!fnCheckPasswordLength(pw)) {
		return '영문, 숫자, 특수문자 조합해 8자 이상 입력해주세요.';
	}
	//비밀번호 공백체크
	if (!fnCheckPasswordSpace(pw)) {
		return '비밀번호에 공백이 있습니다.';
	}
	//영문,숫자,특수문자를 혼합체크
	if (!fnCheckMixPwdChar(pw)) {
		return '영문, 숫자, 특수문자 조합해 8자 이상 입력해주세요.';
	}

	return '0';
}
//8자리 ~ 20자리
function fnCheckPasswordLength(pw) {
	if (pw.length < 8 || pw.length > 20) {
		return false;
	}
	return true;
}

//비밀번호 공백체크
function fnCheckPasswordSpace(pw) {
	if (pw.search(/₩s/) != -1) {
		alert('비밀번호는 공백없이 입력해주세요.');
		return false;
	}
	return true;
}

//영문,숫자 혼합체크
function fnCheckMixIdChar(id) {
	var regType1 = /^[A-Za-z0-9+]{6,16}$/;
	if (isNaN(id)) {
		if (regType1.test(id)) {
			return true;
		}
	}

	return false;
}

//영문,숫자, 특수문자를 혼합체크
function fnCheckMixPwdChar(pw) {
	var num = pw.search(/[0-9]/g);
	var eng = pw.search(/[a-z]/gi);
	var spe = -1;
	var speText = '{}[]()<>?_|~`!@#$%^&*-+"\'\\.,/ '; //특수문자 기재.
	for (var i = 0; i < pw.length; i++) {
		if (-1 != speText.indexOf(pw.charAt(i))) spe++;
	}

	if (num < 0 || eng < 0 || spe < 0) {
		return false;
	}
	return true;
}

//연속된 3개의 문자 사용불가
function fnCheckContinuous3Character(str) {
	if (typeof str != 'string') {
		return false;
	}

	var bytes = []; // char codes
	for (var i = 0; i < str.length; ++i) {
		var code = str.charCodeAt(i);
		bytes = bytes.concat([code]);
	}

	var b = bytes;
	var p = str.length;
	// 연속된 3개의 문자 사용불가 (오름차순)
	for (var i = 0; i < (p * 2) / 3; i++) {
		var b1 = b[i] + 1;
		var b2 = b[i + 1];
		var b3 = b[i + 1] + 1;
		var b4 = b[i + 2];

		if (b1 == b2 && b3 == b4) {
			return false;
		} else {
			continue;
		}
	}
	// 연속된 3개의 문자 사용불가 (내림차순)
	for (var i = 0; i < (p * 2) / 3; i++) {
		var b1 = b[i + 1] + 1;
		var b2 = b[i + 2] + 2;

		if (b[i] == b1 && b[i] == b2) {
			return false;
		} else {
			continue;
		}
	}
	return true;
}
//일련숫자 또는 알파벳 순서대로 3자이상 사용하는 비밀번호는 사용불가
function fnCheckDuplicate3Character(str) {
	var p = d.length();
	if (typeof str != 'string') {
		return false;
	}

	var bytes = []; // char codes
	for (var i = 0; i < str.length; ++i) {
		var code = str.charCodeAt(i);
		bytes = bytes.concat([code]);
	}

	var b = bytes;
	for (var i = 0; i < (p * 2) / 3; i++) {
		var b1 = b[i + 1];
		var b2 = b[i + 2];

		if (b[i] == b1 && b[i] == b2) {
			return true;
		} else {
			continue;
		}
	}
	return false;
}
// //callback : function
// function fnLoginCheck(callback) {
// 	fnAjax({
// 		url: '/comn/getSession',
// 		success: function (data) {
// 			if (data.isSession == 'N') {
// 				fnLoginPage();
// 			} else {
// 				if (callback) {
// 					var callbacks = $.Callbacks();
// 					callbacks.add(callback);
// 					callbacks.fire();
// 				}
// 			}
// 		},
// 	});
// }

// function fnLoginChkYN(callback, param) {
// 	fnAjax({
// 		url: '/comn/getSession',
// 		success: function (data) {
// 			if (data.isSession == 'Y') {
// 				var callbacks = $.Callbacks();
// 				callbacks.add(callback);
// 				callbacks.fire();
// 			} else if (data.isSession == 'N') {
// 				//console.log(102938);
// 				fnLoginPage(param);
// 			}
// 		},
// 	});
// }

// function fnLoginPage(param, prevInfo) {
// 	if (param != null || param != undefined) {
// 		if (param.indexOf('prevInfo=PICKUP') != -1) {
// 			prevInfo = 'PICKUP';
// 		}
// 	}

// 	if (param && prevInfo) {
// 		fnConfirm('로그인이 필요한 서비스입니다.<br/>로그인하시겠습니까?', function (e) {
// 			location.href = '/login/login?reurl=' + param;
// 		});
// 	} else if (prevInfo != '' || prevInfo == undefined) {
// 		fnConfirm('로그인이 필요한 서비스입니다.<br/>로그인하시겠습니까?', function (e) {
// 			location.href = '/login/login?reurl=' + encodeURIComponent(location.href) + '&prevInfo=' + prevInfo;
// 		});
// 	} else {
// 		fnConfirm('로그인이 필요한 서비스입니다.<br/>로그인하시겠습니까?', function (e) {
// 			location.href = '/login/login?reurl=' + encodeURIComponent(location.href);
// 		});
// 	}
// }

// //callback : function
// //로그인 상태일때 로그인체크
// function fnLoginCheck2(callback) {
// 	var flag = false;
// 	fnAjax({
// 		url: '/comn/getSession',
// 		success: function (data) {
// 			//console.log(data);
// 			if (data.isSession == 'Y') {
// 				fnAlert('회원 로그인 상태 입니다.');
// 				return;
// 			} else {
// 				if (callback) {
// 					var callbacks = $.Callbacks();
// 					callbacks.add(callback);
// 					callbacks.fire();
// 				}
// 			}
// 		},
// 	});
// }

/**
 * 이메일 체크
 * @param obj, objNm, target
 * @returns{boolean}
 */
function fnCheckEmail(obj, objNm, target) {
	var $obj = $('#' + obj);
	var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!filter.test($obj.val())) {
		//fnAlert(objNm+" 형식을 확인해 주세요.");
		//$obj.val("");
		//if(target != undefined) $("#"+target).focus();
		//else $obj.focus();
		return true;
	} else {
		return false;
	}
}

/**
 * 휴대폰번호 체크
 * @param value, objNm, target
 * @returns{boolean}
 */
function fnCheckMobile(obj, objNm, target) {
	var $obj = $('#' + obj);
	var filter1 = /^\d{3}-\d{3,4}-\d{4}$/;
	var filter2 = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
	if (!filter1.test($obj.val())) {
		//fnAlert(objNm+" 형식을 확인해 주세요.");
		//$obj.val("");
		//$("#"+target).focus();
		return true;
	} else if (!filter2.test($obj.val())) {
		//fnAlert(objNm+" 앞자리는 010,011,016,017 만 가능합니다.");
		//$obj.val("");
		//if(target != undefined) $("#"+target).focus();
		//else $obj.focus();
		return true;
	} else {
		return false;
	}
}

/**
 * 전화번호 및 팩스번호 체크
 * @param value, objNm, target
 * @returns{boolean}
 */
function fnCheckTel(obj, objNm, target) {
	var $obj = $('#' + obj);
	var filter = /^\d{2,3}-\d{3,4}-\d{4}$/;
	if (!filter.test($obj.val())) {
		//alert(objNm+" 형식을 확인해 주세요.\n예) 02-000-0000");
		//$obj.val("");
		//if(target != undefined) $("#"+target).focus();
		//else $obj.focus();
		return true;
	} else {
		return false;
	}
}

/**
 * 숫자체크
 * @param
 * @returns{boolean}
 */
function fnNumCheck(e) {
	if (
		(e.keyCode >= 48 && e.keyCode <= 57) || //숫자열 0 ~ 9 : 48 ~ 57
		(e.keyCode >= 96 && e.keyCode <= 105) || //키패드 0 ~ 9 : 96 ~ 105
		e.keyCode == 8 || //BackSpace
		e.keyCode == 46 || //Delete
		//e.keyCode == 110 ||    //소수점(.) : 문자키배열
		//e.keyCode == 190 ||    //소수점(.) : 키패드
		e.keyCode == 37 || //좌 화살표
		e.keyCode == 39 || //우 화살표
		e.keyCode == 35 || //End 키
		e.keyCode == 36 || //Home 키
		e.keyCode == 109 || //키패드 - 키
		e.keyCode == 189 || //- 키
		e.keyCode == 9 //Tab 키
	) {
		return true;
	} else {
		return false;
	}
}

/**
 * 숫자만 입력 가능 설정
 * @author : 김아란
 * @date : 2017.05.25
 * @returns {void}
 */
function fnCheckNum(obj) {
	var $obj = $('#' + obj);
	$obj.keyup(function () {
		if (!checkNum($obj)) {
			$obj.val('');
			return;
		}
	});
	$obj.blur(function () {
		if (!checkNum($obj)) {
			$obj.val('');
			return;
		}
	});
}

/**
 * 숫자 확인
 * @author : 김아란
 * @date : 2017.05.25
 * @returns {void}
 */
function checkNum($obj) {
	if ($obj != null && $obj.val() != '') {
		if (isNaN($obj.val().replace(/[,-]/gi, ''))) {
			$obj.focus();
			$obj.val('');
			return false;
		}
	}
	return true;
}
/**
 * 바이트 체크 및 최대 입력길이 설정
 * @author : 김아란
 * @param obj, limit, objNm, messagebyte
 * @returns {void}
 */
function initByteCheck(obj, limit, objNm, $messagebyteObj) {
	var thisObject = obj;
	var limit = limit; //제한byte를 가져온다.
	var str = thisObject.val();
	var strLength = 0;
	var strTitle = '';
	var strPiece = '';
	var check = false;
	var beforeLength = 0;

	if (str.length == '') {
		$messagebyteObj.text(0);
	}
	for (var i = 0; i < str.length; i++) {
		var code = str.charCodeAt(i);
		var ch = str.substr(i, 1).toUpperCase();

		//체크 하는 문자를 저장
		strPiece = str.substr(i, 1);

		code = parseInt(code);

		if ((ch < '0' || ch > '9') && (ch < 'A' || ch > 'Z') && (code > 255 || code < 0)) {
			strLength = strLength + 2; //UTF-8 3byte 로 계산
		} else {
			strLength = strLength + 1;
		}

		if (strLength > limit) {
			//제한 길이 확인
			check = true;
			$messagebyteObj.text(beforeLength);
			break;
		} else {
			beforeLength = strLength;
			strTitle = strTitle + strPiece; //제한길이 보다 작으면 자른 문자를 붙여준다.
			$messagebyteObj.text(strLength);
		}
	}
	if (check) {
		//fnAlert(fnValidation.josa(objNm, "는")+" 최대 "+limit+"byte 까지만 입력 가능합니다.");
		fnAlert('최대 입력 글자수를 초과하였습니다.');
		thisObject.val(strTitle);
		thisObject.focus();
	}
}
/**
 * 앞에 세글자 제외한 마스킹 처리
 * @author : 김아란
 * @param str
 * @returns {void}
 */
function fnEndMasking(str) {
	if (str == undefined || str === '') {
		return '';
	}
	var diff;
	var filler = '*';
	var preResult = '';
	var result = '';

	if (str.length < 3) {
		diff = str.length;
		preResult = '';
	} else {
		diff = str.length - 3;
		preResult = str.substring(0, 3);
	}
	for (var i = 0; i < diff; i++) {
		result += filler;
	}
	return preResult + result;
}

/**
 * 전화번호, 휴대폰 하이픈처리
 * type : 0 -> 가운데 번호 x 처리
 * @author : 김아란
 * @param num, type
 * @returns {void}
 */
function fnPhoneFomatter(num, type) {
	var formatNum = '';
	num = num.replace(/\s*$/, ''); //모든 공백제거
	if (num.length == 11) {
		if (type == 0) {
			formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
		} else {
			formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
		}
	} else if (num.length == 8) {
		formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
	} else {
		if (num.indexOf('02') == 0) {
			if (num.length == 9) {
				if (type == 0) {
					formatNum = num.replace(/(\d{2})(\d{3})(\d{4})/, '$1-****-$3');
				} else {
					formatNum = num.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
				}
			}
			if (num.length == 10) {
				if (type == 0) {
					formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
				} else {
					formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
				}
			}
		} else {
			if (num.length == 10) {
				if (type == 0) {
					formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
				} else {
					formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
				}
			}
			if (num.length == 11) {
				if (type == 0) {
					formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-***-$3');
				} else {
					formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
				}
			}
		}
	}
	return formatNum;
}

//넘버 maxlength 일괄 처리
$(document).on(
	{
		input: function () {
			maxLengthCheck(this);
		},
	},
	'input[type=number][maxLength]'
);
function maxLengthCheck(object) {
	if (object.maxLength && object.maxLength != '') {
		if (object.value.length > object.maxLength) {
			object.value = object.value.slice(0, object.maxLength);
		}
	}
}

/**
 * 배송추적 호출 함수
 *
 * @param {Object} shippingId
 * @param {Object} trackingNumber
 */
function fnTraceShip(shippingId, trackingNumber) {
	var status = 'resizable=no, width=1000, height=800, scrollbars=yes';
	window.open('/getTraceShip?shippingId=' + shippingId + '&trackingNumber=' + trackingNumber);
	// location.href = '/getTraceShip?shippingId='+shippingId + '&trackingNumber='+ trackingNumber;

	// if (trackingNumber != "") {
	// fnAjax({
	// url : '/comn/ps/getTraceShip',
	// params : {
	// PS_SHIPPING_ID : shippingId
	// },
	// success : function(data) {
	// if (data.rows != null) {
	// if(S_USER_AGENT_TYPE == 'app'){
	// location.href = '/getTraceShip?shippingId='+shippingId + '&trackingNumber='+ trackingNumber;
	// }
	// else{
	// var targetUrl = data.rows.TRCK_URL;
	// if( data.rows.INV_PARAM !="" ){
	// if( targetUrl.indexOf(data.rows.INV_PARAM+'=') > 0  ){
	// targetUrl = targetUrl + trackingNumber;
	// }else{
	// if( targetUrl.indexOf('?') > 0 ){
	// targetUrl = targetUrl + '&' + data.rows.INV_PARAM + '=' + trackingNumber;
	// }else{
	// targetUrl = targetUrl + '?' + data.rows.INV_PARAM + '=' + trackingNumber;
	// }
	// }
	// }else{
	// targetUrl = targetUrl + trackingNumber;
	// }
	// location.href = targetUrl;
	// }
	// }
	// }
	// });
	// }
}

function fnGridMsg(msg) {
	var html = '';
	html += '<section class="segment-contents">';
	html += '	<p class="regist-nocontent-type1">';
	html += msg;
	html += '	</p>';
	html += '</section>';

	return html;
}

function fnGoUrl(url, bannerPosition) {
	$('<form/>', {
		action: url,
		method: 'POST',
	})
		.hide()
		.appendTo('body')
		// add any data
		.append('<input name="ST_CLASSIFICATION_ID_2DEPTH" />')
		.find('[name=ST_CLASSIFICATION_ID_2DEPTH]')
		.val(JSON.stringify(bannerPosition))
		.end()
		.submit()
		.remove();
}

// 줄바꿈 함수
function fnReplaceLinefeed(text) {
	if (text != null && text != undefined) {
		return new Handlebars.SafeString(text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
	} else {
		return '';
	}
}

/*
	-1001 "-1k"
	-1 "-1"
	0 "0"
	1 "1"
	2.5 "2.5"
	999 "999"
	1234 "1.23k"
	1234.5 "1.23k"
	1000001 "1m"
	1000000000 "1b"
	1000000000000 "1000000000000"
*/
var pow = Math.pow,
	floor = Math.floor,
	abs = Math.abs,
	log = Math.log;
function fnWishNumberRound(n, precision) {
	var prec = Math.pow(10, precision);
	return Math.round(n * prec) / prec;
}
function fnWishNumberFormat(n) {
	var base = floor(log(abs(n)) / log(1000));
	var suffix = 'kmb'[base - 1];
	return suffix ? fnWishNumberRound(n / pow(1000, base), 2) + suffix : '' + n;
}

// sns 공유
function fnSnsShareOpen(url) {
	fflow.popupOpen($('#sns'));

	if (url != null && url != '' && url != undefined) {
		$('#snsUrl').val('http://' + location.host + url);
	} else {
		$('#snsUrl').val(location.href);
	}
}

//facebox 닫힐 때 fflow 초기화
$(document).on('close.facebox', function () {
	setTimeout(function () {
		fflow.init();
	}, 500);
});

/**
 * 공백, null, undefined 쳋크
 * @param val
 * @returns{boolean}
 */
function fnNullBlankChk(val) {
	if (val == null || val == '' || val == undefined) {
		return true;
	} else {
		return false;
	}
}

/**
 * 공백, null, undefined 체크
 * @param val
 * @returns{boolean}
 */
function fnNullBlankReplace(val, replaceText) {
	if (val == null || val == '' || val == undefined) {
		return replaceText;
	} else {
		return val;
	}
}

/**
 * 에이스카운터 스크립트
 * 전환페이지 설정
 */
function nasa(gubun, value) {
	var _nasa = {};
	_nasa['cnv'] = wcs.cnv(gubun, value);
}

/**
 * 생년월일 유효성 체크
 * @param bday
 * @returns
 */
function isBirthDayCheck(bday) {
	var birthdayCheck = RegExp(/^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/);
	var today = fnGetToday('yyyyMMdd');

	if (Number(bday) > Number(today)) {
		return false;
	}
	if (!birthdayCheck.test(bday)) {
		return false;
	}
	return true;
}

function locationChange(url) {
	location.href = url;
}

function locationReload() {
	$('<form/>', {
		action: location.href,
		method: 'GET',
	})
		.hide()
		.appendTo('body')
		.submit()
		.remove();
}

function comnReload() {
	var agent = navigator.userAgent.toLowerCase();
	if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || agent.indexOf('msie') != -1) {
		var hash = window.location.hash;
		var url = window.location.href;
		url = url.replace(hash, '');

		location.href = url;
	} else {
		location.reload();
	}
}

//환경설정값을 조회한다.
function getEnvConfig(keyValues, returnFunctionEnvConfig) {
	var params = { KEYVALUES: keyValues };
	fnAjax({
		url: '/comn/getEnvConfig',
		params: params,
		success: function (data) {
			if (typeof returnFunctionEnvConfig == 'function') {
				returnFunctionEnvConfig(data);
			}
		},
	});
}

//신규서비스 오픈 체크
function getNewServiceOpen(keyValue, returnNewServiceOpen) {
	var params = { KEYVALUE: keyValue };
	fnAjax({
		url: '/comn/getNewServiceOpen',
		params: params,
		success: function (data) {
			if (typeof returnNewServiceOpen == 'function') {
				returnNewServiceOpen(data.newServiceOpenYn);
			}
		},
	});
}