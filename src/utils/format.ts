import JSZip from "jszip";
import { saveAs } from "file-saver";
import { lens } from "lens.ts";
import { invoke } from "@tauri-apps/api/tauri";

import { safeFileName } from "./utils";
import { Game } from "./initialStuff";
import { AssetGroup } from "../store/gameSlice";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const format = (game: Game) => `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>${game.settings.gameTitle ?? "A herobook game"}</title>
    <style>
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
    <script src="https://github.com/mde/ejs/releases/download/v3.1.9/ejs.js"></script>
    <script>
      const state = {$state: {}}

      const safeMarkdown = (md) => DOMPurify.sanitize(marked.parse(md));
      const evalCondition = ($state, condition) => {
        return eval(condition);
      };

      const evalScript = ($state, script) => {
        eval(script);
      };

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

        evalScript(state.$state, page.script ?? "")
        let body = safeMarkdown(page.text);

        try {
          body = ejs.render(page.text, state)
        } catch (error) { }

        divText.innerHTML = safeMarkdown(body)
        divChoices.innerHTML = ""

        for (nex of page.next) {
          if (nex.condition !== undefined && nex.condition !== "" && !evalCondition(state.$state, nex.condition)) {
            continue;
          }

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

const compile = async (game: Game, assets: AssetGroup, zip: JSZip) => {
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

  const images = assets.images.map(image => image.name)

  zip.file("data.json", JSON.stringify(cleanState));
  zip.file("assets/images/data.json", JSON.stringify(images));
  // zip.file("index.html", format(game));
  zip.folder("saves");

  try {
    const binary = await zip.generateAsync({ type: "base64" });
    await invoke("save", {
      content: binary,
      fileType: "compile",
      openModal: true,
    });
    return;
  } catch (e) {
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, safeFileName(`${game.settings.gameTitle || "game"}.zip`));
  }
};

export { format, compile };
