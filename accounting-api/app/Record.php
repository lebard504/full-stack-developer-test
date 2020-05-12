<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class record extends Model
{
    protected $fillable = [
        "arrivaltime",
        "departuretime",
        "duration"
      ];

      public function vehicle()
      {
          return $this->embedsOne(Vehicle::class);
      }
}
