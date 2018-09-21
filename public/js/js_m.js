
//document.write("<script type='text/javascript' src='/bx/s/js/jquery.easing.1.3.js'></script>");
$(function(){
	//老表格底部不让选中
	$('#dataStart').on('focus','>div:last-child input',function(){
		$(this).blur();
	})
	//弹出框输入内容少的时候山下居中
	$('.form_data').each(function(){
		if($(this).find('tr').length >= 3) return;
		$(this).children('.clr').height(84);
	})
	//table设置
	/*
		class="table_pre"
			data-scrollx='true'  是否左右滚动
			data-scrolly='true'  是否上下滚动
			data-height='class1,class2..' 自适应高, 其他块class
		class='center'
			class:all 是否设置全部td宽度
	*/
	/**/
	$('.table_pre').each(function(){
		if($(this).attr('tablename') != undefined) return ;
		var _this = $(this),table_width = 0,auto_height = new Array();
		if(!$('._top ._head',_this).hasClass('colresize')){
			//表格宽度拖动
			var page_x,
				span_down=false, // 鼠标是否soan里面按下
				_heads = $('._top ._head span',_this).length - 1,
				ismoused = true;
			_this.on('mouseover','._top ._head span',function(a){
				if(span_down) return;
				var _this1 = $(this),_width = _this1.width(),width_arr = {};
				_this1.siblings().each(function(){
					width_arr[$(this).index()] = $(this).width();
				})

				var sp_index = 0;
				var thisspan = $(this).parents('.rowspan_box').length == 0 ? $(this) : $(this).parents('.rowspan_box');

				thisspan.prevAll().each(function(){

					if($(this).hasClass('rowspan_box')){
						sp_index += $(this).find('span').length;
					}else{
						sp_index++;
					}
				})
				if($(this).parents('.rowspan_box').length  != 0 ){
					sp_index += $(this).prevAll().length;
				}
				document.onmousemove = function(e){
					if((_this1.offset().left + _this1.outerWidth() - e.pageX < 8 || span_down)){
						_this1.css('cursor','col-resize');
						ismoused = false;
						if(span_down){
							var _width1 = e.pageX - page_x + _width;
							_this1.width(_width1);
							/*
							$.each(width_arr, function(k,v){
								$('._top ._head span',_this).eq(k).width(v - parseFloat((e.pageX - page_x) / _heads));
							})
							*/
							table_width = 0;
							_this.find('._head').children().each(function(){
								if($(this).is(':hidden')) return true;
								var border = 1;
								var _width = $(this).width();
								if($(this).hasClass('rowspan_box')){
									border = 0;
								}
								table_width +=_width+border;
							})
							/*
							_this.find('._top').children().each(function(){
								$(this).find('span').eq(sp_index).width(_width1);
							})
							*/
							$('.screah_box',_this).find('span').eq(sp_index).width(_width1);
							_this.find('.center tr').each(function(){
								$(this).children().eq(sp_index).attr('width',_width1);
							})
							_this.find('.botm').each(function(){
								$(this).children().eq(sp_index).width(_width1);
							})

							if(_this1.parents('.rowspan_box').length != 0){
								var rowspan_width = 0;
								_this1.parent().children().each(function(){
									rowspan_width += $(this).width() + 1;
								})
								_this1.parents('.rowspan_box').width(rowspan_width)
							}

							if(_heads){
								_this.find('._top').css('min-width',table_width+4);
								_this.find('.botm').css('min-width',table_width);
								_this.find('.center').width(table_width);
								_this.find('.screah_box').width(table_width+4)
							}
						}
					}else{
						_this1.css('cursor','');
						span_down = false,ismoused = true;
					}

				};
				_this1.mousedown(function(e){
					if(ismoused) return;
					span_down = true;
					page_x = e.pageX;
				})
			}).mouseout(function(){
				$(document).mouseup(function(){
					span_down = false,ismoused = true;
				})
			})
			_this.on('mouseup','._top ._head span',function(){
				span_down = false,ismoused = true;
			})
		}
		//设置高度与与响应窗口变化时调整高度
		if(_this.data('height') != undefined){

			function set_height(){
				var str = _this.data('height');
			  	auto_height = str.split(",");
			  	var sli_height = 0;
				for(var i in auto_height){
					if(isNaN(auto_height[i])){
						sli_height += $('.'+auto_height[i]).is(':visible') ? $('.'+auto_height[i]).outerHeight(true) : 0;
					}else{
						sli_height += parseInt(auto_height[i]);
					}
				}
			  	var win_height = $(window).outerHeight(true)-sli_height - 3;
				_this.height(win_height);
				if(_this.hasClass('table_fixed')){
					setTimeout(function(){
						if(_this.siblings('.table_pre').outerWidth() < _this.siblings('.table_pre').find('.center').outerWidth()){
							_this.height(win_height-17);
						}
					},300)
				}
			}
			$(window).resize(function(){
				set_height();
			})
			setTimeout(function(){
				set_height();
			},0)
		}

	})
	//var src = '/bx/s/';
	var src = '/s/';
	//var src = '';
	//复选框改变颜色
 	$('img.checkbox_img').each(function(){

		$(this).hover(function(){if($(this).hasClass('no_hover')) return;
	 		if($(this).prop('src').indexOf('noxz') != -1) $(this).prop('src',src+"images/check_offH.png");
	 		if($(this).prop('src').indexOf('gouxz') != -1) $(this).prop('src',src+"images/check_onH.png");
	 	},function(){ if($(this).hasClass('no_hover')) return;
	 		if($(this).prop('src').indexOf('check_offH') != -1 ) $(this).prop('src',src+"images/noxz.jpg");
	 		if($(this).prop('src').indexOf('check_onH') != -1) $(this).prop('src',src+"images/gouxz.jpg");
	 	})
 	})

	$('.top_Dbutton .button').click(function(){
		if(!$(this).hasClass('_back')){
			show_top_back($(this),function(){ })
		}
	})

})


//顶部导航栏背景切换
function show_top_back(_this,fn){
	if(_this.val().indexOf('删除') != -1 || _this.hasClass('off') || _this.hasClass('no_back')) return;
	_this.addClass('_back').siblings('input').removeClass('_back');
	if(typeof fn == 'undefined'){
		$(window).off().on('click',function(e){
			if(e.target.nodeName != 'INPUT' && !_this.hasClass('no_remove')) _this.removeClass('_back');
		})
	}else{
		fn();
	}
}
function hide_top_back(_this,fn){
	if(!_this.hasClass('no_remove')) _this.removeClass('_back');
	if(typeof fn != 'undefined'){
		fn();
	}
}

//设置div上下位置
function set_pop_wz(_this,pop_box,_top,_left){
    _this.addClass('on_pop')
	var _top = _top || 0,_left = _left || 0;
	var left = _this.offset().left + _left;
	var top = _this.offset().top + _this.outerHeight(true) + _top;
	if(($(window).height() - top) < pop_box.height()){
		top = top - _this.outerHeight(true) - pop_box.outerHeight(true) - _top;
	}
	if(($(window).width() - left) < pop_box.width()){
		left = left - (pop_box.outerWidth(true) - _this.outerWidth(true));
	}
	pop_box.css({'left':left,'top':top});

}
//返回0或整数
function get_isNaN(val){
	var val = $.trim(val);
	return isNaN(parseFloat(val)) ? 0 : parseFloat(val);
}
/*
	click_no : table class 不能被选中

*/
var tables = function(container,params){
	if (!(this instanceof tables)) return new tables(container,params);

	var dafaules = {
		td_clickidex : 0, //被选中的tr下标
		tr_height : 24,
		tr_clickobj : undefined,
		td_hoveridex : 0, //鼠标hover的tr下标
		tr_removeidex : 0, //鼠标hover的tr下标
		is_stati_botm : true, //是否开启统计底部
		botm_stati_number : 0, //底部统计个数
		botm_stati_arr : [],//底部统计数据 下标 => 值
		stati_num : [],
		checkbox_state : 0, //
		column_widths : [],//table下每列宽度
		table_width : 0, //table最小宽度
		is_scroll : true, //判断滚动时是往上还是往下了,true为上 false为下
		is_scroll_line : true,
		table_box_pad_top : 0,
		table_box_pad_botm : 0,
		is_rows_chack_once : false,
		is_clos_chack_once : false,
		set_botm_width : false,
		is_change_tr : false,
		change_td_index : 0,
		checkbox_stopPropagation : true,
		scrollx : 0,
		scrolly : 0,
		ischeckbox_img : true,
		screahreverse : false,
		delete_tr : {
			mess : '确定删除吗?',
			text_align : 'left',
			img : 1,
			title :	'系统提示',
			btn1 : "是(Y)",
			btn2 : "否(N)",
			width : 260,
		},
		set_switch : {
			click_tr : true,
		},
		//s_src : '/bx/s/',
		s_src : '/s/',
		//s_src : '',
		data_class : {
			is_tdclick : 'click_no',
			hj_rows	 : 'hj_rows',
			delete_img : 'delete_img',
			tr_click_class : '_click',
			tr_hover_class : '_hover',
			all_rows : 'all_rows',
			checkbox_img : 'checkbox_img',
			no_check : 'no_hover',
			click_td : 'click_fff',
			show_tr : 'show_tr',
			avg_rows : 'avg_rows',
			show_td : 'show_td',
			rows_td : 'rows_td',
			_rows : 'rows',
		},
		dom_class : {
			_top : '._top',
			_head : '._head',
			screah_box : '.screah_box',
			table_box : '.table_box',
			_center : '.center',
			botm : '.botm',
			show_closbtn : '.show_closbtn',
			show_closbox : '.show_clos',
			screah_img : '.screah_img',
			not_search : '.not_search',
		},
		invalid_data : {
			_thistd : undefined,
			inv_btn : $('.invalid_btn'),
			string : ['作废单据','取消作废'],
			invalid_on_tr : 'invalid_tr',
			invalid_on_btn : 'invalid_btn',
			td_state : 'iszf',
		},

		display_area : {
			tr_top : 0,
			tr_botm : 0,
			td_left : 0,
			td_right : 0,
		},

		//表格选中行上下移动
		move_tr : {
			is_move : false,
			top_t : 0,
	   		botm_t : 0,
	   		tr_t : 0,
		},
		scrollheight : 0,
		scroll_fn : function(){},
		scroll_state : true,

		sort : 'asc',

		_click : true,
		_hjrows : false,
		_delete_img : false,
		_clicktd : true,
		//搜索相关
		/*
			row_b : true, //设置第一次显示  标示
			row_num : 0, //记录显示行数,存入t.dafaule.row_arr
			row_arr : [],//记录每一级显示行数
			rp_ : 0, // 用于数组下标累加
			show_tr_height : 0, // 显示tr累计高度
		*/
		rows_arr : {},
		//显示列
		clos_rows_arr : [],
		tr_length : 50,
		clos_td_index : {},
		clos_tbale : undefined,
		clos_rows_idx : 1,
		clos_click_fn : function(){},
		clos_load_fn : function(){},
		hide_closbox_fn : undefined,
		is_focus : false,
		is_focusjoin : true,

		/*分屏冻结*/
		Split : {
			is : false,
			split_dom : undefined,
			span : undefined,
			idx : 0
		},
		searchdata:[],	//用于搜索的原始数据
        searchresult:[],//搜索完成后的结果数据
		tr_click_fn : function(){}, //选中tr后函数
		tr_change_fn : function(){},
		tr_hover_fn : function(){}, //鼠标hover的tr后函数
		checkbox_click_fn : function(){}, //图片选中后函数
		remove_rows_fn : function(){}, //删除一行后函数
		is_keyup_backfocus_fn : function(){}, //黄色框移动焦点后函数
		key_back_focus_fn : function(){}, //改变表中黄色框值时
		focus_back_focus_fn : function(){}, // 选中表中黄色框值时
		this_scroll_fn : function(){}, // 滚动table时
		stati_botm_fn : function(){},//底部统计后
		deleteok_rows_fn : function(){ return true;},
		screah_fn : function(){},
        searchfn:function(){},
        renderfn:function(){},
        casumfn:function (){}
	};
	this.dafaule = $.extend(true,{},dafaules,params);
	var t = this;
	t.params = params;
	t._this = $(container);
	t.windowing = tables.prototype.windowing;
	t.windowing_init = tables.prototype.windowing_init;
	t.dom = {
		_top : $(t.dafaule.dom_class._top,t._this),
		_head : $(t.dafaule.dom_class._head,t._this),
		screah_box : $(t.dafaule.dom_class.screah_box,t._this),
		table_box : $(t.dafaule.dom_class.table_box,t._this),
		_center : $(t.dafaule.dom_class._center,t._this),
		botm : $(t.dafaule.dom_class.botm,t._this),
		show_closbtn : $(t.dafaule.dom_class.show_closbtn,t._this),
		show_closbox : $(t.dafaule.dom_class.show_closbox,t._this),
		screah_img : $(t.dafaule.dom_class.screah_img,t._this),
	};
	t.is_click = function(_this){
		if(!t._this.hasClass(t.dafaule.data_class.is_tdclick)){
			t.dafaule._click = false;
			return false;
		}else{
			t.dafaule._click = true;
			return true;
		}
	}
	t.is_hjrows = function(_this){
		if(_this.hasClass(t.dafaule.data_class.hj_rows)){
			 t.dafaule._hjrows = true;
			 return true;
		}else{
			 t.dafaule._hjrows = false;
			 return false;
		}
	}
	t.is_delete_img = function(_this){
		if(_this.hasClass(t.dafaule.data_class.delete_img)){
			t.dafaule._delete_img = true;
			return true;
		}else{
			t.dafaule._delete_img = false;
			return false;
		}
	}
	t.set_t = function(param){
		t.set_width();
		if(param!='nothuizong'){
            t.stati_botm();
		}
		t.set_css();
		return t;
	}

	t.is_focus = function(){
		if(t.dafaule.is_focusjoin) return false;
		return t.dafaule.is_focus;
	}

	t.bind_search = function(){
		//console.log($(t.dafaule.dom_class.screah_box).length)
		if($(t.dafaule.dom_class.screah_box).length){
			$(t.dafaule.dom_class.screah_box+' input',t._this).off('keyup').keyup(function(e){
				clearInterval(set_screah);
				var set_screah = setTimeout(function(){
					t.screah();
				},1000);
			})
			$(t.dafaule.dom_class.screah_box+' select',t._this).off('change').change(function(e){
				t.screah();
			})

			$(t.dafaule.dom_class.screah_box+' .'+t.dafaule.data_class.checkbox_img,t._this).off('click').on('click',function(e){
				t.screah($(this).parent().index());
			})
			$(t.dafaule.dom_class.screah_box,t._this).off('click').on('click','.clear_screah',function(){
				t.clear_screah_fn();
			})
		}
		return t;
	}
	t.set_mode = function(param){
        if(param!='new'){
            t.init('new');
        }
        return t;
    }
	t.init = function(){
		t._click();
		t._hover();
		//t.click_sort();
		//t.show_clos_click();
		t.checkbox_click();
		t.checkbox_click_all();
		t.click_td();
		t.click_delete_rows();
		//t.get_display_area();
		if($(t.dafaule.dom_class.screah_box).length){

		   $(t.dafaule.dom_class.screah_box+' input',t._this).unbind('keyup')
		   $(t.dafaule.dom_class.screah_box+' input',t._this).keyup(function(e){
			   if(t.dafaule.search_mode=='json'){
				t.search();
			   }else{
				   clearInterval(set_screah);
				   var set_screah = setTimeout(function(){
					   t.screah();
				   },1000);
			   }

		   })
		   $(t.dafaule.dom_class.screah_box+' select',t._this).change(function(e){
			   if(t.dafaule.search_mode=='json'){
				   t.search();
			   }else{
				   t.screah();
			   }

		   })

		   $(t.dafaule.dom_class.screah_box+' .'+t.dafaule.data_class.checkbox_img,t._this).on('click',function(e){
			   if(t.dafaule.search_mode=='json'){
					t.search($(this).parent().index());
			   }else{
				   t.screah($(this).parent().index());
			   }
		   })
		   $(t.dafaule.dom_class.screah_box,t._this).on('click','.clear_screah',function(){
			   if(t.dafaule.search_mode=='json'){
				   t.clear_search_fn();
			   }else{
				   t.clear_screah_fn();
			   }

		   })



        }
		//设置内容可输入焦点移动
		$(t.dafaule.dom_class._center,t._this).on('focus',' tr td input.focus_back',function(e){
			if(!t.dafaule.is_focusjoin) t.dafaule.is_focus = true;
			t.move_focus($(this));
			t.dafaule.focus_back_focus_fn($(this));
			$(this).select();
		})
		//设置内容改变时调用底部统计
		$(t.dafaule.dom_class._center,t._this).on('keyup',' tr td input.focus_back',function(e){
			if(e.which == 9) return;
			var key = t.dafaule.key_back_focus_fn($(this));
			if(key === undefined || key){
				t.stati_botm();
			}
		})

		//设置title内容没超出则不显示

		/*
		var _title = '';
		t.dom._center.on('mouseover','td',function(){
			if($(this).attr('title')){
				_title = $(this).attr('title');
				if($(this).width() > _title.length * 12){
					$(this).attr('title','');
				}
			}
		}).on('mouseout','td',function(){
			if(_title != ''){
				$(this).attr('title',_title);
				_title = '';
			}
		})
		*/

		//排序
		if(t.dom._head.find('.sort').length > 0){
			t.dom._head.find('.sort').click(function(){
				var state = $(this).children('i').attr('class');
				$(this).children('i').attr('class','');
				if(state == 'defa'){//默认情况
					t.set_sortdom(t.sort('desc',$(this).index()+1));
					$(this).children('i').addClass('desc');
				}else if(state == 'desc'){ //降序
					t.set_sortdom(t.sort('asc',$(this).index()+1));
					$(this).children('i').addClass('asc');
				}else{  //升序
					t.set_sortdom(t.sort('desc',$(this).index()+1));
					$(this).children('i').addClass('desc');
				}
				t.set_width().change_xh();
			})
		}

		//默认选中第一行
		if(t.dafaule.is_change_tr) t.change_tr($(t.dafaule.dom_class._center+' tr:eq(0)',t._this));
		return t;
	}
	t.set_css = function(){
		//设置滚动条
		if(t._this.data('scrollx') != undefined ){
			t._this.data('scrollx') ? t._this.css('overflow-x','scroll') : t._this.css('overflow-x','hidden');
		}
		if(t._this.data('scrolly') != undefined ){
			t._this.data('scrolly') ? t._this.css('overflow-y','scroll') : t._this.css('overflow-y','hidden');
		}

		//设置底部不能被选中
		$(t.dafaule.dom_class.botm,t._this).on('focus','input',function(){$(this).blur();})
		//设置默认高度
		//console.log($(t.dafaule.dom_class.screah_box,t._this).length)
		var pad_top = 0,pad_botm = 0;
			pad_top = $(t.dafaule.dom_class._top,t._this).outerHeight();
			pad_top = pad_top == 0 ? 24 : pad_top;
			$(t.dafaule.dom_class.table_box,t._this).css('padding-top',pad_top);
			t.dafaule.table_box_pad_top = pad_top;
			pad_botm = $(t.dafaule.dom_class.botm,t._this).outerHeight() * $(t.dafaule.dom_class.botm,t._this).length;
			$(t.dafaule.dom_class.table_box,t._this).css('padding-bottom',pad_botm-1);
			t.dafaule.table_box_pad_botm = pad_botm;
		//监听滚动
		/*
		* is_scroll 记录是往上还是往下滚动 true为下 false为下
		* _scroll   记录滚动值,作比较
		* is_scrolltime   判断是用户操作的滚动还是调用的滚动
		* set_scrolltime  延迟执行判断滚动值是否为22的倍数 只执行一次
		*/
		var set_scrolltime,is_scrolltime = true,_scroll = 0,is_scroll = true;
		t._this.scroll(function(){
			//改变表头位置
			is_scroll = _scroll > $(this).scrollTop() ? false : true;
			_scroll = $(this).scrollTop();
			$(t.dafaule.dom_class._top,t._this).css('top',_scroll);
			//改变表尾位置
			$(t.dafaule.dom_class.botm,t._this).each(function(){

				$(this).css('bottom',-_scroll+get_isNaN($(this).attr('top')));
			})
			//双表响应滚动
			$('.left_fixed div',t._this).css({'top':_scroll});
			$('.left_fixed',t._this).css('left',_scroll);
			//双表响应滚动
			if(t._this.siblings('.table_fixed').length > 0){
				t._this.siblings('.table_fixed').find('.center').css('margin-top',-_scroll);
			}

			if(t.dafaule.scrollheight !== 0){
				is_scroll_fn()
			}

			t.dafaule.this_scroll_fn(_scroll);
			/*
			if(t.dafaule.is_scroll_line){
				//设置滚动为tr行的倍数
				clearInterval(set_scrolltime)
				set_scrolltime = setTimeout(set_scroll,100)
			}
			*/
			t.dafaule.is_scroll = is_scroll;
			if(t.dafaule.Split.is){
				t.windowing_fn();
			}
		})
		//设置滚动时必须是tr高度的倍数
		function set_scroll(){
			var scr_top = t._this.scrollTop()/t.dafaule.tr_height;
			if((scr_top | 0) !== scr_top){

				scr_top = is_scroll ? parseInt(scr_top)+1 : parseInt(scr_top);
				is_scrolltime = false;
				t._this.animate({scrollTop:scr_top*t.dafaule.tr_height},0,function(){
					is_scrolltime = true;
				});
			}
		}
		function is_scroll_fn(){
			var t_top = t._this.scrollTop() + t._this.height();
			var table_top = t.dom.table_box.outerHeight(true) - t.dafaule.scrollheight + t.dafaule.scrollx;
			if(t_top > table_top && t.dafaule.scroll_state){
				t.dafaule.scroll_state = false;
				t.dafaule.scroll_fn();
			}
		}
		//设置跨行列
		t.set_trrows_arr();
		t.dafaule.scrollx = t._this.width() < t.dom._center.width() ? 17 : 0;
		t.dafaule.scrolly = t._this.height() < t.dom.table_box.height() ? 17 : 0;
		return t;
	}
	t.set_trrows_arr = function(){
		//设置跨行列
		//if(!$.isEmptyObject(t.dafaule.rows_arr)) return false;
		t.dafaule.rows_arr = {};
		var rowspan = {},tr_index,td = {};
		$(t.dafaule.dom_class._center+' tr:not('+t.dafaule.dom_class.not_search+') td.rows',t._this).each(function(_index){
			$(this).attr('load_rows',$(this).attr('rowspan'));
			if($(this).css('display') != 'none'){
				if(tr_index != $(this).parent().prevAll('tr:not('+t.dafaule.dom_class.not_search+')').length){
					tr_index = $(this).parent().prevAll('tr:not('+t.dafaule.dom_class.not_search+')').length;
					td = {};
				}
				td[$(this).index()] = $(this).attr('rowspan');
				rowspan[tr_index] = td;


			}
		})
		t.dafaule.rows_arr = rowspan;
	}
	t.set_trrows_arr1 = function(){
		t.dafaule.rows_arr = {};
		var rowspan = {},tr_index,td = {};
		$(t.dafaule.dom_class._center+' tr:not('+t.dafaule.dom_class.not_search+') td.rows',t._this).each(function(_index){
			//$(this).attr('load_rows',$(this).attr('rowspan'));
			if($(this).css('display') != 'none'){
				if(tr_index != $(this).parent().prevAll('tr:not('+t.dafaule.dom_class.not_search+')').length){
					tr_index = $(this).parent().prevAll('tr:not('+t.dafaule.dom_class.not_search+')').length;
					td = {};
				}
				td[$(this).index()] = $(this).attr('load_rows');
				rowspan[tr_index] = td;


			}
		})
		t.dafaule.rows_arr = rowspan;
	}
	//宽度设置
	t.set_width = function(){
		var obj = {
			_width : [],
			_index : 0,
			head_row : 0,
			table_width : 0,
			fu_width : 0,
			is_xinhao : [],
			xinhao_wid : 0,
			//获取宽度保存到数组_width
			get_width : function(head_span,span_index){
				var _obj = this;
				if(head_span.hasClass('rowspan_box')){
					var c = _obj.head_row;
					head_span.find('.on_row span').each(function(_index){
						if($(this).is(':hidden')){
							_obj.fu_width ++;
						}else{
							_obj._index = _index + c + span_index-head_span.prevAll('.rowspan_box').length;
							//console.log(_obj._index)
							_obj._width[_obj._index] = $(this).data('width');
						}
						_obj.head_row ++ ;
					})
				}else{
					if(head_span.css('display') !== 'none'){
						_obj._index = _obj.head_row + span_index -head_span.prevAll('.rowspan_box').length;
						_obj._width[_obj._index] = head_span.data('width');
					}
				}
				var width_str = head_span.data('width')+"";
				if(width_str.indexOf("*") != -1){
					_obj.is_xinhao[_obj._index] = parseInt(head_span.data('width').replace('*',''));
					_obj.xinhao_wid += parseInt(head_span.data('width').replace('*',''));
				}
			},
			//循环_width数组,设置宽度
			set_width : function(){
				var _obj = this;
				for (var i in this._width) {
					$(t.dafaule.dom_class._head,t._this).find('span').eq(i).width(this._width[i]);
					$(t.dafaule.dom_class.screah_box,t._this).children().eq(i).width(this._width[i]).children('select').width(this._width[i]+17);
					$(t.dafaule.dom_class.botm,t._this).each(function(){
						if(i == 0 || i == (_obj._width.length-1)) $(this).children().eq(i).width(_obj._width[i]-1);
						else $(this).children().eq(i).width(_obj._width[i]);
					})
					if($(t.dafaule.dom_class._center,t._this).hasClass('_all')){
						$(t.dafaule.dom_class._center+' tr',t._this).each(function(){
							$(this).children().eq(i).attr('width',_obj._width[i]);
						})
					}else{
						var tr = $(t.dafaule.dom_class._center+' tr:first-child',t._this);
						while(tr.css('display') == 'none'){
							tr = tr.next();
						}
						tr.children().eq(i).attr('width',this._width[i]);
					}
					//console.log(this._width[i])
					this.table_width += parseInt(this._width[i]) +1;//保存总宽度设置给外层
				}
				$('.rowspan_box',t._this).each(function(){
					var rowspan_boxwidth = 0;
					$(this).find('span').each(function(){
						if($(this).is(':hidden')) return true;
						rowspan_boxwidth += $(this).width() +1;

					})
					$(this).width(rowspan_boxwidth);
				})
				//this.table_width -= _obj.fu_width;
				$(t.dafaule.dom_class._top,t._this).css('min-width',this.table_width);
				$(t.dafaule.dom_class._head,t._this).css('min-width',this.table_width);
				$(t.dafaule.dom_class.screah_box,t._this).css('width',this.table_width+1);
				$(t.dafaule.dom_class.botm,t._this).css('min-width',this.table_width+1);
				if(t.dafaule.set_botm_width) $(t.dafaule.dom_class.botm,t._this).css('width',this.table_width+1);
				$(t.dafaule.dom_class._center,t._this).width(this.table_width);
				t.dafaule.table_width = this.table_width;//保存到全局

			},
			init : function (){
				var _obj = this;
				$(t.dafaule.dom_class._head,t._this).children().each(function(_index){

					_obj.get_width($(this),_index);
				})
				//console.log(this._width)
				//重组判断是否有百分数,重组宽度
				//console.log(_obj.is_xinhao.length)
				if(_obj.is_xinhao.length > 0){
					var table_width = 0,youx_width = 0;
					for(var i in _obj._width){
						youx_width += (_obj._width[i]+"").indexOf('*') != -1 ? 0 : (parseInt(_obj._width[i]) + 2);
					}
					table_width = t._this.outerWidth(true) - youx_width - 17;
					for(var i in _obj.is_xinhao){
						_obj._width[i] = table_width * (_obj.is_xinhao[i]/_obj.xinhao_wid);
					}

				}

				_obj.set_width();

			}
		}
		obj.init();
		t.dafaule.column_widths = obj._width;//每列宽度数组保存到全局
		return t;
	}
	t.get_min_width = function(){
		//return
	}
	t.change_tr = function(this_tr){
		this_tr.addClass(t.dafaule.data_class.tr_click_class).siblings().removeClass(t.dafaule.data_class.tr_click_class);
		t.dafaule.td_clickidex = this_tr.index();//保存下标到全局
		t.dafaule.tr_clickobj = this_tr;
		t.dafaule.tr_change_fn(this_tr);//回调函数
		return t;
	}
	t.remove_change_tr = function(this_tr){
		this_tr.removeClass(t.dafaule.data_class.tr_click_class);
		t.dafaule.td_clickidex = undefined;//保存下标到全局
		t.dafaule.tr_clickobj = undefined;
		return t;
	}
	t.hover_tr = function(this_tr){ //mouseover tr
		this_tr.addClass(t.dafaule.data_class.tr_hover_class).siblings().removeClass(t.dafaule.data_class.tr_hover_class);
		return t;
	}
	t.mouseout_tr = function(this_table){ //mouseout tr
		this_table.find('tr').removeClass(t.dafaule.data_class.tr_hover_class);
		return t;
	}
	t._click = function(){ //click背景色改变
		$(t._this).on('click','tr',function(e){
			var me = $(this);
			if(t.is_click(me) || t.is_hjrows(me) || t.is_delete_img(me) || t.is_focus()) return t;
			t.change_tr(me);//调用背景改变函数
			t.dafaule.td_clickidex = me.index();//保存下标到全局
			if(t.response._this.length > 0) t.response.on_click();//双表同步函数
			t.dafaule.tr_click_fn(me,me.index(),e);//回调函数
		})
		return t;
	}
	t._hover = function(){ //hover背景色改变
		$(t.dafaule.dom_class._center,t._this).on('mouseover','tr',function(e){
			if(t.is_hjrows($(this))) return t;
			t.hover_tr($(this));//调用背景改变函数
			t.dafaule.td_hoveridex = $(this).index();//保存下标到全局
			t.response.on_hover();//双表同步函数
			t.dafaule.tr_hover_fn();//回调函数

		}).on('mouseout','tr',function(e){
			t.mouseout_tr($(this).parents('table'));//调用背景改变函数
			t.response.on_mouseout();//双表同步函数
		})
		return t;
	}
	t.stati_botm = function(){ //底部行统计,记录需要统计的个数和全部统计的数据

		if(!t.dafaule.is_stati_botm) return false;
		if($(t.dafaule.dom_class.botm,t._this).children('div').length > 0){ //底部行出现多行的时候遍历执行多次
			$(t.dafaule.dom_class.botm,t._this).children('div').each(function(){
				set_stati_botm($(this).children('span'))
			})
		}else{
			set_stati_botm($(t.dafaule.dom_class.botm +':eq(0)',t._this).children('span')) //执行底部统计函数
		}
		t.dafaule.botm_stati_number = 0;
		function set_stati_botm(_span){ //底部统计函数,_传入底部td,挨个统计
			_span.each(function(_index){ //遍历底部td
				var xsd = $(this).attr('xs') > 0 ? $(this).attr('xs') : 2; //当前统计需要的小数点个数,默认两个
				if($(this).children('input').length > 0 && !$(this).hasClass('ccTotal') || $.inArray(_index,t.dafaule.stati_num) != -1){ //判断当前列是否需要统计
					if($(this).hasClass(t.dafaule.data_class.all_rows)){ //判断是否是统计行数的列
						var _length = 0; //行数从0开始计算
						if(!_span.hasClass('is_show')){
							$(t.dafaule.dom_class._center+' tr',t._this).each(function(){ //循环tr
								if($(this).children('td:eq('+_index+')').css('display') != 'none' && !$(this).hasClass(t.dafaule.data_class.hj_rows) && $(this).css('display') != 'none') _length++; // 统计行数,判断隐藏的行数不算在内
							})
						}else{
							$(t.dafaule.dom_class._center+' tr',t._this).each(function(){ //循环tr
								if($(this).children('td:eq('+_index+')').is(':visible') &&
									!$(this).hasClass(t.dafaule.data_class.hj_rows) &&
								 	$(this).children('td:eq('+_index+')').html() != '' ) _length++; // 统计行数,判断隐藏的行数不算在内
							})
						}
						$(this).children('input').val($(this).data('prve') + _length +' '+ $(this).data('next'));//拼进对应的列的input
						t.dafaule.botm_stati_arr[_index] = _length;
					}else{ //统计总数列
						var _val = 0; //总数初始为0
						$(t.dafaule.dom_class._center+' tr',t._this).each(function(){ //遍历tr下对应列的td
							if($(this).css('display') == 'none' || $(this).hasClass('kc') || $(this).hasClass('no_stati')) return;
							var val = 0;
							if($(this).children().eq(_index).children('input').length > 0){
								val = $(this).children().eq(_index).children('input').val();
							}else if($(this).children().eq(_index).children('span').length > 0){
								val = $(this).children().eq(_index).children('span').html();
							}else{
								val = $(this).children().eq(_index).html();
							}
							val = val == undefined ? '' : val;
							val = val.replace(' ','');
							var re = new RegExp(/[^A-Za-z]/);
							val = re.test(val) ? val : 0;
							_val += parseFloat(val)

						})

						if(_val != 0 && !isNaN(_val)){
							if($(this).hasClass(t.dafaule.data_class.avg_rows)){ //判断是否是需要平均数的列
								_val = $(t.dafaule.dom_class._center+' tr',t._this).length > 0 ? (_val/$(t.dafaule.dom_class._center+' tr:visible',t._this).length) : 0;//重新赋值为平均数 总数/tr行个数
								_val = (_val + '').indexOf('.') != -1 ? _val.toFixed(xsd) : _val; //如果平均数为小数,设置小数点后的个数
								var nextstr = $(this).attr('nextstr') || '';
								$(this).children('input').val(check_xsd(_val)+nextstr);//赋值对应统计列
							}else{
								_val = (_val + '').indexOf('.') != -1 ? _val.toFixed(2) : _val;
								$(this).children('input').val(_val);//赋值对应统计列
							}
						}else{
							$(this).children('input').val(0);//赋值对应统计列
						}
						t.dafaule.botm_stati_arr[_index] = _val;//保存到全局数组,关联数组类型
					}
					t.dafaule.botm_stati_number ++; //保存需要统计列的个数到对象
				}
			})
			t.dafaule.stati_botm_fn(t);
		}
		function check_xsd(_val){
			var _val = _val+'';
			if(_val.indexOf('.') == -1) return _val;
			var val_arr = _val.split('.');

			return (val_arr[0]+'.'+val_arr[1].replace('0',''));
		}
		return t;
	}
	//更新序号,td_index为序号所在的td下标 默认为第一个0
	t.change_xh = function(){
		var _index = 0
		if($(t.dafaule.dom_class._center+' table',t._this).hasClass('no_xuhao')) return false;
		$(t.dafaule.dom_class._center+' tr',t._this).each(function(){
			if($(this).css('display') != 'none' && !$(this).hasClass('no_xuhao') ){
				_index ++;
				$(this).children().eq(t.dafaule.change_td_index).html(_index)
			}
		})
		return t;
	}
	t.checkbox_img = function(this_img,state){ //一般复选框图片改变与切换状态
		var this_img = this_img;

		if(state != undefined){
			if(state != this_img.attr('state')){
				check()
			}
		}else{
			check()
		}
		function check(){
			if(this_img.attr('state') == 1){
				this_img.attr('state',0);
				this_img.attr('src',t.dafaule.s_src+"images/noxz.jpg");
			}else{
				this_img.attr('state',1);
				this_img.attr('src',t.dafaule.s_src+"images/gouxz.jpg");
			}
		}

		t.dafaule.checkbox_state =  this_img.attr('state');
		t.dafaule.checkbox_click_fn(this_img,t);
		return t;
	}
	t.checkbox_click = function(){ //复选图片切换
		$(t.dafaule.dom_class._center,t._this).on('click',' .'+t.dafaule.data_class.checkbox_img,function(e){
			if(!$(this).hasClass(t.dafaule.data_class.no_check) && t.dafaule.ischeckbox_img) {
				if(t.dafaule.checkbox_stopPropagation) e.stopPropagation();
				if(t.dafaule.is_rows_chack_once){
					if($(this).attr('state') == 0){
						t.checkbox_img($(this));
						$(this).parent().siblings().each(function(){
							t.checkbox_img($(this).find(' .'+t.dafaule.data_class.checkbox_img),0);
						})
					}
				}else if(t.dafaule.is_clos_chack_once){
					t.checkbox_img($(this));
					$(this).parents('tr').siblings().each(function(){
						t.checkbox_img($(this).find(' .'+t.dafaule.data_class.checkbox_img),0);
					})
				}else{
					t.checkbox_img($(this));
				}
				t.check_all();
			}
		})
		return t;
	}
	t.check_all = function(){
		var check_all = true;
		t.dom._center.find('tr').each(function(){
			if($(this).find('.checkbox_img').attr('state') == 0){
				check_all = false;
				return false;
			}
		})
		if(check_all){
			t.checkbox_img(t.dom._head.find(' .'+t.dafaule.data_class.checkbox_img),1)
		}else{
			t.checkbox_img(t.dom._head.find(' .'+t.dafaule.data_class.checkbox_img),0)
		}
	}
	t.checkbox_click_all = function(){ //点击全选切换
		$(t.dafaule.dom_class._head,t._this).on('click',' .'+t.dafaule.data_class.checkbox_img,function(){

			t.all_checked($(this));
		})
		return t;
	}
	t.all_checked = function(this_img){ //全选切换
		var _src = this_img.attr('src'),_state = this_img.attr('state');
		var _index = this_img.parent().index();
		t.checkbox_img(this_img);
		$(t.dafaule.dom_class._center+' tr',t._this).each(function(){
			if($(this).is(':visible')){
				var _this = $(this).children().eq(_index).find('img.'+t.dafaule.data_class.checkbox_img);
				if(_state == _this.attr('state')){
					if(_this.attr('state') == 0){
						t.checkbox_img(_this,1)
					}else{
						t.checkbox_img(_this,0)
					}
				}
			}
		})
	}
	t.click_td = function(is_clicktd){ //点击td背景变白色
		var is_clicktd = is_clicktd == undefined ? false : is_clicktd;
		if(!t._this.hasClass('click_td') || is_clicktd) return;
		$(t.dafaule.dom_class._center+' tr',t._this).mouseover(function(){
			if(t.dafaule.td_clickidex != $(this).index()) $(this).find('td').removeClass(t.dafaule.data_class.click_td);
		})
		$(t.dafaule.dom_class._center+' tr td',t._this).click(function(){
			$(this).addClass(t.dafaule.data_class.click_td).siblings().removeClass(t.dafaule.data_class.click_td);
		})
		return t;
	}
	t.move_focus = function(focus_this){
    	focus_this.off().on('keyup',function(e){
    		var _y = index_y = focus_this.parent().parent().index(),_x = index_x = focus_this.parent().index();
    		switch(e.which){
    			case 37:
    			//左
    				if(focus_this.parent().prev().children().hasClass('focus_back')){
    					index_x--;
    				}else{
    					var top_td = $(t.dafaule.dom_class._center+' tr:eq('+(index_y-1)+') td:eq('+index_x+')',t._this);
    					if(top_td.children().hasClass('focus_back')){
    						while(top_td.next().children().hasClass('focus_back')){
    							top_td = top_td.next();
    						}
    						index_x = top_td.index();
    						index_y--;
    					}
    				}
                break;
    			case 38:
    			//上
    				if(index_y == 0) return;
    				var top_td = $(t.dafaule.dom_class._center+' tr:eq('+(index_y-1)+') td:eq('+index_x+')',t._this);
    				index_y = top_td.children().hasClass('focus_back') ? index_y-1 : index_y;
                break;
    			case 39:
    			//右
    				if(focus_this.parent().next().children().hasClass('focus_back')){
    					index_x++;
    				}else{
    					var top_botm = $(t.dafaule.dom_class._center+' tr:eq('+(index_y+1)+') td:eq('+index_x+')',t._this);
    					if(top_botm.children().hasClass('focus_back')){
    						while(top_botm.prev().children().hasClass('focus_back')){
    							top_botm = top_botm.prev();
    						}
    						index_x = top_botm.index();
    						index_y++;
    					}
    				}
                break;
    			case 40:
    			//下
    				var top_botm = $(t.dafaule.dom_class._center+' tr:eq('+(index_y+1)+') td:eq('+index_x+')',t._this);
    				index_y = top_botm.children().hasClass('focus_back') ? index_y+1 : index_y;
                break;
    		}
    		if(_x == index_x && _y == index_y) return;
    		var _input = $(t.dafaule.dom_class._center+' tr:eq('+index_y+') td:eq('+index_x+') input.focus_back',t._this)
    		if(!_input.hasClass('focus_back')) return ;
    		if(t.dafaule.is_keyup_backfocus_fn(_input)) return;
    		t.set_scroll(_input.parents('td'));
    		_input.focus();
    		_input.select();
    	})
	}
	t.move_tr = function(){
	    set_enter({
	    	//key_btn : 'keydown',
	    	is : t.dafaule.move_tr.is_move,
	    	key : {
	    		//上
		    	38 : function(){
		    		//console.log('111');
		    		if(t.dafaule.move_tr.is_move){
			    		if(t.dafaule.tr_clickobj.index() == 0) return t.dafaule.move_tr.is_move;
	                	t.change_tr(t.dafaule.tr_clickobj.prev());//调用背景改变函数
	                	is_move_juli()
			    		return t.dafaule.move_tr.is_move;
		    		}else{
		    			return !t.dafaule.move_tr.is_move
		    		}
		    	},
		    	//下
		    	40 : function(){
		    		if(t.dafaule.move_tr.is_move){
		                if(t.dafaule.tr_clickobj.index() < t.dom._center.find('tr').length-1){
		               		t.change_tr(t.dafaule.tr_clickobj.next());//调用背景改变函数
		               	}
		               	is_move_juli()
			    		return t.dafaule.move_tr.is_move;
		    		}else{
		    			return !t.dafaule.move_tr.is_move
		    		}
		    	}
	    	}
	    })
	    function is_move_juli(){
			t.set_move_tr();
	        if(t.dafaule.move_tr.tr_t < t.dafaule.move_tr.top_t){
	        	t._this.scrollTop(t._this.scrollTop()-t.dafaule.tr_height)
	        }else if(t.dafaule.move_tr.tr_t >= t.dafaule.move_tr.botm_t){
	        	t._this.scrollTop(t._this.scrollTop()+t.dafaule.tr_height)
	        }
	    }
	}
	t.set_move_tr = function(){
		t.dafaule.move_tr.top_t = t._this.offset().top + t.dafaule.table_box_pad_top;
		t.dafaule.move_tr.botm_t = t._this.offset().top + t._this.outerHeight(true) - t.dafaule.scrollx - 3;
		t.dafaule.move_tr.tr_t = t.dafaule.tr_clickobj.offset().top;
	}
	t.set_scroll_botm = function(){

	}
	t.set_scroll = function(this_td){
		var td_offset_top = this_td.offset().top;
		var t_offset_top = t._this.offset().top
		var botm_offset_top = $(t.dafaule.dom_class.botm,t._this).offset().top;
		if((td_offset_top - t_offset_top) < t.dafaule.table_box_pad_top){
			t._this.scrollTop(t._this.scrollTop()-this_td.outerHeight(true)+0.1);
		}
		if((botm_offset_top - td_offset_top) < 0){
			t._this.scrollTop(t._this.scrollTop()+this_td.outerHeight(true)+0.1);
		}
	}
	t.delete_rows = function(this_tr){ //删除一行
		var this_tr = this_tr || t.dafaule.tr_clickobj;
		var _table = this_tr.parent();
		var tr_idx = this_tr.index();
		this_tr.remove()
		if(this_tr.hasClass('_click')){
			t.change_tr(_table.children().eq(0))
		}
		if(tr_idx == 0){
			t.set_width();
		}
		t.change_xh()
		t.stati_botm();
		t.dafaule.remove_rows_fn(t);
	}
	t.click_delete_rows = function(){ //绑定删除
		var delete_tr = function(){};
		$(t.dafaule.dom_class._center,t._this).on('click','tr td img.'+t.dafaule.data_class.delete_img,function(){
			var _this = $(this);
			show_button();
			on_tanChuKuang(
				t.dafaule.delete_tr.mess,
				t.dafaule.delete_tr.img,
				t.dafaule.delete_tr.title,
				t.dafaule.delete_tr.btn1,
				t.dafaule.delete_tr.btn2,
				t.dafaule.delete_tr.width,
				t.dafaule.delete_tr.text_align
			);
			$('#tanChuang_confirm').attr('name','delete_tr').removeAttr('act_name');
			//点击确定删除选中行tr
			$('#tanChuang_confirm[name=delete_tr]').unbind('click',delete_tr).one('click',delete_tr = function(){
				if($(this).attr('name') == 'delete_tr'){
					if(t.dafaule.deleteok_rows_fn(_this.parents('tr'))){
						t.dafaule.tr_removeidex = _this.parents('tr').index();
						if(t.dafaule.tr_removeidex == 0) t.set_width();
						t.delete_rows(_this.parents('tr'))
						//t.response.on_delete_rows();
						t.set_scroll_botm();
						$(this).attr('name','tanChuang_confirm');
					}
					off_tanChuKuang();
				}
			})
			$('#tanChuang_confirm[name=delete_tr]').siblings().unbind('click',delete_tr).one('click',function(){
				off_tanChuKuang();
				$(this).siblings().attr('name','tanChuang_confirm');
			})
		})
	}
	t.clear_screah_fn = function(){
		t.dom._top.find('select').val(0);
		t.dom._top.find('input').val('');
		t.dom._top.find('.checkbox_img').each(function(){
			$(this).attr({
				'state':0,
				'src':$(this).data('src0')
			});
		})
		t.screah();
	}
    t.clear_search_fn = function(){
        t.dom._top.find('select').val(0);
        t.dom._top.find('input').val('');
        t.dom._top.find('.checkbox_img').each(function(){
            $(this).attr({
                'state':0,
                'src':$(this).data('src0')
            });
        })
        t.search();
    }
    //获取搜索条件
    t.setsearchmap=function(param) {

	}

	t.setSearchData=function(d){
        t.dafaule.searchdata=d.data;
        t.dafaule.searchresult =d.data;
        t.dafaule.datatableid=d.tableid;
        // callback();
		if(typeof (d.filter) =="function"){
            t.dafaule.searchfn=d.filter;
		}
        if(typeof (d.render) =="function"){
            t.dafaule.renderfn=d.render;
        }
        if(typeof (d.calsum) =="function"){
            t.dafaule.casumfn=d.calsum;
        }


        //t.dafaule.searchmap=searchmap;
	}
	t.getSearchResult=function(){
    	return t.dafaule.searchresult;
	}
	t.clearSearchResult=function(){
        t.dafaule.searchresult =[];
	}

    //搜索数据
	t.search = function (idx) {

        var idx = idx == undefined ? null : idx;
        var tr = $(t.dafaule.dom_class._center+' tr:not('+t.dafaule.dom_class.not_search+')',t._this);

        tr.addClass(t.dafaule.data_class.show_tr).show();
        var searchData= t.dafaule.searchdata.slice();	//复制数组，用于搜索

        var searchFilterKV=new Array();

        $(t.dafaule.dom_class.screah_box+' span',t._this).each(function(_index){
            if($(this).children().length == 0) return true;
            if($(this).children().hasClass('checkbox_img')){
                var is_click = false;
                if(typeof idx != null){
                    is_click = idx == _index ? true : false;
                }
                t.screah_checkimg($(this).children(),is_click);
            }else{
                var _val = '';
                if($(this).children()[0].tagName == 'INPUT' || $(this).children()[0].tagName == 'SELECT'){
                    if($(this).children()[0].tagName == 'INPUT'){
                        _val = $(this).children().val();
                    }
                    if($(this).children()[0].tagName == 'SELECT'){
                        _val = $(this).find('option:selected').text();
                    }
                }
                _val = $.trim(_val)
                if(_val == '') return true;
                _val = _val.toUpperCase();
                searchFilterKV[_index]=_val;

            }
        })

		$('#'+t.dafaule.datatableid).empty();
		if(t.dafaule.searchfn != null){
            t.dafaule.searchresult = t.dafaule.searchfn(searchFilterKV,searchData);	//调用外部函数，来过滤数据，以解决不同数据格式的问题。
		}else{
            t.dafaule.searchresult=searchData;
        }

		//console.log(t.dafaule.searchresult.length);
		if(t.dafaule.casumfn != null){
            t.dafaule.casumfn(t.dafaule.searchresult,t.dafaule.datatableid);	//	汇总
		}

        t.dafaule.renderfn();	//调用页面JS加载页面数据

        if(searchFilterKV.length ==0){
            $(t.dafaule.dom_class.screah_img,t._this).attr('src',t.dafaule.s_src+'images/fangda.png').removeClass('clear_screah');
        }else{
            $(t.dafaule.dom_class.screah_img,t._this).attr('src',t.dafaule.s_src+'images/qxchaxun.png').addClass('clear_screah');
        }

		t._this.scrollTop(0);
        t.set_width();

    }
	/*搜索表格*/
	t.screah = function(idx){
		var idx = idx == undefined ? null : idx;
		var tr = $(t.dafaule.dom_class._center+' tr:not('+t.dafaule.dom_class.not_search+')',t._this);
		tr.addClass(t.dafaule.data_class.show_tr).show();
		$(t.dafaule.dom_class.screah_box+' span',t._this).each(function(_index){
			if($(this).children().length == 0) return true;
			if($(this).children().hasClass('checkbox_img')){
				var is_click = false;
				if(typeof idx != null){
					is_click = idx == _index ? true : false;
				}
				t.screah_checkimg($(this).children(),is_click);
			}else{
				var _val = '';
				if($(this).children()[0].tagName == 'INPUT' || $(this).children()[0].tagName == 'SELECT'){
					if($(this).children()[0].tagName == 'INPUT'){
						_val = $(this).children().val();
					}
					if($(this).children()[0].tagName == 'SELECT'){
						_val = $(this).find('option:selected').text();
					}
				}
				_val = $.trim(_val)
				if(_val == '') return true;
				tr.each(function(){
					if($(this).hasClass(t.dafaule.data_class.show_tr)){
						var td_val = $(this).children('td').eq(_index).children().html() || $(this).children('td').eq(_index).children().val() || $(this).children('td').eq(_index).html();

						if($(this).children('td').eq(_index).hasClass('danjh')){
							td_val += $(this).children('td').eq(_index).html().split('>').pop()+'';
						}
						td_val = td_val.toUpperCase();
						_val = _val.toUpperCase();
						if(t.dafaule.screahreverse){
							if(td_val.indexOf(_val) == -1 && _val.indexOf(td_val) == -1){
								$(this).removeClass(t.dafaule.data_class.show_tr).hide();
							}
						}else{
							if(td_val.indexOf(_val) == -1){
								$(this).removeClass(t.dafaule.data_class.show_tr).hide();
							}
						}
						//t.response.on_screah($(this).index())
					}
				})
			}
		})

		if($(t.dafaule.dom_class._center+' tr.'+t.dafaule.data_class.show_tr,t._this).length == tr.length){
			$(t.dafaule.dom_class.screah_img,t._this).attr('src',t.dafaule.s_src+'images/fangda.png').removeClass('clear_screah');
		}else{
			$(t.dafaule.dom_class.screah_img,t._this).attr('src',t.dafaule.s_src+'images/qxchaxun.png').addClass('clear_screah');
		}
		t.set_rows();
		if(!t._this.hasClass('no_xuhao')) t.change_xh();
		t.stati_botm();
		if(t.dom._center.find('tr:eq(0)').is(':hidden')) t.set_width();
		t._this.scrollTop(0);
		t.dafaule.screah_fn();
	}

	t.set_rows = function(){
		var tr,tr_first = true,show_tr;
		var show_num = 0;
		var rows_arr = t.dafaule.rows_arr;
		for(var i in rows_arr){
			for(var j in rows_arr[i]){
				tr = t.set_tr(i,rows_arr[i][j]);
				show_tr = '';
				tr.each(function(_index){
					if($(this).hasClass('show_tr')){
						if(tr_first){
							show_tr = $(this);
							$(this).children().eq(j).show();
							tr_first = false;
						}else{
							$(this).children().eq(j).hide();
						}
						show_num++;
					}
				})
				tr_first = true;
				if(typeof show_tr == 'object') show_tr.children().eq(j).attr('rowspan',show_num);
				show_num = 0;
			}
		}
		//console.log(rows_arr);
	}
	t.set_tr = function(gt,lt){
		var gt = get_isNaN(gt);
		var lt = get_isNaN(lt);
		if(gt == 0){
			return $(t.dafaule.dom_class._center+' tr:not('+t.dafaule.dom_class.not_search+'):lt('+lt+')',t._this);
		}else{
			return $(t.dafaule.dom_class._center+' tr:not('+t.dafaule.dom_class.not_search+'):gt('+(gt-1)+'):lt('+lt+')',t._this);
		}
	}
	//显示列功能

	t.show_clos_click = function(){
		t.dafaule.clos_tbale = $('.'+$(t.dafaule.dom_class.show_closbox).attr('showtable'));
		var xh = t.dafaule.change_td_index + t.dafaule.clos_rows_idx;

		$('body').on('click',t.dafaule.dom_class.show_closbtn,function(){ //绑定显示
			set_pop_wz($(t.dafaule.dom_class.show_closbtn),$(t.dafaule.dom_class.show_closbox),-4) //定位方法
			t.show_clos_box(); //显示方法
			clear_pop($(t.dafaule.dom_class.show_closbox),'',t.dafaule.hide_closbox_fn)
		})
		$(t.dafaule.dom_class.show_closbox + ' li').click(function(){ //绑定每列点击事件
			var _index = $(this).attr('index') || $(this).index();
			t.checkbox_img($(this).children('.'+t.dafaule.data_class.checkbox_img)); //切换自定义checkbox
			if(container !== undefined){
				var prev_rosp = xh;
				$(this).prevAll().each(function(){
					prev_rosp += $(this).attr('rosp') != undefined ? get_isNaN($(this).attr('rosp'))-1 : 0;
				})
				if($(this).attr('rosp') != undefined){
					for (var i = 0; i < $(this).attr('rosp'); i++) {
						t.clos_toggle(_index+prev_rosp+i,1);
						t.dafaule.clos_td_index[_index] = _index+prev_rosp+i;
					}
				}else{
					t.clos_toggle(_index+prev_rosp,1); //显示隐藏对应列方法
					t.dafaule.clos_td_index[_index] = _index+prev_rosp;
				}

			}
			t.set_width(); //调用宽度,显示或隐藏后从新设置宽度
			t.getli_arr(); //更新显示列数字,存入cookie
			t.dafaule.clos_click_fn($(this),t.dafaule.clos_rows_arr);
		})

		var li_arr = t.get_cookie($('title').data('title')) == '' ? undefined : t.get_cookie($('title').data('title'))//读取cookie
		li_arr = (li_arr !== undefined && li_arr !== null) ? li_arr.split(',') : li_arr;
		t.dafaule.clos_td_index = li_arr || {};
		t.dafaule.clos_load_fn(li_arr);
		//t.clos_scroll();
		if(li_arr !== undefined && li_arr !== null){
			t.each_closs(li_arr)//根据cookie默认隐藏对应列
		}
	}
	t.show_clos_box = function(){ //显示'显示列div'方法
		$(t.dafaule.dom_class.show_closbox).show();
	}
	t.clos_scroll = function(){
		var _tbale = t.dafaule.clos_tbale,i = 1,scrolheight = t.dafaule.tr_length*22*0.7;
		_tbale.scroll(function(){
			if($(this).scrollTop()> scrolheight*i){
				i++;
				for (var v in t.dafaule.clos_td_index) {
					t.clos_toggle(t.dafaule.clos_td_index[v],i);
				};
			}
			//if()
			//t.clos_toggle();
		})
	}
	t.clos_toggle = function(td_index,trs_index){ //切换显示对应列
		var _tbale = t.dafaule.clos_tbale,tr_length = t.dafaule.tr_length,tr;
		//判断对应列是否是隐藏
		/*
		if(trs_index == 1){
			tr = $(t.dafaule.dom_class._center +' tr:lt('+tr_length+')',_tbale)
		}else{
			tr = $(t.dafaule.dom_class._center +' tr:gt('+(trs_index*(tr_length-1)-1)+'):lt('+(trs_index*tr_length)+')',_tbale)
		}
		*/
		//console.log(tr_length,trs_index,tr);
		tr = $(t.dafaule.dom_class._center +' tr',_tbale);
		var ishide = $(t.dafaule.dom_class._head,t._this).find('span').eq(td_index).is(':hidden');
		if(ishide){
			//显示对应列
			tr.each(function(){
				var td = $(this).children().eq(td_index);
				if(td.hasClass(t.dafaule.data_class.show_td)){
					if(td.html().indexOf('合计') != -1){ //判断有合计代表有跨行,调用跨行遍历的方法
						td.removeClass(t.dafaule.data_class.rows_td).parent().show();
						t.change_rows(td,false);
					}
					td.removeClass(t.dafaule.data_class.show_td).show();
				}
			})
			if(trs_index == 1){
				$(t.dafaule.dom_class._head +' span',_tbale).eq(td_index).show();
				if($(t.dafaule.dom_class._head +' span',_tbale).eq(td_index).parents('.rowspan_box').length > 0){
					$(t.dafaule.dom_class._head +' span',_tbale).eq(td_index).parents('.rowspan_box').show();
				}
				$(t.dafaule.dom_class.screah_box +' span',_tbale).eq(td_index).show();
				$(t.dafaule.dom_class.botm +' span',_tbale).eq(td_index).show();
			}
		}else{
			//隐藏对应列
			tr.each(function(){
				var td = $(this).children().eq(td_index);
				if(td.is(':visible')){
					if(td.html().indexOf('合计') != -1){ //判断有合计代表有跨行,调用跨行遍历的方法
						td.addClass(t.dafaule.data_class.rows_td).parent().hide();
						t.change_rows(td,true);
					}
					td.addClass(t.dafaule.data_class.show_td).hide();
				}
			})
			if(trs_index == 1){
				$(t.dafaule.dom_class._head +' span',_tbale).eq(td_index).hide();
				if($(t.dafaule.dom_class._head +' span',_tbale).eq(td_index).parents('.rowspan_box').length > 0){
					var show = false;
					$(t.dafaule.dom_class._head +' span',_tbale).eq(td_index).siblings().each(function(){
						if($(this).is(':visible')){
							return show = true;
						}
					})
					if(!show){
						$(t.dafaule.dom_class._head +' span',_tbale).eq(td_index).parents('.rowspan_box').hide();
					}
				}
				$(t.dafaule.dom_class.screah_box +' span',_tbale).eq(td_index).hide();
				$(t.dafaule.dom_class.botm +' span',_tbale).eq(td_index).hide();
			}
		}
	}
	t.change_rows = function(td,ys){ //跨行列的操作
		var td_index = td.index(),tr = td.parent();
		for (var i = td_index; i > 0; i--){
			while(tr.children().eq(i).is(':hidden') && tr.children().eq(i).hasClass(t.dafaule.data_class._rows) && !tr.children().eq(i).hasClass(t.dafaule.data_class.show_td)){
				tr = tr.prev();
			}
			if(ys)  tr.children().eq(i).attr('rowspan',parseInt(tr.children().eq(i).attr('rowspan')) - 1);
			else  tr.children().eq(i).attr('rowspan',parseInt(tr.children().eq(i).attr('rowspan')) + 1);
		};
	}
	t.getli_arr = function(){ //遍历更新隐藏的li下标,存入cookie
		t.dafaule.clos_rows_arr = [];
		$(t.dafaule.dom_class.show_closbox + ' li').each(function(_index){
			if($(this).find('.'+t.dafaule.data_class.checkbox_img).attr('state') == 1) return true;
			t.dafaule.clos_rows_arr.push(_index);
		})
		t.set_cookie($('title').data('title'),t.dafaule.clos_rows_arr);
	}
	t.each_closs = function(closs_arr){ //传入隐藏列的下标, 隐藏对应下标的列
		var _li = $(t.dafaule.dom_class.show_closbox + ' li');
		var xh = t.dafaule.change_td_index + t.dafaule.clos_rows_idx;

		for (var i in closs_arr) {
			t.checkbox_img(_li.eq(closs_arr[i]).children('.checkbox_img')); //切换自定义checkbox

			if(container !== undefined){
				var prev_rosp = xh,
					_index = parseInt(closs_arr[i]),
					li = _li.eq(_index);
				_li.eq(closs_arr[i]).prevAll().each(function(){
					prev_rosp += $(this).attr('rosp') != undefined ? get_isNaN($(this).attr('rosp'))-1 : 0;
				})

				if(li.attr('rosp') != undefined){
					for (var i = 0; i < li.attr('rosp'); i++) {
						t.clos_toggle(_index+prev_rosp+i,1);

					}
				}else{

					t.clos_toggle(_index+prev_rosp,1); //显示隐藏对应列方法
				}

			}

			//t.clos_toggle(parseInt(closs_arr[i])+1,1); //显示隐藏对应列方法
		};
		t.set_width(); //调用宽度,显示或隐藏后从新设置宽度
	}
	t.set_cookie = function(name,value,days){ //存入cookie
		var days = days == undefined ? 30 : days;
        var exp = new Date();
        exp.setTime(exp.getTime() + days*24*60*60*1000);
        document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
	}
	t.get_cookie = function(name){ //读取cookie
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)) return unescape(arr[2]);
        else return null;
	}
	t.invalid_fn = {  // 作废操作
		change_text : function(_thistd){
			t.dafaule.invalid_data._thistd = _thistd;
			if(_thistd.children('img').attr('state') == 1){
				t.dafaule.invalid_data.inv_btn.addClass('color_hs').addClass('off');
				t.dafaule.invalid_data.inv_btn.val(t.dafaule.invalid_data.string[1]);
			}else{
				t.dafaule.invalid_data.inv_btn.removeClass('color_hs').removeClass('off');
				t.dafaule.invalid_data.inv_btn.val(t.dafaule.invalid_data.string[0]);
			}
		},
		change_btn : function(){
			if(t.dafaule.invalid_data._thistd.children('img').attr('state') == 1){
				t.dafaule.invalid_data._thistd.attr(t.dafaule.invalid_data.td_state,0).children().parents('tr').removeClass(t.dafaule.invalid_data.invalid_on_tr);
			}else{
				t.dafaule.invalid_data._thistd.attr(t.dafaule.invalid_data.td_state,1).parents('tr').addClass(t.dafaule.invalid_data.invalid_on_tr);
			}
			t.response.on_invalid_change_btn();
			t.checkbox_img(t.dafaule.invalid_data._thistd.children('img'));
			this.change_text(t.dafaule.invalid_data._thistd);
		},
		is_invalid : function(){
			return t.dafaule.invalid_data._thistd.children('img').attr('state') == 1 ? true : false;
		}
	}
	//搜索栏状态复选图标切换
	t.screah_checkimg = function(this_img,is_click){
		var _src = this_img.attr('src');
		var _index = this_img.parent().index();
		if(this_img.attr('state') == 0){
			if(is_click){
				this_img.attr('state',1);
				this_img.attr('src',this_img.data('src1'));
				this_img.data('src0',_src);
				$(t.dafaule.dom_class._center+' tr',t._this).each(function(){
					if(!$(this).hasClass(t.dafaule.data_class.show_tr)) return true;
					if($(this).children().eq(_index).find('img').attr('state') == 1){
						$(this).removeClass(t.dafaule.data_class.show_tr).hide();
					}
				})
			}
		}else if(this_img.attr('state') == 1){
			if(is_click){
				this_img.attr('state',2);
				this_img.attr('src',this_img.data('src2'));
				this_img.data('src1',_src);
				$(t.dafaule.dom_class._center+' tr',t._this).each(function(){
					if(!$(this).hasClass(t.dafaule.data_class.show_tr)) return true;
					if($(this).children().eq(_index).find('img').attr('state') == 0){
						$(this).removeClass(t.dafaule.data_class.show_tr).hide();
					}
				})
			}else{
				$(t.dafaule.dom_class._center+' tr',t._this).each(function(){
					if(!$(this).hasClass(t.dafaule.data_class.show_tr)) return true;
					if($(this).children().eq(_index).find('img').attr('state') == 1){
						$(this).removeClass(t.dafaule.data_class.show_tr).hide();
					}
				})
			}
		}else{
			if(is_click){
				this_img.attr('state',0);
				this_img.attr('src',this_img.data('src0'));
				this_img.data('src2',_src);
			}else{
				$(t.dafaule.dom_class._center+' tr',t._this).each(function(){
					if(!$(this).hasClass(t.dafaule.data_class.show_tr)) return true;
					if($(this).children().eq(_index).find('img').attr('state') == 0){
						$(this).removeClass(t.dafaule.data_class.show_tr).hide();
					}
				})
			}
		}
	}
	t.rows_zf = function(tr,ys){
		var td_index = tr.children(t.dafaules.data_class._rows).length;
		for (var i = td_index; i > 0; i--){
			while(tr.children().eq(i).is(':hidden') && tr.children().eq(i).hasClass(t.dafaule.data_class._rows)){
				tr = tr.prev();
			}
			if(ys)  tr.children().eq(i).attr('rowspan',parseInt(tr.children().eq(i).attr('rowspan')) - 1);
			else  tr.children().eq(i).attr('rowspan',parseInt(tr.children().eq(i).attr('rowspan')) + 1);
		};
	}
	t.new_tr = function(arr,tr_attrs){
		var html;
		if(typeof tr_attrs !== "undefined"){
			var str = '';
			$.each(tr_attrs,function(key,val){
				str += " "+key+"='"+val+"' ";
			});
			html ="<tr"+str+" class='new_tr'>";
		}else{
			html ="<tr class='new_tr'>";
		}

		for(var i in arr){
			if(typeof arr[i] == "object" && arr[i] !== null){
				var attr = "";
				var attr_name = arr[i].name;
				$.each(attr_name,function(key,val){
					attr += " "+key+"='"+val+"' ";
				})
				html+="<td"+attr+">"+arr[i].val+"</td>";
			}else{
				html+="<td>"+arr[i]+"</td>";
			}
		}
		html +="</tr>";
		var table = t.dom._center.find('tbody').length != 0 ? t.dom._center.find('tbody') : t.dom._center.find('table');
		table.append(html);
		t.change_tr($('.new_tr'));
		if(table.find('tr').length == 1) t.set_width();
		return $('.new_tr').removeClass('new_tr');
	}
	t.update_tr = function(arr,tr_attrs,_trobj){
		var td,attr_name,tr = t.dafaule.tr_clickobj;
		if(typeof _trobj !== "undefined") tr = _trobj;
		if(typeof tr_attrs !== "undefined"){
			$.each(tr_attrs,function(key,val){
				tr.attr(key,val);
			});
		}
		for(var i in arr){
			td = tr.children('td:eq('+i+')');
			if(typeof arr[i] == "object" && arr[i] !== null){
				attr_name = arr[i].name;
				$.each(attr_name,function(key,val){
					td.attr(key,val);
				})
				td.html(arr[i].val);
			}else{
				td.html(arr[i]);
			}
			//console.log(td.html(),i);
		}
		return _trobj;
	}
	t.response = {
		_this : t._this.siblings('.table_pre'),
		on_click : function(){
			t.change_tr($(t.dafaule.dom_class._center+' tr',t.response._this).eq(t.dafaule.td_clickidex))
		},
		on_hover : function(){
			t.hover_tr($(t.dafaule.dom_class._center+' tr',t.response._this).eq(t.dafaule.td_hoveridex))
		},
		on_mouseout : function(){
			t.mouseout_tr($(t.dafaule.dom_class._center+' table',t.response._this))
		},
		on_delete_rows : function(){
			t.delete_rows($(t.dafaule.dom_class._center+' tr',t.response._this).eq(t.dafaule.tr_removeidex))
		},
		on_invalid_change_btn : function(){
			if(t.invalid_fn.is_invalid()){
				$(t.dafaule.dom_class._center+' tr',t.response._this).eq(t.dafaule.td_clickidex).removeClass(t.dafaule.invalid_data.invalid_on_tr)
			}else{
				$(t.dafaule.dom_class._center+' tr',t.response._this).eq(t.dafaule.td_clickidex).addClass(t.dafaule.invalid_data.invalid_on_tr);
			}
		}

	}

	t.column = function(rows){
		rows = typeof rows == 'string' ? [rows] : rows;
		$(t.dafaule.dom_class._head+' span',t._this).each(function(idx){
			if($.inArray($(this).html(),rows) !== -1){
				$(this).hide();
				$(t.dafaule.dom_class._center+' tr td:nth-child('+(idx+1)+')',t._this).hide().addClass('show_td');
				$(t.dafaule.dom_class.screah_box+' span:nth-child('+(idx+1)+')',t._this).hide();
				$(t.dafaule.dom_class.botm+' span:nth-child('+(idx+1)+')',t._this).hide();
			}
		})
		this.set_width();
	}
	t.showcolumn = function(rows){
		rows = typeof rows == 'string' ? [rows] : rows;
		$(t.dafaule.dom_class._head+' span',t._this).each(function(idx){
			if($.inArray($(this).html(),rows) !== -1){
				$(this).show();
				$(t.dafaule.dom_class._center+' tr td:nth-child('+(idx+1)+')',t._this).show().removeClass('show_td');
				$(t.dafaule.dom_class.screah_box+' span:nth-child('+(idx+1)+')',t._this).show();
				$(t.dafaule.dom_class.botm+' span:nth-child('+(idx+1)+')',t._this).show();
			}
		})
		this.set_width();
	}
	t.columnidx = function(rows){

		for(var i in rows){

			$(t.dafaule.dom_class._head+' span:nth-child('+(rows[i])+')',t._this).hide();
			$(t.dafaule.dom_class._center+' tr td:nth-child('+(rows[i])+')',t._this).hide().addClass('show_td');
			$(t.dafaule.dom_class.screah_box+' span:nth-child('+(rows[i])+')',t._this).hide();
			$(t.dafaule.dom_class.botm+' span:nth-child('+(rows[i])+')',t._this).hide();
		}
		this.set_width();
	}
	t.columnhead = function(){
		var spanlenth = $(t.dafaule.dom_class._head+' span',t._this).length;
		for (var i = 0; i < spanlenth; i++) {
			if($(t.dafaule.dom_class._head+' span:eq('+i+')',t._this).is(':hidden')){
				$(t.dafaule.dom_class._center+' tr',t._this).each(function(){
					$(this).children().eq(i).hide().addClass('show_td');
				})
			}
		};
		this.set_width();
	}

	t.set_height = function(){
		var _this = this._this;
		var str = _this.data('height');
	  	auto_height = str.split(",");
	  	var sli_height = 0;
		for(var i in auto_height){
			if(isNaN(auto_height[i])){
				sli_height += $('.'+auto_height[i]).is(':visible') ? $('.'+auto_height[i]).outerHeight(true) : 0;
			}else{
				sli_height += parseInt(auto_height[i]);
			}
		}
	  	var win_height = $(window).outerHeight(true)-sli_height - 3;
		_this.height(win_height);
	}
	t.set_t().init();
}

tables.prototype = {
	stop : function(){ return false;},
	active : function(){ return true;},
	windowing : function(windowing_box){
		var _this = this,span = undefined;
		_this.dom._head.hover(function(){
			document.oncontextmenu=_this.stop;
		},function(){
			document.oncontextmenu=_this.active;
		}).mousedown(function(e){
			if(e.which == 3){
				windowing_box.css({'left':e.pageX+1,'top':e.pageY+1})
				windowing_box.show();
				clear_pop(windowing_box);
				span = $(e.target).parents('.rowspan_box').length != 0 ? $(e.target).parents('.rowspan_box') : $(e.target);

			}
		})
		_this.dafaule.Split.split_dom.click(function(){
			if(_this.dafaule.Split.is){
				$(this).html('分屏冻结')
				_this.dafaule.Split.is = false;
				_this.removewindowing(_this.dafaule.Split.span);
			}else{
				_this.dafaule.Split.span = span;
				var idx = span.index();
				_this.windowing_init(idx);
			}
			windowing_box.hide();
		})
		return this;
	},
	windowing_init : function(idx){
		if(this.dafaule.Split.span == undefined){
			var idx = idx+2;
		}else{
			var idx = this.dafaule.Split.span.index()+2;
		}
		var head = this.dom._head.children(':nth-child('+idx+')');
			head.prevAll().addClass('windowing');

		head.prevAll().each(function(){
			if($(this).hasClass('rowspan_box')){
				idx += $(this).find('span').length-1;
			}
		})

		this.dom.screah_box.find('span:nth-child('+idx+')').prevAll().addClass('windowing');
		var td = this.dom._center.find('tr td:nth-child('+idx+')');
		td.prevAll().addClass('windowing').css('left',- 1);
		td.attr('width',td.attr('width')-1);
		this.dom.botm.find('span:nth-child('+idx+')').prevAll().addClass('windowing');
		this.dafaule.Split.is = true;
		if(this.dafaule.Split.split_dom !== undefined){
			this.dafaule.Split.split_dom.html('解除冻结');
		}
		this.dafaule.Split.idx = idx;
		return this;
	},
	windowing_fn : function(){
		this.dafaule.Split.span.next().prevAll().css('left',this._this.scrollLeft());
		this.dom.screah_box.find('span:nth-child('+this.dafaule.Split.idx+')').prevAll().css('left',this._this.scrollLeft());
		this.dom._center.find('tr td:nth-child('+this.dafaule.Split.idx+')').prevAll().css('left',this._this.scrollLeft()-1);
		this.dom.botm.find('span:nth-child('+this.dafaule.Split.idx+')').prevAll().css('left',this._this.scrollLeft());
	},
	removewindowing : function(){
		this.dafaule.Split.span.next().prevAll().css('left',0).removeClass('windowing');
		this.dom.screah_box.find('span:nth-child('+this.dafaule.Split.idx+')').prevAll().css('left',0).removeClass('windowing');
		this.dom._center.find('tr td:nth-child('+this.dafaule.Split.idx+')').prevAll().css('left',0).removeClass('windowing');
		var td = this.dom._center.find('tr td:nth-child('+this.dafaule.Split.idx+')');
		td.attr('width',parseInt(td.attr('width'))+1);
		this.dom.botm.find('span:nth-child('+this.dafaule.Split.idx+')').prevAll().css('left',0).removeClass('windowing');
	},
	sort : function(order,idx){
		var arr = [];
		this.dom._center.find('tr td:nth-child('+idx+')').each(function(){
			var obj = {
				dom : $(this).parent(),
				sort : parseInt($(this).children().html() || $(this).html())
			}
			arr.push(obj);
		})
		arr.sort(this.getSortFun(order,'sort'));
		return arr;
	},
	getSortFun : function(order, sortBy) {
	    var ordAlpah = (order == 'asc') ? '>' : '<';
	    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
	    return sortFun;
	},
	set_sortdom : function(arr){

		var table = this.dom._center.find('tbody') || this.dom._center.find('table');
		for(var i in arr){
			table.append(arr[i].dom);
		}
	}
}

$.extend({
    Object:{
        count: function(p) {
            p = p || false;
            return $.map( this, function(o) {
                if( !p ) return o;
                return true;
            }).length;
        }
    },
});
$.fn.extend({
    hoverimg : function(options){
	    if(this.length == 0) return false;
    	defaults = {
    		height : 160,
    		width : 120,
    		attr : 'src'
	    };
        var opts = $.extend({}, defaults, options),
        	tx = {
	        	load_dom : function(){
					var html = '<div class="hoverimg" style="position: fixed; left: 0; top: 0; z-index: 999; opacity:0; transition:all .3s ease 0s; background:#fff;">';
						html +='<img src=""/>';
						html +='<img src="" style="opacity:0;"/>';
						html +='</div>';
					return html;
	        	},
	        	set_size : function(dom,height,width){
	        		height = opts.height || height;
	        		width = opts.width || width;
	        		var left = dom.width();
	        		var top = -(dom.height()/2 + height/2);
	        		if((dom.offset().top + height/2 + dom.height()/2) > $(window).height()){
	        			top = $(window).height() - dom.offset().top - dom.height() - height;
	        		}else if((top + dom.height() + dom.offset().top) < 0){
	        			top = 0;
	        		}
	        		set_pop_wz_r(dom,$('.hoverimg'),top,left);
	        		$('.hoverimg img').height(height).width(width);
	        	},
	        	init : function(dom,src){
	        		var _this = this,
	        			imgdom = $('.hoverimg img:eq(0)').css('opacity') == 0 ? $('.hoverimg img:eq(0)') : $('.hoverimg img:eq(1)');
	        		imgdom.attr('src',src);
	        		var img = new Image();
					img.src = src;
					var a = setInterval(function(){
						if(img.height != 0){
							clearInterval(a);
							_this.set_size(dom,img.height,img.width);
	        				imgdom.siblings().css('opacity','0');
							imgdom.css('opacity','1');
							$('.hoverimg').css('opacity','1');
						}
					},100)

	        	}
	        };
	    if($('.hoverimg').length == 0){
	    	$('body').append(tx.load_dom());
	    }
	    set_pop_wz_r(this.eq(0),$('.hoverimg'),-this.eq(0).height(),this.eq(0).width());
	    var time,
	    	hidetime;
        return this.each(function(){
			var space = $(this);
			space.off('mouseover').on('mouseover',function(e){
				clearTimeout(time);
				clearTimeout(hidetime);
				var _this = $(this);
				$('.hoverimg').show();
				time = setTimeout(function(){
					tx.init(_this,_this.attr(opts.attr));
				},50);
			});
			space.off('mouseout').on('mouseout',function(){
				clearTimeout(time);
				time = setTimeout(function(){
					$('.hoverimg').css('opacity','0');
					hidetime = setTimeout(function(){
	        			$('.hoverimg').hide();
	        		},300)
				},100)
			});
        });
    },
    set_btn : function(options){
    	var defaults = {
    		_class : '',
    		dom : []
    	}
        var def = $.extend({},defaults,options),
        	space = this.parent();
        this.removeClass(def._class);
       	for(var i in def.dom){
       		$(def.dom[i],space).addClass(def._class)
       	}
       	return this;
    }
})
//会员头像定位与查看原图功能
function set_img_size(img,load){
	var load = load == undefined ? true : load;
	var _img = new Image();
	_img.src = img.attr('src');
	var a = setInterval(function(){
		if(_img.height != 0){
			clearInterval(a);
			img.attr('style','');
			var pre_box = {
				height : img.parent().outerHeight(true),
				width : img.parent().outerWidth(true)
			}
			if(pre_box.width / pre_box.height > _img.width / _img.height){
				img.width(pre_box.width);
				var _top = (img.height() - pre_box.height)/2;
				img.css({'top':-_top});
			}else{
				img.height(pre_box.height);
				var _left = (img.width() - pre_box.width)/2;
				img.css({'left':-_left});
			}
			if(load) load_img(img,img.attr('primary-src'));
		}
	},100)
}
function load_img(_img,src){
	var img = new Image();
	img.src = src;
	var a = setInterval(function(){
		if(img.height != 0){
			clearInterval(a);
			_img.attr('title','点击查看原图').off().on('click',function(){
				if($('.primary').length == 0){
					$('body').append(set_primary_img(img.height,img.width,src))
				}
				$('.primary').fadeIn(100);
				$('.primary img').attr('src',src);
				$('.primary').off('click').on('click',function(e){
					if($(e.target).hasClass('primary')){
						$('.primary').fadeOut(100);
						$('.primary img').attr('src','');
					}
				})
			})
		}
	},100)
}
function new_houhimg(src,dpj,max_width,max_height){
	var max_width = max_width || 280;
	var max_height = max_height || 370;
	//src = src;
	if(src.indexOf('?') !== -1){
		src += new Date().getTime();
	}else{
		src += '?'+new Date().getTime();
	}
	if($('.primary').length == 0){
		if(dpj == undefined){
			$('body').append(set_primary_img(max_height,max_width,src))
		}else{
			$('body').append(primary_imgku(max_height,max_width,src,dpj))
		}
	}else{
		$('.primary img').attr('src',src);
		$('.primary .dpj').html('吊牌价：'+dpj+'元');
	}
	$('.primary').off('click').on('click',function(e){
		if($(e.target).hasClass('primary')){
			$('.primary').fadeOut(100);
			$('.primary img').attr('src','');
			$('.primary .dpj').html('');
		}
	})
	setTimeout(function(){
		$('.primary').fadeIn(100);
	},50)
}

function set_primary_img(height,width,src){
	var win_height = $(window).height() - 60;
	var win_width = $(window).width() - 60;

	if(width > win_width || height > win_height){
		if(width/height > win_width/win_height){
			height = win_width/width * height;
			width = win_width;
		}else{
			width = win_height/height * width;
			height = win_height;
		}
	}
	var html = '<div class="primary" style="display:none;">';
		html +='<span style="height:'+height+'px; width:'+parseInt(width)+'px; margin-top:-'+((height/2)+12)+'px; margin-left:-'+((width/2)+8)+'px;">';
		html +='<i class="close" onclick="$(\'.primary\').fadeOut(100);">X</i>';
		html +='<img src="'+src+'" height='+height+' width='+width+'/>';
		html +='</span>';
		html +='</div>';
	return html;
}

function primary_imgku(height,width,src,dpj){
	var win_height = $(window).height() - 60;
	var win_width = $(window).width() - 60;

	if(width > win_width || height > win_height){
		if(width/height > win_width/win_height){
			height = win_width/width * height;
			width = win_width;
		}else{
			width = win_height/height * width;
			height = win_height;
		}
	}
	var html = '<div class="primary" style="display:none;">';
		html +='<span style="height:'+height+'px; width:'+parseInt(width)+'px; margin-top:-'+((height/2)+12)+'px; margin-left:-'+((width/2)+8)+'px;">';
		html +='<i class="close" onclick="$(\'.primary\').fadeOut(100);">X</i>';
		html +='<img src="'+src+'" height='+height+' width='+width+'/>';
		html +='<i class="dpj">吊牌价：'+dpj+'元</i>';
		html +='</span>';
		html +='</div>';
	return html;
}


//设置div左右位置
function set_pop_wz_r(_this,pop_box,_top,_left){
	var _top = _top || 0,_left = _left || 0;
	var left = _this.offset().left + _left;
	var top = _this.offset().top + _this.outerHeight(true) + _top;
	pop_box.css({'left':left,'top':top});
}

function new_popimg(){
	if($('.pop_img').length == 0){
		$('body').append(new_popimg_html());
	}

}
function new_popimg_html(){
	var html ='<div class="pop_img" style="display:none;">';
		html =+'<img src="">';
		html =+'</div>';
	return html;
}
//绑定window点击事件, 判断不是点击当前box则关闭当前box

function clear_pop(pop_table,is_fn,fn){
	$('body').on('click',clearpop = function(e){
		if(!$(e.target).hasClass('dropdown-toggle') && $(e.target).get(0).nodeName != 'LABEL' && $(e.target).get(0).nodeName != 'OPTION' &&
			$(e.target).parents('.tanChuChuang').length == 0 && !$(e.target).hasClass('theme-popover-mask') && $(e.target).parents('.show_clos').length == 0
			){
			var pop = {
				xl : get_isNaN(pop_table.offset().left),
				xr : pop_table.outerWidth(true) + get_isNaN(pop_table.offset().left),
				yt : get_isNaN(pop_table.offset().top),
				yb : pop_table.outerHeight(true) + get_isNaN(pop_table.offset().top),
			}
			if(!((e.pageX > pop.xl && e.pageX < pop.xr && e.pageY > pop.yt && e.pageY < pop.yb) || $(e.target).hasClass('on_pop'))){

				if(typeof is_fn === 'function'){
					if(is_fn(e)) return false;
				}
				$('body').unbind('click',clearpop);
				pop_table.hide();
				if($('.top_Dbutton .button._back').length > 0){
					show_top_back($('.top_Dbutton .button._back'),function(){
						if(!$(e.target).hasClass('button')){
							hide_top_back($('.top_Dbutton .button._back'))
						}
					})
				}
				if(typeof fn === 'function') fn();

			}
		}
	})
}

function new_clearpop(this_box,pop_box,is_fn,fn){
	var _pop = {
			left  : pop_box.offset().left,
			right : pop_box.outerWidth(true) + pop_box.offset().left,
			top   : pop_box.offset().top,
			botm  : pop_box.outerHeight(true) + pop_box.offset().top
		},
		_this = {
			left  : this_box.offset().left,
			right : this_box.outerWidth(true) + this_box.offset().left,
			top   : this_box.offset().top,
			botm  : this_box.outerHeight(true) + this_box.offset().top
		};

	$('body').on('click',newclearpop = function(e){
		e.stopPropagation();
		if(!(e.pageX > _pop.left && e.pageX < _pop.right && e.pageY > _pop.top && e.pageY < _pop.botm) &&
			!(e.pageX > _this.left && e.pageX < _this.right && e.pageY > _this.top && e.pageY < _this.botm)){

			if(typeof is_fn === 'function'){
				if(is_fn(e)) return;
			}
			$('body').unbind('click',newclearpop);
			var is_return = true;
			if(typeof fn === 'function'){
				is_return = (typeof fn() === 'undefined') ? true : fn();
			}
			if(is_return) pop_box.hide();
		}
	})
}


var enter = {
	is : false,
	key : {
		13 : function(){},
	}
};
function set_enter(i,time){
	enter.key = {};
	setTimeout(function(){
		enter = $.extend(true,{},enter,i);
	},time || 0)
}
$(window).keyup(function(e){
	if(typeof enter !== 'object') return;
	for(var i in enter.key){
		if(e.which == i && enter.is){
			enter.is = enter.key[i]();
		}
	}
})
