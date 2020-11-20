module Main exposing (..)

import Browser
import Dict
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode
import Http
import File exposing (File)
import File.Select as Select
import Task
import Maybe


main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias ChoiceModel =
  { action : String
  , page : String
  }

type alias PageModel =
  { name : String
  , text : String
  , next : List ChoiceModel
  }

type alias Model =
  { pages : List PageModel
  , actual : String
  , request : Cmd Msg
  }

filesDecoder : Decode.Decoder (List File)
filesDecoder =
  Decode.at ["target","files"] (Decode.list File.decoder)

decode_page : Decode.Decoder (List PageModel)
decode_page =
    Decode.list
      (Decode.map3 PageModel
          (Decode.field "name" Decode.string)
          (Decode.field "text" Decode.string)
          (Decode.field "next"
              (Decode.list
                  (Decode.map2 ChoiceModel
                      (Decode.field "action" Decode.string)
                      (Decode.field "page" Decode.string)
                  )
              )
          )
      )

extract_result : Result Decode.Error (List PageModel) -> (List PageModel)
extract_result res = case res of
  Err _ -> [{name = "Main", text = "Couldn't load a file so replacer with an empty one", next = []}]
  Ok x -> x

init : Model
init =
  { pages = []
  , actual = "Main"
  , request = Cmd.none
  }


-- UPDATE

type Msg 
  = Choice String
  | Open File
  | Read String

extract_text res = case res of
  Err _ -> ""
  Ok x -> x



update : Msg -> Model -> Model
update msg model =
  case msg of
    Choice page ->
      {model| actual = page }
    Open file ->
      {model| request = file
        |> File.toString
        |> Task.perform Read
      }
    Read content -> {model| pages = content
        |> (Decode.decodeString decode_page)
        |> extract_result
      }


-- VIEW
to_buttons item = div [] [button [onClick (Choice item.page)] [text item.action]]

find_list f liste = case liste of
  [] -> Nothing
  x :: xs ->
    if f x
    then Just x
    else find_list f xs

view : Model -> Html Msg
view model =
  let
    actual_page = (find_list (\x -> x.name == model.actual) model.pages)
       |> (Maybe.withDefault {name = "First", text = "First page", next = []})
  in
    div []
      [ input
          [ type_ "file"
          , multiple False
          , on "change" (Select.file ["application/json"] Open)
          ] []
      , div [] [text actual_page.text]
      , div [] (List.map to_buttons actual_page.next)
      ]
