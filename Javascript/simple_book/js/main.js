let data
const div_story = document.querySelector(".story")
const div_text = div_story.querySelector(".story-text")
const div_choices = div_story.querySelector(".story-choices")

const format = function(pageName) {
  let page = data.find(p => p.name === pageName)
  if(!page) {
    alert("no page found !")
    return
  }

  div_text.innerText = page.text
  div_choices.innerHTML = ""

  for (nex of page.next) {
    let button = document.createElement("button")
    button.innerText = nex.action
    button.setAttribute("page", nex.page)
    button.addEventListener("click", function() {
      format(this.getAttribute("page"))
    })
    div_choices.appendChild(button)
    div_choices.appendChild(document.createElement("br"))
  }
}

const xhr = new XMLHttpRequest()
xhr.open("GET", "data/pages.json", true)
xhr.responseType = 'json'
xhr.onload = function() {
  var status = xhr.status
  if (status === 200) {
    data = this.response
    format("main")
  } else {
    alert("no page found !")
  }
};
xhr.send();
