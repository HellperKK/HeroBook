module Main exposing (..)

import Browser
import Dict
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as D
import Http as H
import File exposing (File)
import File.Select as Select
import Task


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

filesDecoder : D.Decoder (List File)
filesDecoder =
  D.at ["target","files"] (D.list File.decoder)

decode_page : D.Decoder (List PageModel)
decode_page =
    D.list
      (D.map3 PageModel
          (D.field "name" D.string)
          (D.field "text" D.string)
          (D.field "next"
              (D.list
                  (D.map2 ChoiceModel
                      (D.field "action" D.string)
                      (D.field "page" D.string)
                  )
              )
          )
      )

extract_result : Result D.Error (List PageModel) -> (List PageModel)
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

type Msg = Choice String | Charge (List File) | Lis String

extract_text res = case res of
  Err _ -> ""
  Ok x -> x



update : Msg -> Model -> Model
update msg model =
  case msg of
    Choice x ->
      {model| actual = x }
    Lis x -> {model| pages = x
        |> (D.decodeString decode_page)
        |> extract_result
      }
    Charge x ->
      {model| request = x
        |> List.head
        |> maybe_read
        |> (maybe_take Cmd.none)
      }


-- VIEW
to_buttons item = div [] [button [onClick (Choice item.page)] [text item.action]]

find_list f liste = case liste of
  [] -> Nothing
  x :: xs ->
    if f x
    then Just x
    else find_list f xs

maybe_take defaut page = case page of
  Nothing -> defaut
  Just x -> x

maybe_read file = case file of
  Nothing -> Nothing
  Just x -> Just (Task.perform Lis (File.toString x))

view : Model -> Html Msg
view model =
  let
    actual_page = (find_list (\x -> x.name == model.actual) model.pages) |>
      (maybe_take {name = "First", text = "First page", next = []})
  in
    div []
      [ input
          [ type_ "file"
          , multiple False
          , on "change" (D.map Charge filesDecoder)
          ] []
      , div [] [text actual_page.text]
      , div [] (List.map to_buttons actual_page.next)
      ]
