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
const getCharacters = async() =>{
 const url = `${urlBase}characters?${ts}${publicKey}${hash}`
 const response = await fetch(url)
 const data = await response.json()
 return(data.data.results);
}
getCharacters()

const getComics = async() =>{
    const url = `${urlBase}comics?${ts}${publicKey}${hash}`
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
const renderComics = async() => {
    const comics = await getComics()
    $("#render-cards").innerHTML += ``
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
        <p>${com.characters}</p>
     </div>
    </div>`
    }
}



/* EVENTS */

// $("#input-search").addEventListener("input", () => {
//     renderComics($("#input-search").value)
// })
