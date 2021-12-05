	
	// 공통 Handlebars
	Handlebars.registerHelper({
	    'HELPER_IF_IS_SESSION' : function(options) {
	        if( IS_SESSION == 'Y' ){
	            return options.fn(this);
	        }else{
	            return options.inverse(this);
	        };
	    },
	    'HELPER_PRICE_FORMAT' : function(price) {
			return fnDataFormat(price, 'toPrice');
		},
		'HELPER_CATGRY_IF' : function(index, option){
	    	var text="";
	    	if($('#global').val() == 'cn'){
	    		if( index == '571' )		  text="四季极强保湿";
		        else if( index == '572' )     text="低刺激镇定";
		        else if( index == '573' )     text="水油平衡";
		        else if( index == '574' )     text="肤色&活力";
		        else if( index == '575' )     text="故障管理";
		        else if( index == '576' )     text="弹性期间";
		        else if( index == '577' )     text="光滑角质";
		        else if( index == '578' )     text="毛里求斯";
		        else if( index == '579' )     text="特殊发型&身体";
		        else text = this.CTGRY_NAME;
	    	} else if($('#global').val() == 'en'){
	    		if( index == '571' )		  text="Extreme steel moisturization in all seasons";
		        else if( index == '572' )     text="Hypoallergenic sedation";
		        else if( index == '573' )     text="Water balance";
		        else if( index == '574' )     text="Skin tone & vitality";
		        else if( index == '575')      text="Trouble Management";
		        else if( index == '576' )     text="During momentum";
		        else if( index == '577' )     text="Sleek skin";
		        else if( index == '578' )     text="Penture";
		        else if( index == '579' )     text="Special Hair & Body";
		        else text = this.CTGRY_NAME;
	    	} else {
	    		text = this.CTGRY_NAME;
	    	}
	    	return text;
	    }
	});