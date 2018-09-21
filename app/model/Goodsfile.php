<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/21 0021
 * Time: 09:48
 */

namespace App\model;


use Illuminate\Database\Eloquent\Model;

class Goodsfile extends Model
{
    protected $table = 'goodsfile';
    public function brand(){
        return $this->hasOne('App\model\Brand','id','bid')->select('id','bname');
    }
    public function boduan(){
        return $this->hasOne('App\model\Boduan','id','boduanid')->select('id','bdname');
    }
    public function series(){
        return $this->hasOne('App\model\Series','id','xlid')->select('id','seriesname');
    }
}