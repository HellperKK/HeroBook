module Main exposing (..)

import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)


main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Model = Int

init : Model
init =
  0


-- UPDATE

type Msg = Choice Int

update : Msg -> Model -> Model
update msg model =
  case msg of
    Choice x ->
      model + x


-- VIEW
to_buttons item = div [] [button [onClick (Choice item)] [text (String.fromInt item)]]

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick (Choice 1) ] [ text "Increment" ]
    , div [] [ text (String.fromInt model) ]
    , div [] (List.map to_buttons [1, 2, 3])
    ]
