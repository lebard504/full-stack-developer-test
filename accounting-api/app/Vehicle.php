<?php
declare(strict_types=1);
namespace App;


use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Jenssegers\Mongodb\Eloquent\HybridRelations;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Vehicle extends Eloquent
{
    use HybridRelations;
    
    protected $connection = 'mongodb';
    protected $collection = 'vehicles';
    protected static $unguarded = true;

    protected $fillable = [
        "category"
      ];

    protected $casts = [
        'category' => 'string',
    ];

    public function records()
    {
        return $this->embedsMany(Record::class);
    }

    public function category()
    {
        return $this->embedsOne(Category::class);
    }

}
