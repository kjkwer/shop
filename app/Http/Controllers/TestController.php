<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/20 0020
 * Time: 13:17
 */

namespace App\Http\Controllers;

use App\model\Brand;
use App\model\Goodstype;
use App\model\Inoutdetails;
use App\model\Rathercode;
use App\model\Store;
use App\model\Supplier;
use App\model\Supplierbrand;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class TestController extends Controller
{
    public static $leixing;
    public function __construct()
    {
        set_time_limit(0);
        ini_set("memory_limit","-1");
    }

    public function index(){



//        获取本周开始的时间戳
        $time = $this->getQueryDate('thisweek','Y-m-d H:i:s');
        $time1 = $time['begintime'];
        $time2 = $time['endtime'];

        return view('test/index',[
            'time1'=>$time1,
            'time2'=>$time1,
        ]);
    }
    public function select(Request $request){
//        接收参数
        if ($request->data){
            $httpData = $request->data;
            $tm1 = $httpData['tm1'];
            $tm2 = $httpData['tm2'];
            $hh = $httpData['hh'];
            $djh = $httpData['djh'];
            $sets = $httpData['sets'];
        }
        $setInfo = array_keys($sets, 1);
//        查询数据
        $data = Inoutdetails::whereBetween('zdtime',[$tm1,$tm2])->where('djnum','like','%'.$djh.'%')->select('id','zdtime','djnum','dpsum','jjsum','hhorder','storeid','rktypeid','gysid')
            ->with(['ordergoods'=>function($query) use($hh){
                $query->with(['goodsfile'=>function($query) use($hh){
                    $query->where('hh','like','%'.$hh.'%')->with(['brand','boduan','series']);
                },'colorcode','sizecode']);
            },'store','inouttype','supplier'])
            ->get();
        $arrData = $data->toArray();
//        echo json_encode(array($arrData));exit;
//        查询国际码
        $hpid = [];
        $colorid = [];
        $cmid = [];
        $ordergoods = array_column($arrData,'ordergoods');
        foreach ($ordergoods as $k=>$v){
            foreach ($v as $k1=>$v1){
                $hpid[] = $v1['hpid'];
                $colorid[] = $v1['cid'];
                $cmid[] = $v1['sizeid'];
            }
        }

        $hpid = array_unique($colorid);
        $colorid = array_unique($cmid);
        $cmid = array_unique($hpid);

        $rather = Rathercode::whereIn('hpdaid',$hpid)->select(DB::raw('CONCAT_WS("_",hpdaid,colorid,cmid) as sku,tm1,tm2,gbcode'))->get();

//        设置国际码

        foreach ($arrData as $k=>$v){
            if ($v['ordergoods']){
                foreach ($v['ordergoods'] as $k1=>$v2){
                    $sku = $v2['hpid'].'_'.$v2['cid'].'_'.$v2['sizeid'];
                    if(isset($rather[$sku])){
                        if($rather[$sku]['gbcode']!=''&&$rather[$sku]['gbcode']!=null){
                            $tm = $rather[$sku]['gbcode'];
                        }else{
                            $tm = $rather[$sku]['tm1']!=null? $rather[$sku]['tm1']: '';
                        }
                    }else{
                        $tm = '';
                    }
//                    设置表格数据
                    $riqi = $v['zdtime']; //日期
                    $djbh = $v['djnum'];  //单据编号
                    $diancang = $v['store']['stname']; //店仓
                    $rktype = $v['inouttype']['rktype'];   //入库类型
                    $gys = $v['supplier']['suname'];   //供应商
                    $pingpai = $v2['goodsfile']['brand']['bname'];  //品牌
                    $niandu = $v2['goodsfile']['year'];  //年度
                    $jijie = $v2['goodsfile']['season'];  //季节
                    $boduan = $v2['goodsfile']['boduan']['bdname'];  //波段
                    $xilie = $v2['goodsfile']['series']['seriesname'];  //系列
                    $pinming = $v2['goodsfile']['pinming'];  //品名
                    $huohao = $v2['goodsfile']['hh'];  //货号
                    $yanse = $v2['colorcode']['codename'];  //颜色
                    $chima = $v2['sizecode']['sizecode'];   //尺码
                    $dpj = $v2['goodsfile']['diaopaijia'];  //吊牌价
                    $jj = $v2['goodsfile']['bzprice'];  //进价
                    $shuliang = $v2['cgsum'];  //数量
                    $dpjje = $v2['goodsfile']['diaopaijia']*$v2['cgsum'];  //总吊牌价
                    $jjje = $v2['goodsfile']['bzprice']*$v2['cgsum'];   //总进价
                    $beizhu = $v['hhorder'];   //备注
                    $spdl = $v2['goodsfile']['dlid'];    //大类
                    $spxl = $v2['goodsfile']['xiaoleiid'];  //小类
//                    验证显示列
                    $key		= '';/*验证下标*/
                    $charr		= array();
//                    设置显示列
                    foreach ($setInfo as $k1=>$v1){
                        $key .= ${$v1}.'_';
                    }
                    if (isset($infos[$key])){
                        $infos[$key]['shuliang']+=$shuliang;
                        $infos[$key]['dpjje']+=$dpjje;
                        $infos[$key]['jjje']+=$jjje;
                        $infos[$key]['dpjje'] = round($infos[$key]['dpjje'],2).'';
                        $infos[$key]['jjje'] = round($infos[$key]['jjje'],2).'';
                    }else{
                        $charr['riqi']=$riqi;
                        $charr['djbh']=$djbh;
                        $charr['diancang']=$diancang;
                        $charr['rktype']=$rktype;
                        $charr['gys']=$gys;
                        $charr['pingpai']=$pingpai;
                        $charr['niandu']=$niandu;
                        $charr['jijie']=$jijie;
                        $charr['boduan']=$boduan;
                        $charr['xilie']=$xilie;
                        $charr['pinming']=$pinming;
                        $charr['huohao']=$huohao;
                        $charr['yanse']=$yanse;
                        $charr['chima']=$chima;
                        $charr['spdl']=$spdl;
                        $charr['spxl']=$spxl;
                        $charr['dpj']=$dpj;
                        $charr['jj']=$jj;
                        $charr['beizhu']=$beizhu;
                        $charr['tm']=$tm;
                        $charr['shuliang']=$shuliang;
                        $charr['dpjje']=round($dpjje,2).'';
                        $charr['jjje']=round($jjje,2).'';
                        $infos[$key]=$charr;
                    }
                }

            }
        }

        //      XML数组
        $str		= '<?xml version="1.0" encoding="utf-8"?><DataRoot>';
        foreach ($infos as $k => $v){
            $str 	.=	'<Record>';
            foreach($v as $kk => $vv) {
                //
                if ($kk == 'riqi') {
                    $str 	.=	'<'.$kk.'>'.$vv.'</'.$kk.'>';
                } else {
                    $str 	.=	'<'.$kk.'>'.$vv.'</'.$kk.'>';
                }

            }
            $str 	.=	'</Record>';
        }
        $str 		.= '</DataRoot>';
        echo $str;
//        echo json_encode(array($arrData));
    }
    public function dayin($data){
        echo '<pre>';
        var_dump($data);
        echo '</pre>';
    }
    //时间
    public function getQueryDate($type='today',$format='timestamp')
    {
        switch ($type){
            case 'today':
                $begin=mktime(0, 0 , 0,date("m"),date("d"),date("Y"));
                $end=mktime(23, 59 , 59,date("m"),date("d"),date("Y"));
                break;
            case 'yesterday':
                $begin=mktime(0, 0 , 0,date("m"),date("d")-1,date("Y"));
                $end=mktime(23, 59 , 59,date("m"),date("d")-1,date("Y"));
                break;
            case 'thisweek':
//            $begin=mktime(0, 0 , 0,date("m"),date("d")-date("w")+1,date("Y"));
//            $end=mktime(23,59,59,date("m"),date("d")-date("w")+7,date("Y"));
                $w=date('w');
                $begin = strtotime(date('Y-m-d')."-".($w ? $w - 1 : 6).' days');
                $tmp=date('Y-m-d 23:59:59',$begin);
                $end = strtotime("{$tmp}+6 days");
                break;
            case 'lastweek':
//            $begin=mktime(0, 0 , 0,date("m"),date("d")-date("w")+1-7,date("Y"));
//            $end=mktime(23,59,59,date("m"),date("d")-date("w")+7-7,date("Y"));
                $w = date('w');
                $begin = strtotime(date('Y-m-d')."-".( ( $w ? $w - 1 : 6 ) + 7 ).' days');
                $tmp=date('Y-m-d 23:59:59',$begin);
                $end = strtotime("{$tmp}+6 days");

                break;
            case 'thismonth':
                $begin=mktime(0, 0 , 0,date("m"),1,date("Y"));
                $end=mktime(23,59,59,date("m"),date("t"),date("Y"));
                break;
            case 'lastmonth':
                $begin=mktime(0, 0 , 0,date("m")-1,1,date("Y"));
                $end=mktime(23,59,59,date("m") ,0,date("Y"));
                break;
            case 'thisseason':
                $season = ceil((date('n'))/3);//当月是第几季度
                $begin= mktime(0, 0, 0,$season*3-3+1,1,date('Y'));
                $end=mktime(23,59,59,$season*3,date('t',mktime(0, 0 , 0,$season*3,1,date("Y"))),date('Y'));
                break;
            case 'lastseason':
                $season = ceil((date('n'))/3)-1;//上季度是第几季度
                $begin=mktime(0, 0, 0,$season*3-3+1,1,date('Y'));
                $end=mktime(23,59,59,$season*3,date('t',mktime(0, 0 , 0,$season*3,1,date("Y"))),date('Y'));
                break;
            case 'thisyear':
                $begin=mktime(0, 0 , 0, 1 ,1,date("Y"));
                $end=mktime(23,59,59,12 ,date("t",mktime(0, 0 , 0,12,1,date("Y"))),date("Y"));
                break;
            case 'lastyear':
                $begin=mktime(0, 0 , 0, 1 ,1,date("Y")-1);
                $end=mktime(23,59,59,12 ,date("t",mktime(0, 0 , 0,12,1,date("Y"))),date("Y")-1);
                break;
        }
        if($format !='timestamp'){
            $begin=date($format,$begin);
            $end=date($format,$end);
        }
        return array('begintime'=>$begin,'endtime'=>$end);
    }
    //根据下拉框返回修改选择框日期
    public function inoutde1()
    {
        $arr = array();
        $dateSearch = isset($_POST['data']) ? $_POST['data'] : '0';
        if ($dateSearch != '0') {
            $times 		= $this->getQueryDate($dateSearch,'Y-m-d H:i:s');
            $arr['data1'] = $times['begintime'];
            $arr['data2'] = $times['endtime'];
        } else {
            $arr['data1'] = '';
            $arr['data2'] = '';
        }
        echo json_encode(array($arr));/*返回时间*/
    }
}