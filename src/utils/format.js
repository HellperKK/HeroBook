const makeTitle = (settings) =>
  settings.gameTitle + (settings.author ? ` by ${settings.author}` : '');

const crypter = (str, key) => {
  const chars = str.split('');
  const codes = chars.map((char, index) => {
    return char.charCodeAt(0) + key.charCodeAt(index % key.length);
  });
  return codes.join(',');
};

const format = (game, crypt, settings) =>
  `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>{title}</title>
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
    <p style="display: none;" id="game-data">
        {game}
    </p>
    <script>
      let data
      const crypted = {crypted}
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
        console.log(pageFormat)
        console.log(globalFormat)

        divImage.innerHTML = ""
        if (page.format.image) {
          const img = document.createElement("img")
          img.src = page.format.image
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

      const dataT = document.querySelector("#game-data")

      if (dataT && dataT.innerText) {
        try {
          const text = crypted? decrypter(dataT.innerText, "jeronimo") : dataT.innerText
          console.log(text)
          data = JSON.parse(text)
          dataT.remove()
          format(data.pages.find(p => p.isFirst).id)
        } catch (error) {
          console.log(error)
          alert("error while reading data")
        }
      }
      else {
        alert("No game data found")
      }
    </script>
  </body>
</html>
`
    .replace('{game}', crypt ? crypter(game, 'jeronimo') : game)
    .replace('{crypted}', crypt)
    .replace('{title}', makeTitle(settings));

export default format;
