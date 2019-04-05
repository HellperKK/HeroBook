module Main exposing (..)

import Browser
import Dict
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)


main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias ChoiceModel =
  { action : String
  , next : String
  }

type alias Model =
  { dico : Dict.Dict String ChoiceModel
  , actual : String
  }

init : Model
init =
  {dico = Dict.fromList
    [ ("First", {action = "parler un peu", next = "Second"})
    , ("Second"  , {action = "parler beaucoup", next = "Third"})
    , ("Third", {action = "parler mal", next = "First"})
    ]
  , actual = "First"
  }



-- UPDATE

type Msg = Choice String

update : Msg -> Model -> Model
update msg model =
  case msg of
    Choice x ->
      {model| actual = x }


-- VIEW
to_buttons item = div [] [button [onClick (Choice item.next)] [text item.action]]

recover_dico val dico = case (Dict.get val dico) of
  Just x -> x
  Nothing -> {action = "", next = ""}

view : Model -> Html Msg
view model =
  div []
    [ div [] [ text ((recover_dico model.actual model.dico )).action ]
    , div [] (List.map to_buttons (Dict.values model.dico))
    ]
