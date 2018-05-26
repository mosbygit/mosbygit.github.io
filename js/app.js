//判断是移动端还是pc端
function isPC () {
	if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
	    return false;//移动端
	} else {
	    return true;//pc端  
	}
}
var environment = isPC();
var mun = [];
//差异化设置
function differentiation () {
	if (isPC()) {//pc端
		$('#aside').addClass("aside-pc");
		$('#content').addClass("content-pc");
		$('#keyboard').addClass("keyboard-pc");
	} else {//移动端
		var width = $('#aside').addClass("aside-mobie").width();
		$('#aside').width(width);
		$('#content').addClass("content-mobie").width(width).css("left", width + 40).hide();
		$('#keyboard').addClass("keyboard-mobie");
		$('#full').text("文章");
	}
}
differentiation();
//渲染目录
function aside() {
	$.get("./aside.md",function(data){
		$("#aside").html(marked(data));	
		asideCatalogue();
		$('#aside code').map(function() {
	    	Prism.highlightElement(this);
	   	});
	   	$("#aside li a").map(function() {
	   		var hash = $(this).attr('href');
			if(hash && hash.substr(1)) {
				mun.push(hash.substr(1));
			}
	   	});
	   	prev();
	   	next();
	}, "text").fail(function(){
		alert("数据获取失败");
	})
}
//获得哈希值
function getHash() {
	return window.location.hash.substr(1) || "docs/let";
}
//获得内容
function conent() {
	var hash = getHash();
	$("#content").html("<div>加载中。。。</div>");
	$.get("./" + hash + ".md",function(data){
		$("#content").html(marked(data));	
		$('#content code').map(function() {
	    	Prism.highlightElement(this);
	   	});
	   	articleDirectories();

// 		if(!environment) {
//	   		$('#full').trigger("click");
//	   	}

	}, "text").fail(function(){
		alert("数据获取失败");
	})
}
aside();
if(environment) {
	conent();
}
$(window).on('hashchange', linkData);
//判断是否该跳转
function linkData() {
	var hash = window.location.hash;
	if(hash && hash.substr(1)!="#") {
		conent();
		if(!environment) {
	   		$('#full').trigger("click");
		}
	}
}
//目录初始化
function asideCatalogue () {
	//初始化一级菜单
	$("#aside ol ul").hide();//影藏所有二级目录
	$("#aside ol>li>a").click(function(){
		$(this).next().toggle(300);//二级目录切换隐藏
	});
	//初始化目录选项
	$("#aside h2").click(function(e){
		e.preventDefault();
		$("#aside ol ul").hide();//影藏所有二级目录
	})
	if(!environment) {
	   	$("#aside ul li a").click(linkData)
	}
}

function articleDirectories() {
	$('#content h2, #content h3, #content h4').map(function(index) {
		$(this).html("<span class='h-link'>"+ $(this).html() + "</span>")
		$(this).attr('id', "h" + index);//替换id
		$(this).on('click','span',function (e) {
			e.preventDefault();
			$("#content").animate({
				scrollTop : this.offsetTop
			}, 300);
		})
	})
	var ul_tag = $("<ol id='content-top' class='content-top'></ol>").insertAfter('#content h1');
	$('#content h2').map(function(index) {
		var self = this;
		$(this).attr('id', "h2" + "and" + index + "link");
		var ul_li = $("<li id=" + "h2" + "and" + index + "top" +" class='li-link'>"+ $(this).text() +"</li>");
		ul_tag.append(ul_li);
		ul_li.click(function(e) {
			e.preventDefault();
			$("#content").animate({
				scrollTop : self.offsetTop
			}, 300);
		})
	});
}
//全屏/正常
function fullScreen() {
	$("#full").addClass("show");
	$("#full").click(function(e) {	
		e.preventDefault();
		if($(this).hasClass("show")) {
			$("#content").show();
			$(this).addClass("hide").removeClass("show").text("目录");
			$("#aside").animate({left: -$("#aside").width()-40, right:0}, 500);
			$("#content").animate({left: 0}, 500);
		} else {
			$(this).addClass("show").removeClass("hide").text("全屏");
			$("#aside").animate({left: 0, right: $("#aside").width()+40}, 500);
			$("#content").animate({left: $("#aside").width()+40}, 500);
			if (!environment) {
				$('#full').text("文章");
				setTimeout(function() {
					$("#content").hide();
				},300)
			}
		}
	
	})
}
fullScreen();
//回到页面顶部
function topScreen() {
	$("#top").click(function(e) {
		e.preventDefault();
		$("#content").animate({scrollTop: 0}, 300);
	})
}
topScreen();
//初始化上一篇，下一篇
function prev() {
	$('#prev').click(function(e) {
		e.preventDefault();
		var hash = getHash();
		for(var i = 0, len = mun.length; i < len; i++) {
			if(mun[i] == hash) {
				if(i) {
					location.hash="#" + mun[i-1];
					return;
				}				
			}
		}
		alert("没有前面一个了")
	})
}
function next() {
	$('#next').click(function(e) {
		e.preventDefault();
		var hash = getHash();
		for(var i = 0, len = mun.length; i < len; i++) {
			if(mun[i] == hash) {
				if(i < len-1) {
					location.hash="#" + mun[i+1];
					return;
				}				
			}
		}
		alert("没有后面一个了")
	})
}

