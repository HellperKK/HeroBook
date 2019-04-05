module Main exposing (..)

import Browser
import Dict
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)
import Json.Decode as D
import Http as H
import File.Select as Select


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
  , load : Cmd Msg
  }

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
  { load = (H.get {url = "./pages.json", expect = H.expectString GotText})
  , pages = []
  , actual = "Main"
  }


-- UPDATE

type Msg = Choice String |GotText (Result H.Error String)

extract_text res = case res of
  Err _ -> "[]"
  Ok x -> x

update : Msg -> Model -> Model
update msg model =
  case msg of
    Choice x ->
      {model| actual = x }
    GotText x -> {model| load = Cmd.none ,pages = x |> extract_text |> (D.decodeString decode_page) |> extract_result }


-- VIEW
to_buttons item = div [] [button [onClick (Choice item.page)] [text item.action]]

find_list f liste = case liste of
  [] -> Nothing
  x :: xs ->
    if f x
    then Just x
    else find_list f xs

maybe_page page = case page of
  Nothing -> {name = "First", text = "First page", next = []}
  Just x -> x

view : Model -> Html Msg
view model =
  let
    actual_page = (find_list (\x -> x.name == model.actual) model.pages) |> maybe_page
  in
    div []
      [ div [] [ text actual_page.text]
      , div [] (List.map to_buttons actual_page.next)
      ]
