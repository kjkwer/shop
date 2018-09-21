<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>测试</title>
        <script src="https://cdn.staticfile.org/jquery/3.1.1/jquery.min.js"></script>

        <link rel="stylesheet" href="{{ asset('css/public.css') }}">
        <!--    拖动div-->
        <link rel="stylesheet" href="{{ asset('css/popup.css') }}">
        <!--    弹窗-->
        <link rel="stylesheet" href="{{ asset('css/minTanChuChuang.css') }}">
        <!--    毛海-->
        <link rel="stylesheet" href="{{ asset('css/style_m.css') }}">

        <script type="text/javascript"  src="{{ asset('js/easydialog.js') }}"></script>

        <script type="text/javascript"  src="{{ asset('js/minTanChuChuang.js') }}"></script>
        <script type="text/javascript">
            var popup_src = "s";
        </script>
        <script type="text/javascript"  src="{{ asset('js/popup.js') }}"></script>
        <link rel="stylesheet" href="{{ asset('css/select2.min.css') }}">
        <script type="text/javascript"  src="{{ asset('js/select2.min.js') }}"></script>

        <!--下拉多选带搜索功能插件-->
        <link rel="stylesheet" href="{{ asset('silviomoretoBootstrapSelect/dist/css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ asset('silviomoretoBootstrapSelect/dist/css/bootstrap-select.css') }}">
        <script type="text/javascript"  src="{{ asset('silviomoretoBootstrapSelect/dist/js/bootstrap.min.js') }}"></script>
        <script type="text/javascript"  src="{{ asset('silviomoretoBootstrapSelect/dist/js/bootstrap-select.js') }}"></script>
        <!--日历插件-->
        <script type="text/javascript" src="{{ asset('my97datepicker/WdatePicker.js') }}"></script>
        <!--    毛海-->
        <script type="text/javascript" src="{{ asset('js/js_m.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/table.js') }}"></script>
        <!--硕正报表-->
        <script type="text/javascript" src="{{ asset('css/binary/dynaload.js') }}"></script>
        <script>
            //supcan加载XML文件
            function OnReady(id) //Treelist抛给页面的事件
            {
                //加装相对当前目录下的XML描述文档，创建Treelist
                AF.func("Build", "{{ asset('index/index.xml') }}");
            }
            $(document).ready(function() {
                $("#btn").click(function() {
                    //“取数”按钮执行的jsAF.func("Load", $("#source").val()); //调用Load函数填充数据
                });
            });
        </script>
    </head>
    <body>
    <div id="top_Dbutton" class="top_Dbutton top_title" style="width:auto;">
        <input class="button" id="guolv" type="button" value="过滤" tj="" style="display: block">
        <input class="button" type="button" value="导出" style="display: none">
        <input class="button showclosbtn" type="button" value="显示列">
        <img src="{{ asset('images/help.png') }}" id="help_img" title="使用帮助">
    </div>
    {{--菜单栏--}}
        <div id="serachdiv" class='serach_div clr' style="width:auto;">
            <table class="serach_table fl" width="460" style='margin-top:3px;'>
                <tr>
                    <td width="95" style="text-align:left;">
                        <select id="dateSearch" style="width:80px;">
                            <option value="0"></option>
                            <option value="today" >显示今天</option>
                            <option value="yesterday">显示昨天</option>
                            <option value="thisweek" selected="selected" >显示本周</option>
                            <option value="lastweek" >显示上周</option>
                            <option value="thismonth">显示本月</option>
                            <option value="lastmonth">显示上月</option>
                            <option value="thisyear">显示今年</option>
                        </select>
                    </td>
                    <td width="164">日期：<input style="width:126px" type="text" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                              onchange="inputTime_hover1($(this));" class="inputTime_hover"
                                              id="inputTime_hover1" value="{{$time1}}"/></td>
                    <td width="140" style="text-align:left;">至 <input style="width:126px" type="text" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                                      onchange="inputTime_hover2($(this));"
                                                                      class="inputTime_hover" id="inputTime_hover2"
                                                                      value="{{$time2}}"/></td>
                    <td><input id="select_btn" class="select_btn" value="OK" type="button"></td>
                </tr>
            </table>
            <div id="dandushaixuan" class='form_1'>
                <input type="text" id="conts" name="sTime" placeholder='输入"货号/条码"进行查询'>
                <input type="button" id="subs" value="" class="btn_submit1" >
                <input type="hidden" name="noneInput">
            </div>
            <div id="dandushaixuan_djh" class='form_1'>
                <input type="text" id="djh_val" name="sTime" placeholder='输入"单据号"进行查询'>
                <input type="button" id="djh_sub" value="" class="btn_submit1" >
                <input type="hidden" name="noneInput">
            </div>

        </div>
    <!--显示列 列表-->
        <div class="show_clos show_clos_dd" style="height:353px;">
            <div class="scro_div">
                <ul class="shoelie" >
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='riqi'>日期</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='djbh'>单据编号</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='diancang'>店仓</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='rktype'>入库类型</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='gys'>供应商</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='pingpai'>品牌</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='niandu'>年度</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='jijie'>季节</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='boduan'>波段</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='xilie'>系列</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='spdl'>商品大类</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='spxl'>商品小类</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='pinming'>品名</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='huohao'>货号</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='yanse'>颜色</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='chima'>尺码</li>
                    <li><img src="{{ asset('images/gouxz.jpg') }}"
                             data-src="{{ asset('images/noxz.jpg') }}"
                             class="checkbox_img" state="1" name='tm'>条码/国际码</li>
                    <li ><img src="{{ asset('images/gouxz.jpg') }}"
                              data-src="{{ asset('images/noxz.jpg') }}"
                              class="checkbox_img" state="1" name='dpj'>吊牌价</li>
                    <li ><img src="{{ asset('images/gouxz.jpg') }}"
                              data-src="{{ asset('images/noxz.jpg') }}"
                              class="checkbox_img" state="1" name='jj'>进价</li>
                    <li ><img src="{{ asset('images/gouxz.jpg') }}"
                              data-src="{{ asset('images/noxz.jpg') }}"
                              class="checkbox_img" state="1" name='beizhu'>备注</li>
                </ul>
            </div>
            <div class="clr show_clos_btn">
                <input type='button' value='确定' class='confirmButton showtdlie'  name="confirm"/>
                <input type='reset'  value='关闭' class="confirmButton quxiaohidlie" />
                <input type='button' value='保存设置' class='confirmButton saveslie' style="margin-top:4px;" />
            </div>
        </div>
        {{--<!--数据显示-->--}}
        <div style="position:relative;width:97%" id="source">
            <script>insertTreeList('AF', 'Hue=LightGray', '400px')</script>
        </div>
        {{----}}
    <script type="text/javascript" src="{{ asset('js/select_dc.js') }}"></script>
    <div class="jzz jzzjz" style="display:none"><span>数据加载中... <img class="rotate" src="{{ asset('images/jzz.png') }}"></span></div>
        <script>
            {{--确认搜索--}}
            $(".select_btn").on("click",select);
            function select(){   //获取数据
//                获取时间数据
                var inputTime = $(".inputTime_hover");
                var tm1 = inputTime.eq(0).val();//获取前时间
                var tm2 = inputTime.eq(1).val();//获取后时间
//        获取货号和单据号
                var hh = $('#dandushaixuan input[name=sTime]').val();/*货号*/
                var djh = $('#dandushaixuan_djh input[name=sTime]').val();/*djh*/
//        获取年代和季节
                var year = $('#year').val()
                var jijie = $('#jijie').val()
                chaxun_new_tj(tm1,tm2,hh,djh,year,jijie)
            }
            function chaxun_new_tj(tm1,tm2,hh,djh,year,jijie){

                var url = 'select';
//                获取显示列
                var lis = $('.show_clos_dd .shoelie img');
                var sets={};
                for(var i=0;i<lis.length;i++){
                    var a1 	= lis.eq(i).attr('name');
                    var a2 	= lis.eq(i).attr('state');
                    sets[a1]	= a2;
                }
                AF.func("SetRedrawAble","false");/*隐藏效果*/
                var jiaqxs = jiaqx(sets);
                $.each(jiaqxs,function(k,i){
                    if(i=='1'){
                        AF.func('SetColProp',k+"\r\n isHide \r\n false");/*显示列*/
                    }else{
                        AF.func('SetColProp',k+"\r\n isHide \r\n true");/*隐藏列*/
                    }
                })
                AF.func("SetRedrawAble","true");/*隐藏效果*/
//                设置发送数据
                var data = {hh:hh,djh:djh,tm1:tm1,tm2:tm2,year:year,jijie:jijie,sets:sets};
                $('.jzzjz').show();
                $.post(url,{data:data},function(res){
                    $('.jzzjz').hide();
//                    console.log()
                    if(res==0){
                        on_mess_sh('没有符合条件的数据!');
                        AF.func("Load",'');
                    }else{
                        AF.func("Load",res+"\r\n LoadUserProp=true");
                    }
                })
            }

            {{--时间框--}}
            function inputTime_hover1(thiss) {
                $("#dateSearch").val('');
            }
            function inputTime_hover2(thiss) {
                $("#dateSearch").val('');
                //第一时间框
                var date1 = $("#inputTime_hover1").val();
                if (!date1) {
                    var newdate = thiss.val().substr(0, 8) + '01';
                    $("#inputTime_hover1").val(newdate);
                }
            }
            $("#dateSearch").off();
            $("#dateSearch").on('change', dateSearch);
            function dateSearch() {
                var dates = $(this);
                date_btn(dates.val());//修改选择框时间
            }
            //修改选择框时间
            function date_btn($val) {
                var url = 'inoutde1';
                $.post(url, {data: $val}, function (res) {
                    var data = eval(res);
                    var inputTime = $(".inputTime_hover");
                    var inputTime1 = inputTime.eq(0).val(data[0]['data1']);//修改前时间
                    var inputTime2 = inputTime.eq(1).val(data[0]['data2']);//修改后时间
                    var sets = $('.show_clos_dd .quxiaohidlie').attr('sets');/*显示设置*/
                    var info = eval('('+sets+')');
                    var tj = $('#guolv').attr('tj');/*过滤条件*/
                })
            }
//            显示列操作
            $('.show_clos_dd').hide()   //默认隐藏
            $('.top_title input').click(function(){   //打开显示列
                if($(this).index() == 0){
                    on_popup('.popup_goods_gl');
                }else if($(this).index() == 1){ /*导出数据*/
                }else{
                    set_pop_wz($('.showclosbtn'),$('.show_clos_dd'),-4); //定位方法
                    $('.show_clos_dd').show(); //显示
                    clear_pop($('.show_clos_dd'),'');
                }
            })
            $('.shoelie li').on('click',function(){   //设置下拉框选中效果
                var status = $(this).find('img').attr('state');
                if(status == 1){
                    $(this).find('img').attr('src','{{ asset('images/noxz.jpg') }}');
                    $(this).find('img').attr('state','0');
                } else if(status == 0){
                    $(this).find('img').attr('src','{{ asset('images/gouxz.jpg') }}');
                    $(this).find('img').attr('state','1');
                }
            })
            $('.show_clos_dd .quxiaohidlie').on('click',function(){    //关闭显示列
                $('.show_clos_dd').hide();
            })
            $('.show_clos_dd .showtdlie').on('click',function(){      //确定显示列
                $('.show_clos_dd').hide(); //bu显示
                select();
//                var lis = $('.show_clos_dd .shoelie img');/*设置项li*/
//                var sets={};/*设置数据*/
//                for(var i=0;i<lis.length;i++){
//                    var a1 	= lis.eq(i).attr('name');
//                    var a2 	= lis.eq(i).attr('state');
//                    sets[a1]	= a2;
//                }
//        console.log(sets);
//                chaxun_new_tj(sets);   //调用函数合并数据
            })
            function jiaqx(_set){    //设置权限
                return _set;
            }
        </script>
    </body>
</html>