/**
 * Created by 陈志林 on 2016/3/13.
 * 页面提示框
 */
/**
 *
 * 开启小弹窗方法
 * @param tishi_content 传入显示内容
 */
 $(function(){ 
 	$('img.boxImg,img.attrcheckbox,img.sjcheckbox').each(function(){ 
 		if($(this).hasClass('no_hover')) return true;
		$(this).mouseover(function(){
	 		if($(this).prop('src').indexOf('noxz') != -1) $(this).prop('src',"./s/images/check_offH.png");
	 		if($(this).prop('src').indexOf('gouxz') != -1) $(this).prop('src',"./s/images/check_onH.png");
	 	});
		$(this).mouseout(function(){ 
	 		if($(this).prop('src').indexOf('check_offH') != -1 ) $(this).prop('src',"./s/images/noxz.jpg");
	 		if($(this).prop('src').indexOf('check_onH') != -1) $(this).prop('src',"./s/images/gouxz.jpg");
	 	})
 	});

 	

 })
function on_tanChuKuang(tishi_content,imgurl,tishi_biaoTi,yes,no,width,text_align){
	var tishi_content = tishi_content || '',
		imgurl = imgurl || 1,
		tishi_biaoTi = tishi_biaoTi || '系统提示',
		yes = yes || '是(Y)',
		no = no || '否(N)',
		width = width || 220,
		text_align = text_align || 'left';

	var _src = './s/';
	//var _src = '';
    $('.tanChuChuang').css('width',width);
    $('.theme-popbod_dform').css('width',width);
    var src = _src+'images/chengong.png';
    if(imgurl == 2)      src = _src+'images/hongcha.png';
    else if(imgurl == 3) src = _src+'images/help.png';
    else if(imgurl == 4) src = _src+'images/hongcha1.png';
    $('#tanchuchaungimage').attr('src',src);
    $("#tishi_content").html(tishi_content).css('text-align',text_align);
    $("#tishi_biaoTi").html(tishi_biaoTi);
    var inp = $('.tanChuChuang_button').find('input');
    inp.eq(0).val(yes);
    inp.eq(1).val(no);
    var tc = $('.tanChuChuang');
    //tc.fadeIn(100);
    tc.css('display','block');
    tc.css({     /*位置永远保持居中*/
        left    : $(window).width()/2 - tc.width()/2,
        top     : $(window).height()/2 - tc.height()/2
    });
    //$('.theme-popover-mask').slideDown(120);
    $('.theme-popover-mask').css('display','block');

};
on_mess({tishi_content:'选定商品后不可修改店仓',width:240});
function on_mess(c){ 
	var a = { 
		tishi_content : '默认提示信息',
		imgurl : 1,
		tishi_biaoTi : '系统提示',
		yes : "是(Y)",
		no : "否(N)",
		width : 220,
		text_align : 'left',
	}
	a = $.extend(true,{},a,c);
	on_tanChuKuang(a.tishi_content,a.imgurl,a.tishi_biaoTi,a.yes,a.no,a.width,a.text_align);
}
/**
 *  隐藏确定按钮
 *  */

function hidden_button(val){
	var val = val || '确定';
    $('#tanChuang_confirm').attr('hidden','hidden');  /*隐藏 确定按钮*/
    $('input[name="quxiao"]').attr('value',val);
};
/**
 *  显示确定按钮
 *  */
function show_button(val){
	var val = val || '否(N)';
    $('#tanChuang_confirm').removeAttr('hidden');     /*显示确认按钮*/
    $('input[name="quxiao"]').attr('value',val);
};
/**
 * 由于要在属性上绑定onclick方法所以要放在加载事件外
 * 关闭小弹窗
 */
function off_tanChuKuang(){
    //$('.theme-popover-mask').fadeOut(120);
    //$('.tanChuChuang').slideUp(200);
    $('.theme-popover-mask').css('display','none');
    $('.tanChuChuang').css('display','none');
    if(typeof hide_top_back === 'function') //判断方法是否存在
        hide_top_back($('.top_Dbutton .button._back'));
    if(clear_pop_fn !== undefined) clear_pop_fn();
};

/**
 * 功能：固定表头
 * @param tabid      表格的id
 * @param scrollid   滚动条所在容器的id(外部divid)
 * @param rows       表头的行数
 * @param brows      表尾锁定行数
 */
var gundongWidth = 0;//用于底部滚动条的17px
var tt = 0;
function scroll(tabid,scrollid,rows,brows,a){
	var brows = brows == undefined ? 1 : brows ;
		a = a || 2;
    var scroll = document.getElementById(scrollid);
    var tb2 = document.getElementById(tabid).cloneNode(true);
    var len = tb2.rows.length;
    for(var i=tb2.rows.length;i>rows;i--){
        tb2.deleteRow(rows);
    }
    var bak = document.createElement("div");
    scroll.appendChild(bak);
    bak.appendChild(tb2);
    bak.style.position = "absolute";
    bak.style.display = "block";
    bak.style.left = 0;
    bak.style.width = '100%';
    bak.style.top = "0px";
    if(brows > 0){
        var tb3 = document.getElementById(tabid).cloneNode(true);
        var len = tb3.rows.length;
        for(var i=tb3.rows.length;i>brows;i--){
            tb3.deleteRow(0);
        }
        var bak1 = document.createElement("div");
        scroll.appendChild(bak1);
        var tableda = document.getElementById(tabid);
        for(var j = 1; j <= brows; j++){
            tableda.rows[tableda.rows.length-j].style.visibility = "hidden";
            tableda.rows[tableda.rows.length-j].style.borderWidth = "0px";
        }
        bak1.appendChild(tb3);
        bak1.style.position = "absolute";
        bak1.style.display = "block";
        bak1.style.left = 0;
        bak1.style.width = '100%';
        bak1.style.top = scroll.offsetHeight-(bak1.offsetHeight+a)+'px';
    }
    scroll.onscroll = function(){
        tt = this.scrollTop;
        bak.style.top = tt+"px";
        if(brows > 0) bak1.style.top = scroll.offsetHeight-(bak1.offsetHeight+gundongWidth)+this.scrollTop+"px";
    }
};


/**
 * @param arr 禁用按钮
 * @param ban 隐藏按钮
 * @param doc 当前按钮
 * @param boo 当前按钮是否需要样式
 */
function setBut(arr,ban,doc,boo) { // 控制按钮
	var arr = arr || [],
		ban = ban || [],
		doc = doc || '',
		boo = boo || true;
    var r = [], i = 0;
    $(".button").removeClass('temp');  // 按钮全部显示
    $(".button").css({"background": "rgba(0,0,0,0)", "fontWeight": "normal"}); //初始化背景颜色和字体
    $("._button").attr({"disabled": false, "class": "button clickbutton"}); //把更换了class的按钮还原到正常class
    for (var b in ban) {
        $(".button").eq(ban[b]).addClass('temp'); // 添加隐藏属性
    }
    $(".button").css("color", "#15428B"); //给全部class为button的按钮上色
    for (var k in arr) { // 转存对象
        r[i] = $(".button").eq(arr[k]);
        i++;
    }
    for (var d in r) {
        r[d].attr({'class': '_button', "disabled": true});
        r[d].css('color', "#8C8788"); // 修改此处  填写按钮禁用时的颜色
    }
    if (doc != "") {
        if (boo) {
            doc.css({
                "background": "-moz-linear-gradient(top, #4371B6, #7199D1)",
                "fontWeight": "bold",
                "color": "#FFFFFF"
            });
            doc.removeClass('clickbutton'); // 删除自身的 移入移出事件
            doc.siblings(".button").addClass('clickbutton'); // 兄弟节点 添加移入移出事件
        } else {
            doc.css({
                "background": 'rgba(0, 0, 0, 0)',
                "fontWeight": "normal"
            });
        }
    }
}

/*
**select下拉div显示在select上面
**sobj:select对象本身
**top:根据select下拉div设置的高度变化。150px时，传入-200；200px时，传入-250
*/
function selPositionTop(sobj,top){
	var countDiv = top == -200 ? 6 : 8;
	var changeDiv = sobj.next().find('.searchable-select-dropdown');
	var divobj = sobj.next().find('.searchable-select-items');
	if(divobj.children().length > countDiv){
		changeDiv.css('top',(top - 1) + 'px');
	}else{
		changeDiv.css('top',-(changeDiv.height() + 9) + 'px');
	}
	divobj.scroll(function(){
		var prevDis = divobj.prev().css('display');
		var nextDis = divobj.next().css('display');
		if(prevDis == 'block' && nextDis == 'block'){
			changeDiv.css('top',(top - 17) + 'px');
		}else{
			changeDiv.css('top',(top - 1) + 'px');
		}
	})
}

/*禁用单选(pre:select对象)*/
function disabledDanXuan(pre){
	pre.next().find('.searchable-select-holder').css('background','#E3E3E3');
}

/*启用单选(pre:select对象)*/
function abledDanXuan(pre){
	pre.next().find('.searchable-select-holder').css('background','#FFFFFF');
}

