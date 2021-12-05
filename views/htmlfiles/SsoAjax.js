var _domainPath = "";
var _host = "";

/**
 * SSO 함수 호출 전 초기화 처리
 * 
 * @date 2017.01.04
 * @author bklee
 * @example gfnSsoInit()
 */
function gfnSsoInit() {	
	
	var getRequestURL = location.href ;
	_host = location.host;	
	_domainPath = getRequestURL.substring(0, getRequestURL.indexOf(_host))+_host ;	
}


//토큰 발급 요청 : mcustNo(통합고객번호), ssoAuthCd(권한코드)
function gfnReqSSoToknIssuAjax(mcustNo, ssoAuthCd, callback)
{	
	gfnSsoInit();
	//alert("test시작");
	$.support.cors = true;
	
	//var httpUrl = "https://hmssodev.ehyundai.com:29865/co/setSsoToknIssuJSONP.hd"; //개발 - https
	var httpUrl = "https://ssodev.h-point.co.kr:29865/co/setSsoToknIssuJSONP.hd"; //개발 - https
	
	if(_host.indexOf("dev.h-point") > -1) {
		httpUrl = "https://ssodev.h-point.co.kr:29865/co/setSsoToknIssuJSONP.hd"; //개발NEW - https
	}else if(_host.indexOf("www.h-point") > -1) {
		httpUrl = "https://sso.h-point.co.kr:29865/co/setSsoToknIssuJSONP.hd"; //운영 - https
	}

	console.log("_host:"+_host);
	 $.ajax({
			url: httpUrl, 
			type: "GET",
			//contenType: "application/json",
			data: {"mcustNo":mcustNo, "ssoAuthCd":ssoAuthCd , "domainPath":_domainPath, "dmnAdr":_host, "callback":callback.name},
			async:true,
			crossDomain:true,
			cache:false,
			dataType: "jsonp",
			jsonp: callback.name,
			xhrFields: {
				withCredentials : true
			}, 
			success : function (data) {
				//fnTestCallback1(data);
				if(callback && typeof callback == "function"){
					callback(data);
				}
			},
			error : function (data) {
			}
		});
}

//SSO 요청후 sso 인증 성공시 고객번호 리턴
function gfnSsoReqAjax(callback)
{
	gfnSsoInit();
	$.support.cors = true;
	console.log("_host:"+_host);

	//var httpUrl = "https://hmssodev.ehyundai.com:29865/co/setSsoReqJSONP.hd"; //개발 - https
	var httpUrl = "https://ssodev.h-point.co.kr:29865/co/setSsoReqJSONP.hd"; //개발 - https
	
	if(_host.indexOf("10.100.166.110:8211") > -1) {
		httpUrl = "https://ssodev.h-point.co.kr:29865/co/setSsoReqJSONP.hd"; //개발NEW  - https
	}else if(_host.indexOf("www.greating") > -1) {
		httpUrl = "https://sso.h-point.co.kr:29865/co/setSsoReqJSONP.hd"; //운영 - https
	}
	
	 $.ajax({
		url: httpUrl, 
		type: "POST",
		contenType: "application/json",
		data: {"domainPath":_domainPath, "dmnAdr":_host, "callback":callback.name},
		async:true,
		crossDomain:true,
		cache:false,
		dataType: "jsonp",
		jsonp: callback.name,
		xhrFields: {
			withCredentials : true
		}, 
		success : function (data) {
			if(callback && typeof callback == "function"){
				callback(data);
			}
			
		},
		error : function (data) {
		}
	});
}

//SSO 만료처리
function gfnSsoDscdToknReqAjax(callback)
{
	gfnSsoInit();
	$.support.cors = true;
	console.log("_host:"+_host);

	//var httpUrl = "https://hmssodev.ehyundai.com:29865/co/setDscdToknJSONP.hd"; //개발 - https
	var httpUrl = "https://ssodev.h-point.co.kr:29865/co/setDscdToknJSONP.hd"; //개발 - https
	
	if(_host.indexOf("frontdev.greating") > -1) {
		httpUrl = "https://ssodev.h-point.co.kr:29865/co/setDscdToknJSONP.hd"; //개발NEW - https
	}else if(_host.indexOf("www.greating") > -1) {
		httpUrl = "https://sso.h-point.co.kr:29865/co/setDscdToknJSONP.hd"; //운영 - https
	}
	
	 $.ajax({
		url: httpUrl, 
		type: "POST",
		contenType: "application/json",
		data: {"domainPath":_domainPath, "dmnAdr":_host, "callback":callback.name},
		async:true,
		crossDomain:true,
		cache:false,
		dataType: "jsonp",
		jsonp: callback.name,
		xhrFields: {
			withCredentials : true
		}, 
		success : function (data) {
			if(typeof callback == "function"){
				callback(data);
			}
		},
		error : function (data) {
		}
	});
}