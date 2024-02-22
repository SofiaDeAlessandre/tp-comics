/* UTILITIES */
const urlBase = `http://gateway.marvel.com/v1/public/`
const ts = `ts=1`
const publicKey = "&apikey=61f276d1838483b47e28b9120ccfc29e"
const hash = "&hash=c56011d7230c43adadab65f4f70e2111"

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")


//_________________________________
const getCharacters = async(name) =>{
    let existName = name? `&nameStartsWith=${name}` :""
 const url = `${urlBase}characters?${ts}${publicKey}${hash}${existName}`
 const response = await fetch(url)
 const data = await response.json()
 return(data.data.results);
}
getCharacters()

const getCharacterDetail = async(characterId) => {
    const url = `${urlBase}characters/${characterId}?${ts}${publicKey}${hash}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data.data.results)
    return data.data.results
   }

const getComics = async(title, searched) =>{
    let existTitle = title? `&titleStartsWith=${title}` :""
    const url = `${urlBase}comics?${ts}${publicKey}${hash}${existTitle}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data.data.results);
    return data.data.results
   }
getComics()

const getComicDetail = async(comicId) => {
    const url = `${urlBase}comics/${comicId}?${ts}${publicKey}${hash}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data.data.results)
    return data.data.results
   }

/* RENDERS */
const renderComics = async(title, searched) => {
    const comics = await getComics(title, searched)
    $("#render-cards").innerHTML = ""
    for(let comic of comics){
        $("#render-cards").innerHTML += `
        <div onclick="renderComic(getComicDetail(${comic.id}))" class="flex justify-center flex-col gap-y-2">
         <img class="rounded-md" src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="">
         <p class="font-bold text-white">${comic.title}</p>
        </div>
        `
    }
}
renderComics()

const renderComic = async() => {
    const comic = await getComics()
    hideElement("#render-cards")
    showElement("#render-cards-detail")
    for(let com of comic){
    $("#render-cards-detail").innerHTML = `
    <div class="flex justify-center gap-4">
        <div>
             <img src="${com.thumbnail.path}/portrait_xlarge.${com.thumbnail.extension}" alt="">
       </div>
       <div class="flex flex-col gap-6">
           <h3>${com.title}</h3>
           <p>Publicado:</p>
           <p>Guionistas:${com.creators}</p>
           <p>Descripción:${com.description}</p>
       </div>
   </div>
   <h4>Personajes</h4>
   <h5>Resultados</h5>
    <div class="grid grid-cols-5">
     <div>
        <img src="" alt="">
        <p>${com.characters.items}</p>
     </div>
    </div>`
    }
}

const renderCharacters = async(name) => {
    const characters = await getCharacters(name)
    $("#render-characters").innerHTML = ""
    for(let character of characters){
        $("#render-characters").innerHTML += `
        <div onclick="renderCharacter(getCharacterDetail(${character.id}))" class="flex justify-center flex-col gap-y-2">
         <img class="rounded-md" src="${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}" alt="">
         <p class="font-bold text-white">${character.name}</p>
        </div>
        `
    }
}
renderCharacters()

const renderCharacter = async(name) => {
    const character = await getCharacters(name)
    hideElement("#render-cards")
    hideElement("#render-cards-detail")
    hideElement("#render-characters")
    showElement("#render-characters-detail")
    for(let ch of character){
    $("#render-characters-detail").innerHTML = `
    <div class="flex justify-center gap-4">
        <div>
             <img src="${ch.thumbnail.path}/portrait_xlarge.${ch.thumbnail.extension}" alt="">
       </div>
       <div class="flex flex-col gap-6">
           <h3>${ch.name}</h3>
           <p>Publicado:</p>
           <p>Guionistas:${ch.creators}</p>
           <p>Descripción:${ch.description}</p>
       </div>
   </div>
   <h4>Personajes</h4>
   <h5>Resultados</h5>
    <div class="grid grid-cols-5">
     <div>
        <img src="" alt="">
        <p>${ch.comics}</p>
     </div>
    </div>`
    }
}



/* EVENTS */

$("#input-search").addEventListener("input", () => {
    renderComics($("#input-search").value)
    renderCharacters($("#input-search").value)
})
$("#select-type").addEventListener("input", () => {
    if ($("#select-type").value == "characters"){
        showElement("#render-characters")
        hideElement("#render-cards")
    } else{
        showElement("#render-cards")
        hideElement("#render-characters")
    }
})
