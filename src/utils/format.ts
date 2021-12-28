/* eslint-disable no-console */
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { nothing } from './utils';
import { Game } from './initialStuff';

const format = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>A herobook game</title>
    <style>
      body {
        text-align: center;
      }

      .story {
        margin:10%;
      }

      .story-choices button {
        background-color: transparent;
        border: none;
        cursor: pointer;
      }

      .story-choices button::before {
        content: '> ';
      }

      .story-image img {
        max-width: 80%;
      }
    </style>
  </head>
  <body>
    <div class="story">
    <div class="story-image"></div>
      <p class="story-text"></p>
      <div class="story-choices">

      </div>
    </div>
    <script>
      let data
      const divStory = document.querySelector(".story")
      const divImage = divStory.querySelector(".story-image")
      const divText = divStory.querySelector(".story-text")
      const divChoices = divStory.querySelector(".story-choices")

      const decrypter = (str, key) => {
        const chars = str.split(",")
        const codes = chars.map((char, index) => {
          return String.fromCharCode(parseInt(char) - key.charCodeAt(index % key.length))
        })
        console.log(codes)
        return codes.join("")
      }

      const format = function(pageId) {
        let page = data.pages.find(p => p.id == pageId)
        if(!page) {
          alert("no page found !")
          return
        }

        const pageFormat = page.format
        const globalFormat = data.format
        console.log(page.image)
        console.log(pageFormat)
        console.log(globalFormat)

        divImage.innerHTML = ""
        if (page.image) {
          const img = document.createElement("img")
          img.src = "assets/images/" + page.image
          divImage.appendChild(img)
        }

        document.body.style.backgroundColor = pageFormat.background || globalFormat.background
        divStory.style.backgroundColor = pageFormat.page || globalFormat.page
        divText.style.color = pageFormat.textColor || globalFormat.textColor

        divText.innerText = page.text
        divChoices.innerHTML = ""

        for (nex of page.next) {
          let button = document.createElement("button")
          button.innerText = nex.action
          button.setAttribute("pageId", nex.pageId)
          button.addEventListener("click", function() {
            format(this.getAttribute("pageId"))
          })
          button.style.color = pageFormat.btnColor || globalFormat.btnColor
          divChoices.appendChild(button)
          divChoices.appendChild(document.createElement("br"))
        }
      }

      fetch('./data.json')
      .then(data => data.json())
      .then(json => {
        data = json

        if(data.gameTitle) {
          document.title = data.gameTitle + data.author ? ' by ' + data.author : ''
        }

        format(data.pages.find(p => p.isFirst).id)
      })
      .catch((error) => alert(error))
    </script>
  </body>
</html>
`;

const compile = async (state: Game, zip: JSZip) => {
  zip.file('data.json', JSON.stringify(state));
  zip
    .generateAsync({ type: 'blob' })
    .then((blob) => saveAs(blob, `${state.settings.gameTitle || 'game'}.zip`))
    .catch(nothing);
};

export { format, compile };
