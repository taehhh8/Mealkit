var params = {};

var IL_ITEM_FILTER_ID = fnGetUrlParameter('IL_ITEM_FILTER_ID');
var IL_ITEM_FILTER_ID2 = fnGetUrlParameter('IL_ITEM_FILTER_ID2');
var AL_FILTER_ID = fnGetUrlParameter('AL_FILTER_ID');
var IL_ITEM_TEXT = fnGetUrlParameter('IL_ITEM_TEXT');
var IL_ITEM_FILTER_ID4 = fnGetUrlParameter('IL_ITEM_FILTER_ID4');

$(function(){	
	
	fnSetTemplate('dvFilterGrpTemplate', $("#dvFilterGrpTemplate"));
	fnSetTemplate('dvFilterListTemplate', $("#dvFilterListTemplate"));
	
	fnGetSearchMarketData();

});

function fnGetSearchMarketData(){

	fnAjax({
		url : '/search/getItemFilterList'
		,params : {}
		,success : function(data){

			$('#dvGetFilterArea').empty();
			
			$.each(data.result, function(i, x) {
				fnDataBind( 'dvFilterGrpTemplate', this, $('#dvGetFilterArea'));
            	$.each(x.filterList, function(i, y) {
            		fnDataBind( 'dvFilterListTemplate', this ,$('#dvFilterGrpSubTemplate'+y.FILTER_GRP_CODE));    					
            	}); // data  
            });
			
			initSearchEvent();
			
			if(IL_ITEM_FILTER_ID != '' && IL_ITEM_FILTER_ID != null && IL_ITEM_FILTER_ID != undefined) {
				setChecked();
			}	
			
			if(IL_ITEM_FILTER_ID2 != '' && IL_ITEM_FILTER_ID2 != null && IL_ITEM_FILTER_ID2 != undefined) {
				setChecked();
			}
			
			if(AL_FILTER_ID != '' && AL_FILTER_ID != null && AL_FILTER_ID != undefined) {
				setChecked();
			}
			
			if(IL_ITEM_FILTER_ID4 != '' && IL_ITEM_FILTER_ID4 != null && IL_ITEM_FILTER_ID4 != undefined) {
				setChecked();
			}
			
			if(IL_ITEM_TEXT != '' && IL_ITEM_TEXT != null && IL_ITEM_TEXT != undefined && IL_ITEM_TEXT != 'null') {
				$('#searchInput').val(IL_ITEM_TEXT);
				$('#searchInput2').val(IL_ITEM_TEXT);
			}
			
		}
	});	
}

function setChecked(){
	var idArr = new Array();
	var tmpIds ="";
	if(IL_ITEM_FILTER_ID != null){ //선호하는 재료가 있으신가요 ID list
		if(tmpIds.length >0){
			tmpIds += ","+IL_ITEM_FILTER_ID;
		}else{
			tmpIds += IL_ITEM_FILTER_ID;
		}
	}
	if(IL_ITEM_FILTER_ID2 != null){ //어떤 요리를 좋아하세요 ID list
		if(tmpIds.length >0){
			tmpIds += ","+IL_ITEM_FILTER_ID2;
		}else{
			tmpIds += IL_ITEM_FILTER_ID2;
		}
	}
	if(AL_FILTER_ID != null){ //빼고 싶은 재료가 있으신가요 ID list
		if(tmpIds.length >0){
			tmpIds += ","+AL_FILTER_ID;
		}else{
			tmpIds += AL_FILTER_ID;
		}
	}
	
	if(IL_ITEM_FILTER_ID4 != null){ //선호하는 보관방법이 있으신가요 ID list
		if(tmpIds.length >0){
			tmpIds += ","+IL_ITEM_FILTER_ID4;
		}else{
			tmpIds += IL_ITEM_FILTER_ID4;
		}
	}
	
	if(tmpIds != ""){
		idArr = tmpIds.split(',');
	}
	
	for(var i = 0;i < idArr.length;i++){
		$("#filter_"+idArr[i]).attr("checked", true);
		$("#filter_"+idArr[i]).parent().addClass("on");
	}
}

function initSearchEvent(){
	
	$('#searchInput').bind().keyup(function(e){
		if(e.keyCode==13){
			getItemFilterSearch();
		}
	});
	
	$('#searchInput2').bind().keyup(function(e){
		var ITEM_SRH_TEXT_VAL = $('#searchInput2').val();	
		if((ITEM_SRH_TEXT_VAL == undefined || ITEM_SRH_TEXT_VAL == null || ITEM_SRH_TEXT_VAL.trim() == '')){
		}
		else {
			if(e.keyCode==13){
				getItemFilterSearch2();
			}
		}
	});
	
   	//분류 검색 버튼
	$('#dvSrhFilterBtn').on('click',function(){
		getItemFilterSearch();
	});
	//분류 검색 버튼
	$('#dvSrhFilterBtn2').on('click',function(){
		var ITEM_SRH_TEXT_VAL = $('#searchInput2').val();	
		if((ITEM_SRH_TEXT_VAL == undefined || ITEM_SRH_TEXT_VAL == null || ITEM_SRH_TEXT_VAL.trim() == '')){
			$('#searchInput').val('');
			modalPopUp.popupOpen($("#searchPopup"));
		}
		else {
			getItemFilterSearch2();
		}
	});
	// 검색 팝업 하단 선택완료 버튼 -BJH
	$('#dvSrhFilterSelectBtn').on('click',function(){
		getItemFilterSearch();
	});
	
   	//초기화 버튼
	$('#btnClear').on('click',function(){
		$('#searchInput').val('');
		var categoryList = $("input[type=checkbox][id^=filter_]");
	    
        categoryList.prop("checked", false);		
	});
	
	//2021.03.18 LHJ ADD - 검색기능 수정
//	$('.btn__modal-open').on('click', function () {
//		var ITEM_SRH_TEXT_VAL = $('#searchInput2').val();	
//		if((ITEM_SRH_TEXT_VAL == undefined || ITEM_SRH_TEXT_VAL == null || ITEM_SRH_TEXT_VAL.trim() == '')){
//		}
//		
//		modalPopUp.popupOpen($("#searchPopup"));
//	});
}


function getItemFilterSearch2(){
	var url = '/search/searchResult';
	
	var ITEM_SRH_TEXT_VAL = $('#searchInput2').val();	
	
	if((ITEM_SRH_TEXT_VAL == undefined || ITEM_SRH_TEXT_VAL == null || ITEM_SRH_TEXT_VAL.trim() == '')){
		$('#searchInput2').focus();
		fnAlert('검색어 입력 또는 옵션을 선택 해 주세요', function(){});

		return;
	}
	
	window.location.href = url+'?IL_ITEM_TEXT='+encodeURIComponent(ITEM_SRH_TEXT_VAL.replace("%",""));	
}

function getItemFilterSearch(){
	var url = '/search/searchResult';
	
	var chkList = $("input[type=checkbox][id^=filter_][name^=1_]:checked");
	var chkList2 = $("input[type=checkbox][id^=filter_][name^=2_]:checked");
	var allergyList = $("input[type=checkbox][id^=filter_][name^=3_]:checked");
	var chkList4 = $("input[type=checkbox][id^=filter_][name^=4_]:checked");
	
	var ITEM_SRH_TEXT_VAL = $('#searchInput').val();	
	
	if(chkList.length <= 0 && chkList2.length <= 0 && allergyList.length <= 0 && chkList4.length <= 0 && (ITEM_SRH_TEXT_VAL == undefined || ITEM_SRH_TEXT_VAL == null || ITEM_SRH_TEXT_VAL.trim() == '')){
		$('#searchInput').focus();
		fnAlert('검색어 입력 또는 옵션을 선택 해 주세요', function(){});

		return;
	}
	/*
	if((ITEM_SRH_TEXT_VAL != undefined && ITEM_SRH_TEXT_VAL != null && ITEM_SRH_TEXT_VAL.trim() != '') && !(ITEM_SRH_TEXT_VAL.length > 1)){
		$('#searchInput').focus();
		fnAlert('검색어는 두 글자 이상 입력하셔야 합니다.');
		
		return;
	}
	*/
	var idList = new Array();
	var idNameList = new Array();
	if(chkList.length > 0){
		for(var i = 0;i < chkList.length;i++){
			idList.push(chkList[i].value);
			idNameList.push(chkList[i].getAttribute('data-filtername'));
		}
	}
	
	var idList2 = new Array();
	if(chkList2.length > 0){
		for(var i = 0;i < chkList2.length;i++){
			idList2.push(chkList2[i].value);
		}
	}
	
	var alList = new Array();
	var alNameList = new Array();
	if(allergyList.length > 0){
		for(var i = 0;i < allergyList.length;i++){
			alList.push(allergyList[i].value);
			alNameList.push(allergyList[i].getAttribute('data-filtername'));
		}
	}	
	
	if(idNameList.length > 0 && alNameList.length > 0){
		for(var i = 0 ; i < idNameList.length; i++){
			for(var j = 0 ; j < alNameList.length; j++){
				if(idNameList[i] == alNameList[j]){
					fnAlert('선호하는 재료와 빼고 싶은 재료가 같습니다.<br> 다시 확인해주세요.');
					return;
				}
			}
		}
	}
	
	// 보관 방법 
	var idList4 = new Array();
	if(chkList4.length > 0){
		for(var i = 0;i < chkList4.length;i++){
			idList4.push(chkList4[i].value);
		}
	}
	
	window.location.href = url+'?IL_ITEM_FILTER_ID='+idList.toString()+'&AL_FILTER_ID='+alList.toString()+'&IL_ITEM_FILTER_ID2='+idList2.toString()+'&IL_ITEM_FILTER_ID4='+idList4.toString()+'&IL_ITEM_TEXT='+encodeURIComponent(ITEM_SRH_TEXT_VAL.replace("%",""));	
}