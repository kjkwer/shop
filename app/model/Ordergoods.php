<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/20 0020
 * Time: 19:40
 */

namespace App\model;


use Illuminate\Database\Eloquent\Model;

class Ordergoods extends Model
{
    public function goodsfile(){
        return $this->hasOne('App\model\goodsfile','id','hpid')->select('id','year','season','pinming','hh','diaopaijia','bzprice','dlid','xiaoleiid','bid','boduanid','xlid');
    }
    public function colorcode(){
        return $this->hasOne('App\model\Colorcode','id','cid')->select('id','codename','colorcode');
    }
    public function sizecode(){
        return $this->hasOne('App\model\sizecode','id','sizeid')->select('id','sizecode');
    }
}