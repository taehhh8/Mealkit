/*!
 * 2017.04.27 최봉석
 * 페이징 처리 함수
 */
var pageController = function(){
	var totalCnt; 	// 총 건수
	var pageSize; 	// 한 페이지에 출력될 항목 갯수
	var curPage; 	// 현재 페이지
	var disPagepCnt;// 화면출력 버튼수
	var disNum;
	
	var totalPage;
	var lastPage;
	
	var params;
	var url;
	var fnSuccessFucntion;
	
	var proBar = false;
	
	var defMag = 0;
	this.initPage = function(opt){
		if(opt.url === undefined){
			alret("url이 설정되지 않았습니다.");
			return ; 	
		}else{
			url = opt.url;	
		}
		if(opt.params){
			params = opt.params;
			if(opt.params.ePage){
				pageSize = opt.params.ePage;	
			}else{
				pageSize = 10;
			}
		}
		if(opt.disPagepCnt){
			disPagepCnt = opt.disPagepCnt;	
		}else{
			disPagepCnt = 10;
		}
		if(opt.defMag){
			defMag =opt.defMag;
		}
		if(opt.proBar){
			proBar = opt.proBar;
		}
		if(typeof(opt.success) === 'function'){
			fnSuccessFucntion = opt.success;
		}
		this.fnDraw();
		
		var hashPage = window.location.hash;
		
		if(hashPage != null && hashPage != ""){
			var goHashPage = hashPage.replace("#page", "") * 1;
			if(isNaN(goHashPage)){
				this.read(1);	
			}else{
				this.read(goHashPage);	
			}
			
			
		}else{
			this.read(1);	
		}

		if(typeof(opt.complete) === 'function'){
			fnCompleteFucntion = opt.complete;
		}
	};
	this.read = function(pageLoc){
		if(pageLoc !== undefined){
			curPage = pageLoc;	
		}
		var startPage = ((curPage-1)*pageSize)+1;
		if (params) {
			params["sPage"] = startPage;
			params["ePage"] = startPage+pageSize-1;
		}
		if(proBar){
			//$('.progress-bar').show();	
		}

		fnAjax({
	         url : url
	        ,params : params
	        ,success : function (data){
	        	totalCnt = data.total;
	        	if(totalCnt > 0){
	        		totalCnt -=1;
	        	}
	        	disNum = totalCnt/pageSize;
	        	lastPage =Math.ceil((totalCnt+1)/pageSize);
	        	if(lastPage ==0){
	        		lastPage =1;
	        	}
	        	var startNum=1;
	        	var endNum=10;
	        	while(true){
	        		if(startNum<=curPage && endNum>=curPage){
	        			break;
	        		}else{
	        			startNum+=10;
	        			endNum+=10;
	        		}
	        	}
	        	if(endNum >disNum){
	        		endNum = disNum+1;
	        	}
	        	
	        	$('#pageNation').find('.first').css("display","");
	        	$('#pageNation').find('.prev').css("display","");
	        	$('#pageNation').find('.end').css("display","");
	        	$('#pageNation').find('.next').css("display","");
	        	if(curPage ==1){
	        		$('#pageNation').find('.first').css("display","none");
	        		$('#pageNation').find('.prev').css("display","none");	
	        	}
	        	if(curPage==lastPage){
	        		$('#pageNation').find('.end').css("display","none");
	        		$('#pageNation').find('.next').css("display","none");
	        	}
				var drawStr ='';
	        	for(var i=startNum; i<=endNum ; i++){
	        		if(i==curPage){
	        			//drawStr+='<a href="javascript:fnPgUtilRead('+(i)+')" class="paging dvChkAction active">'+(i)+'</a>';
	        			drawStr+='<span class="active paging"><span>'+(i)+'</span></span>';	
	        		}else{
	        			drawStr+='<a href="javascript:fnPgUtilRead('+(i)+')" class="paging dvChkAction">'+(i)+'</a>';
	        		}
    				
	        	}
	        	$('#pager').html(drawStr);
	            if(typeof(fnSuccessFucntion) === 'function'){
	            	var callbacks = $.Callbacks();
				    callbacks.add( fnSuccessFucntion );
				    callbacks.fire( data);
				}
			},
			complete: function() {
				if(typeof(fnCompleteFucntion) === 'function'){
	            	var callbacks = $.Callbacks();
				    callbacks.add( fnCompleteFucntion );
				    callbacks.fire();
				}
			}
	    });	
	};
	
	this.fnDraw = function(){
		var drawStr ='';
    	drawStr+='<button class="pageBtn first" onclick="fnPgUtilRead('+"'first'"+')"><span class="hidden">처음으로</span></button>';
		drawStr+='<button class="pageBtn prev" onclick="fnPgUtilRead('+"'prev'"+')"><span class="hidden">이전</span></button>';
		drawStr+='<span class="pagenation__number" id="pager">';
		
		drawStr+='</span>';
		drawStr+='<button class="pageBtn next" onclick="fnPgUtilRead('+"'next'"+')"><span class="hidden">다음</span></button>';
		drawStr+='<button class="pageBtn end" onclick="fnPgUtilRead('+"'last'"+')"><span class="hidden">마지막</span></button>';
		$('#pageNation').html(drawStr);
	};
	
	this.fnPgUtilRead = function(data){
		// greating 프로그래스바
		$('.progress').show();
		
		if(typeof data =="string"){
			this.fnTypeRead(data);
		}else if(typeof data =="number"){
			var curPageNumber = $('#pageNation').find('.active').text();
			if(data==curPageNumber){
				return;
			}
			$('html, body').animate({scrollTop : defMag},10);
			this.read(data);
		}else{
			alret("화면을 읽을수없습니다.");
		}
	};
	this.fnTypeRead = function(data){
		var curPageNumber = $('#pageNation').find('.active').text();
		curPageNumber = parseInt(curPageNumber);
		$('html, body').animate({scrollTop : defMag},10);
		switch(data){
			case "first": this.read(1); break;
			case "prev": this.read(curPageNumber-1); break;
			case "next": this.read(curPageNumber+1); break;
			case "last": this.read(lastPage); break;
		}
	};
	
	this.initPageDesc = function(opt){
		if(opt.url === undefined){
			alret("url이 설정되지 않았습니다.");
			return ; 	
		}else{
			url = opt.url;	
		}
		if(opt.params){
			params = opt.params;
			if(opt.params.ePage){
				pageSize = opt.params.ePage;	
			}else{
				pageSize = 10;
			}
		}
		if(opt.disPagepCnt){
			disPagepCnt = opt.disPagepCnt;	
		}else{
			disPagepCnt = 10;
		}
		if(opt.defMag){
			defMag =opt.defMag;
		}
		if(opt.proBar){
			proBar = opt.proBar;
		}
		if(typeof(opt.success) === 'function'){
			fnSuccessFucntion = opt.success;
		}
		this.fnDraw();
		
		var hashPage = window.location.hash;
		
		if(hashPage != null && hashPage != ""){
			var goHashPage = hashPage.replace("#page", "") * 1;
			if(isNaN(goHashPage)){
				this.readDesc(1);	
			}else{
				this.readDesc(goHashPage);	
			}
			
			
		}else{
			this.readDesc(1);	
		}
	};
	this.readDesc = function(pageLoc){
		if(pageLoc !== undefined){
			curPage = pageLoc;	
		}
		var startPage = ((curPage-1)*pageSize)+1;
		
		fnAjax({
			url : url
			,async : false
			,params : params
			,success : function (data) {
				totalCnt = data.total;
				console.log("curPage" + curPage);
				params["sPage"] = totalCnt-((curPage-1)*pageSize)-pageSize+1;
				params["ePage"] = totalCnt-((curPage-1)*pageSize);
			}
		});
//		console.log("start" + params["sPage"]);
//		console.log("end" + params["ePage"]);
		
		if(proBar){
			//$('.progress-bar').show();	
		}
		fnAjax({
	         url : url
	        ,params : params
	        ,success : function (data){
	        	totalCnt = data.total;
	        	if(totalCnt > 0){
	        		totalCnt -=1;
	        	}
	        	disNum = totalCnt/pageSize;
	        	lastPage =Math.ceil((totalCnt+1)/pageSize);
	        	if(lastPage ==0){
	        		lastPage =1;
	        	}
	        	var startNum=1;
	        	var endNum=10;
	        	while(true){
	        		if(startNum<=curPage && endNum>=curPage){
	        			break;
	        		}else{
	        			startNum+=10;
	        			endNum+=10;
	        		}
	        	}
	        	if(endNum >disNum){
	        		endNum = disNum+1;
	        	}
	        	
	        	$('#pageNation').find('.first').css("display","");
	        	$('#pageNation').find('.prev').css("display","");
	        	$('#pageNation').find('.end').css("display","");
	        	$('#pageNation').find('.next').css("display","");
	        	if(curPage ==1){
	        		$('#pageNation').find('.first').css("display","none");
	        		$('#pageNation').find('.prev').css("display","none");	
	        	}
	        	if(curPage==lastPage){
	        		$('#pageNation').find('.end').css("display","none");
	        		$('#pageNation').find('.next').css("display","none");
	        	}
				var drawStr ='';
	        	for(var i=startNum; i<=endNum ; i++){
	        		if(i==curPage){
	        			//drawStr+='<a href="javascript:fnPgUtilRead('+(i)+')" class="paging dvChkAction active">'+(i)+'</a>';
	        			drawStr+='<span class="active paging"><span>'+(i)+'</span></span>';	
	        		}else{
	        			drawStr+='<a href="javascript:fnPgUtilRead('+(i)+')" class="paging dvChkAction">'+(i)+'</a>';
	        		}
    				
	        	}
	        	$('#pager').html(drawStr);
	            if(typeof(fnSuccessFucntion) === 'function'){
	            	var callbacks = $.Callbacks();
				    callbacks.add( fnSuccessFucntion );
				    callbacks.fire( data);
				}
			}
	    });	
	};
	this.fnPgUtilReadDesc = function(data){
		if(typeof data =="string"){
			this.fnTypeReadDesc(data);
		}else if(typeof data =="number"){
			var curPageNumber = $('#pageNation').find('.active').text();
			if(data==curPageNumber){
				return;
			}
			$('html, body').animate({scrollTop : defMag},10);
			this.readDesc(data);
		}else{
			alret("화면을 읽을수없습니다.");
		}
	};
	this.fnTypeReadDesc = function(data){
		var curPageNumber = $('#pageNation').find('.active').text();
		curPageNumber = parseInt(curPageNumber);
		$('html body').animate({scrollTop : defMag},10);
		switch(data){
			case "first": this.readDesc(1); break;
			case "prev": this.readDesc(curPageNumber-1); break;
			case "next": this.readDesc(curPageNumber+1); break;
			case "last": this.readDesc(lastPage); break;
		}
	};
};
