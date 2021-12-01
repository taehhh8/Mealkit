$(function () {
	if (IS_SESSION == 'Y') {
		getMyViewItemData();
	} else {
		// 플로팅배너
		getSideSlideBanner();
	}
	setTimeout(getFooterEnvConfig,600);
});

function getSideSlideBanner() {
	fnAjax({
		url: '/comn/dp/banner/getDpBanner',
		params: {
			ST_CLASSIFICATION_ID_2DEPTH: JSON.stringify([531]),
			IL_CTGRY_ID: '',
		},
		overlap: true,
		success: function (data) {
			// console.log('banner3 :: ', data)
			var bannerArray = new Array();
			var sideSlideHtml = '';
			if (data.rows.length > 0) {
				$.each(data.rows, function (i, banner) {
					if (banner.detail.length > 0) {
						for (var i = 0; i < banner.detail.length; i++) {
							sideSlideHtml += '<div class="side-slider__list">';
							sideSlideHtml +=
								'<a href="' + banner.detail[i].URL + '" style="position:static; width: auto; margin-left:0; cursor:pointer;">';
							sideSlideHtml += '<img src="' + banner.detail[i].IMG + '" alt="' + banner.data.BANNER_NAME + '0' + (i + 1) + '"/>';
							sideSlideHtml += '</a></div>';
						}
						// 배너 GA 태깅
						bannerArray.push({
							id: banner.data.DP_BANNER_ID,
							name: banner.data.BANNER_NAME,
						});
					}
				});

				$('#sideSlide').html(sideSlideHtml);

				// 배너 GA 태깅
				gtag('event', 'view_promotion', {
					"promotions": bannerArray,
				});
				hdFn.hdSlide('.side-slide-wrap .side-slide', {
					arrows: true,
					autoplay: true,
					autoplaySpeed: 3000, // 3초에 한 번
					cssEase: 'linear',
					dots: false,
					fade: true,
					infinite: true,
					prevArrow: $('.side-slide-wrap .slide-prev'),
					nextArrow: $('.side-slide-wrap .slide-next'),
					speed: 500, // 루프 실행 속도
				});
				sideBanner();
			}
		},
	});
}

//사이드배너 위치 조정
function sideBanner() {
	var $sideBanner = $('.side-banner');
	if ($('#main').length > 0) {
		$sideBanner.css({ top: '600px' });
	} else {
		$sideBanner.css({ top: '230px' });
	}

	document.addEventListener('scroll', function () {
		var sideBannerTop = $(window).scrollTop() + 100;
		if ($('#main').length > 0) {
			if (sideBannerTop > 600) {
				$sideBanner.css({ top: sideBannerTop });
			}
		} else {
			if (sideBannerTop > 300) {
				$sideBanner.css({ top: sideBannerTop });
			}
		}
	});
}

function getMyViewItemData() {
	var params = { csId: 1, sPage: 0, ePage: 3 };
	fnAjax({
		url: '/myPage/sideBanner/getSideBannerRecentlyList',
		params: params,
		success: function (data) {
			//상품목록
			if (data.total != null && data.total > 0) {
				var sideMyViewItemListHtml = '';
				$.each(data.rows, function () {
					sideMyViewItemListHtml += '<li><a href="/market/marketDetail?itemId=' + this.IL_ITEM_ID + '">';
					sideMyViewItemListHtml += '<img src="' + this.S_IMG + '" alt="' + this.ITEM_NAME + '" /></a></li>';
				});
				$('#sideMyViewItemList').html(sideMyViewItemListHtml);
				$('#sideMyViewItem').show();
				// 플로팅배너
				getSideSlideBanner();
			} else {
				getSideSlideBanner();
			}
		},
	});
}

function getFooterEnvConfig() {
	var keyValues = 'CUSTOMER_CENTER_TEL,CUSTOMER_CENTER_TIME01,CUSTOMER_CENTER_TIME02,';
	keyValues += 'FOOTER_COMPANY,FOOTER_CEO,FOOTER_ADDR01,FOOTER_ADDR02,FOOTER_BUSINESS_LICENSE,';
	keyValues += 'FOOTER_BUSINESS_LICENSE_NUMBER,FOOTER_INTERNET_BUSINESS_LICENSE,';
	keyValues += 'FOOTER_PRIVACY_OFFICER,FOOTER_PRIVACY_EMAIL,FOOTER_HOSTING,FOOTER_COPYRIGHT';
	var params = { KEYVALUES: keyValues };
	fnAjax({
		url: '/comn/getEnvConfig',
		params: params,
		success: function (data) {
			if (location.href.indexOf('serviceCenter') != -1) {
				if ($('#csCenterTel').html() != undefined) {
					$('#csCenterTel').html(data.CUSTOMER_CENTER_TEL);
					$('#csCenterTime').html(data.CUSTOMER_CENTER_TIME01 + '<br>' + data.CUSTOMER_CENTER_TIME02);
				}
			}
			$('#sideBannerCustomerCenter').html(data.CUSTOMER_CENTER_TEL);
			$('#CUSTOMER_CENTER_TEL').html(data.CUSTOMER_CENTER_TEL);
			$('#CUSTOMER_CENTER_TIME').html(
				data.CUSTOMER_CENTER_TIME01 +
					'<br>' +
					data.CUSTOMER_CENTER_TIME02 +
					'<br> 카카오톡 <span class="point"><a href="javascript:csKakao();"  class="icon-area-kakao">@그리팅</a></span> 친구 추가하고 소식과 혜택을 받아보세요.'
			);
			var companyInfoHtml = '대표이사 : ' + data.FOOTER_CEO + ' | ';
			companyInfoHtml += '사업장소재지 : ' + data.FOOTER_ADDR01 + ' ' + data.FOOTER_ADDR02 + '<br>';
			companyInfoHtml +=
				'사업자등록번호 : ' +
				data.FOOTER_BUSINESS_LICENSE +
				' <a href="#" class="winOpen" data-url="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=' +
				data.FOOTER_BUSINESS_LICENSE_NUMBER +
				'">[사업자정보확인]</a> | ';
			companyInfoHtml += '통신판매신고번호 : ' + data.FOOTER_INTERNET_BUSINESS_LICENSE + '<br>';
			companyInfoHtml += '개인정보보호책임자 : ' + data.FOOTER_PRIVACY_OFFICER + '  | ';
			companyInfoHtml += '개인정보 관리 이메일 : ' + data.FOOTER_PRIVACY_EMAIL + '<br>';
			companyInfoHtml += '호스팅 서비스 사업자 : ' + data.FOOTER_HOSTING + '<br>';
			companyInfoHtml += '<p>그리팅의 개별 판매자가 등록한 상품(브랜드직송)에 대한 광고, 상품주문, 배송, 환불의 의무와 책임은 <br>각 판매자가 부담하고, 그리팅은 통신판매 중개자로서의 의무와 책임을 다합니다.</p>';
			companyInfoHtml +=
				'<a href="#" class="winOpen" data-url="https://pg.nicepay.co.kr/issue/IssueEscrow.jsp?Mid=hyundaig5m&CoNo=' +
				data.FOOTER_BUSINESS_LICENSE_NUMBER +
				'">[에스크로 서비스 가입사실 확인]</a><br>';
			$('#COMPANY_NAME').html(data.FOOTER_COMPANY);
			$('#COMPANY_INFO').html(companyInfoHtml);
			$('#COPYRIGHT').html('Copyright &copy; ' + data.FOOTER_COPYRIGHT);
			
			$('#COMPANY_INFO .winOpen')
			.on('click', function(e) {
			    const $this = $(this);
			    const _url = $this.data('url');
			    const options = 'left=0, top=0, width=800, height=1200, resizeble=no, scrollbars=yes, status=no';
			    window.open(_url, '_blank', options);

			    e.preventDefault();
			});
		},
	});
}
