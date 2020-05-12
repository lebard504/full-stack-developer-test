<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        "description",
        "name",
        "byMonth",
        "percent"
      ];
}
