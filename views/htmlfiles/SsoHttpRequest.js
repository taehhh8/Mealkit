var _domainPath = "";
var _host = "";
var httpRequest = null;
// todo : carrot 추후 로그 삭제 해야함
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

/**
 * 개발서버, 리얼서버 체크
 * @returns
 */
function gfnServerCheck() {
	gfnSsoInit();
	
	// todo : carrot 추후 ip는 삭제 요망
	var realServer = ["www.greating.co.kr", "front.greating.co.kr", "m.greating.co.kr", "123.111.138.13" ,"123.111.138.15", "www.greating.co.kr"];
	if(realServer.indexOf(_host) > -1){
		return 'REAL';
	}else{
		return 'DEV';
	}
}

function getXMLHttpRequest() {
	if(window.ActiveXObject) {
		try {
			return new ActiveXObject('Msxml2.XMLHTTP');
		} catch(e) {
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch(e1) {
				return null;
			};
		};
	} else if(window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else {
		return null;
	}
}

//토큰 발급 요청 - xmlHttpRrequest 직접 사용 : mcustNo(통합고객번호), ssoAuthCd(권한코드)
function gfnReqSSoToknIssuHttp(mcustNo, ssoAuthCd, callback) {
	httpRequest = getXMLHttpRequest();
	var httpMethod = 'POST';
	var httpUrl = "";
	if(gfnServerCheck() == 'REAL'){
		// todo : carrot sso로그인 운영쪽으로 확정되면 주석 해제요망
		httpUrl = "https://sso.h-point.co.kr:29865/co/setSsoToknIssu.hd"; //운영 - https
	}else{
		httpUrl = "https://ssodev.h-point.co.kr:29865/co/setSsoToknIssu.hd";//개발
	}
	
	var httpParams =  "mcustNo="+mcustNo + "&ssoAuthCd=" +ssoAuthCd+ "&domainPath="+_domainPath + "&dmnAdr="+_host;
//	var httpParams =  "mcustNo="+mcustNo + "&ssoAuthCd=" +ssoAuthCd+ "&domainPath=http://10.100.166.110:8211&dmnAdr=http://10.100.166.110:8211";
	console.log('token mcustNo', mcustNo);
	console.log('token ssoAuthCd', ssoAuthCd);
	console.log('token domainPath', _domainPath);
	console.log('token host', _host);
	console.log('token httpParams', httpParams);
	console.log('token httpUrl', httpUrl);
	
	httpRequest.open(httpMethod, httpUrl, true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	httpRequest.withCredentials = true;
	httpRequest.onreadystatechange = function () {
		if(httpRequest.readyState == 4) {
			if(httpRequest.status == 200) {
				if(callback && typeof callback == "function"){
					var data = JSON.parse(httpRequest.responseText);
					console.log('token res', data);
					callback(data);
				}
			}
		}
		
	}
	httpRequest.send(httpParams);
	console.log('token res req', httpRequest);
	 
}

// SSO 인증 처리 - xmlHttpRrequest 직접 사용
function gfnSsoReqHttp(callback){
	httpRequest = getXMLHttpRequest();
	var httpMethod = 'POST';
	var httpUrl = "";
	if(gfnServerCheck() == 'REAL'){
		// todo : carrot sso로그인 운영쪽으로 확정되면 주석 해제요망
		httpUrl = "https://sso.h-point.co.kr:29865/co/setSsoReq.hd"; //운영 - https
	}else{
		httpUrl = "https://ssodev.h-point.co.kr:29865/co/setSsoReq.hd"; //개발
	}
	
//	var httpParams =  "domainPath="+_domainPath + "&dmnAdr="+_host;
//	_domainPath = "http://10.100.166.110:8211";
	var httpParams =  "domainPath="+_domainPath + "&dmnAdr="+_host;
	console.log('sso domainPath', _domainPath);
	console.log('sso host', _host);
	console.log('sso httpParams', httpParams);
	console.log('sso httpUrl', httpUrl);
	
	httpRequest.open(httpMethod, httpUrl, true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	httpRequest.withCredentials = true;
	httpRequest.onreadystatechange = function () {
		if(httpRequest.readyState == 4) {
			if(httpRequest.status == 200) {
				if(callback && typeof callback == "function"){
					var data = JSON.parse(httpRequest.responseText);
					console.log('sso res', data);
					callback(data);
				}
			}
		}		
	}
	httpRequest.send(httpParams);
}

//토큰 만료 요청
function gfnSsoDscdToknReq(callback){
	httpRequest = getXMLHttpRequest();
	var httpMethod = 'POST';
	var httpUrl = "";
	if(gfnServerCheck() == 'REAL'){
		// todo : carrot sso로그인 운영쪽으로 확정되면 주석 해제요망
		httpUrl = "https://sso.h-point.co.kr:29865/co/setDscdTokn.hd"; //운영 - https
	}else{
		httpUrl = "https://ssodev.h-point.co.kr:29865/co/setDscdTokn.hd"; //local
	}

	var httpParams = "domainPath="+_domainPath + "&dmnAdr="+_host;
	
	console.log('token end domainPath', _domainPath);
	console.log('token end host', _host);
	console.log('token end httpParams', httpParams);
	console.log('token end httpUrl', httpUrl);

	httpRequest.open(httpMethod, httpUrl, true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	httpRequest.withCredentials = true;
	httpRequest.onreadystatechange = function () {
		if(httpRequest.readyState == 4) {
			if(httpRequest.status == 200) {
				if(typeof callback == "function"){
					var data = JSON.parse(httpRequest.responseText);
					console.log('token end res', data);
					callback(data);
				}
			}
		}		
	}
	httpRequest.send(httpParams);
}

// sso 로그인 처리
function gfnSsoLogin(mcustNo){
	if(mcustNo == null){
		return;
	}
	
	httpRequest = getXMLHttpRequest();

	var httpMethod = 'POST';
	var httpUrl = "/biz/login/chkSsoLogin";
	var httpParams = "MCUST_NO="+mcustNo;

	httpRequest.open(httpMethod, httpUrl, true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.withCredentials = true;
	httpRequest.onreadystatechange = function () {
		if(httpRequest.readyState == 4) {
			if(httpRequest.status == 200) {
				var data = JSON.parse(httpRequest.responseText);
				if(data.loginCheck == 0){
					if( data.GREATING_STATUS_CODE == '5' ) {
		    			location.href = "/login/memberAccount/inactiveMember";
					} else {
						console.log('sso 로그인 성공');
						location.reload();
					}
				}
			}
		}		
	}
	httpRequest.send(httpParams);
}

//sso 로그아웃 처리
function gfnHLogout(){
	
	httpRequest = getXMLHttpRequest();

	var httpMethod = 'POST';
	var httpUrl = "/biz/member/logOut";

	httpRequest.open(httpMethod, httpUrl, true);
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.withCredentials = true;
	httpRequest.onreadystatechange = function () {
		if(httpRequest.readyState == 4) {
			if(httpRequest.status == 200) {
				sessionStorage.removeItem('LOGIN_MCUST_NO');
				location.reload();
			}
		}		
	}
	httpRequest.send();
}
