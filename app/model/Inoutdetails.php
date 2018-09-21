<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/20 0020
 * Time: 19:38
 */

namespace App\model;
use Illuminate\Database\Eloquent\Model;

class Inoutdetails extends Model
{
    public function ordergoods(){
        return $this->hasMany('App\model\Ordergoods','inoutid','id')->select('inoutid','cgsum','hpid','cid','sizeid');
    }
    public function store(){
        return $this->hasOne('App\model\Store','id','storeid')->select('id','stname');
    }
    public function inouttype(){
        return $this->hasOne('App\model\Inouttype','id','rktypeid')->select('id','rktype');
    }
    public function supplier(){
        return $this->hasOne('App\model\Supplier','id','gysid')->select('id','suname');
    }
}