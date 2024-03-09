/* UTILITIES */
const urlBase = `http://gateway.marvel.com/v1/public/`
const ts = `ts=1`
const publicKey = "&apikey=61f276d1838483b47e28b9120ccfc29e"
const hash = "&hash=c56011d7230c43adadab65f4f70e2111"
//?ts=1&apikey=61f276d1838483b47e28b9120ccfc29e&hash=c56011d7230c43adadab65f4f70e2111
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")

let offset = 0

//_________________________________CHARACTERS
const getCharacters = async(name, searched) =>{
    let existName = name? `&nameStartsWith=${name}` :""
    let searchedExist = searched? `&orderBy=${searched}` :""
    //let searchedExist = searched? `&orderBy=${searched}` :""
 const url = `${urlBase}characters?${ts}${publicKey}${hash}${existName}${searchedExist}`
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
    const infoNecesariaComic = `${urlBase}comics/${data[0].id}/characters?offset=${offset}&limit=20&${ts}${publicKey}${hash}`
    const response = await fetch(infoNecesariaComic)
    const data2 = await response.json()
    console.log(data2.data.results)
    const arrCharacters = data2.data.results
    let charactersComic = ""

    for (let arr of arrCharacters){
        console.log(arr)
        charactersComic += `${arr.name}, `
    }


    let comicsCreators = ""
    for(let arr of arrComic){
     comicsCreators += `${arr.name}, `
    }
    
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
        <p class="text-white">${charactersComic}</p>
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

//let infoComic = ""
const getComicDetail = async(comicId) => {
        const url = `${urlBase}comics/${comicId}?${ts}${publicKey}${hash}`
        const response = await fetch(url)
        const data = await response.json()
        renderComic(data.data.results)
        console.log(data.data.results)
        //getCharactersComic(`${data.data.results[0].characters.collectionURI}?${ts}${publicKey}${hash}`)//collectionURI
         return data.data.results
       }
       

// const getCharactersComic = async (info) =>{
//     //const info = await getComicDetail()
//     //const url = `${info}[0].characters.collectionURI?${ts}${publicKey}${hash}`
//      const response = await fetch(info)
//      const data =  await response.json()
//      console.log(data)
//     return data
// }
// getCharactersComic()

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

const renderCharacters = async(name, searched) => {
    const characters = await getCharacters(name, searched)
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
    if (("#select-order").value == "title"){
    $("#change-value").value = "name"
    //("#select-order").value = changeTitle
    console.log(("#select-order").value)
    //renderCharacters($("#input-search").value, $("#select-order").value)
} 
     else if (("#select-order").value == "-title") {
    let changeTitle2 = "-name"
    ("#select-order").value = changeTitle2
    //renderCharacters($("#input-search").value, $("#select-order").value)
    } else {
    //renderComics($("#search-input").value , $("#select-order").value)
    renderComics($("#input-search").value, $("#select-order").value)
    console.log($("#select-order").value)
    //renderCharacters($("#input-search").value, $("#select-order").value)
}
renderCharacters($("#input-search").value, $("#select-order").value)
}
)



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
