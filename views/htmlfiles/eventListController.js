var pageClickFlag = false;
var pageController;
var hashFlag = false;

var pageSize = 12;

var total = null;
var dataCnt = 0;

var params = { sPage : 1, ePage : pageSize };

var type = fnGetUrlParameter('type');
var typeName;
if (type == '' || type == null || type == undefined) {
	type = "I";
}

$(document).on({
    click : function() {
		type = $(this).attr('dvType');
		$('#eventOngoing').empty();
		$('#eventDone').empty();
		
		$('#dvGoodsEventBannerEmpty').css("display","none");
		$('#dvGoodsEventBannerEnd').css("display","none");		
		
		//파라메터 초기화
		total = null;
		dataCnt = 0;
		params = { sPage : 1, ePage : pageSize };
		
		window.location.hash = "";
		var renewURL = location.href;
		history.pushState(null, null, "?type="+type);
		
		fnTypeChange(type);       
    }
}, '.dvTap');

$(function(){
	$(window.onhashchange = function () {
		if(hashFlag){
			hashFlag = false;
		}else{
			var hashPage = window.location.hash;
			
			if(hashPage != null && hashPage != ""){
				var goHashPage = hashPage.replace("#page", "") * 1;
				pageController.fnPgUtilRead(goHashPage);
			}
		}
	});
	
	pageController = new pageController();
	
	fnSetTemplate('dvEventContentsOngoingTemplate', $("#dvEventContentsOngoingTemplate"));
	fnSetTemplate('dvEventContentsDoneTemplate', $("#dvEventContentsDoneTemplate"));
	
	fnTypeChange(type);
});

function fnGetEvent(){
	var hashPage = window.location.hash;
	
	if(hashPage == null || hashPage == ""){
		window.location.hash = '#page' + 1;
	}
	params["ORDER_BY"] ="START";
	
	if(type == "I"){
		params["AWARD_DISP_YN"] ="N";
		params["STATUS"] = "P";
	} else {
		params["STATUS"] = "E";
	}
	
	pageController.initPage({
         url : '/event/getEvents'
        ,params : params
        ,success : function (data){
        	console.log("data=====", data);
        	total = data.total;
        	
        	if(total ==0){
        		
        		$('#pageNation').css("display","none");
        		
        		if(type == "I"){
					$('#dvGoodsEventBannerEmpty').css("display","");
					$('#dvGoodsEventBannerEnd').css("display","none");
				} else {
					$('#dvGoodsEventBannerEmpty').css("display","none");
					$('#dvGoodsEventBannerEnd').css("display","");					
				}
        		
        	}else{
        		$('#eventOngoing').empty();
        		$('#eventDone').empty();
        		
				$('#pageNation').css("display","");
				
				$.each(data.rows, function(){
					if(type =="I"){
						fnDataBind( 'dvEventContentsOngoingTemplate', this, $('#eventOngoing') );						
					}else{
						fnDataBind( 'dvEventContentsDoneTemplate', this, $('#eventDone') );	
					}
	            });        		
        		
        	}
        	
        	/*
			$(document).scroll(function(){
				if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
					fnGetEvent();
				}
			});

            // 더보기 카운트
			dataCnt += data.rows.length;
			
            params.sPage += data.rows.length;
            params.ePage += pageSize;
            */    			
			
			fflow.init();
			initEvent();
		},
		complete: function() {
        	$('.progress').hide();
        }
    });
};

function initEvent(){
}

function fnPgUtilRead(data){
	hashFlag = true;
	window.location.hash = '#page' + data;
	pageController.fnPgUtilRead(data);
}

function fnBanner(type,id){
	var page = window.location.hash;
	if( type == 1 ) {
		location.href = "/event/eventReview?evEventId="+id+page;
	} else if( type == 2 ) {
		location.href = "/event/eventSurvey?evEventId="+id+page;
	} else if( type == 3 ) {
		location.href = "/event/eventCheckAttendance?evEventId="+id+page;
	} else if( type == 6 ) {
		location.href = "/event/eventTyping?evEventId="+id+page;
	} else if( type == 7 ) {
		location.href = "/event/eventChallenge?evEventId="+id+page;
	} else if( type == 8 ) {
		location.href = "/event/eventCoupon?evEventId="+id+page;	
	} else if( type == 4 ) {
		location.href = "/event/eventRoulette?evEventId="+id+page;
	}
}

function fnWinner(type,id,winnerCnt){
	//당첨발표 이벤트(당첨자가 있을 경우만 당첨발표 페이지로 이동)
	var page = window.location.hash;
	location.href = "/event/winnerDetail?evEventId="+id+page;
	/*
	if(type == 1 || type == 2 || type == 6){
		if(winnerCnt > 0){
			location.href = "/event/winnerDetail?evEventId="+id;
		}else{
			if(type == 1) location.href = "/event/eventReview?evEventId="+id;
			if(type == 2) location.href = "/event/eventSurvey?evEventId="+id;
			if(type == 6) location.href = "/event/eventTyping?evEventId="+id;
		}
	//출석체크 이벤트
	}else if(type == 3){
		location.href = "/event/eventCheckAttendance?evEventId="+id;
	//식사숙고 이벤트
	}else if(type == 7){
		location.href = "/event/eventChallenge?evEventId="+id;
	}
	*/
}

function fnTypeChange(type){
	$('.progress').show();
	$('.eventList__cont').find("li").removeClass("tab-menu__list--on");
	$('.dvTap[dvType='+type+']').parent().addClass("tab-menu__list--on");
	
	$('.tab-content').removeClass("tab-content--show");

	if ( type == "E" ) {
		$('.event-end').addClass("tab-content--show");
		$('.breadcrumb li').last().text("종료된 이벤트");
	} else {
		$('.event-ing').addClass("tab-content--show");
		$('.breadcrumb li').last().text("진행 중 이벤트");
	}
	
	fnGetEvent();
}

Handlebars.registerHelper("switch", function(value,options){
    this.switch_value = value;
    var html = options.fn(this);
    delete this.switch_value;
    return html;
});
Handlebars.registerHelper("case", function(value,options){
    if(value == this.switch_value){
    	return options.fn(this);
    }
});
Handlebars.registerHelper({
	'HELPER_WINNER_CNT' : function(options) {
		if(this.WINNER_CNT > 0){
	    	return options.fn(this);	
		}else{
	    	return options.inverse(this);
		}
	}
});