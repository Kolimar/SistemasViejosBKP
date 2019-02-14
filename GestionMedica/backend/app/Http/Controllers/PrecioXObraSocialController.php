<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\ObraSocial;
use App\Prestacion;
use App\PrecioXObraSocial;

class PrecioXObraSocialController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

      try {

          \DB::beginTransaction();

          JWTAuth::parseToken();
          $user = JWTAuth::parseToken()->authenticate();

          $currency= str_replace(".", "", $request->precio);

          $verificar= PrecioXObraSocial::where('id_prestacion','=',$request->id_prestacion)->where('id_obra_social','=',$request->id_obra_social)->count();

          if ($verificar >= 1) {

            return response()->json("Ya existe un precio para esta prestación", 409);

          }else{

            $precio= new PrecioXObraSocial($request->all());
            $precio->precio= $currency;
            $precio->created_at= Carbon::now('America/Argentina/Buenos_Aires');
            $precio->created_by= $user->id;
            $precio->save();

            \DB::commit();
            return response()->json('Registro ok', 201);

          }


      }catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
      }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $lista= ObraSocial::find($id)->prestaciones;
        return response()->json($lista, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        try {

          if ($request->precio) {

            $currency= str_replace(".", "", $request->precio);

            $precio= PrecioXObraSocial::find($id);
            $precio->precio= $currency;
            $precio->save();

            return response()->json("ok", 200);

          }else{
            return response()->json("La prestación debe tener un precio", 409);
          }

        } catch (Exception $e) {
          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

      try {
        \DB::beginTransaction();

        $precioObraSocial= PrecioXObraSocial::find($id);
        $precioObraSocial->delete();

        \DB::commit();
        return response()->json('Ok', 200);

      } catch (Exception $e) {

          \DB::rollBack();
          Log::critical('No se pudo completal la acción: ' .$e);
          return response()->json('Algo salió mal, intente más tarde', 500);

      }

    }
}