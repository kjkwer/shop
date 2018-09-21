;(function(root,factory){ 
	var modules = {},
		require = function(deps,callback){ 
			if(typeof deps == 'string'){ 
				return get_module(deps)
			}else{ 
				var args = [];
				for(var i in deps){ 
					args.push(get_module(deps[i]))
				}
				
				return callback.apply(null,args);
			}
		},
		define = function(id,deps,factory){ 
			if(arguments.length == 2){ 
				factory = deps;
				deps = null;
			}
			require(deps || [],function(){ 
				set_module(id,factory,arguments);
			})
		},
		set_module = function(id,factory,args){ 

			var module = {
                    exports: factory 
                };
            var returned = factory.apply( null, args );

                returned !== undefined && (module.exports = returned);

            modules[ id ] = module.exports;
		},
		get_module = function(id){ 
			return modules[id];
		};
		
		var tables = factory(root,define,require);
		root.t = tables;
		root.Base = modules.base;
})(window,function(window,define,require){ 
		
		

	'use strict';


	define('DEFAULTS',function(){ 
		return { 
			operate : { 
				rows : [], 					//自动跨行列列名(为空不开启)
				attr : {}					//通用td attr属性 tdname : { attrname : val }
			},
			data : {},						//数据存放
			head : {},						//表头数据存放
			search : {},					//搜索数据存放
			searchdata : {},				//搜索数据存放
			searchselect : {},				//搜索条件
			foot : {},						//底部数据存放
			is_clicktr : true,				//是否开启点击tr
			trobj : undefined,				//选中tr存放(jqueryobj)
			is_move : false,				//是否开启上下移动
			stati_nth : '',					//统计奇数还是偶数, ood or even , 默认统计全部
			stati_not : 'not_stati',        //统计行不计算的行属性

			trattr : {},					//tr attr数据
			relationmark : '',				//合并行时唯一标示(前提是trattr不为空)
			relationclos : [],				//合并行时需要数据相加的列名
			relation : {},
			sort : [],						//需要排序的列名(为空不开启)
			menu : false,					//是否开启右键菜单功能
			isxuhao : true,					//忘了

			split : 'xuhao',				//分屏冻结列名(默认开启序号列)
			splitis : false,				//忘了
			splitidx : 0,					//忘了
			splitspan : undefined,			//忘了

			columnis : true,				//是否开启右键菜单里面的显示列功能
			columnclos : [],				//需要显示列功能的列名
			columnshowclos : [],			//显示的列名
			columnhideclos : [],			//隐藏的列名
			columnprevishide : true,		//显示列上一次操作是不是隐藏

			initdata : {},					//初始化时传的数据立马加到表格中
			isnullinput : false,			//特别需求 当input值为空时不输入input 默认关闭

			hjrows : [],					//表中合计不计算在统计内
			ishjrows : false,				//false表示不统计表中合计行,true就只统计合计行

			hidedata : {},					//隐藏的行数据 通过hiderow方法隐藏数据
			hidetrattr : {},				//隐藏的行属性 通过hiderow方法隐藏属性

			recordorder : true,				//是否记录数据顺序
			orderid : [],					//存放记录好顺序的id

			tableheight : 0,				//table高度

			xuhaoidx : 0,					//记录序号

			datalength : 0,					//有效数据的个数
			ruledata : {},					//合并行保存的规则数据
			
			limit : true,					//是否限制加载
			limitstati : true,				//加载状态
			pagesun : 100,					//每次限制100条
			limitdata : {}, 				//已经加载了的数据
			returndata : {},				//所有新增返回的id

			hxwissb : [],					//不自动填充select搜索的name

			input_rule : 'all',				//input输入验证

			daochusplit : ':)',				//导出数据拼接符
			
			src : ''						//图片路径前缀
			

			//ps:还有很多属性是在需要的时候再加到里面的
		}
	});
	
	define('dom_class',function(){ 
		return { 
			top : '._top',
			head : '._head',
			search_box : '.screah_box',
			table_box : '.table_box',
			center : '.center',
			botm : '.botm',
			show_closbtn : '.show_closbtn',
			show_closbox : '.show_clos',
			search_img : '.search_img',
			not_search : '.not_search'
		}
	})

	define('data_class',function(){ 
		return { 
			is_tdclick : 'click_no',
			hj_rows	 : 'hj_rows',
			delete_img : 'delete_img',
			tr_click : '_click',
			tr_hover_class : '_hover',
			all_rows : 'all_rows',
			checkbox_img : 'checkbox_img',
			no_check : 'no_hover',
			click_td : 'click_fff',
			show_tr : 'show_tr',
			avg_rows : 'avg_rows',
			show_td : 'show_td',
			rows_td : 'rows_td',
			rows : 'rows',
			sort : 'sort'
		}
	})
	
	define('all_default',[ 
		'DEFAULTS',
		'dom_class',
		'data_class'
	],function(defaults,dom_class,data_class){ 
		return { 
			defaults : defaults,
			dom_class : dom_class,
			data_class : data_class
		};
	})

	define('base',function(){ 
		var tableallcont = {},
			enter = { 
				is : false,
				key : {}
			};

		window.Newclearpop = function(){};

		

        function bind_fun(name,deps,table){ 
        	if(arguments.length == 2){ 
        		table = deps;
        		deps = null;
        	}
        	if(typeof table.options.callback[name] !== 'function'){
        		table.options.callback[name] = function(){};
        	}
        	table.options.callback[name].call(table,deps);
        }
        
        function tableproto(name,factory){ 
        	var table = require('table');
        	table.prototype[name] = factory;
        }
        
        
        function tableconst(name,factory){ 
        	tableallcont[name] = factory;
        };

        return {

            version: '1.1.1',
    		
    		$ : window.jQuery,

    		table : {},

			gettable : function(dom){ 
				var tableid = dom.parents('.table_pre').attr('tableid');
				return this.table[tableid];
			},

    		initfactory : new Array(),

            gtid: (function() {
                var counter = 0;
    
                return function( prefix ) {
                    var guid = (+new Date()).toString( 32 ),
                        i = 0;
    
                    for ( ; i < 5; i++ ) {
                        guid += Math.floor( Math.random() * 65535 ).toString( 32 );
                    }
    
                    return (prefix || 'tr_') + guid + (counter++).toString( 32 );
                };
            })(),

            isNaN : function(str){ 
            	return isNaN(parseFloat(str)) ? 0 : parseFloat(str);
            },
            isArray : function(obj) { 
				return Object.prototype.toString.call(obj) === '[object Array]'; 
			},
			
            Enter : (function(winevent){ 
            	$(window).keydown(winevent);

            	return function(i,time){ 
					setTimeout(function(){ 
						enter = $.extend(true,{},enter,i);
					},time || 0);
				};

            })(function(e){ 
				for(var i in enter.key){ 
					if(e.which == i && enter.is){ 
						enter.is = enter.key[i]();
					}
				}
            }),
            
            bind_fun : bind_fun,

            tableproto : function(name,factory,isinit){ 
            	tableproto(name,factory)
            	if(isinit){ 
            		this.initfactory.push(name);
            	}
            },

            tableconst : function(name,factory,isinit){ 
            	tableconst(name,factory)
            	if(isinit){ 
            		this.initfactory.push(name);
            	}
            },

            installCo : function(obj){ 
            	 return $.extend(obj,tableallcont);
            },

            getint : function(num){ 
            	return parseFloat((num+'').replace(/[^0-9\.\-]+/,''));
            },

            newobjurl : function(obj){ 
            	if(!$.isEmptyObject(obj)){
            		return JSON.parse(JSON.stringify(obj));
            	}else{ 
            		return obj;
            	}
            },

            new_clearpop : function(this_box,pop_box,factory){ //此方法很*************
            	if(arguments.length == 2){ 
            		factory = pop_box;
            		pop_box = this_box;
            	}
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
            	$('body').unbind('click',Newclearpop);
				$('body').on('click',Newclearpop = function(e){ 
					if(!(e.pageX > _pop.left && e.pageX < _pop.right && e.pageY > _pop.top && e.pageY < _pop.botm) &&
						!(e.pageX > _this.left && e.pageX < _this.right && e.pageY > _this.top && e.pageY < _this.botm)){
						factory(e);
						$('body').unbind('click',Newclearpop);
					}
				});
			},

			removearray : function(name,arr){ 
				var idx = 0;
				while(arr[idx] != name && idx < arr.length){ 
					idx ++;
				}
				if(idx !== arr.length){
					arr.splice(idx,1);
				}
				return arr;
			},

			set_cookie : function(name,value,days){
				var days = days == undefined ? 30 : days;
		        var exp = new Date();
		        exp.setTime(exp.getTime() + days*24*60*60*1000);
		        document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
			},

			get_cookie : function(name){
				var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		        if(arr=document.cookie.match(reg)) return unescape(arr[2]);
		        else return null;
			},

			get_val : function(obj){ 
				obj = obj == null ? '' : obj;
				var each = function(_obj){ 
					if(typeof _obj.val === 'object'){ 
						each(_obj.val);
					}else{ 
						return _obj.val === undefined ? _obj : _obj.val;
					}
				}
				return each(obj);
			},

			creatarr : function(arr){ 
				return { 
					each : function(callback){ 
						for (var i = 0; i < arr.length; i++) {
							var isbreak = callback.call(arr,i,arr[i]);
							if(!isbreak && isbreak !== undefined) break;
						};
					},
					after : function(name,afterarr){ 
						
						afterarr = typeof afterarr === 'object' ? afterarr : [afterarr];
						
						this.each(function(i,v){ 
							
							if(name == v){
								var me = this;
								for(var j in afterarr){ 
									this.splice(parseInt(i)+parseInt(j)+1, 0, afterarr[j]);
								}
								return false;
							}

						});

						return arr;

					},
					before : function(name,afterarr){ 
						
						afterarr = typeof afterarr === 'object' ? afterarr : [afterarr];
						
						this.each(function(i,v){ 
							if(name == v){
								var me = this;
								for(var j in afterarr){ 
									this.splice(parseInt(i)+parseInt(j), 0, afterarr[j]);
								}
								return false;
							}

						});

						return arr;
						
					},
					remove : function(name){ 
						this.each(function(_,v){ 
							if(v == name){ 
								this.splice(_,1);
							}
						})
						return arr;
					}
				};
			}

			
        };
	})
	
	define('mediator',[
        'base'
    ],function(base){
    	var $ = base.$,
    		separator = ',',
    		protos;

    	function eachEvent(events,callback,iterator) {
            $.each((events || '').split(separator),function(_,key) {
                iterator(key,callback);
            });
        }

    	protos = { 
    		on : function(name,callback){ 
    			var _this = this;
    			if (!callback) {
                    return this;
                }
                eachEvent(name,callback,function(name,callback) {
                    _this.options.callback[name] = callback;
                    
                });

    			return this;
    		},
    		once : function(name,callback){ 
    			var _this = this;
    			if (!callback) {
                    return this;
                }
                eachEvent(name,callback,function(name,callback ) {
                    var once = function(){ 
                    	_this.off(name);
                    	return callback.apply(_this,arguments);
                    }
                    _this.on(name,once);
                });

    			return this;
    		},
    		off : function(name){ 
    			this.options.callback[name] = function(){};
    			return this;
    		}
    	}

    	return $.extend({ 
    		installTo: function(obj) {
                return $.extend(obj,protos);
            }
    	},protos);
    });


	define('table',[ 
		'base',
		'all_default',
		'mediator'
	],function(base,all_default,mediator){ 
		var $ = base.$;
		
		var table = function(container,params){ 

			if (!(this instanceof table)) return new table(container,params);
			//重新开辟地址,否则会被引用传递改变了值
			var alldefault = base.newobjurl(all_default);
			//初始化属性
			this._this = $(container);
			alldefault.defaults = $.extend(true,{},alldefault.defaults,params || {})
			this.options = alldefault;
			
			//配置回调函数
			/**
			 *@param insert 	新增
			 *@param remove 	删除
			 *@param update 	修改
			 *@param stati  	统计
			 *@param click  	tr点击
			 *@param dblclick  	tr双击
			 *@param keyup  	表格里面input输入(必须调用,其中回调里面最后调用update 例:e.update(修改输入框后其他关联数据的变动传到此方法修改))
			 *@param scroll 	滚动
			 *@param move   	上下移动tr
			 *@param emptydata 	清空数据
			 *@param search 	用户搜索过后
			 *........
			 *
			 *@grammar table.on(name,callback)
			 *@grammar table.off(name)
			 *@grammar table.once(name,callback)
			 */
			this.options.callback = {};

			//初始化方法
			base.installCo(this);
			//初始化事件
			mediator.installTo(this);
			this.init();
		}
		/*
			var tab = t('.table_pre',{ 
				//参数配置(参数列表看上面DEFAULTS)
			})
			
			tab.insert(data) 	//添加方法
			tab.remove(id) 		//删除方法
			tab.update(id,data) //修改方法
			
			tab.select()		//查询方法
			tab.change_tr(id) 	//选中一行
			tab.location() 		//定位选中行到可视界面(前提是有选中行)
			tab.move()			//开启上下键移动选中行(前提是有选中行 && 不能同时开启多个表格的移动)
			tab.offmove()		//关闭上下键移动选中行
			tab.set_number()	//设置序号
			tab.set_width()		//设置宽度
			tab.stati()			//底部统计
			tab.getdata(id)		//返回对应的数据
			tab.getattr(id)		//返回对应的tr attr
			tab.column(name);	//显示列方法,如果显示的就隐藏,反之显示(name 列名)
			tab.emptydata(); 	//清空数据
			tab.refreshdata(); 	//刷新数据
			tab.refresh(params);//刷新所有配置
			tab.gettrobj()		//获取当前选中tr对象
			tab.columnrows()	//隐藏列方法,删除标签方式隐藏;参数1为列名,单个传字符串,多个为数组;参数2默认为false,是否取反的列名
			tab.columnrowshide()//隐藏列方法,隐藏标签的方式;参数说明同上一个一样
		*/
		

		$.extend(table.prototype,{ 
			version: base.version,

			init : function(){ 
				this.head();
				this.foot();
				this.search_box();

				for(var i in base.initfactory){ 
					this[base.initfactory[i]]();
				}
				
				if(!$.isEmptyObject(this.options.defaults.initdata)){ 
					setTimeout((function(e){
						return function(){
							e.insert(e.options.defaults.initdata); 
							e._this.scrollTop(0);
						}
					})(this),100);
				}
				
			}
		})

		return table;
	})
	


	define('events',[
		'base',
		'style'
	],function(base,style){ 
		var $ = base.$;


		$(window).resize(function(){ 
			var tables = base.table;
			for(var i in tables){ 
				tables[i].resizecss();
			}
		})

		base.tableproto('css',function(){ 
			var dom = this.dom();
			this.options.defaults.trheight = dom.center.find('tr:eq(0)').height() || 0;
			this.options.defaults.headheight = dom.top.height();
			this.options.defaults.footheight = dom.botm.height();
			this.options.defaults.scrollx = dom.head.total_width > this._this.width();
		},true)
		base.tableproto('tableid',function(){ 
			var tableid = base.gtid('tab_');
			this._this.attr('tableid',tableid);
			base.table[tableid] = this;
		},true)
		
		base.tableproto('resizecss',function(){ 
			
			var tableheight = $(window).height() - base.getint(this._this.css('margin-top')) - base.getint(this._this.css('margin-bottom')) - 1,
				dom = this.dom();
			if(this._this.attr('height') !== undefined){ 
				$.each(this._this.attr('height').split(','),function(_,v){ 
					tableheight -= $('.'+v).outerHeight(true);
				})
				this._this.height(tableheight);
			}
			this.options.defaults.scrolly = dom.table.find('tr').length 
										* this.options.defaults.trheight 
										+ dom.top.outerHeight(true) 
										+ dom.botm.outerHeight(true) > this._this.height();
			this.options.defaults.scrollx = this.options.defaults.head.total_width > (this._this.width() - (this.options.defaults.scrolly ? 17 : 0));
		},true)



		base.tableproto('dom',function(){ 
			return {
				top : $(this.options.dom_class.top,this._this),
				head : $(this.options.dom_class.head,this._this),
				search : $(this.options.dom_class.search_box,this._this),
				search_img : $(this.options.dom_class.search_img,this._this),
				table : $(this.options.dom_class.table_box,this._this),
				center : $(this.options.dom_class.center,this._this),
				botm : $(this.options.dom_class.botm,this._this)
			};
		});

		function events(){ 

			var dom = this.dom(),
				table = this,
				resizefn,
				on_change = function(e){ 
					var this_iniput = $(this),
						id = this_iniput.parents('tr').attr('id'),
						data = table.getdata(id),
						name = this_iniput.parents('td').attr('name'),
						input_rule = table.options.defaults.input_rule;
					if(table.moveinput(this_iniput,e)){
						if(input_rule){
							if(input_rule === 'all'){
								this_iniput.val((this_iniput.val()+'').replace(/[^0-9\.]+/,''))
							}else if(typeof input_rule == 'object'){ 
								if($.inArray(name,input_rule) != -1){ 
									this_iniput.val((this_iniput.val()+'').replace(/[^0-9\.]+/,''))
								}
							}
						}
						base.bind_fun('keyup',{ 
							input : this_iniput,
							event : e,
							'id' : id,
							'data' : data,
							'name' : name,
							update : function(_data){ 
								_data = _data || {};
								if(typeof data[name] === 'object'){ 
									data[name].val = this_iniput.val();
								}else{ 
									data[name] = this_iniput.val();
								}
								$.extend(data,_data);

								table.update(id,data);
							}
						},table)
					}
				};
			table._this.scroll(function(){ 

				var scrolltop = $(this).scrollTop();
				dom.top.css('top',scrolltop);
				dom.botm.css('margin-bottom',-scrolltop);
				
				base.bind_fun('scroll',scrolltop,table);
				table.scrollinside(scrolltop);
				if(table.options.defaults.splitis){ 
					table.splitscreenfn();
				}
			})

			dom.center.on('click','tr',function(e){ 

				table.change_tr($(this));

				base.bind_fun('click',{ 
					id : $(this).attr('id'),
					tr : $(this),
					event : e
				},table)

			}).on('dblclick','tr',function(e){ 

				base.bind_fun('dblclick',{ 
					id : $(this).attr('id'),
					tr : $(this),
					event : e
				},table)
			}).on('keyup','input.focus_back',on_change).on('change','input.focus_back[type=number]',on_change);

			dom.botm.on('focus','input',function(e){  
				$(this).blur();
			})

		}

		base.tableproto('events',events,true);
		
		base.tableproto('change_tr',function(tr){ 
			if(!this.options.defaults.is_clicktr) return false;

			this.options.defaults.trobj && base.bind_fun('changeafter',this.options.defaults.trobj,this);
			this.options.defaults.trobj = tr;
			var tr_click = this.options.data_class.tr_click;
			tr.addClass(tr_click).siblings().removeClass(tr_click);

		});
		
		base.tableproto('scrollinside',function(top){
			if(this.options.defaults.orderid.length < this.options.defaults.pagesun) return false;
			var isbotm = function(height){ 	
				if(top/(this.tableheight - height) >= 0.95){ 
					return true;
				}
				return false;
			},
			me = this;
			if(isbotm.call(this.options.defaults,this._this.height()) && this.options.defaults.limitstati){
				this.options.defaults.limitstati = false;
				var operate = require('operate');
				var Operate = new operate(this);
				var tr = Operate.new_tr(this.options.defaults.data);
				Operate.ope_table.append(tr);
				base.bind_fun('insert',Operate.returndata,this);
				this.operates();
				if(this.options.defaults.xuhaoidx < this.options.defaults.datalength){ 
					this.options.defaults.limitstati = true;
				}
			}
		})
		base.tableproto('operates',function(){ 
			var dom = this.dom();
			
			this.options.defaults.limitstati = this.options.defaults.datalength > dom.table.find('tr').length;
			this.options.defaults.tableheight = dom.table.get(0).scrollHeight
			
		})

		base.tableproto('daochutable',function(callback){ 
			var data = { 
					head : { 
						text : '',
						width : ''
					},
					data : {},
					foot : ''
				},
				split = this.options.defaults.daochusplit,
				dom = this.dom(),
				me = this,
				names = base.creatarr(base.newobjurl(this.options.defaults.head).names).remove('xuhao');
			;(function(callback){ 
				
				$.each(names,function(i,v){ 
					split = i == 0 ? '' : me.options.defaults.daochusplit;
					callback(v);
					
				});
				
			})(function(name){ 
				
				data.head.text += split + dom.head.find('span[name='+name+']').html();
				data.head.width += split + me.options.defaults.head.widths[name];
				data.foot += split + (function(){ 
					var input = dom.botm.find('span[name='+name+'] input');
					return input.length ? input.val() : '';
				})();

			});

			$.each(this.search(),function(id,_data){ 
				data.data[id] = (function(){ 
					var vals = '';
					$.each(names,function(i,v){ 
						
						split = i == 0 ? '' : me.options.defaults.daochusplit;
						vals += split+(function(){ 

							var _val = base.get_val(_data[v]);
							if($.inArray(v,me.options.defaults.head.checkbox) !== -1){ 
								var qz = _val == 0 ? '未' : '已';
								_val = qz + dom.head.find('span[name='+v+']').html();
							}
							return _val;
						})();
					});
					return vals;
				})();
			});

			typeof callback === 'function' && (callback.call(this,data));
			return data;
		})

		base.tableproto('location',function(trobj){ 

			var dom = this.dom();
			var tr_obj = trobj || this.options.defaults.trobj;
			if(tr_obj === undefined){ 
				throw new Error( '`trobj` is undefined' );
			}else if(tr_obj.length == 0){ 
				throw new Error( '`trobj` is null' );
			}
			if(arguments.length == 1){
				this.change_tr(trobj)
			}
			var scrolltop = tr_obj.offset().top - this._this.offset().top - dom.top.outerHeight(true);
		    var show_num  =  Math.floor((this._this.height() - dom.top.outerHeight(true) - dom.botm.outerHeight(true)) / this.options.defaults.trheight);
		    var weizhi = dom.center.find('tr').length - (tr_obj.index() + 1);
		    var _thistop = this._this.scrollTop() + scrolltop;
		    if(weizhi >= show_num){
		    	this._this.scrollTop(_thistop);
		    }else{ 
		    	this._this.scrollTop(dom.table.outerHeight(true)+100);
		    }
		    return this;
		})

		
		base.tableproto('set_width',function(){ 
			var head = this.options.defaults.head;
			var foot = this.options.defaults.foot;
			var search = this.options.defaults.search;
			//console.log(search)
			var dom = this.dom();
			head.findspan.each(function(i){ 
				if($(this).css('display') == 'none') return true;
				$(this).width(head.widths[head.names[i]]);

			})
			foot.findspan.each(function(i){ 
				if($(this).css('display') == 'none') return true;
				$(this).width(head.widths[head.names[i]]);

			})
			
			if(!$.isEmptyObject(search)){ 
				search.findspan.each(function(i){ 
					if($(this).css('display') == 'none') return true;
					$(this).width(head.widths[head.names[i]]);
					//$(this).children('select').width(head.widths[head.names[i]]+17)
				})
			}
			this.css();
			dom.search.css('width',head.total_width);
			dom.top.css('min-width',head.total_width+2);
			dom.botm.css('min-width',head.total_width+2);
			dom.center.css('width',head.total_width);
			dom.table.css('padding-top',dom.top.outerHeight(true));
			dom.table.css('padding-bottom',dom.botm.outerHeight(true));
			return this;
		},true);

		
		base.tableproto('set_number',function(){ 
			if(!this.options.defaults.isxuhao) return this;
			this.dom().center.find('tr').each(function(i){ 
				$(this).children(':eq(0)').html(i+1);
			})
			return this;
		});

		function stati(table){
			this.parent = table;
			this.foot = table.options.defaults.foot;
			this.dom = table.dom();
			this.returndata = {};
			this.init();
			base.bind_fun('stati',this.returndata,table);
			return table;
		}

		$.extend(stati.prototype,{
			init : function(){
				var data = this.parent.search(),
					hjrows = this.parent.options.defaults.hjrows,
					nth = this.parent.options.defaults.stati_nth,
					not = this.parent.options.defaults.stati_not,
					nth_start = 0,
					nth_stati;
					
				this.foot.stati_data = {};
				if(nth !== ''){ 
					nth_stati = nth == 'odd' ? 1 : 0;
				}

				if(!$.isEmptyObject(data)){
					for(var i in data){ 
						if(nth_stati !== undefined){ 
							if(++nth_start%2 == nth_stati) continue;
						}
						var attr = this.parent.getattr(i);
						if(attr !== undefined){ 
							if(attr.class !== undefined){ 
								if(attr.class.indexOf(not) !== -1){ 
									continue;
								}
							}
						}
						if(!this.parent.options.defaults.ishjrows){
							if($.inArray(i,hjrows) == -1){
								for(var j in data[i]){ 
									this.isdata(j,data[i][j]);
								}
							}
						}else{ 
							if($.inArray(i,hjrows) != -1){
								for(var j in data[i]){ 
									this.isdata(j,data[i][j]);
								}
							}
						}
					}
				}else{ 
					var _this = this;
					this.dom.botm.find('span input').each(function(){ 
						_this.foot.stati_data[$(this).parent().attr('name')] = { 
							total : 0,
							rows  : 0
						};
					})
				}

				var stati_data = this.foot.stati_data,
					stati_text = this.foot.stati_text;
				for(var i in stati_data){ 
					var val = 0;
					
					if(this.foot.stati[i] == 'defaults'){ 
						val = stati_data[i].total
					}else if(this.foot.stati[i] == 'avg'){ 
						val = stati_data[i].total / stati_data[i].rows
					}else if(this.foot.stati[i] == 'rows'){ 
						val = stati_data[i].rows
					}
					if((val+'').indexOf('.') !== -1){ 
						val = val.toFixed(2);
					}
					this.returndata[i] = base.isNaN(val);
					if(i in stati_text){ 
						val = this.settext(stati_text[i],base.isNaN(val));
					}
					this.dom.botm.find('span[name="'+i+'"] input').val(val);
				}
			},
			isdata : function(name,data){ 
				data = base.get_val(data);
				if(name in this.foot.stati){ 
					var total = this.foot.stati_data[name] !== undefined ? this.foot.stati_data[name].total || 0 : 0;
					var rows = this.foot.stati_data[name] !== undefined ? this.foot.stati_data[name].rows || 0 : 0;
					this.foot.stati_data[name] = { 
						total : total+base.isNaN((data+'').replace(/[^0-9.-]/ig,"")),
						rows  : rows+1
					};
				}
			},
			settext : function(text,val){ 
				if(text.indexOf('*') !== -1){ 
					return text.replace('*',val);
				}else{ 
					return val+text;
				}
			}

		});
		base.tableproto('stati',function(){ 
			return new stati(this);
		});
		
		base.tableproto('move',function(){ 
			var table = this,
				set_scolll;
			if(table.options.defaults.trobj === undefined){ 
				throw new Error( '`trobj` is undefined' );
			}
			this.options.defaults.is_move = true;
			base.Enter({ 
		    	is : table.options.defaults.is_move,
		    	key : {
		    		//上
			    	38 : function(){ 
			    		var is_move = table.options.defaults.is_move;
			    		if(is_move){
				    		if(table.options.defaults.trobj.index() == 0) return is_move;
		                	table.change_tr(table.options.defaults.trobj.prev());
		                	set_scolll('top');
				    		return is_move;
			    		}else{ 
			    			return !is_move;
			    		}
			    	},
			    	//下
			    	40 : function(){ 
			    		var is_move = table.options.defaults.is_move;
			    		if(is_move){
			                if(table.options.defaults.trobj.index() < table.dom().center.find('tr').length-1){
			               		table.change_tr(table.options.defaults.trobj.next());
			               	}
			               	set_scolll('down');
				    		return is_move;
			    		}else{ 
			    			return !is_move;
			    		}
			    	}
		    	}
		    })
		    set_scolll = function(scroll){ 
				if(table._this.is(':hidden')){ 
					table.offmove();
				}
				var top_t = table._this.offset().top + table.options.defaults.headheight,
					botm_t = -table.options.defaults.trheight,
					tr_t = table.options.defaults.trobj.offset().top;
				if(table.dom().botm.length != 0){ 
					botm_t += table.dom().botm.offset().top;
				}else{ 
					botm_t += table._this.offset().top
					+ table._this.outerHeight(true)
					- parseInt(table.options.defaults.scrollx ? 17 : 0);
				}


		        if(tr_t < top_t){ 
		        	var cc = top_t-table.options.defaults.trobj.offset().top;

		        	table._this.scrollTop(table._this.scrollTop()-cc);
		        }else if(tr_t >= botm_t){ 
		        	var cc = table.options.defaults.trobj.offset().top-botm_t;
		        	
		        	table._this.scrollTop(table._this.scrollTop()+cc);
		        }
		        base.bind_fun('move',scroll,table);
		    } 
		    return table;
		});
		base.tableproto('offmove',function(){ 
			this.options.defaults.is_move = false;
			return this;
		})

		base.tableproto('moveinput',function(input,event){ 
			var index_y = input.parent().parent().index(),
				index_x = input.parent().index(),
				_y = index_y,
				_x = index_x,
				which = event.which,
				dom = this.dom(),
				table = this,
				returned = true;
    		switch(which){
    			//左
    			case 37:
    				if(input.parent().prev().children().hasClass('focus_back')){ 
    					index_x--;
    				}else{ 
    					var top_td = dom.center.find(' tr:eq('+(index_y-1)+') td:eq('+index_x+')');
    					if(top_td.children().hasClass('focus_back')){ 
    						while(top_td.next().children().hasClass('focus_back')){ 
    							top_td = top_td.next();
    						}
    						index_x = top_td.index();
    						index_y--;
    					}
    				}
    				returned = false;
                break;
                //上
    			case 38:
    				if(index_y == 0) return;
    				var top_td = dom.center.find(' tr:eq('+(index_y-1)+') td:eq('+index_x+')');
    				index_y = top_td.children().hasClass('focus_back') ? index_y-1 : index_y;
    				returned = false;
                break;
                //右
    			case 39:
    				if(input.parent().next().children().hasClass('focus_back')){ 
    					index_x++;
    				}else{ 
    					var top_botm = dom.center.find(' tr:eq('+(index_y+1)+') td:eq('+index_x+')');
    					if(top_botm.children().hasClass('focus_back')){ 
    						while(top_botm.prev().children().hasClass('focus_back')){ 
    							top_botm = top_botm.prev();
    						}
    						index_x = top_botm.index();
    						index_y++;
    					}
    				}
    				returned = false;
                break;
                //下
    			case 40:
    				var top_botm = dom.center.find(' tr:eq('+(index_y+1)+') td:eq('+index_x+')');
    				index_y = top_botm.children().hasClass('focus_back') ? index_y+1 : index_y;
    				returned = false;
                break;
    		}

    		if(_x !== index_x || _y !== index_y){
	    		var _input = dom.center.find(' tr:eq('+index_y+') td:eq('+index_x+') input.focus_back');
	    		
	    		_input.focus();
	    		_input.select();
    		}
    		return returned;
		})
		
		base.tableproto('getdata',function(id,callback){ 
			var returndata;
			callback = typeof callback === 'function' ? callback : id;
			if(arguments.length !== 0 && typeof id !== 'function'){
				if(id == 'all'){ 
					returndata = base.newobjurl(this.options.defaults.data)
				}else{ 
					var id = typeof id == 'object' ? id.attr('id') : id;
					returndata = base.newobjurl(this.options.defaults.data[id]);
				}
			}else{ 
				if(this.options.defaults.trobj == undefined){ 
					if(typeof callback === 'function') callback.call(this,null);
					return null
				}
				var _id = this.options.defaults.trobj.attr('id');
				returndata = base.newobjurl(this.options.defaults.data[_id])
			}
			if(typeof callback === 'function') callback.call(this,returndata);
			return returndata;
		})
		
		base.tableproto('gethidedata',function(id,callback){ 
			var returndata;

			if(id == 'all'){ 
				returndata = base.newobjurl(this.options.defaults.hidedata)
			}else{ 
				returndata = base.newobjurl(this.options.defaults.hidedata[id]);
			}

			callback = typeof callback === 'function' ? callback : id;
			if(typeof callback === 'function') callback.call(this,returndata);
			return returndata;
		})

		base.tableproto('getalldata',function(id,callback){ 
			var returndata;
			var all = $.extend(this.getdata('all'),this.gethidedata('all'));
			if(id == 'all'){ 
				returndata = base.newobjurl(all);
			}else{ 
				returndata = base.newobjurl(all[id]);
			}

			callback = typeof callback === 'function' ? callback : id;
			if(typeof callback === 'function') callback.call(this,returndata);
			return returndata;
		})
		
		base.tableproto('getattr',function(id,callback){ 
			var returndata;
			callback = typeof callback === 'function' ? callback : id;
			if(arguments.length !== 0 && typeof id !== 'function'){
				if(id == 'all'){ 
					returndata = base.newobjurl(this.options.defaults.trattr)
				}else{ 
					var id = typeof id == 'object' ? id.attr('id') : id;
					returndata = base.newobjurl(this.options.defaults.trattr[id]);
				}
			}else{ 
				if(this.options.defaults.trobj == undefined){ 
					if(typeof callback === 'function') callback.call(this,null);
					return null
				}
				var _id = this.options.defaults.trobj.attr('id');
				returndata = base.newobjurl(this.options.defaults.trattr[_id])
			}
			
			if(typeof callback === 'function') callback.call(this,returndata);
			return returndata;
		})
		
		base.tableproto('gethideattr',function(id,callback){ 
			var returndata;
			
			if(id == 'all'){ 
				returndata = base.newobjurl(this.options.defaults.hidetrattr);
			}else{ 
				returndata = base.newobjurl(this.options.defaults.hidetrattr[id]);
			}

			callback = typeof callback === 'function' ? callback : id;
			if(typeof callback === 'function') callback.call(this,returndata);
			return returndata;
		})

		base.tableproto('getallattr',function(id,callback){ 
			var returndata;
			var all = this.gethideattr('all');
			$.each(this.getattr('all'),function(id,v){ 
				all[id] = v;
			})
			if(id == 'all'){ 
				returndata = base.newobjurl(all);
			}else{ 
				returndata = base.newobjurl(all[id]);
			}

			callback = typeof callback === 'function' ? callback : id;
			if(typeof callback === 'function') callback.call(this,returndata);
			return returndata;
		})

		base.tableproto('drag',function(){ 
			var page_x,
				dom = this.dom(),
				table = this,
				headspan = dom.head.find('span'),
				span_down=false, //鼠标是否soan里面按下
				movespan,
				movespanwidth = 0,
				siblingsdom = {};

			headspan.mousemove(function(e){ 
				if(span_down) return;
				if($(this).offset().left + $(this).outerWidth() - e.pageX < 8){
					$(this).css('cursor','col-resize');
					$(this).mousedown(function(e){ 
						span_down = true;
						page_x = e.pageX;
						movespan = $(this);
						movespanwidth = parseInt($(this).attr('width'));

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

						siblingsdom.search = dom.search.find('span[name='+movespan.attr("name")+']');
						siblingsdom.botm = dom.botm.find('span[name='+movespan.attr("name")+']');

					})
				}else{ 
					$(this).css('cursor','').off('mousedown');
				}
			});
			$('body').mouseup(function(e){ 
				if(e.which = 1 && span_down){
					span_down = false;
					table.head();
				}
			})
			$('body').mousemove(function(e){
				if(span_down){ 
					var movewidth = e.pageX - page_x,
						width = movewidth + movespanwidth;
						movespan.width(width).attr('width',width),
						name = movespan.attr("name");
					$.each(siblingsdom,function(_,v){ 
						if(v !== undefined){ 
							v.width(width).attr('width',width);
						}
					})
					//console.log(name)h
					dom.table.find('td[name="'+name+'"]').attr('width',width);
					//dom.search.find('span[name="'+name+'"]').width(width);
					
					dom.search.css('width',table.options.defaults.head.total_width+movewidth);
					dom.center.css('width',table.options.defaults.head.total_width+movewidth);
					dom.top.css('min-width',table.options.defaults.head.total_width+2+movewidth);
					dom.botm.css('min-width',table.options.defaults.head.total_width+2+movewidth);
					
				}
			});
		},true)

		base.tableproto('sort',function(){ 

			if(this.options.defaults.sort.length === 0) return false;

			if(this.options.defaults.operate.rows.length !== 0){ 
				throw new Error( '已有合并行数据不能排序!!!' );
			}
			
			var dom = this.dom(),
				table = this,
				html = "<i class='defa'></i>",
				Sort = this.sortfn();

			$.each(this.options.defaults.sort,function(_,v){ 

				if(dom.head.find('span[name="'+v+'"]').hasClass(table.options.data_class.sort)) return true;

				dom.head.find('span[name="'+v+'"]').addClass(table.options.data_class.sort).append(html).click(function(){ 
					if($(this).css('cursor') == 'col-resize') return false;
					$(this).siblings().children('i').attr('class','defa');
					var state = $(this).children('i').attr('class'),
						name = $(this).attr('name');
					$(this).children('i').attr('class','');
					if(state == 'defa'){
						Sort.sort('desc',name)
						$(this).children('i').addClass('desc');
					}else if(state == 'desc'){
						Sort.sort('asc',name)
						$(this).children('i').addClass('asc');
					}else{
						Sort.sort('desc',name)
						$(this).children('i').addClass('desc');
					}
					table.set_number();
				});
			})
			
		},true)
		
		base.tableproto('sortfn',function(){ 
			var dom = this.dom(),
				me = this;
			return { 
				init : function(order,name){
					var arr = [];
					$.each(me.options.defaults.orderid,function(_,v){ 
						var obj = { 
							id : v,
							sort : (function(){ 
								var val = me.getdata(v);
								return base.isNaN(base.getint(val[name]))
							})()
						}
						arr.push(obj);
					});
					arr.sort(this.getSortFun(order,'sort'));
					return arr;
				},
				getSortFun : function(order,sortBy) {
				    var ordAlpah = (order == 'asc') ? '>' : '<';
				    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
				    return sortFun;
				},
				sort : function(a,b){ 
					var arr = this.init(a,b);
					var neworderid = [];
					for(var i in arr){ 
						neworderid.push(arr[i].id);
					}
					me.options.defaults.orderid = neworderid;
					me.refreshdata();
				}
			}
		})
		
		
		base.tableproto('offsort',function(name){ 
			var dom = this.dom();
			dom.head.find('span[name="'+name+'"]').off('click').removeClass(this.options.data_class.sort).find('i').remove();
		})

		base.tableproto('menu',function(){ 

			if(!this.options.defaults.menu) return false;

			var dom = this.dom(),
				table = this,
				tablemenu = $('.tablemenu'),
				span;

			if(tablemenu.length == 0){ 
				
				var menuhtml = '<div class="tablemenu">';
					menuhtml +='<div>';
					menuhtml +='<p class="showclos">显示列</p>';
					menuhtml +='<p class="rowspan on">合并行</p>';
					menuhtml +='<p class="sortclos">加入排序</p>';
					menuhtml +='</div>';
					menuhtml +='<p class="splitscreen off">分屏冻结</p>';
					menuhtml +='</div>';
				$('body').append(menuhtml);
				tablemenu = $('.tablemenu');
			}


			var splitscreen = { 
				stop : function(){ return false;},
				active : function(){ return true;},

				checkmenu : function(){ 
					if(span.hasClass('rowspan_box')){ 
						tablemenu.find('p.rowspan').addClass('off');
						tablemenu.find('p.sortclos').addClass('off');
					}else{ 
						var name = span.attr('name');


						if(table.options.defaults.sort.length !== 0){ 
							tablemenu.find('p.rowspan').addClass('off');
						}else{ 
							tablemenu.find('p.rowspan').removeClass('off');
							if($.inArray(name,table.options.defaults.operate.rows) != -1){ 
								tablemenu.find('p.rowspan').addClass('on');
							}else{ 
								tablemenu.find('p.rowspan').removeClass('on');
							}
						}

						if(table.options.defaults.operate.rows.length !== 0){ 
							tablemenu.find('p.sortclos').addClass('off');
						}else{ 
							tablemenu.find('p.sortclos').removeClass('off');
							if(span.hasClass('sort')){ 
								tablemenu.find('p.sortclos').addClass('on');
							}else{ 
								tablemenu.find('p.sortclos').removeClass('on');
							}
						}

						if(!table.options.defaults.scrollx){ 
							tablemenu.find('p.splitscreen').addClass('off');
						}else{ 
							tablemenu.find('p.splitscreen').removeClass('off');
							if(table.options.defaults.splitis){ 
								tablemenu.find('p.splitscreen').addClass('on');
							}else{ 
								tablemenu.find('p.splitscreen').removeClass('on');
							}
						}
					}
				}
			}

			dom.head.hover(function(){ 
				document.oncontextmenu=splitscreen.stop;
			},function(){ 
				document.oncontextmenu=splitscreen.active;
			}).mousedown(function(e){ 
				if(e.which == 3){ 

					var column = Column(e.pageX,e.pageY);
					tablemenu.css({'left':e.pageX+1,'top':e.pageY+1});
					tablemenu.show();
					base.new_clearpop(tablemenu,function(){ 
						tablemenu.hide();
						column.hide();
					});

					span = $(e.target).parents('.rowspan_box').length != 0 ? $(e.target).parents('.rowspan_box') : $(e.target);
					splitscreen.checkmenu();

					tablemenu.find('p').off('mouseover').mouseover(function(){ 
						if($(this).hasClass('off')) return false;

						var attr = $(this).attr('class'),
							name = span.attr('name'),
							allarr;
						if(attr.indexOf('showclos') !== -1){ 
							column.show();
							$(this).addClass('hover')
							base.new_clearpop(tablemenu,column,function(){ 
								tablemenu.hide();
								column.hide();
							});

						}else{ 
							column.hide();
							$(this).siblings('.hover').removeClass('hover');
							base.new_clearpop(tablemenu,function(){ 
								tablemenu.hide();
							});
						}
					})
					tablemenu.find('p').off('click').click(function(){ 
						if($(this).hasClass('off')) return false;
						
						var attr = $(this).attr('class'),
							name = span.attr('name'),  
							allarr;

						if(attr.indexOf('showclos') !== -1){ 

						}else
						if(attr.indexOf('rowspan') !== -1){ 
							var arr = table.options.defaults.operate.rows;
							if(attr.indexOf('on') !== -1){ 
								arr = base.removearray(name,arr);
							}else{ 
								allarr = table.options.defaults.head.names;
								arr.push(name);
								var newarr = [];
								for(var i in allarr){ 
									if($.inArray(allarr[i],arr) !== -1){ 
										newarr.push(allarr[i]);
									}
								}
								arr = newarr;
							}

							table.options.defaults.operate.rows = arr;
							table.refreshdata();

						}else
						if(attr.indexOf('sortclos') !== -1){ 
							if(attr.indexOf('on') === -1){ 
								table.options.defaults.sort.push(name);
								table.sort();
							}else{ 
								table.options.defaults.sort = base.removearray(name,table.options.defaults.sort);
								table.offsort(name);
							}
						}else
						if(attr.indexOf('splitscreen') !== -1){ 
							if(attr.indexOf('on') !== -1){ 
								table.removesplitscreen();
							}else{ 
								table.splitscreen(span);
							}
						}

						tablemenu.hide();
					})
				}
			})

			function Column(x,y){ 
				var column = $('.column');
				if(column.length == 0){ 
					var columnhtml = '<div class="column"></div>';
					tablemenu.after(columnhtml);
					column = $('.column');
				}
				column.css({'left':x+120,'top':y+1});
				column.html('');

				var columnclos = table.options.defaults.columnclos,
					dom = table.dom(),
					text,
					classname;
				for(var i in columnclos){ 
					classname = checkcolumn(columnclos[i]);
					text = dom.head.find('[name="'+columnclos[i]+'"]').text();
					column.append('<p '+classname+' name="'+columnclos[i]+'">'+text+'</p>');
				}

				column.find('p').off('click').click(function(){ 
					var name = $(this).attr('name');
					if($(this).hasClass('on')){ 
						table.options.defaults.columnshowclos = base.removearray(name,table.options.defaults.columnshowclos);
						$(this).removeClass('on');
					}else{ 
						table.options.defaults.columnshowclos.push(name);
						$(this).addClass('on');
					}
					table.column(name);
					base.set_cookie(table.options.defaults.columntablename,table.options.defaults.columnshowclos);
					table.head().set_width().refreshdata();
				})

				return column;
			}
			function checkcolumn(name){ 
				if($.inArray(name,table.options.defaults.columnshowclos) !== -1){ 
					return 'class = "on"';
				}
				return '';
			}
			
			this.options.defaults.tablemenu = tablemenu || undefined;
		},true)
		
		base.tableproto('columnjoin',function(param){ 
			var columnclos = param.columnclos || this.options.defaults.columnclos,
				dom = this.dom(),
				param = $.extend({},true,{ 
					height : 290,
					clickback : function(){}
				},param),
				text,
				classname,
				table = this,
				checkcolumn = function(name){ 
					if($.inArray(name,table.options.defaults.columnshowclos) !== -1){ 
						return '<img src="'+table.options.defaults.src+'/images/gouxz.jpg" class="checkbox_img" state="1"/>';
					}
					return '<img src="'+table.options.defaults.src+'/images/noxz.jpg" class="checkbox_img" state="0"/>';
				};

			var column = $('.show_clos');
			if(column.length == 0){ 
				var columnhtml ='<div class="show_clos" style="height:'+param.height+'px;"><div class="scro_div"><ul></ul></div></div>';
				$('body').after(columnhtml);
				column = $('.show_clos');
			}
			column.find('li').remove();
			for(var i in columnclos){ 
				classname = checkcolumn(columnclos[i]);
				text = dom.head.find('[name="'+columnclos[i]+'"]').text();
				column.find('ul').append("<li name='"+columnclos[i]+"' title='"+text+"'>"+classname+text+"</li>");
			}

			column.find('li').off('click').click(function(){ 
				var name = $(this).attr('name');
				if($(this).children('img').attr('state') == '1'){ 
					table.options.defaults.columnshowclos = base.removearray(name,table.options.defaults.columnshowclos);
				}else{ 
					table.options.defaults.columnshowclos.push(name);
				}
				classname = checkcolumn(name);
				$(this).html(classname+$(this).text());
				table.column(name);
				base.set_cookie(table.options.defaults.columntablename,table.options.defaults.columnshowclos);
				table.head().set_width().refreshdata();
				param.clickback.call(table);
			})
			return column;
		})

		
		base.tableproto('splitinit',function(){ 
			if(this.options.defaults.split === '' && !this.options.defaults.splitis) return false;
			var dom = this.dom(),
				table = this,
				span = dom.head.find('span[name="'+this.options.defaults.split+'"]'),
				span = span.parents('.rowspan_box').length != 0 ? span.parents('.rowspan_box') : span;
			setTimeout(function(){
				if(span.length != 0) table.splitscreen(span);
			},10)
		},true)

		base.tableproto('splitscreen',function(span){ 
			var dom = this.dom(),
				idx = span.index()+2,
				me  = this;
			
			var head = dom.head.children(':nth-child('+idx+')');
				head.prevAll().addClass('windowing');

			var tdchayi = 0;
			head.prevAll().each(function(){ 
				if($(this).hasClass('rowspan_box')){ 
					idx += $(this).find('span').length-1;
				}
				if($.inArray($(this).attr('name'),me.options.defaults.columnhideclos) !== -1) tdchayi++;
			})
			
			dom.search.find('span:nth-child('+idx+')').prevAll().addClass('windowing');
			
			var tdidx = idx - tdchayi;
			var td = dom.table.find('tr td:nth-child('+tdidx+')');
			td.prevAll().addClass('windowing').css('left',- 1);
			td.attr('width',this.options.defaults.head.widths[td.attr('name')]-0.5);
			dom.botm.find('span:nth-child('+idx+')').prevAll().addClass('windowing');
			this.options.defaults.split = span.attr('name');
			this.options.defaults.splitis = true;
			this.options.defaults.splitidx = idx;
			this.options.defaults.splitspan = span;
			if(this.options.defaults.menu){
				this.options.defaults.tablemenu.find('p.splitscreen').addClass('on');
			}
			this._this.scrollLeft(0);
			return this;
		})

		base.tableproto('splitscreenfn',function(){ 
			var dom = this.dom();
			this.options.defaults.splitspan.next().prevAll().css('left',this._this.scrollLeft());
			dom.search.find('span:nth-child('+this.options.defaults.splitidx+')').prevAll().css('left',this._this.scrollLeft());
			dom.table.find('tr td:nth-child('+this.options.defaults.splitidx+')').prevAll().css('left',this._this.scrollLeft()-1);
			dom.botm.find('span:nth-child('+this.options.defaults.splitidx+')').prevAll().css('left',this._this.scrollLeft());
		})

		base.tableproto('removesplitscreen',function(){ 
			this.options.defaults.splitis = false;
			this.options.defaults.split = '';
			if(this.options.defaults.menu){
				this.options.defaults.tablemenu.find('p.splitscreen').removeClass('on');
			}
			var dom = this.dom();
			this.options.defaults.splitspan.next().prevAll().css('left',0).removeClass('windowing');
			dom.search.find('span:nth-child('+this.options.defaults.splitidx+')').prevAll().css('left',0).removeClass('windowing');
			dom.table.find('tr td:nth-child('+this.options.defaults.splitidx+')').prevAll().css('left',0).removeClass('windowing');
			var td = dom.table.find('tr td:nth-child('+this.options.defaults.splitidx+')');
			td.attr('width',parseInt(td.attr('width'))+1);
			dom.botm.find('span:nth-child('+this.options.defaults.splitidx+')').prevAll().css('left',0).removeClass('windowing');
			this._this.scrollLeft(0);
		})


		base.tableproto('refreshdata',function(){ 
			this._this.scrollTop(0);
			var operate = require('operate');
			var Operate = new operate(this);
			Operate.resetlimit();
			Operate.ope_table.html(Operate.new_tr());
			this.operates();
			this.stati();
			this.set_number();
			this.splitinit();
			this.columnrowshide();
			return this;
		})

		base.tableproto('column',function(name,isdisplay,callback){ 
			var istoggle = false;
			if(arguments.length < 3){ 
				if(typeof isdisplay === 'function'){ 
					callback = isdisplay;
					isdisplay = undefined;
					istoggle = true;
				}
			}else{ 
				//istoggle = true
			}

			if(arguments.length == 1) istoggle = true;
			var dom = this.dom(),
				doms = { 
					head : dom.head.find('span[name="'+name+'"]') || null,
					search : dom.search.find('span[name="'+name+'"]') || null,
					botm : dom.botm.find('span[name="'+name+'"]') || null,
				},
				columnhideclos = this.options.defaults.columnhideclos,
				isdisplay = isdisplay == undefined ? false : isdisplay;
			if(istoggle){ 
				this.options.defaults.columnprevishide = !doms.head.is(':hidden');
				if(doms.head.is(':hidden')){ 
					toggle(function(i){ 
						doms[i].show();
					})
				}else{ 
					toggle(function(i){ 
						doms[i].hide();
					})
				}

				if($.inArray(name,columnhideclos) == -1){ 
					columnhideclos.push(name);
				}else{ 
					columnhideclos = base.removearray(name,columnhideclos);
				}
			}else{ 
				this.options.defaults.columnprevishide = isdisplay;
				if(!isdisplay){ 
					toggle(function(i){ 
						doms[i].show();
					})
					columnhideclos = base.removearray(name,columnhideclos);
				}else{ 
					toggle(function(i){ 
						doms[i].hide();
					})
					if($.inArray(name,columnhideclos) == -1) columnhideclos.push(name);
				}
			}
			function toggle(factory){ 
				for(var i in doms){ 
					if(doms[i] !== null){ 
						factory(i);
					}
				}
			}

			var rowspan_box = doms.head.parents('.rowspan_box');
			if(rowspan_box.length){ 

				rowspan_box.show();
				var showlen = rowspan_box.find('span:visible').length;
				if($.inArray(name,columnhideclos) !== -1){ 
					var showheadws = 0;

					rowspan_box.find('span:visible').each(function(){ 
						
						showheadws += $(this).width();
						
					})


					if(!showlen) rowspan_box.hide();
					if((rowspan_box.width() - showheadws) !== showlen && showlen == 1){ 
						
						rowspan_box.find('span:visible').attr({ 
							od_width : doms.head.attr('width'),
							width : rowspan_box.width()+10
						});
					}
					
				}else{ 
					if(showlen != 1){ 
						rowspan_box.find('span[od_width]').each(function(){ 
							$(this).attr('width',$(this).attr('od_width'));
							$(this).removeAttr('od_width');
						})
					}
				}
			}
			

			this.options.defaults.columnhideclos = columnhideclos;
			if(typeof callback === 'function') callback.call(this,columnhideclos);
			base.bind_fun('column',columnhideclos,this);
			return this;
		})
		
		base.tableproto('setcolumendata',function(data){ 
			var data = data || this.options.defaults.data,
				columnhideclos = this.options.defaults.columnhideclos;
			if($.isEmptyObject(data)) return data;
			data = base.newobjurl(data);
			for(var i in data){ 
				for(var c in columnhideclos){ 
					delete data[i][columnhideclos[c]];
				}
			}
			return data;
		})

		base.tableproto('columnrows',function(rows,ishide){ 

			rows = typeof rows == 'string' ? [rows] : rows;
			ishide = ishide == undefined ? false : ishide;
			var table = this,
				get_columnclos = function(){
					var cr = [];
					$.each(table.options.defaults.head.names,function(_,v){ 
						if($.inArray(v,rows) == -1){ 
							cr.push(v);
						}
					})
					return cr;
				};

			this.options.defaults.columnclos = ishide ? rows : get_columnclos();

			if(ishide){ 
				rows = get_columnclos();
			}

			$.each(rows,function(_,v){ 
				table.column(v,true);
			})
			
			this.head().set_width().refreshdata();
			
			return this;
		})

		base.tableproto('columnrowshide',function(rows,ishide){ 
			if(this.options.defaults.columnrowshide === undefined && arguments.length == 0) return this;
			if(arguments.length !== 0){
				rows = typeof rows == 'string' ? [rows] : rows;
				ishide = ishide == undefined ? false : ishide;
			}else{ 
				rows = this.options.defaults.columnrowshide;
				ishide = this.options.defaults.columnrowshideis;
			}
			if(rows.length == 0) return this;
			var table = this,
				dom = this.dom(),
				get_columnclos = function(){ 
					var cr = [];
					$.each(table.options.defaults.head.names,function(_,v){ 
						if($.inArray(v,rows) == -1){ 
							cr.push(v);
						}
					})
					return cr;
				};
			if(ishide){ 
				rows = get_columnclos();
			}

			$.each(rows,function(_,v){ 
				dom.head.find('span[name="'+v+'"]').hide();
				dom.search.find('span[name="'+v+'"]').hide();
				dom.table.find('td[name="'+v+'"]').hide();
				dom.botm.find('span[name="'+v+'"]').hide();

			})
			this.head().set_width();
			if(this.options.defaults.columnrowshide){ 
				var _this = this;
				$.each(rows,function(key,value){ 
					_this.options.defaults.columnrowshide.push(value)
				})
			}else{
				this.options.defaults.columnrowshide = rows;
			}
			this.options.defaults.columnrowshideis = ishide;
			return this;
		})

		base.tableproto('initcolumn',function(){ 

			if(!this.options.defaults.columnis) return false;

			var columnclos = this.options.defaults.columnclos,
				tablename = this._this.attr('tablename');
				
			if(columnclos.length == 0){ 
				columnclos =  this.options.defaults.head.names;
			}

			if(tablename == '' || tablename == undefined){ 
				throw new Error('`tablename` is undefined');
			}

			var cookie = base.get_cookie(tablename),
				cookie = cookie == null ? cookie : cookie.split(',');
			if(!cookie){ 
				this.options.defaults.columnshowclos = columnclos;
			}else{ 
				this.options.defaults.columnshowclos = cookie;
				var table = this;
				setTimeout(function(){
					for(var i in columnclos){ 
						if($.inArray(columnclos[i],cookie) == -1){ 
							table.column(columnclos[i],true);
						}
					}
					table.head().set_width().refreshdata();
				},0)
			}
			this.options.defaults.columntablename = tablename;
			this.options.defaults.columnclos = columnclos;
		},true)
		
		base.tableproto('emptydata',function(){ 
			this.options.defaults.data = {};
			this.options.defaults.trattr = {};
			this.options.defaults.hidedata = {};
			this.options.defaults.hidetrattr = {};
			this.options.defaults.trobj = null;
			this.options.defaults.relation = {};
			this.options.defaults.initdata = {};
			this.options.defaults.hjrows = [];
			this.options.defaults.searchselect = {};
			this.options.defaults.orderid = [];
			this.refreshdata();
			base.bind_fun('emptydata',this);
			return this;
		})

		base.tableproto('select',function(param){ 
			if($.isEmptyObject(param || {})){ 
				throw new Error('`param` is undefined');
			}
			$.extend(this.options.defaults.searchselect,param);
			this.refreshdata();
			return this;
		})

		base.tableproto('refresh',function(params){ 
			this.options.defaults = $.extend(true,{},this.options.defaults,params || {});
			this.head();
			this.foot();
			this.search_box();
			
			if(!$.isEmptyObject(this.options.defaults.initdata)){ 
				this.insert(this.options.defaults.initdata);
			}
			this.set_width();
			return this;
		})

		base.tableproto('gettrobj',function(callback){ 
			var trobj = this.options.defaults.trobj;
			typeof callback === 'function' && callback.call(this,trobj);
			return trobj;
		})

		base.tableproto('hxwissb',function(){ 
			var search = this.options.defaults.search;
			//var pinyin = require('pinyin');
			var me = this;
			if($.isEmptyObject(search)) return this;
			if(search.selects.length !== 0){ 
				var data = this.getdata('all'),
					selects = {},
					dom = this.dom();
				$.each(search.selects,function(_,v){ 
					if($.inArray(v,me.options.defaults.hxwissb) !== -1) return true;
					selects[v] = [];
					for(var i in data){ 
						for(var j in data[i]){ 
							var strdata = base.get_val(data[i][j]);
							if(v == j && $.inArray(strdata,selects[v]) == -1){ 
								selects[v].push(strdata);
							}
						}
					}
				})
				for(var s in selects){ 
					var options = '<option selected></option>';
					for(var o in selects[s]){ 
						if($.trim(selects[s][o]) !== '') options+='<option>'+selects[s][o]+'</option>';
					}
					dom.search.find('span[name="'+s+'"] select').html(options).select2({ 
						placeholder: "",
						allowClear : true
					});
				}
			}
			base.bind_fun('hxwissb',this);
			return this;
		})

		base.tableproto('hiderow',function(id,callback){ 

			id = base.isArray(id) ? id : [id];

			for(var i in id){ 
				this.options.defaults.hidedata[id[i]] = this.options.defaults.data[id[i]];
				this.options.defaults.hidetrattr[id[i]] = this.options.defaults.trattr[id[i]];
				delete this.options.defaults.data[id[i]];
				delete this.options.defaults.trattr[id[i]];
			}
			if(typeof callback === 'function') callback.call(this,base.newobjurl(this.options.defaults.hidedata));
			return this;
		})

		base.tableproto('showrow',function(id,callback){ 

			id = base.isArray(id) ? id : [id];
			for(var i in id){ 
				this.options.defaults.data[id[i]] = this.options.defaults.hidedata[id[i]];
				this.options.defaults.trattr[id[i]] = this.options.defaults.hidetrattr[id[i]];
				delete this.options.defaults.hidedata[id[i]];
				delete this.options.defaults.hidetrattr[id[i]];
			}
			if(this.options.defaults.recordorder){ 
				var newdata = {},
					newattr = {},
					me = this;
				$.each(this.options.defaults.orderid,function(_,_id){ 
					if(me.options.defaults.data[_id] !== undefined){
						newdata[_id] = me.options.defaults.data[_id];
						newattr[_id] = me.options.defaults.trattr[_id];
					}
				})
				this.options.defaults.data = base.newobjurl(newdata);
				this.options.defaults.trattr = base.newobjurl(newattr);
			}
			
			if(typeof callback === 'function') callback.call(this,base.newobjurl(this.options.defaults.hidedata));
			return this;
		})

		base.tableproto('orderid',function(){ 
			var orderid = this.options.defaults.orderid;
			var newdata = {},
				newattr = {},
				me = this;
			$.each(orderid,function(_,_id){ 
				if(me.options.defaults.data[_id] !== undefined){
					newdata[_id] = me.options.defaults.data[_id];
					newattr[_id] = me.options.defaults.trattr[_id];
				}
			})
			this.options.defaults.data = base.newobjurl(newdata);
			this.options.defaults.trattr = base.newobjurl(newattr);
			return this;
		})

		base.tableproto('alldata',function(callback){ 
			var data = [];
			var me = this;
			$.each(this.getdata('all'),function(id, val){ 
				var _data = {};
				_data.key = me.getattr(id);
				_data.val = val;
				data.push(_data);
			});
			typeof callback === 'function' && callback.call(this,data);
			return data;
		})

		base.tableproto('setsearchselect',function(select,isTakeback){ 
			typeof isTakeback == 'undefined' && (isTakeback = false);
			if(isTakeback){ 

			}
			//setsearchselect
		})
	})

	define('head',[
		'base'
	],function(base){ 
		var $ = base.$;

		function header(table){ 
			
			this.parent = table;
			var head = table.options.defaults.head; 

			head.names = this.names = [];
			head.widths = this.widths = {};
			this.total_width = 0;
			head.align = this.align = {};
			head.checkbox = this.checkbox = [];
			head.bianhao = this.bianhao = [];
			head.input = this.input = [];
			head.number = this.number = [];
			head.inputtime = this.inputtime = [];
			head.heads = this.heads = {};

			this.is_autowidth = false;
			this.auto_clos = { 
				auto_clostotal : 0
			};
			this.findspan = head.findspan = table.dom().head.find('span[width]');
			this.init();
			head.total_width = this.total_width;
			return table;
		}
		$.extend(header.prototype,{ 
			init : function(){ 
				var head = this,
					spans = head.findspan,
					auto_length = 0;
				spans.each(function(){

					var key = $(this).attr('name') || $(this).index();
					var val = $(this).attr('width') || $(this).data('width');
					head.widths[key] = base.isNaN(val);
					head.heads[key] = '';
					head.names.push(key);

					if($(this).css('display') == 'none') return true;
					head.align[key] = $(this).attr('align') || 'center';
					
					if($(this).attr('checkbox') !== undefined){
						head.checkbox.push(key);
					}
					if($(this).attr('bianhao') !== undefined){
						head.bianhao.push(key);
					}
					if($(this).attr('input') !== undefined){
						head.input.push(key);
					}
					if($(this).attr('number') !== undefined){
						head.number.push(key);
					}
					if($(this).attr('time') !== undefined){
						head.inputtime.push(key);
					}
					//是否有自动适应列
					if((val+'').indexOf('*') !== -1){ 
						head.is_autowidth = true;
						head.auto_clos[key] = parseInt(val.replace('*',''));
						head.auto_clos['auto_clostotal'] += head.auto_clos[key];
						auto_length+=1;
					}else{ 
						head.total_width += parseInt(val)+1; //累加总宽度
					}
				})
				if(head.is_autowidth) head.reset_width(auto_length);
			},
			reset_width : function(auto_length){ 
				var ccc = this.parent.options.defaults.scrolly ? 17 : 0;
				
				var auto_width = this.parent._this.width() - 2 - this.total_width - auto_length - ccc;
				for(var i in this.auto_clos){ 
					this.widths[i] = auto_width*(this.auto_clos[i]/this.auto_clos['auto_clostotal']) - 1;
				}
				this.total_width += auto_width;
			}
		})



		base.tableproto('head',function(){ 
			return new header(this);
		});
		
		return header;
	})
	
	define('search_box',[
		'base'
	],function(base){ 
		var $ = base.$;
		
		function Search_box(table){ 

			this.parent = table;
			var search = table.options.defaults.search; 

			this.dom = table.dom().search;
			if(this.dom.length == 0) return table;
			this.findspan = search.findspan = table.dom().search.children('span');
			this.selects = [];

			this.init();
			search.selects = this.selects;
			
			return table;
		}

		$.extend(Search_box.prototype,{ 
			init : function(){ 
				var _this = this,
					_time;
				this.dom.children().each(function(i){ 
					var name = _this.parent.options.defaults.head.names[$(this).index()]
					$(this).attr('name',name);
					if($(this).children('select').length !== 0){ 
						_this.selects.push(name);
					}
				})

				this.dom.find('input').keyup(function(event){
					
					
					var input = $(this);
					_time = setTimeout(function(){ 
						_this.setsearchselect(input.parent().attr('name'),input.val());
					},400)
				}).keydown(function(event){ 
					event.stopPropagation();
					clearTimeout(_time);
				})

				this.dom.find('.checkbox_img').click(function(event){ 
					var state = Number($(this).attr('state')),
						src = '';
					if(state == 2){ 
						state = 0;
						src = _this.parent.options.defaults.src+'/images/noxz.jpg';
					}else if(state == 0){ 
						state = 1;
						src = _this.parent.options.defaults.src+'/images/gouxz.jpg';
					}else{ 
						state = 2;
						src = _this.parent.options.defaults.src+'/images/allxz.jpg';
					}
					$(this).attr({'src':src,'state':state});
					_this.setsearchselect($(this).parent().attr('name'),state == 2 ? '' : state+'');
				})

				this.dom.find('select').change(function(event){ 
					var val = $(this).find('option:selected').text();
					_this.setsearchselect($(this).parent().attr('name'),val);
				})

			},
			setsearchselect : function(name,val){ 
				if(val == ''){ 
					delete this.parent.options.defaults.searchselect[name];
				}else{
					this.parent.options.defaults.searchselect[name] = val;
				}
				this.parent.refreshdata();
				this.parent._this.scrollTop(0);
				base.bind_fun('search',this.parent);
			}
		})

		base.tableproto('search_box',function(){ 
			return new Search_box(this);
		})

		return Search_box;
	})

	define('foot',[
		'base'
	],function(base){ 
		var $ = base.$,
			stati_attr = ['rows','avg'];

		function footer(table){ 
			this.parent = table;
			var foot = table.options.defaults.foot;
			foot.stati = this.stati = {};
			foot.stati_data = this.stati_data = {};
			foot.stati_text = this.stati_text = {};
			foot.findspan = this.findspan = table.dom().botm.find('span');
			this.init(); 


			return table;
		}
		$.extend(footer.prototype,{ 
			init : function(){ 
				var foot = this;
				
				this.findspan.each(function(){ 
					var name = foot.parent.options.defaults.head.names[$(this).index()];
					$(this).attr('name',name);
					if($(this).children('input').length !== 0){ 
						foot.stati[name] = 'defaults'; //默认统计总数
						for(var i in stati_attr){ 
							if($(this).attr(stati_attr[i]) !== undefined){ 
								foot.stati[name] = stati_attr[i];
								continue;
							}
						}
						if($(this).attr('text')){
							foot.stati_text[name] = $(this).attr('text');
						}
					}
				})
				
			}
		})

		base.tableproto('foot',function(){ 
			return new footer(this);
		});

		return footer;
	})

	define('operate',[
		'base',
	],function(base){ 
		var $ = base.$;
		
		function operate(data,table){ 
			if(arguments.length == 1){ 
				table = data;
				data = null;
			}
			this.h = base.newobjurl(table.options.defaults.head);
			this.f = base.newobjurl(table.options.defaults.foot);
			this.t = table;
			this.dom = table.dom();

			this.data = data || {};//数据
			this.returndata = {}; //返回数据
			this.deps = table.options.defaults.operate; //规则数据

			this.ope_table = this.dom.center.find('tbody').length == 0 ? this.dom.center.find('table') : this.dom.center.find('tbody');
			
			
			if(!$.isEmptyObject(this.data)){ 
				this.set_data();
			}
		};

		$.extend(operate.prototype,{ 
			set_data : function(data,paramid){ 
				var new_data = {},
					relation = this.t.options.defaults.relation || {},
					trattr = this.t.options.defaults.trattr || {},
					od_data = data || this.data,
					id = '',
					relationmark = this.t.options.defaults.relationmark,
					key = {},
					data = {},
					hjrows = this.t.options.defaults.hjrows,
					orderid = [];
				for(var i in od_data){ 

					id = paramid || base.gtid();
					
					if(!$.isEmptyObject(od_data[i].key)){ 
						key = od_data[i].key[relationmark];
						if((key in relation) && this.t.options.defaults.relationclos.length != 0){ 
							id = relation[key];
							trattr[id] = $.extend(true,{},trattr[id],od_data[i].key);
							data = $.isEmptyObject(this.t.options.defaults.data[id]) ? new_data[id] : this.t.options.defaults.data[id];
							new_data[id] = this.extend(data,od_data[i].val);
							this.returndata['relationid'] = this.returndata['relationid'] || [];
							this.returndata['relationid'].push(id);
						}else{ 
							relation[key] = id;
							trattr[id] = od_data[i].key;
							new_data[id] = od_data[i].val;
							orderid.push(id);
						}
						if(od_data[i].key.class == this.t.options.data_class.hj_rows){ 
							hjrows.push(id)
						}
					}else{ 
						new_data[id] = od_data[i];
						orderid.push(id);
					}



					this.returndata['id'] = this.returndata['id'] || [];
					this.returndata['id'].push(id);
				}
				this.t.options.defaults.returndata = $.extend(true,{},this.t.options.defaults.returndata,this.returndata);
				this.t.options.defaults.hjrows = hjrows;
				$.extend(this.t.options.defaults.relation,relation);
				$.extend(this.t.options.defaults.trattr,trattr);
				//new_data = this.t.search(new_data);
				if(this.t.options.defaults.relationclos.length != 0){ 
					new_data = $.extend(this.t.options.defaults.data,new_data);
				}else{ 
					$.extend(this.t.options.defaults.data,new_data);
				}

				if(this.t.options.defaults.insertafter !== undefined){ 
					var arrobj = base.creatarr(this.t.options.defaults.orderid);
					this.t.options.defaults.orderid = arrobj.after(this.t.options.defaults.insertafter,orderid);
					this.t.options.defaults.insertafter = undefined;
					this.t.orderid();
					this.ope_table.html('');
					new_data = this.t.options.defaults.data;
				}else{ 
					this.t.options.defaults.orderid = this.t.options.defaults.orderid.concat(orderid);
				}
				this.data = new_data;
				return new_data;
			},
			extend : function(a,b){ 
				var relationclos = this.t.options.defaults.relationclos;
				for(var i in relationclos){ 
					if(a[relationclos[i]] === '' && b[relationclos[i]] === ''){ 
						a[relationclos[i]] = '';
					}else{
						var aaa = base.isNaN(base.get_val(a[relationclos[i]])) + base.isNaN(base.get_val(b[relationclos[i]]));
						aaa == 0 && (aaa = '')
						if(typeof a[relationclos[i]] == 'object'){
                            a[relationclos[i]].val = aaa;
						}else{
                            a[relationclos[i]] = aaa;
						}
					}
				}
				return a;
			},
			setlimit : function(arg){ 
				if(typeof arg == 'string'){ 
					this.t.options.defaults.limitdata[arg] = this.t.options.defaults.data[arg];
				}else{ 
					for(var i in arg){ 
						this.t.options.defaults.limitdata[arg[i]] = this.t.options.defaults.data[arg[i]];
					}
				}
			},
			limit : function(){ 
				/*
				limit : true,				
				page : 0,					
				pagesun : 100,	
				*/
				var pagesun = this.t.options.defaults.pagesun;
				var limitidx = 0;
				var limitdata = this.t.options.defaults.limitdata;
				var orderid = this.t.options.defaults.orderid;
				var newdata = {};
				var _this = this;
				var returndata = base.newobjurl(this.t.options.defaults.returndata);
				var newreturndata = { 
					id : [],
					relationid : []
				};
				return { 
					get1 : function(data){ 
						$.each(orderid,function(_,i){ 
							if(limitdata[i] == undefined){ 
								if(data[i] !== undefined){
									newdata[i] = data[i];
									limitidx++;
									returndata.id != undefined && newreturndata.id.push(i);
									returndata.relationid != undefined && $.inArray(i,returndata.relationid) != -1 && newreturndata.relationid.push(i);

									if(limitidx > pagesun) return false;
								}
							}
						})
						return newdata;
					},
					get2 : function(){ 
						if($.isEmptyObject(_this.t.options.defaults.ruledata)){ 
							_this.t.options.defaults.ruledata = _this.set_rows();
						}
						var data = _this.t.options.defaults.ruledata;
						
						for(var i in data){ 
							for(var j in data[i].data){
								if(limitdata[data[i].data[j]] == undefined && j == 0){ 
									newdata[i] = data[i];
									limitidx += data[i].length;
								}
								var id = data[i].data[j];
								returndata.id != undefined && newreturndata.id.push(id);
								returndata.relationid != undefined && $.inArray(id,returndata.relationid) != -1 && newreturndata.relationid.push(id);
								if(j == data[i].data.length-1){ 
									delete data[i];
								}
							}
							if(limitidx > pagesun) break;
						}
						return newdata;
					},
					getreturndata : function(){ 
						return newreturndata;
					}
				}
				
			},
			resetlimit : function(){ 
				this.t.options.defaults.limitdata = {};
				this.t.options.defaults.xuhaoidx = 0;
				this.t.options.defaults.ruledata = {};
			},
			set_rows : function(){ 
				var new_data = {},
					od_data = this.t.search(),
					rows = this.deps.rows,
					rowslength = rows.length-1,
					linshi_data = {},
					dir,
					new_dir,
					get_dir;

				(function(limitdata){ 
					for(var i in limitdata){ 
						delete od_data[i];
					}
				})(this.t.options.defaults.limitdata)
				get_dir = function(num,data){ 
					for(var i in data){ 
						if(data[i][num] !== undefined){ 
							dir.push(data[i]);
						}else{ 
							var c = 0;
							while(data[i][rows[c]] == undefined){ 
								c++;
							}
							get_dir(num,data[i][rows[c]]);
						}
					}
				}

				for(var i in rows){ 
					new_data[rows[i]] = new_data[rows[i]] || {};
					for(var j in od_data){ 
						var layer = base.get_val(od_data[j][rows[i]]);
						new_data[rows[i]][layer] = new_data[rows[i]][layer] || [];
						new_data[rows[i]][layer].push(j);
					}
				}
				for(var i in rows){ 
					var noce = new_data[rows[i]];
					if(i == 0){
						for(var j in noce){ 
							linshi_data[j] = {};
							linshi_data[j].length = noce[j].length;
							linshi_data[j].data = noce[j];
							linshi_data[j].id = base.gtid('data_');
							if(rows[1] !== undefined){
								linshi_data[j][rows[1]] = {};
							}else{ 
								linshi_data[j].last = '1';
							}
						}
					}else{ 
						dir = [];
						new_dir = [];
						get_dir(rows[i],linshi_data);
						new_dir = dir;
						for(var j in noce){ 

							for(var l in noce[j]){ 
								for(var d in new_dir){ 
									if($.inArray(noce[j][l],new_dir[d].data) >= 0){ 

										new_dir[d][rows[i]][j] = new_dir[d][rows[i]][j] || {};
										new_dir[d][rows[i]][j].data = new_dir[d][rows[i]][j].data || [];
										new_dir[d][rows[i]][j].data.push(noce[j][l]);
										new_dir[d][rows[i]][j].length = new_dir[d][rows[i]][j].data.length;
										new_dir[d][rows[i]][j].id = new_dir[d][rows[i]][j].id || base.gtid('data_');


										if(parseInt(i) != rowslength){
											new_dir[d][rows[i]][j][rows[parseInt(i)+1]] = {};
										}else{ 
											new_dir[d][rows[i]][j].last = '1';
										}
									}
								}
							}
						}
					}
				}
				return linshi_data;
			},
			get_tdattr : function(name,html){ 
				var attrs = "";
				if(!$.isEmptyObject(this.deps.attr)){
					var attr = this.deps.attr[name];
					for(var i in attr){ 
						attrs += i+'=\''+attr[i]+'\'';
					}
				}
				if(typeof html === 'object'){ 
					var attr = html.key;
					for(var i in attr){ 
						attrs += i+'=\''+attr[i]+'\'';
					}
				}
				return attrs;
			},
			td_text : function(name,html){ 
				var align = this.h.align[name],
					checkbox = this.h.checkbox,
					bianhao = this.h.bianhao,
					input = this.h.input,
					number = this.h.number,
					inputtime = this.h.inputtime,
					td = base.get_val(html),
					isinput = (function(cc){ 
						if(cc.key !== undefined){ 
							return cc.key.isinput != undefined ? true : false;
						}
						return false;
					})(html),
					checktime = function(){ 
						if($.inArray(name,inputtime) !== -1){ 
							return 'onfocus="WdatePicker({isShowClear:true})" readonly';
						}
						return '';
					};
				if(name == 'xuhao'){ 
					return ++this.t.options.defaults.xuhaoidx;
				}
				if($.inArray(name,checkbox) !== -1){ 
					var state = Number(base.getint(td));
					var src = state == 0 ? this.t.options.defaults.src+'/images/noxz.jpg' :  this.t.options.defaults.src+'/images/gouxz.jpg'; 
					td = '<img src="'+src+'" class="checkboximg" state="'+state+'">';
				}else{
					if($.inArray(name,bianhao) !== -1){ 
						td = "<i class='color_red'>"+td.substr(0,2)+"</i>"+td.substr(2,td.length);
					}else if($.inArray(name,input) !== -1 || isinput){
						if(this.t.options.defaults.isnullinput){
							if(td !== ''){
								td = "<input type='text' class='focus_back' "+checktime()+" value='"+(td == '0' ? '' : td)+"' />";
							}
						}else{ 
							td = "<input type='text' class='focus_back' "+checktime()+" value='"+(td == '0' ? '' : td)+"' />";
						}
					}else if($.inArray(name,number) !== -1){
						td = "<input type='number' class='focus_back' value='"+(td == '0' ? '' : td)+"' />";
					}else{
						if(align == 'right'){ 
							td = '<span class="text_r">'+td+'</span>';
						}else if(align == 'left'){ 
							td = '<span class="text_l">'+td+'</span>';
						}
					}
				}
				return td;
			},
			td_rows : function(name,rowsobj){ 

				var tdattr = '';

				if(rowsobj[name] == 'hide'){ 
					tdattr = 'style="display:none;"';
				}else if(rowsobj[name] != undefined){ 
					tdattr = 'rowspan="'+rowsobj[name]+'"';
				}
				return tdattr;
			},
			tr_attr : function(id){ 
				var newtrattr = '',
					trattr = this.t.options.defaults.trattr[id];
				for(var i in trattr){ 
					newtrattr += ' '+i+'=\''+trattr[i]+'\'';
				}
				return newtrattr;
			},
			new_tr : function(data,callback){ 

				base.bind_fun('insertafter',this.t);
				
				var data =  data || this.t.options.defaults.data,
				data = this.t.search(data),
				data = this.t.setcolumendata(data),
				orderid = this.t.options.defaults.orderid,
				tr = '',
				_this = this,
				ruledata = null,
				rowsobj = {},
				rows = null,
				echo_tr,
				eachdata;
				/*
				if(this.t.options.defaults.relationclos.length != 0){ 
					this.ope_table.html('');
				}
				*/
				var limit = this.limit();
				if(this.deps.rows.length === 0){
					data = limit.get1(data);
					if(arguments.length !== 0 && $.isEmptyObject(data)){ 
						data = this.set_data(data);
					}
					if($.isEmptyObject(data)){ 
						this.ope_table.html('');
						//console.log( '`data` is null' );
						return '';
					}
					for(var o in orderid){
						if(data[orderid[o]] !== undefined){
							var i = orderid[o];
							this.setlimit(i);
							tr += '<tr id="'+i+'" '+this.tr_attr(i)+'>';
							$.each(this.h.names,function(_,j){
								if($.inArray(j,_this.t.options.defaults.columnhideclos) == -1){
									tr += '<td width="'+_this.h.widths[j]+'" name="'+j+'" '+_this.get_tdattr(j,data[i][j] == null ? '' : data[i][j])+'>'+_this.td_text(j,data[i][j] == null ? '' : data[i][j])+'</td>';
								}
							})
							tr += '</tr>';
						}
					}
				}else{ 
					//var aaaa = this.set_rows();
					ruledata = limit.get2();
					rows = this.deps.rows;
					//this.ope_table.html('');
					var rowsdata = this.t.setcolumendata();
					echo_tr = function(_data,callback){ 
						var trstr = '';
						_this.setlimit(_data);
						for(var t in _data){
							var trdata = rowsdata[_data[t]];
							trstr += '<tr id="'+_data[t]+'" '+_this.tr_attr(_data[t])+'>';
							$.each(_this.h.names,function(_,j){
								if($.inArray(j,_this.t.options.defaults.columnhideclos) == -1){
									trstr += '<td '+_this.td_rows(j,rowsobj)+' width="'+_this.h.widths[j]+'" name="'+j+'" '+_this.get_tdattr(j,trdata[j] == null ? '' : trdata[j])+'>'+_this.td_text(j,trdata[j] == null ? '' : trdata[j])+'</td>';
									if(_this.td_rows(j,rowsobj) !== ''){ 
										rowsobj[j] = 'hide';
									}
								}
							})
							trstr += '</tr>';
						}
						callback(trstr);
					};

					(function resetdata(num,_data){ 
						var linshidata = base.newobjurl(_data);
						_data = {};
						for(var o in orderid){
							if(!$.isEmptyObject(linshidata)){
								for(var i in linshidata){ 
									rowsobj[num] = linshidata[i].length;
									if($.inArray(orderid[o],linshidata[i].data) !== -1){ 
										_data[i] = linshidata[i];

										if(_data[i].last !== undefined){ 
											echo_tr(_data[i].data,function(str){ 
												tr += str;
											});
										}
										delete linshidata[i];
										var c = 0;
										while(_data[i][rows[c]] == undefined && c < rows.length-1){ 
											c++;
										}
										if(_data[i][rows[c]] != undefined){
											resetdata(rows[c],_data[i][rows[c]]);
										}
										continue;
									}
								}
							}
						}
					})(rows[0],ruledata);

				}
				this.returndata = limit.getreturndata();
				//添加后执行函数
				typeof callback === 'function' && callback(limit.getreturndata());
				return tr;
			}

		})

		
		return operate;
	})
	
	//新增
	define('insert',[
		'base',
		'operate'
	],function(base,operate){ 
		var $ = base.$;

		function insert(data,callback){
			if(arguments.length === 0) throw new Error('参数不能为空 SB!');
			
			data = base.isArray(data) ? data : [data];
			var heads = base.newobjurl(this.options.defaults.head.heads),
				orderid = this.options.defaults.orderid,
				me = this;
			/*
			for(var i in data){ 
				var Data = data[i].val !== undefined ? data[i].val : data[i];
				data[i].val = $.extend(true,{},heads,Data);
			}
			*/
			if(callback !== undefined){
				callback.call(this,{ 
					after : function(id){ 
						if($.inArray(id,orderid) == -1)  throw new Error('id `'+id+'` is null!');
						me.options.defaults.insertafter = id;
					}
				})
			}
			this._this.scrollTop(0);
			var Operate = new operate(data,this);
			Operate.resetlimit();
			Operate.ope_table.html(Operate.new_tr());
			if(!this.options.defaults.trheight){ 
				this.options.defaults.trheight = this.dom().center.find('tr:eq(0)').height();
			}
			base.bind_fun('insert',Operate.returndata,this);
			this.operates();
			this.stati();
			this.set_number();
			this.splitinit();
			this.hxwissb();
			this.columnrowshide();
			
			return this;
		}
		
		base.tableproto('insert',insert);
	})

	//删除
	define('del',[ 
		'base',
		'operate'
	],function(base,operate){ 
		var $ = base.$;

		function del(id){ 

			if(arguments.length == 1){ 
				var id = typeof id == 'object' ? id.attr('id') : id;
			}else{ 
				if(this.options.defaults.trobj === undefined){ 
					throw new Error( '`trobj` is undefined' );
				}
				var id = this.options.defaults.trobj.attr('id');
			}

			var Operate = new operate(this);
			if(this.options.defaults.data[id] === undefined){ 
				throw new Error( '`' + id + '` is undefined' );
			}

			delete this.options.defaults.data[id];
			delete this.options.defaults.trattr[id];
			if(this.options.defaults.relationmark !== ''){
				delete this.options.defaults.relation[$('#'+id).attr(this.options.defaults.relationmark)];
			}

			if(this.options.defaults.operate.rows.length === 0){ 
				$('#'+id).remove();
			}else{ 
				Operate.resetlimit();
				Operate.ope_table.html(Operate.new_tr());
			}

			this.operates();
			this.stati();
			this.set_number();
			this.splitinit();
			this.hxwissb();
			this.columnrowshide();

			base.bind_fun('remove',id,this);
			return this;
		}
		
		base.tableproto('remove',del);
	})

	//修改
	define('update',[ 
		'base',
		'operate'
	],function(base,operate){ 
		var $ = base.$;


		function update(id,deps){ 

			var Operate = new operate(this),
				returndata = {};

			returndata['id'] = returndata['id'] || [];
			if(arguments.length == 1){ 
				var deps = id;
				for(var i in deps){ 
					if(this.options.defaults.data[i] === undefined){ 
						throw new Error('id:`' + i + '` is data undefined');
					}
					if(deps[i].key !== undefined){ 
						if(deps[i].val !== undefined){ 
							$.extend(this.options.defaults.data[i],deps[i].val);
						}
						$.extend(this.options.defaults.trattr[i],deps[i].key);
					}else{ 
						$.extend(this.options.defaults.data[i],deps[i]);
					}
					
					id = i;
					returndata['id'].push(i);
				}
			}else{
				if(this.options.defaults.data[id] === undefined){ 
					throw new Error( '`' + id + '` is undefined' );
				}
				if(deps.key !== undefined){ 
					if(deps.val !== undefined){ 
						$.extend(this.options.defaults.data[id],deps.val);
					}
					$.extend(this.options.defaults.trattr[id],deps.key);
				}else{ 
					$.extend(this.options.defaults.data[id],deps);
				}
				
				returndata['id'].push(id);
			}
			var ids = returndata.id;
			for(var i in ids){ 
				var data = this.options.defaults.data[ids[i]],
					trattr = this.options.defaults.trattr[ids[i]],
					table = this;
				if(data !== undefined){
					if(data !== undefined){ 
						$('#'+ids[i]+' td').each(function(){ 
							if($(this).attr('name') == 'xuhao') return true;
							var val = data[$(this).attr('name')];
							if($(this).children('input').length !== 0){ 
								$(this).children('input').val(base.get_val(val == null ? '' : val));
							}else{ 
								$(this).html(Operate.td_text($(this).attr('name'),val == null ? '' : val));
							}
						})
					}
					if(trattr !== undefined){ 
						for(var a in trattr){ 
							$('#'+ids[i]).attr(a,trattr[a]);
						}
					}
				}
			}
			/*
			Operate.ope_table.html('');
			Operate.ope_table.append(Operate.new_tr(this.options.defaults.data));
			*/
			if($('#'+id).length != 0){
				this.change_tr($('#'+id));
			}
			
			this.operates();
			this.stati();
			this.set_number();
			this.splitinit();
			this.hxwissb();
			//this.columnrowshide();
			

			base.bind_fun('update',returndata,this);
			return this;
		}

		base.tableproto('update',update);
	})

	//查询
	define('search',[ 
		'base'
	],function(base){ 
		var $ = base.$;
		
		function search(_data,searchselect){ 
			var data = _data !== undefined ? _data : base.newobjurl(this.options.defaults.data),
				deps = searchselect !== undefined ? searchselect : this.options.defaults.searchselect,
				newdata = {},
				datalength = this.options.defaults.orderid.length,
				bool,
				ccc;
				//console.log(deps)
			if($.isEmptyObject(deps)){ 
				newdata = data;
			}else{ 
				for(var j in data){ 
					bool = true;
					for(var i in deps){ 
						ccc = base.get_val(data[j][i]);
						ccc = (ccc+'').toUpperCase();
						var depsof = (deps[i]+'').toUpperCase();
						if(ccc.indexOf(depsof) !== -1){ 
							newdata[j] = {};
						}else{ 
							delete newdata[j];
							datalength--;
							bool = false;
							break;
						}
					}
					if(bool) $.extend(newdata[j],data[j]);
				}
			}
			if(arguments.length == 2) return newdata;
			this.options.defaults.datalength = datalength;
			this.options.defaults.searchdata = newdata;
			return newdata;
		}
		base.tableproto('search',search);
	})





	return require('table');
});

