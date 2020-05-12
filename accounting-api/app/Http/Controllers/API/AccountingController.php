<?php

namespace App\Http\Controllers\API;

use App\Vehicle;
use App\Record;
use App\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class Payment
{
    public $carplate;
    private $ammount;
    public $total_time;
    public $value;

    public function __construct($carplate, $ammount)
    {
        $this->carplate = $carplate;
        $this->ammount = $ammount;
    }

    public function addTime($time){
        $this->total_time = $this->total_time + $time;
        $this->value = $this->total_time * $this->ammount;
    }
}

class AccountingController extends Controller
{
    public  $successStatus = 200;

    public function getPaymetsByCategory(Request $request, $categoryid){
       $arr = $request->all();
       try {
        $relatedCategory = Category::find($categoryid);

        if (is_null($relatedCategory)) {
            return response()->json(['error'=>"Related category does not exist"], 403);
        }

        $payments = [];
        $items = Vehicle::all();
        
        foreach ($items as $vehicle) {
            $recordsByCategory = [];
            if($vehicle->category->oid === $categoryid) {
                $payment = new Payment($vehicle->carplate, $relatedCategory->percent);

                foreach ($vehicle->records as $record) {
                    array_push($recordsByCategory, $record->oid);
                }

                $records = Record::findMany($recordsByCategory);
                foreach ($records as $record) {
                    if ($record->duration != 0) {
                        $payment->addTime($record->duration);
                    }
                }
                array_push($payments, $payment);
            }
        }

        return response()->json($payments, $this->successStatus);
       }
       catch (Exception $e) {
        return response()->json(['error'=>$e.getMessage()], 403);
       }
    }

    public function GetPaymentByDeparture(Request $request, $vehicleid){
        $arr = $request->all();
        try {
            $vehicle = Vehicle::find($vehicleid);
    
            if (is_null($vehicle)) {
                return response()->json(['error'=>"Related vehicle does not exist"], 403);
            }

            $relatedCategory = Category::find($vehicle->category->oid);
    
            $payment = new Payment($vehicle->carplate, $relatedCategory->percent);
            $lastRecord = count($vehicle->records) > 0 ? $vehicle->records[count($vehicle->records) -1] : null;

            if (is_null($lastRecord)) {
                return response()->json(['error'=>"Does not exist open record."], 403);
            }

            $relatedDeparture = Record::find($lastRecord->oid);

            if (is_null($relatedDeparture->departuretime)) {
                return response()->json(['error'=>"The current registration is not yet closed."], 403);
            }

            $payment->addTime($relatedDeparture->duration);
 
            return response()->json($payment, $this->successStatus);
        }
        catch (Exception $e) {
         return response()->json(['error'=>$e.getMessage()], 403);
        }
    }
}
