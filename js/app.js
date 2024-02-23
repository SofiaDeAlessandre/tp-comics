/* UTILITIES */
const urlBase = `http://gateway.marvel.com/v1/public/`
const ts = `ts=1`
const publicKey = "&apikey=61f276d1838483b47e28b9120ccfc29e"
const hash = "&hash=c56011d7230c43adadab65f4f70e2111"

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")

let offset = 0

//_________________________________CHARACTERS
const getCharacters = async(name) =>{
    let existName = name? `&nameStartsWith=${name}` :""
    //let searchedExist = searched? `&orderBy=${searched}` :""
 const url = `${urlBase}characters?${ts}${publicKey}${hash}${existName}`
 const response = await fetch(url)
 const data = await response.json()
 return(data.data.results);
}
getCharacters()

//_________________________________COMICS PRUEBA DE OFFSET PARA COMICS
const getComics = async(title, searched, offset) =>{
    let existTitle = title? `&titleStartsWith=${title}` :""
    let existOffset = offset? `&offset=${offset}` : ""
    let searchedExist = searched? `&orderBy=${searched}` :""
    //let offsetOffset = offsetOffset? `&offset=${offset}` :""
    const url = `${urlBase}comics?${ts}${publicKey}${hash}${existTitle}${searchedExist}${existOffset}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data.data.results);
    console.log(data.data)
    return data.data.results
   }
getComics()


//_________________________________________________
/* RENDERS */ 
//_______________________________________________RENDER COMICS


const renderComic = async(data) => {
    hideElement("#render-cards")
    showElement("#render-cards-detail")
    const arrComic = data[0].creators.items
    let comicsCreators = ""
    for(let arr of arrComic){
     comicsCreators += `${arr.name}, `
    }
    // const arrCharacters = data[0].characters.items
    // console.log(arrCharacters)
    // let charactersOfComics = ""
    // for (let arr of charactersOfComics){

    // }
    
    $("#render-cards-detail").innerHTML = `
    <div class="flex justify-center gap-4">
        <div>
             <img src="${data[0].thumbnail.path}/portrait_xlarge.${data[0].thumbnail.extension}" alt="">
       </div>
       <div class="flex flex-col gap-6">
           <h3>${data[0].title}</h3>
           <p>Publicado: ${data[0].dates[0].date}</p>
           <p>Guionistas:${comicsCreators}</p>
           <p>Descripción:${data[0].description}</p>
       </div>
   </div>
   <h4>Personajes</h4>
   <h5>Resultados</h5>
    <div class="grid grid-cols-5">
     <div>
        <img src="" alt="">
        <p>${data[0].characters.collectionURI}</p>
     </div>
    </div>`
}


const renderComics = async(title, searched, offset) => {
    const comics = await getComics(title, searched, offset)
    $("#render-cards").innerHTML = ""
    for(let comic of comics){
        $("#render-cards").innerHTML += `
        <div onclick="getComicDetail(${comic.id})" class="flex justify-center flex-col gap-y-2">
         <img class="rounded-md" src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="">
         <p class="font-bold text-white">${comic.title}</p>
        </div>
        `
    }
}
renderComics()

const getComicDetail = async(comicId) => {
        const url = `${urlBase}comics/${comicId}?${ts}${publicKey}${hash}`
        const response = await fetch(url)
        const data = await response.json()
        renderComic(data.data.results)
        return data.data.results
       }

//___________________________________________RENDER CHARACTERS


const renderCharacter = async(data) => {
    //const character = await getCharacters(name)
    hideElement("#render-cards")
    hideElement("#render-cards-detail")
    hideElement("#render-characters")
    showElement("#render-characters-detail")
    
    $("#render-characters-detail").innerHTML = `
    <div class="flex justify-center gap-4">
        <div>
             <img src="${data[0].thumbnail.path}/portrait_xlarge.${data[0].thumbnail.extension}" alt="">
       </div>
       <div class="flex flex-col gap-6">
           <h3>${data[0].name}</h3>
       </div>
   </div>
   <p>COMICS</p>
   <h5>Resultados</h5>
    <div class="grid grid-cols-5">
     <div>
        <img src="" alt="">
        <p>${data[0].comics}</p>
     </div>
    </div>`
  
}

const renderCharacters = async(name) => {
    const characters = await getCharacters(name)
    $("#render-characters").innerHTML = ""
    for(let character of characters){
        $("#render-characters").innerHTML += `
        <div onclick="getCharacterDetail(${character.id})" class="flex justify-center flex-col gap-y-2">
         <img class="rounded-md" src="${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}" alt="">
         <p class="font-bold text-white">${character.name}</p>
        </div>
        `
    }
}
renderCharacters()

const getCharacterDetail = async(characterId) => {
    const url = `${urlBase}characters/${characterId}?${ts}${publicKey}${hash}`
    const response = await fetch(url)
    const data = await response.json()
    renderCharacter(data.data.results)
    return data.data.results
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
        hideElement("#render-cards-detail")
    } else{
        showElement("#render-cards")
        hideElement("#render-characters")
        hideElement("#render-characters-detail")
    }
})
$("#select-order").addEventListener("input", () => {
    //renderComics($("#search-input").value , $("#select-order").value)
    renderComics($("#input-search").value, $("#select-order").value)
    console.log($("#select-order").value)
    //renderCharacters($("#search-input").value), $("#select-order").value
})
$("#next").addEventListener("click", () => {
    offset += 20
    console.log("hola")
    renderComics($("#input-search").value, $("#select-order").value, offset)
     })
// $("#next").onclick = function (e) {
//     offset += 20
//     console.log("hola")
//     renderComics($("#input-search").value, $("#select-order").value, offset)
// }
$("#prev").addEventListener("click", () => {
    offset -= 20
    renderComics($("#input-search").value, $("#select-order").value, offset)
     })
