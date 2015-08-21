$(document).ready(function(){
	$.bom = {
		query: function (n) {
			var m = window.location.search.match(new RegExp("(\\?|&)" + n + "=([^&]*)(&|$)"));
			return !m ? "" : decodeURIComponent(m[2]);
		}
	};
	var url = new URI(location.href);


	var listSelector = ".select-list",
		select_prefix = "#Filter_selected_";

	/*
	*
	* */
	$(listSelector).on("click","a",function(e){
		var self = $(this);
		if(self.hasClass("selected")){
			return;
		}
		var url = handlerSelect(self);
		if(url){
			url.removeQuery("page");
			location.href = url.toString();
		}
	});

	$(document.body).on("click",".select dd", function () {
		if ($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	});
	$(".select-result").on("click",".selected", function () {
		var ele = $(this),
			id = ele.attr("id").split("_").pop();
		if( id ){
			url.removeQuery( id );
			ele.remove();
			url.removeQuery("page");
			location.href = url.toString();
		}
	});


	function handlerSelect(self){
		var ele = self,
			dd = ele.parent(),
			dl = dd.parent(),
			paramName = dl.data("name");


		var params = [],
			values = [];
		if(!paramName) return;
		//没有改变
		if(dd.hasClass('selected')) return;
		dd.addClass("selected").siblings().removeClass("selected");

		if(paramName.indexOf("-") > 0){
			params = paramName.split("-");
			values = (ele.data("value") || "").split("-");
		}else{
			params = [paramName];
			values = [ele.data("value")];
		}

		//选择全部
		if( dd.hasClass("select-all") ){
			$(select_prefix+paramName).remove();
			for(var i = 0, l = params.length; i<l ;i++){
				url.removeQuery( params[i] );
			}
			if(l > 1){
				url.removeQuery(paramName);
			}
			url.removeQuery("page");

			location.href = url.toString();
			return;
		}


		/*
		* 这是兼容代码
		* fuck....
		* */

		if(params.length == 1){
			var tab = ele.parents(".filter_tab");
			if(tab){
				tab.show();
				$("a[data-tab="+tab.attr('id')+"]").addClass('active');
				tab.siblings().removeClass("selected");
			}
			//如果是statusId，删掉其他
			if(paramName == "statusId"){
				url.removeQuery("process").addQuery("process",99);
			}else if(paramName == "process" && ele.data("value") != 99){
				url.removeQuery("statusId");
			}else if(paramName == "processAll" && dd.hasClass("select-all") ){
				url.removeQuery("process").removeQuery("statusId");
			}else if (paramName == "day"){
				url.removeQuery("start").removeQuery("end");
			}

		}
		/*
		* 兼容代码结束
		* */

		var cloneEle = dd.clone();
		if ($( select_prefix + paramName).length > 0) {
			$( select_prefix + paramName +" a").html( ele.data("text") );
		} else {
			$(".select-result dl").append(cloneEle.attr("id", select_prefix.substr(1) + paramName));
		}

		for(var i = 0, l = params.length; i<l ;i++){
			url.removeQuery( params[i] );
			url.addQuery( params[i] , values[i]);
		}
		if(params.length > 1){
			url.removeQuery( paramName );
			url.addQuery(paramName , ele.data("value") );
		}
		return url;
	}


	(function initFilter(){


		var paramMap = URI.parseQuery(location.search);
		for(var a in paramMap){
			var dl = $("dl[data-name='"+a+"']");
			if(dl){
				var ele = dl.find("a[data-value='"+paramMap[a]+"']");
				if(ele){
					handlerSelect(ele);
				}
			}
		}
		if ($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	})();
	
});