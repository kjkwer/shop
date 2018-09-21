/**
 * Created by 陈志林 on 2016/3/12.
 * 页面弹窗插件js 可实现拖动
 */

var clear_pop_fn = undefined;
function popup(tuoDiv,titleDiv){
	var tuoDiv = tuoDiv || ".popup_tuoDiv",
		titleDiv = titleDiv || ".popup_titleDiv";
	if($('#audio').length == 0){
		$('body').append('<audio controls="controls" id="audio" style="display:none;"><source src="/'+popup_src+'/images/6.wav" type="audio/wav"></audio>')
	}
    var tuoDiv = $(tuoDiv);
    tuoDiv.css({
        position: 'absolute',
        zIndex  : 100,
        left    : $(window).width()/2 - tuoDiv.width()/2,      /*插件位置永远保持居中*/
        top     : $(window).height()/2 - tuoDiv.height()/2,
    });
    var titleDiv = $(titleDiv);
    var popmousemove;
    titleDiv.mousedown(function(e)      /*e鼠标按下事件*/
    {
        //$(this).css("cursor","move");
        var offset = tuoDiv.offset();   /*DIV在页面的位置*/
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        $(document).bind("mousemove",popmousemove = function(ev)
        {
            tuoDiv.stop();/*加上这个之后*/
            var _x = ev.pageX - x;  /*获得X轴方向移动的值*/
            var _y = ev.pageY - y;  /*获得Y轴方向移动的值*/
            if(_x < 0) _x = 0;
            if(_y < 0) _y = 0;
            var win_x = $(window).width()  - tuoDiv.outerWidth(true);    /*获取右下加最大x坐标 需要减去div宽度*/
            var win_y = $(window).height() - tuoDiv.outerHeight(true);   /*获取右下加最大y坐标 需要减去div高度*/
            if(_x > win_x) _x = win_x;
            if(_y > win_y) _y = win_y;
            tuoDiv.animate({left:_x+"px",top:_y+"px"},10);
        });
        
    });
    /*鼠标抬起事件*/
    $(document).mouseup(function()
    {
        //titleDiv.css("cursor","default");
        $(document).unbind("mousemove",popmousemove);        /*取消绑定*/
    });
};
/*显示弹出窗*/

function on_popup(tuoDiv){
	var tuoDiv = tuoDiv || '.popup_tuoDiv';
    var tuoDiv = $(tuoDiv);
   	$('.popup_tuoDiv').css('z-index','97');
    tuoDiv.css({
        left    : $(window).width()/2 - tuoDiv.width()/2,      /*插件位置永远保持居中*/
        top     : $(window).height()/2 - tuoDiv.height()/2,
        'display':'block',
        'z-index' : 99 
    });

    $('.theme-popover-masktwo').css('display','block');

};
/* 关闭小弹窗*/
function off_popup(tuoDiv){
	var tuoDiv = tuoDiv || '.popup_tuoDiv';
	var is_hide = 0;
	var popup = [];
	$('.popup_tuoDiv').each(function(){ 
		if($(this).is(':visible')){
			is_hide++;
			popup.push($(this));
		}
	})
	if(is_hide <= 1){
    	$('.theme-popover-masktwo').css('display','none');
    }else{ 
    	popup[popup.length-2].css('z-index',99);
    }
    $(tuoDiv).css('display','none');
    if(typeof hide_top_back === 'function')
	    hide_top_back($('.top_Dbutton .button._back'));
	if(clear_pop_fn !== undefined) clear_pop_fn();
    //$(".button").css({"background": "rgba(0,0,0,0)", "color": "#15428B", "fontWeight": "normal"});
    //$('.searchable-select-input').keyup();  /*关闭重新刷新搜索下拉框*/
};
/* 关闭小弹窗2(select写在页面上时关闭弹出窗方法)*/
function off_popup2(tuoDiv){
	var tuoDiv = tuoDiv || '.popup_tuoDiv';
    $('.theme-popover-masktwo').css('display','none');
    $(tuoDiv).css('display','none');
    //$(".button").css({"background": "rgba(0,0,0,0)", "color": "#15428B", "fontWeight": "normal"});
};
$(function(){ 
	//窗口抖动
	$('.theme-popover-masktwo,.theme-popover-mask').click(function(e){ 
		var popup;
		if($(e.delegateTarget).hasClass('theme-popover-mask')){
			popup = $('.tanChuChuang')
		}else{ 
			$('.popup_tuoDiv').each(function(){ 
				if($(this).is(':visible')){
					popup = $(this);
				}
			})
		}
		popup.addClass('shake');
		var x = $('#audio').get(0);
		x.play();
		setTimeout(function(){ 
			popup.removeClass('shake');
		},450)
	})
})