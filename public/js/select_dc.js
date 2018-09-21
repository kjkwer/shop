
    //选择店仓table dbj 单店
	var popup_select_dc = tables('.select_dc .table_pre');
	
	var dc_fn = { 
		is_dc : function(){return true}
	};
	//点击店仓输入框,弹出店仓选择下拉
	$('body').on('click','input.dc',function(e){
		if(dc_fn.is_dc()){
			set_pop_wz($(this),$('.select_dc'))//设置下拉位置
			if($(this).val() != '') show_dc($(this).attr('dcid')); // 判断不为空值 选中店仓
			$('.select_dc').show();//显示下拉
			popup_select_dc._this.scrollTop(0);
			set_dc_qx($(this).attr('qx'));
			popup_select_dc.set_t(); // 设置距离
			$('input.dc.on').removeClass('on');
			$(this).addClass('on');//添加标示
			//绑定关闭事件
			clear_pop($('.select_dc'),function(){ 
				if(typeof popup_select_dc.dafaule.tr_clickobj === 'object'){
					popup_select_dc.remove_change_tr(popup_select_dc.dafaule.tr_clickobj);
				}
			});
		}
	})


	function set_dc_qx(showid){ 
		$('.select_dc tr').show();
		if(showid == undefined || showid == '') return '';
		
		$('.select_dc tr').hide();
		var showidarr = showid.split(',');
		//console.log(showidarr);
		for(var i in showidarr){ 
			if(parseInt(showidarr[i]) !== 0){
				$('.select_dc tr[dcid='+showidarr[i]+']').show();
			}
		}
			

	}

	function set_dc_fn(a){ 
		dc_fn = $.extend(true,{},dc_fn,a);
	}
	function click_dc_fn(dc,tr){ 
		for(var i in dc){ 
			if($('input.dc.on').hasClass(i)){ 
				dc[i](tr);
			}
		}
	}

	//单击店仓 赋值 关闭下拉
	popup_select_dc.dafaule.tr_click_fn = function(_this){ 
		$('input.dc.on').val(get_select_dcname()).attr('dcid',get_select_dcid());
		$('#storeid').val(get_select_dcid());
		$('.select_dc').hide();
		click_dc_fn(dc_fn,_this);
	}
	
	//获取店仓名称
	function get_select_dcname(){ 
		return popup_select_dc.dafaule.tr_clickobj.children().eq(1).html();
	}
	//获取店仓id
	function get_select_dcid(){ 
		return popup_select_dc.dafaule.tr_clickobj.attr('dcid');
	}
	//设置店仓选中
	function show_dc(dcid){ 
		popup_select_dc.dom._center.find('tr').each(function(){ 
			if($(this).attr('dcid') == dcid){ 
				popup_select_dc.change_tr($(this));
				return false;
			}
		})
	}
	/*
	if($('.select_dc .table_pre tr').length == 1){ 
		$('.select_dc .table_pre tr').click();
	}
	*/
	/**************多店选择*****************/
	var dcs_fn = { 
		is_dc : function(){return true}
	};
	function set_dcs_fn(a){ 
		dcs_fn = $.extend(true,{},dcs_fn,a);
	}
	function click_dcs_fn(dc,tr){ 
		for(var i in dc){ 
			if($('input.dcs.on').hasClass(i)){ 
				dc[i](tr);
			}
		}
	}
	//选择调拨店仓table dbj
	var popup_select_dcs = tables('.select_dcs .table_pre'),dcs = [];
	//点击店仓输入框,弹出店仓选择下拉
	$('body').on('click','input.dcs',function(e){ 
		var _this = $(this);
		setTimeout(function(){
			clear_dc();//清空所有店仓
			set_pop_wz(_this,$('.select_dcs'))//设置下拉位置
			//如果input有值 设置对应店仓
			if(typeof _this.attr('index') != 'undefined' && _this.attr('index') != ''){ 
				var val = _this.attr('index'),val_arr = [];
				val_arr = val.split(',');
				console.log(val_arr);
				set_select_dcsname(val_arr);
			}
			popup_select_dcs.check_all();
			$('.select_dcs').show();//显示下拉
			popup_select_dcs.set_t(); // 设置距离
			$('input.dcs').removeClass('on');
			_this.addClass('on');//添加标示
			new_clearpop(_this,$('.select_dcs'));
		},100)
	})
	//赋值店仓到输入框
	$('.select_dcs #confirm').click(function(){ 
		var val = get_select_dcsname();
		var index = get_select_dcsindex();
		var dcid = get_select_dcsval();
		$('input.dcs.on').val(val).attr({'title':val,'index':index,'dcid':dcid});
		click_dcs_fn(dcs_fn,{ 
			val : val,
			dcid : dcid
		})
		$('.select_dcs').hide();
		if($('input.dcs.on').hasClass('once')){
			store_change();
		}
		$('body').unbind('click',newclearpop);
	})
	$('.select_dcs #reset').click(function(){ 
		$('input.dcs').click();
	})
	//单击店仓 保存勾选的tr到dcs
	popup_select_dcs.dafaule.tr_click_fn = function(_this,_index,e){ 
		if(e.target.nodeName != 'IMG'){
			popup_select_dcs.checkbox_img(_this.children().eq(0).find('.checkbox_img'));
		}
		
	}
	popup_select_dcs.dafaule.checkbox_click_fn = function(this_img){ 

		var __this = this_img.parents('tr');
		if(__this.length == 0) return false;
		dcs[__this.index()] = this_img.attr('state') == 1 ? __this : undefined ;
	}
	//返回店仓名称
	function get_select_dcsname(){ 
		var val = '',is_dh = false;
		for(var i in dcs){ 
			if(typeof dcs[i] === 'object' && checkishidden(dcs[i])){ 
				val += is_dh ? ','+dcs[i].children().eq(2).html() : dcs[i].children().eq(2).html();
				is_dh = true;
			}
		}
		return val;
	}
	//返回店仓下标
	function get_select_dcsindex(){ 
		var val = '',is_dh = false;
		for(var i in dcs){ 
			if(typeof dcs[i] === 'object' && checkishidden(dcs[i])){ 
				val += is_dh ? ','+i : i;
				is_dh = true;
			}
		}
		return val;
	}
	//返回店仓值
	function get_select_dcsval(){ 
		var val = '',is_dh = false;
		for(var i in dcs){ 
			if(typeof dcs[i] === 'object' && checkishidden(dcs[i])){ 
				val += is_dh ? ','+dcs[i].attr('dcid') : dcs[i].attr('dcid');
				is_dh = true;
			}
		}
		return val;
	}
	//设置选中的店仓
	function set_select_dcsname(val_arr){ 
		for(var i in val_arr){ 
			popup_select_dcs.checkbox_img(popup_select_dcs.dom._center.find('tr').eq(val_arr[i]).find('.'+popup_select_dcs.dafaule.data_class.checkbox_img))
			dcs[val_arr[i]] = popup_select_dcs.dom._center.find('tr').eq(val_arr[i]);
		}
	}
	//检查是否隐藏
	function checkishidden(tr){ 
		return tr.is(':hidden') ? false : true;
	}
	//清空所有店仓
	function clear_dc(){ 
		if(typeof popup_select_dcs.dafaule.tr_clickobj === 'object'){
			popup_select_dcs.remove_change_tr(popup_select_dcs.dafaule.tr_clickobj);
		}
		popup_select_dcs.dom._center.find('.'+popup_select_dcs.dafaule.data_class.checkbox_img).each(function(){ 
			if($(this).attr('state') == 1){ 
				popup_select_dcs.checkbox_img($(this));
			}
		})
		dcs = [];
	}
	/**************多店选择end**************/
