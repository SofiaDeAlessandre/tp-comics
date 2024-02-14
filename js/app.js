/* UTILITIES */
const urlBase = `http://gateway.marvel.com/v1/public/`
const ts = `ts=1`
const publicKey = "&apikey=61f276d1838483b47e28b9120ccfc29e"
const hash = "&hash=c56011d7230c43adadab65f4f70e2111"

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
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

/* RENDERS */
const renderComics = async() => {
    const comics = await getComics()
    $("#render-cards").innerHTML += ``
    for(let comic of comics){
        $("#render-cards").innerHTML += `
        <div class="bg-black rounded-lg flex justify-center flex-col gap-y-2">
         <img src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="">
         <p class="font-bold text-white">${comic.title}</p>
        </div>
        `
    }
}
renderComics()

