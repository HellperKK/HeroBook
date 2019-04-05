module Main exposing (..)

import Browser
import Dict
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)


main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias ChoiceModel =
  { action:String
  , next:String
  }

type alias Model = Dict.Dict String ChoiceModel

init : Model
init =
  Dict.fromList
    [ ("First", {action = "parler un peu", next = "Second"})
    , ("Second"  , {action = "parler beaucoup", next = "Third"})
    , ("Third", {action = "parler mal", next = "First"})
    ]



-- UPDATE

type Msg = Choice Int

update : Msg -> Model -> Model
update msg model =
  case msg of
    Choice x ->
      model


-- VIEW
to_buttons item = div [] [button [onClick (Choice item)] [text (String.fromInt item)]]

recover_dico val dico = case (Dict.get val dico) of
  Just x -> x
  Nothing -> {action = "", next = ""}

view : Model -> Html Msg
view model =
  div []
    [ div [] [ text ((recover_dico "First" model )).action ]
    , div [] (List.map to_buttons [1, 2, 3])
    ]
