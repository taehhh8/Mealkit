var appType ="";
var sessionYn;
var $topBanner = $('.topBanner');
var $container = $('#contents');


var agent = navigator.userAgent.toLowerCase();

if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {

	/*ie11에서 지원하지 않기 때문에 넣은 prototype */
	String.prototype.replaceAll = function(org, dest) {
	    return this.split(org).join(dest);
	}

}else{
	if (String.prototype.replaceAll==null || String.prototype.replaceAll==undefined ||String.prototype.replaceAll =="" ) {
		/*없으면 무조건 생성 */
		String.prototype.replaceAll = function(org, dest) {
		    return this.split(org).join(dest);
		}
	}
	
}



$(function() {	
	// 메인탑배너
	if(localStorage.getItem("popupExpires"+"Today_MainTopBanner") != undefined){
		$topBanner.hide();
		$container.addClass('hd__main--pt0');
	}
		
	//fnSetTemplate('dvWord', $("#dvWord"));
	// fnSetTemplate('dvSmart', $("#dvSmart"));
	fnSetTemplate('dvdpPopupTemplate', $("#dvdpPopupTemplate"));
	
	// initHeaderEvent();
	
	// setHeaderDesign("trend");
	// getHeaderKwd("trend");
	
	
	/**
	 *  ToDo : 세션이 있는지 체크하는 함수
	 *  function fnSessionCheck()
	 *  향후 공통으로 만들어야 할 듯... 
	 */
	fnAjax({
        url : '/biz/ur/sessionCheck'
       ,success : function (data){
       		if( data.SS_FLAG == 'Y' ){
       			sessionYn = 'Y';
       		} else {
       			sessionYn = 'N';
       		}
   			getGnbInitInfo();
       }
	});
	/*
	if(IS_SESSION =="Y"){
		getMyPageIndexData();	
	}
	*/
	// getHeadMenuYn();  // 헤드 메뉴 노출 여부
	
	// 비밀번호 변경 체크
	getPwCheck();
	
	//매일마켓 카테고리
	getHeaderMarketMunuListData();
	
	//현대장터 카테고리
	/*if(SS_IS_HM_BUYER == "true"){
		getHmCtgryList();
	}*/
	
	// 숫자 특수문자 방지
/*	$(document).on('input', 'input[checkInputUserName=Y]', function(){
		var th = $(this);
		var replaceChar = /[0-9~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
		
		th.val(th.val().replace(replaceChar, ""));
	});*/
	   $(document).on('input', 'input[checkInputUserName=Y]', function(){
           var inputVal = $(this).val();
           var replaceChar = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]/gi;
           if(replaceChar.test(inputVal) == true){
//               $(this).val(inputVal.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]/gi, ''));
               $(this).val(inputVal.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\u318D\u119E\u11A2\u2022\u2025\u00B7\uFE55\u4E10\u3163\u3161]/gi, ''));
           }
       });
	
	// 한글 특수문자 방지
	$(document).on('input', 'input[checkInputId=Y]', function(){
		var th = $(this);
		var replaceChar = /[ㄱ-ㅎㅏ-ㅣ가-힣~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
		
		th.val(th.val().replace(replaceChar, ""));
	});
	// 한글 방지(특수문자 '-', '_', '.') 제외
	$(document).on('input', 'input[checkInputEmail=Y]', function(){
		var th = $(this);
		var replaceChar = /[ㄱ-ㅎㅏ-ㅣ가-힣~!@\#$%^&*\()=+'\;<>\/\`:\"\\,\[\]?|{}]/gi;
		
		th.val(th.val().replace(replaceChar, ""));
	});
	// 이메일용 특수문자 방지(특수문자 '-', '_', '.') 제외
	$(document).on('input', 'input[checkInputJoinEmail=Y]', function(){
		var th = $(this);
		var replaceChar = /[~!@\#$%^&*\()=+'\;<>\/\`:\"\\,\[\]?|{}]/gi;
		
		th.val(th.val().replace(replaceChar, ""));
	});
	// 한글 방지(특수문자 '-', '_', '.', '@') 제외
	$(document).on('input', 'input[checkInputFullEmail=Y]', function(){
		var th = $(this);
		var replaceChar = /[ㄱ-ㅎㅏ-ㅣ가-힣~!\#$%^&*\()=+'\;<>\/\`:\"\\,\[\]?|{}]/gi;
		
		th.val(th.val().replace(replaceChar, ""));
	});
	
	// 휴대폰번호 check
	$(document).on('input', 'input[checkPhoneNumber=Y]', function(){
		var th = $(this);
		var replaceChar = /[^0-9-]/gi;
		
		th.val(th.val().replace(replaceChar, ""));
	});
	// 휴대폰 인증 번호 변경시
	$('[id^=mobile]').on('change keyup paste', function(){
		if($('#sendMobile').hasClass('green')){
			mobileProcCheck = false;
			$('#sendMobile').removeClass('grey').addClass('green').prop('disabled', false);
			$('#smsAuthCountDown').text('남은시간 : 3분 00초');
			$('.certification').hide();
		}
	});
	
	// getDpKwdDp();
	
});


// gnb 영역 정보
function getGnbInitInfo(){
	fnAjax({
         url : '/biz/main/getGnbInfo'
        ,success : function (data){
			if (sessionYn == 'Y') {
				if(data.point_code == "900000001"){
					data.rem_point = 0;
				}
				if(data.rem_point == null || data.rem_point ==""){
					data.rem_point = 0;
				}
				
				$('.gnb_login').addClass(data.GRP_NAME_L);
				$('#orderSubscriptionCnt').text(data.SUBSCRIPTION_CNT);
				$('#couponCnt').text(data.USE_COUPON_CNT);
				$('#pointCnt').text(data.rem_point+"P");
				$('#userName_gnb').text(data.USERNAME);
				$('.gnb_login_text').addClass(data.GRP_NAME_L);
				$('.user_class').text(data.GRP_NAME_U);
				if (data.UR_BAND_ID == "3"){
					$("#myPageUserInfoGrp").text("임직원");
					$("#myPageTotalGrp").css('display', 'none');
					$("#myPageMyGrp").css('display', 'none');
				} else { 
					if (data.GROUP_DC_EXCEPT_YN == "Y") {
						$("#myPageUserInfoGrp").css('display', 'none');
						$("#myPageTotalGrp").css('display', 'none');
						$("#myPageMyGrp").css('display', 'none');
				        $("#myBenefit").remove();
					} else {
						$("#myPageUserInfoGrp").text(data.GRP_NAME+"회원");
					}
				}
				
				//배송중
				if(data.DICount != null){
					$('#myPageUserInfoDICount').html(data.DICount);
				}
				
				//H.point, 스푼
				if(data.ablePoint != null){
					var ablePoint = data.ablePoint;
					if(isNaN(ablePoint) == true) {
						$('#HMemberArea2').hide();
						$('#HMemberArea1').show();
						$('#HMemberArea1').html(data.ablePoint);
					} else {
						$('#HMemberArea1').hide();
						$('#HMemberArea2').show();
						$('#myPageUserInfoHPoint').html(fnDataFormat(data.ablePoint, 'toPrice') +'P');
					}
		        }
		       	$('#myPageUserInfoPoint').html(fnDataFormat(data.my_point, 'toPrice') +'개');
		       	$('#myPageUserInfoGreeneryPoint').html(fnDataFormat(data.GreeneryPoint, 'toPrice') +'P');
		       	$('#myPageUserInfoStaffPoint').html(fnDataFormat(data.StaffPoint, 'toPrice') +'P');
			}
			
			var cartCnt = data.rows[0].CART_CNT;
			$('#cartCnt').text(cartCnt);
        }
    });
}

// 매일마켓 카테고리
function getHeaderMarketMunuListData(){
		
	fnAjax({
        url : '/biz/market/menuListHeader3Depth'
        ,params : {IL_CTGRY_ID : 55}
        ,success : function (data){ 
        	
			if( data.CTGRY_INFO == null ){
                return;
            }
			
			// 2뎁스 카테고리 바인드
			var html = [];
			var subHtml = [];
			$.each(data.TitleCtgryList, function(i, item){
				html.push('<li class="submenu__list" id="cate_slide_id_' + item.IL_CTGRY_ID + '">');
				html.push('	<a href="/market/marketList?ctgryId=' + item.IL_CTGRY_ID + '" class="submenu__list-name"><i class="all-menu__depth2-ico"></i>' + item.CTGRY_NAME + '</a>');
				// 3뎁스 카테고리
				if( item.SubCtgryList.length > 1 ) {
					html.push('<ul class="all-menu__depth3">');
					// 3뎁스 카테고리 목록
					$.each(item.SubCtgryList, function (j , subItem) {
						
						html.push('<li>');
                        html.push('    <a href="/market/marketList?ctgryId=' +  subItem.IL_CTGRY_ID + '">' + subItem.CTGRY_NAME + '</a>');
                        html.push('</li>')
					});
					
				}
				html.push('    </ul>');
				html.push('</li>');
				
				subHtml.push('<li class="box__list"><a href="/market/marketList?ctgryId=' + item.IL_CTGRY_ID + '">' + item.CTGRY_NAME + '</a></li>');
			});
		/*	html.push('<li class="submenu__list">');
			html.push('	<a href="/market/designationList" class="submenu__list-name">오늘의 그리팅</a>');
			html.push('</li>');
			
			subHtml.push('<li class="box__list"><a href="/market/designationList">오늘의 그리팅</a></li>');*/
			
			$('#dvMainMenuCtgryList').html(html.join(' '));
			$('#dvMainMenuSubCtgryList').html(subHtml.join(' '));
			
        }
	});	
}

//현대장터 카테고리
function getHmCtgryList(){
		
	fnAjax({
        url : '/biz/market/getHmCtgryList'
        ,params : {IL_CTGRY_ID : 2139}
        ,success : function (data){ 
        	
			if( data.CTGRY_INFO == null ){
                return;
            }
			
			// 2뎁스 카테고리 바인드
			var html = [];
			var subHtml = [];
			$.each(data.TitleCtgryList, function(i, item){
				html.push('<li class="submenu__list" id="cate_slide_id_' + item.IL_CTGRY_ID + '">');
				html.push('	<a href="/market/marketList?ctgryId=' + item.IL_CTGRY_ID + '" class="submenu__list-name">' + item.CTGRY_NAME + '</a>');
				html.push('</li>');
				
				subHtml.push('<li class="box__list"><a href="/market/marketList?ctgryId=' + item.IL_CTGRY_ID + '">' + item.CTGRY_NAME + '</a></li>');
			});
			
			$('#dvMainHmCtgryList').html(html.join(' '));
			//$('#dvMainHmSubCtgryList').html(subHtml.join(' '));
        }
	});	
}

//스팸단어 체크
function fnSpamChk(content){
	var result = true;
	fnAjax({
        url : '/main/getSpamChkList'
        ,params : {}
		,async : false 
        ,success : function (data){ 

			for(var i=0; i<data.rows.length;i++){
				var item = data.rows[i];
				if(content.indexOf(item.SPAM) != -1){
					result = false;
				}
			}
			
        }
	});	
	return result;
}


// 키워드 > 노출키워드
function getDpKwdDp(){

	if(fnGetUrlParameter("ctgryId") == null || fnGetUrlParameter("ctgryId") == undefined){
		ctgryId = 0;
	}
}


// 로그인
function fnLogin(){
	var link = document.location.href;
	if(link.indexOf('/member/join') != -1 ){
		link = '/';
	}
	location.href='/login/login?reurl=' + encodeURIComponent(link);
}

// 로그아웃
function fnLogout(){
	// sso 토큰 만료 처리
	fnSsoDscdTokent();
	sessionStorage.removeItem('LOGIN_MCUST_NO');
	
	fnAjax({
        url     : "/biz/member/logOut"
        ,type   : "POST"
        ,success : function (data){
        	
        	//IE일 경우 메인에서 새로고침얼럿창이 뜨기 때문에 구분(같은 hash로 href에 넣으면 이동되지 않는 현상이 있음 hash없는 url로 이동)
        	var agent = navigator.userAgent.toLowerCase();
        	
        	if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {

            	var hash = window.location.hash;
            	var url = window.location.href;
            	url = url.replace(hash,"");
            	// 주문서에서 로그아웃시 메인
            	if(url.indexOf('/order/orderPayment') != -1 
            			|| url.indexOf('/myPage') != -1
            			|| url.indexOf('/login/memberAccount') != -1){
            		url = '/';
            	}
            	
            	location.href=url;

        	}else{
        		// 주문서에서 로그아웃시 메인
        		if(window.location.href.indexOf('/order/orderPayment') != -1 
        				|| window.location.href.indexOf('/myPage') != -1
        				|| window.location.href.indexOf('/login/memberAccount') != -1){
        			location.replace('/');
        		}else{
        			location.reload();
        		}
        	}
        }
    });
	
	
}

// sso 토큰 만료 처리
function fnSsoDscdTokent(){
	gfnSsoDscdToknReq(dscdCallback);
}

// sso 토큰만료 콜백
function dscdCallback(data){
//	console.log("data.rtnMsg:"+data.rtnMsg);
	if(data.succYn == "Y"){
//		console.log("토큰 만료처리");
	}
}
/*
function fnCallEventStamp(a,b,c){
	fnConfirm("오늘의 출석체크 완료! "+b+"일 동안 출석하면 쿠폰을 드려요. ( "+a+"/"+b+")", function(e){
		location.href ="/event/goodsEventStamp?ID="+c;
	} ,null, "이벤트 보러가기");
}
*/
/*
function fnSetAppTypeCallByApp(param, param2){
	if(appType ==""){
		fnAjax({
	        url     : "/mobileApp/putSetAppType"
	         ,params : {"APP_TYPE" :param ,"DEVICE_ID" : param2}
	        ,success : function (data){
	        }
	    });
	}
}
*/
function getMyPageIndexData(){
	
    fnAjax({
         url : '/biz/mypage/getMyPageInfo'
        ,overlap : true
        ,success : function (data){
		
			if(data.point_code == "900000001"){
				data.rem_point = 0;
			}	    
			if(data.rem_point == null || data.rem_point ==""){
				data.rem_point = 0;
			}
			/*			
			var tmpUrl = data.DISP_IMG_URL.split('.png');
//			document.getElementById("dvGrade").src = data.DISP_IMG_URL;
			document.getElementById("dvGrade").src = tmpUrl[0]+'_s.png';
			document.getElementById("dvGrade").alt = data.GRP_NAME_M ;
			$('#dvGradeGrp').text(data.GRP_NAME); 
			$('#dvRemPoint').text(data.rem_point+"P");
			*/ 
        }
    });
};

// 비밀번호 변경 체크 여부
function getPwCheck(){
	if(IS_SESSION=="Y" && SS_PW_CHANGE_YN =="Y" && SS_SOCIAL_TYPE == ''){
		var nowUrl = location.pathname;
		if(nowUrl != '/login/memberAccount/pwChange') {
			location.href = '/login/memberAccount/pwChange';
		}
	}
}

function getCaluseView(param){
	$.facebox({ajax:'/popup/termInput?PS_CLAUSE_GRP_ID='+param});
}

// 약관 (그룹ID, 순서)
function getCaluseViewAgree(id, seq){
	fnAjax({
		 url : '/popup/termInput'
		,params : {"PS_CLAUSE_GRP_ID" : id, "seq" : seq}
		,success : function(data) {
			
			fflow.popupOpen($('#joinAgree'));
			
			//$('#title').html(data.title);
			$('#AT').html(data.AT);
			$('#seq').val(data.seq);
		}
	});
}

// 약관 한개씩 가져오기
function showGetCaluseOne(obj){
	fnAjax({
   		 url : "/biz/join/getCaluseContent"
   		,params : obj
   		,success : function (data){
   			$('#'+obj.TARGET).html(data.rows);
   		}
 	});
}

function getDpPopup(IL_CTGRY_ID, MAIN_YN){
	fnAjax({
   	 url : "/dpComn/getDpPopup"
   	,params : {"IL_CTGRY_ID":IL_CTGRY_ID, "MAIN_YN":MAIN_YN}	// [플]윤기연 현대장터의 경우, 메인에서는 팝업을 노출하지 않음
   	,success : function (data){
   		if(data.rows.length > 0){
	   		$.each(data.rows,function(){
	   			var popupCloseYn = "N";
	   			
	   			if(localStorage.getItem("popupExpires"+"Today_"+this.DP_POPUP_ID) != undefined){
	   	   		   	var exTime = new Date(parseInt(localStorage.getItem("popupExpires"+"Today_"+this.DP_POPUP_ID)));
	   	   		   	var sysTime = new Date();

	   	   		   	if(exTime.getTime() <= sysTime.getTime()){
	   	   		   		popupCloseYn = "N";
	   	   		   		localStorage.removeItem("popupExpires"+"Today_"+this.DP_POPUP_ID);
	   	   		   	}else{
	   	   		   		popupCloseYn = "Y";
	   	   		   	}   	   		   	
		   		}  
	   			
	   			if(popupCloseYn != "Y"){
		    		if(this.TODAY_YN == "Y"){
		    			this.TODAYYN = "Y";
		    		}
		    		fnDataBind( 'dvdpPopupTemplate', this, $('#dvdpPopupArea'));

		    		$('#dpPopup_'+this.DP_POPUP_ID).css('left', this.POSITION_LEFT);
		    		$('#dpPopup_'+this.DP_POPUP_ID).css('top', this.POSITION_TOP);
	   			} 
	    	});
   		}
   	}
   });
}

//쿠키 생성
function setCookiePop(name, value, expiredays) {
	var today = new Date();
    today.setDate(today.getDate() + expiredays);
    
    localStorage.setItem("popupExpires"+name, today.getTime());
    document.cookie = name + '=' + escape(value) + '; path=/; expires=' + today.toDateString() + ';'
}

//쿠키 가져옴
function getCookiePop(name){ 
	var cName = name + "="; 
	var x = 0; 
	   
	while(x <= document.cookie.length) 
	{
		var y = (x+cName.length); 
		
		if(document.cookie.substring(x, y) == cName) 
		{ 
			var endOfCookie = document.cookie.indexOf(";", y);
			
			if(endOfCookie == -1){
				endOfCookie = document.cookie.length;
			}
			
			return unescape(document.cookie.substring(y, endOfCookie)); 
		} 
		x = document.cookie.indexOf(" ", x ) + 1; 
		
		if (x == 0) 
		break; 
	} 
	return ""; 
}

function closeDpPopup(item, DP_POPUP_ID){	       
	setCookiePop('Today_'+DP_POPUP_ID,'Y', 1);
	$("#dpPopup_"+DP_POPUP_ID).hide();
}

function closePopup(item, DP_POPUP_ID){	             
	$("#dpPopup_"+DP_POPUP_ID).hide();
}

function closeTopBanner(){	      
	setCookiePop('Today_MainTopBanner','Y', 1);

    $topBanner.hide();
    $container.addClass('hd__main--pt0');
}

function fnCommLogin(){
	var reUrl =  encodeURIComponent(location.href) ;
	location.href = "/login/login?reurl="+reUrl;
}

Handlebars.registerHelper({
	'HELPER_HTML' : function( html ) {
        return new Handlebars.SafeString( fnHtmlSpecialCharsDecode( "<div class='swiper-slide'>" + html +"</div>" ) );
    }
});

function moveOrderDetail(OD_ORDER_ID, OD_ORDER_DETL_ID,CSTMZ_SHIPPING_DIV){
	location.href="/myPage/myOrderDetail?OD_ORDER_ID="+OD_ORDER_ID+"&OD_ORDER_DETL_ID="+OD_ORDER_DETL_ID+"&CSTMZ_SHIPPING_DIV="+CSTMZ_SHIPPING_DIV; 
}

function moveGoodsFlowPage(psShippingId, trackingNumber){

	var params = { PS_SHIPPING_ID : psShippingId, TRACKING_NUMBER : trackingNumber };
	var trackingUrl = '';

	if (psShippingId == "3") {
		fnAlert("이 상품은 택배가 아닌 판매자가 자체배송하는 상품입니다.<br/>배송추적은 판매자에게 문의 바랍니다.");
		return;
	}
	
	fnAjax({
		url: '/comn/ps/getTraceShip',
		params: params,
		success: function(data) {
			if( data.rows == null ) {
				fnAlert('배송추적이 불가한 택배사입니다.');
				return;
			}
			
			trackingUrl = data.rows.TRCK_URL;
			
			if( data.rows.TRANS == 'G' ) {
				trackingUrl += trackingNumber;
			}
			window.open('about:blank').location.href=trackingUrl;
		}
	});
	//window.open('about:blank').location.href="https://ftr.alps.llogis.com:18260/ftr/tracingNView.html?param1="+tracking_number;
}

function moveTrackingDone(tracking_number,od_order_detl_id,status, grp_id, orgOdOrderClaimId, update_claim_flag){

	fnConfirm('해당 상품을 배송완료로 변경하시겠습니까?', function(e) {
		fnAjax({
			url : '/comn/od/order/putOrderDetlChangeStatus'
			,params : { OD_ORDER_DETL_IDS : od_order_detl_id ,TRACKING_NUMBER:tracking_number,STATUS:status, GRP_IDS : grp_id, UPDATE_CLAIM_FLAG: update_claim_flag}
		   	,success : function (data){

				if( data.rows.fail > 0 ){
	        		fnAlert('아래와 같은 사유로 처리되지 못하였습니다.<br/> - ' + data.rows.failInfos[0].MSG, function(){
	        			history.go(0);
	        		});	
	        	}else{
					if (orgOdOrderClaimId && orgOdOrderClaimId > 0) {
						data['OD_ORDER_CLAIM_ID'] = orgOdOrderClaimId;
					}
					orderItemStatusUpdate(data);
					fnAlert('배송완료 되었습니다.');
	        	};
		   	} 
		});
	 }); 
}

function moveChangeStatus(type,od_order_id,od_order_detl_id,grp_id,ur_company_id){
	
	if(type=='C'){
		location.href="/myPage/applyOrderCancel?OD_ORDER_ID="+od_order_id+"&CLAIM_OD_ORDER_DETL_ID="+od_order_detl_id+"&CLAIM_TYPE="+type+"&GRP_ID="+grp_id+"&UR_COMPANY_ID="+ur_company_id;
	}else if(type=='E'){
		location.href="/myPage/applyOrderExchange?OD_ORDER_ID="+od_order_id+"&CLAIM_OD_ORDER_DETL_ID="+od_order_detl_id+"&CLAIM_TYPE="+type+"&GRP_ID="+grp_id+"&UR_COMPANY_ID="+ur_company_id;
	}else if(type=='R'){
		location.href="/myPage/applyOrderReturn?OD_ORDER_ID="+od_order_id+"&CLAIM_OD_ORDER_DETL_ID="+od_order_detl_id+"&CLAIM_TYPE="+type+"&GRP_ID="+grp_id+"&UR_COMPANY_ID="+ur_company_id;
	}else if(type=='CA'){
		//location.href="/myPage/applyOrderCancel?OD_ORDER_ID="+od_order_id+"&CLAIM_TYPE="+type+"&GRP_ID="+grp_id;
		// [플]윤기연 전체취소 방어 로직 추가
		// 선물하기의 경우, 주문자가 주문 취소 전 수취인이 선물수락/거절에 따라 상태가 변경될 수 있음
		// 상태 변경 시 전체취소 불가 
        fnAjax({
			  url		: '/gift/getCancelOrders'
			, params	: {OD_ORDER_ID : od_order_id}
			, success	: function (data) {
				if ( data.info.GIFT_SHIPPING_YN != undefined && data.info.CNT != undefined ) {
					if ( data.info.GIFT_SHIPPING_YN == 'Y' && parseInt(data.info.CNT) > 0 ) {
						fnAlert('주문 상태가 변경된 상품이 있습니다.<br>전체취소는 고객센터로 문의 바랍니다.', function(){return;});
					} else {
						location.href="/myPage/applyOrderCancel?OD_ORDER_ID="+od_order_id+"&CLAIM_TYPE="+type+"&GRP_ID="+grp_id;
					}
				} else {
					location.href="/myPage/applyOrderCancel?OD_ORDER_ID="+od_order_id+"&CLAIM_TYPE="+type+"&GRP_ID="+grp_id;
				}
			}
        });
	}

}

function moveBuyDone(tracking_number,od_order_detl_id,status, update_claim_flag){

	fnConfirm('해당 상품을 구매확정으로 변경하시겠습니까?', function(e) {
		fnAjax({
		   	 url : '/myPage/myOrderList/updateOrderDetailStatus'
		   	,params : { OD_ORDER_DETL_ID : od_order_detl_id ,TRACKING_NUMBER:tracking_number,STATUS:status, UPDATE_CLAIM_FLAG: update_claim_flag}
		   	,success : function (data){
		   		if(data.success >0){
					orderItemStatusUpdate(data);
					fnAlert('구매 확정 되었습니다.');
		   		}else{
		   			alert('구매확정 변경 실패하였습니다.');
		   		}
		   	} 
		});
	 });	
}

function moveClaimStatusChange(claimType,od_order_detl_id,status,orgOdOrderClaimId,update_claim_flag,exchangeAddShippingYn){

	var txtMsg ="교환철회";
	
	if(claimType=='R'){
		txtMsg ="반품철회";
	}

	// 교환철회 (추가배송비 결제 확인)
	if (claimType && exchangeAddShippingYn && /* 클레임타입, 교환추가배송비 존재시 */
		claimType == "E" && exchangeAddShippingYn == "Y") {
		fnAlert("결제된 추가 배송비가 있어 클레임 철회가 불가합니다. 고객센터로 연락 바랍니다.");
		return ;
	}

	fnConfirm("해당 상품을 "+txtMsg+'로 변경하시겠습니까?', function(e) {
		fnAjax({
		   	 url : '/myPage/myOrderList/updateOrderDetailStatus'
		   	,params : { OD_ORDER_DETL_ID : od_order_detl_id ,STATUS:status,OD_ORDER_CLAIM_ID:0, UPDATE_CLAIM_FLAG: update_claim_flag, claimType:claimType}
		   	,success : function (data){
		   		if(data.success >0){
					// 기존 상품상세 클레임아이디 존재시
		   			if (orgOdOrderClaimId > 0) {
						data['OD_ORDER_CLAIM_ID'] = orgOdOrderClaimId;
					}
					orderItemStatusUpdate(data);
					fnAlert(txtMsg + '가 완료되었습니다.');
		   		}else{
					fnAlert(txtMsg+' 실패하였습니다.');
		   		}
		   	} 
		});
	 }); 
}


function fnHpointJoin(){
	//마이페이지 통합회원 전환
	fnAjax({
	   	 url : "/myPage/hpointJoin"
	   	,success : function (data){
	   		var $hpointFrom = $('#hpointFrom');
	   		$hpointFrom.find('[name=host]').val(data.HMEMBERSHIP_API_HOST);
	   		$hpointFrom.find('[name=prtnrId]').val(data.HMEMBERSHIP_API_PRTNR_ID);
	   		$hpointFrom.find('[name=chnnlId]').val(data.HMEMBERSHIP_API_CHNNL_ID);
	   		$hpointFrom.find('[name=custNm]').val(data.CUST_NM);
	   		$hpointFrom.find('[name=birthDt]').val(data.BIRTH_DT);
	   		$hpointFrom.find('[name=mophNo]').val(data.MOPH_NO);
	   		$hpointFrom.find('[name=chId]').val(data.CHID);
	   		$hpointFrom.find('[name=custUniqKey]').val(data.CUST_UNIQ_KEY);
	   		$hpointFrom.find('[name=email]').val(data.EMAIL);
	   		$hpointFrom.find('[name=sexGbCd]').val(data.SEX_GB_CD);
	   		$hpointFrom.find('[name=ptcoAlliPaonInf1]').val(data.BAND_ID);
	   		$hpointFrom.find('[name=ptcoAlliPaonInf2]').val(data.COMPANY_CODE);
	   		$hpointFrom.find('[name=ptcoReqnMdaInf]').val(data.JOIN_PARAMETER);
	   		
	   		var popTitle = 'hpoint_popup';
	   		window.open('', popTitle);
	   		var action = $hpointFrom.find('[name=host]').val() + '/cu/join/start.nhd';
	   		
	   		var testdata = $('#hpointFrom').serialize();
	   		console.log(testdata);
	   		
	   		$hpointFrom.attr('action', action).attr('target', popTitle).submit();
	   	}
	});
	
	event.preventDefault();
}
