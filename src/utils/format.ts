import JSZip from "jszip";
import { saveAs } from "file-saver";
import { lens } from "lens.ts";

import { safeFileName } from "./utils";
import { Game } from "./initialStuff";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const format = (game: Game) => `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>${game.settings.gameTitle ?? "A herobook game"}</title>
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

    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.1.0/marked.min.js"></script>
    <script>
      const state = {$state: {}}

      const safeMarkdown = (md) => DOMPurify.sanitize(marked.parse(md));

      const data = ${JSON.stringify(game)}
      const divStory = document.querySelector(".story")
      const divImage = divStory.querySelector(".story-image")
      const divText = divStory.querySelector(".story-text")
      const divChoices = divStory.querySelector(".story-choices")

      const decrypter = (str, key) => {
        const chars = str.split(",")
        const codes = chars.map((char, index) => {
          return String.fromCharCode(parseInt(char) - key.charCodeAt(index % key.length))
        })
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

        divImage.innerHTML = ""
        if (page.image) {
          const img = document.createElement("img")
          img.src = "assets/images/" + page.image
          divImage.appendChild(img)
        }

        document.body.style.backgroundColor = pageFormat.background || globalFormat.background
        divStory.style.backgroundColor = pageFormat.page || globalFormat.page
        divText.style.color = pageFormat.textColor || globalFormat.textColor

        divText.innerHTML = safeMarkdown(ejs.render(page.text, state))
        divChoices.innerHTML = ""

        for (nex of page.next) {
          let button = document.createElement("button")
          button.innerHTML = safeMarkdown(nex.action)
          button.setAttribute("pageId", nex.pageId)
          button.addEventListener("click", function() {
            format(this.getAttribute("pageId"))
          })
          button.style.color = pageFormat.btnColor || globalFormat.btnColor
          divChoices.appendChild(button)
          divChoices.appendChild(document.createElement("br"))
        }
      }

      format(data.pages.find(p => p.isFirst).id)
    </script>
  </body>
</html>
`;

const compile = async (game: Game, zip: JSZip) => {
  const gameL = lens<Game>();
  const cleanState = gameL.pages.set((pages) =>
    pages.map((page) => ({
      ...page,
      text: page.text,
      next: page.next.map((nex) => ({
        ...nex,
        action: nex.action,
      })),
    }))
  )(game);

  zip.file("data.json", JSON.stringify(cleanState));
  zip.file("index.html", format(game));

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, safeFileName(`${game.settings.gameTitle || "game"}.zip`));
};

export { format, compile };
