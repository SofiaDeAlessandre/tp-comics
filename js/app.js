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
let offsetCharacters = 0
//_________________________________CHARACTERS
const getCharacters = async(name, searched, offsetCharacters) =>{
    let existName = name? `&nameStartsWith=${name}` :""
    let existOffsetCh = offsetCharacters? `&offset=${offsetCharacters}` : ""
    let searchedExist = searched? `&orderBy=${searched}` :""
 const url = `${urlBase}characters?${ts}${publicKey}${hash}${existName}${searchedExist}${existOffsetCh}`
 const response = await fetch(url)
 const data = await response.json()
 console.log(data.data)
 return(data.data.results);
}
getCharacters()

//_________________________________COMICS PRUEBA DE OFFSET PARA COMICS
const getComics = async(title, searched, offset) =>{
    let existTitle = title? `&titleStartsWith=${title}` :""
    let existOffset = offset? `&offset=${offset}` : ""
    let searchedExist = searched? `&orderBy=${searched}` :""
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
    let resultsData = data2.data.results.length
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
    <div class="m-2 p-2 gap-y-4 md:flex justify-center gap-4 lg:md:flex justify-center gap-4 xl:md:flex justify-center gap-4">
        <div>
             <img src="${data[0].thumbnail.path}/portrait_xlarge.${data[0].thumbnail.extension}" alt="">
       </div>
       <div class="flex flex-col gap-6">
           <h3><b>${data[0].title}</b></h3>
           <p><b>Publicado:</b> ${data[0].dates[0].date}</p>
           <p><b>Guionistas:</b> ${comicsCreators}</p>
           <p><b>Descripción:</b> ${data[0].description}</p>
       </div>
   </div>
   <h4><b>Personajes</b></h4>
   <h5>Resultados: ${resultsData}</h5>
    <div class="">
     <div>
        <img src="" alt="">
        <p class="text-neutral-500">${charactersComic}</p>
     </div>
    </div>`
}


const renderComics = async(title, searched, offset) => {
    const comics = await getComics(title, searched, offset)
    $("#render-cards").innerHTML = ""
    for(let comic of comics){
        $("#render-cards").innerHTML += `
        <div onclick="getComicDetail(${comic.id})" class="m-2 flex justify-center flex-col gap-y-2">
         <img class="rounded-md" src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="">
         <p class="font-semibold text-white">${comic.title}</p>
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
        console.log(data.data.results)
         return data.data.results
       }
       

//___________________________________________RENDER CHARACTERS


const renderCharacter = async(data) => {
    hideElement("#render-cards")
    hideElement("#render-cards-detail")
    hideElement("#render-characters")
    showElement("#render-characters-detail")
    const infoNecesariaCharacter = `${urlBase}characters/${data[0].id}/comics?offset=${offsetCharacters}&limit=20&${ts}${publicKey}${hash}`
    const response = await fetch(infoNecesariaCharacter)
    const data2 = await response.json()
    console.log(data2.data.results)
    let totalData2 = data2.data.results.length
    console.log(totalData2)
    const arrComics = data2.data.results
    let comicCharacters = ""

    for (let arr of arrComics){
        console.log(arr)
        comicCharacters += `${arr.title}, `
    }


    $("#render-characters-detail").innerHTML = `
    <div class="m-2 p-2 gap-y-4 md:flex justify-center gap-4 lg:md:flex justify-center gap-4 xl:md:flex justify-center gap-4">
        <div>
             <img src="${data[0].thumbnail.path}/portrait_xlarge.${data[0].thumbnail.extension}" alt="">
       </div>
       <div class="">
           <h3><b>${data[0].name}</b></h3>
       </div>
   </div>
   <p><b>COMICS</b></p>
   <h5>Resultados</h5>
   <p>${totalData2}</p>
    <div class="gap-4">
     <div>
        <img src="" alt="">
        <p>${comicCharacters}</p>
     </div>
    </div>`
  
}

const renderCharacters = async(name, searched, offsetCharacters) => {
    const characters = await getCharacters(name, searched, offsetCharacters)
    $("#render-characters").innerHTML = ""
    for(let character of characters){
        $("#render-characters").innerHTML += `
        <div onclick="getCharacterDetail(${character.id})" class="m-2 flex justify-center flex-col gap-y-2">
         <img class="rounded-md" src="${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}" alt="">
         <p class="font-semibold text-white">${character.name}</p>
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

$("#input-search").addEventListener("change", () => {
    //renderComics($("#input-search").value)
    //renderCharacters($("#input-search").value)
})
$("#select-type").addEventListener("onchange", () => {
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
$("#select-order").addEventListener("onchange", () => {
    if (("#select-order").value == "title"){
    $("#change-value").value = "name"
    console.log(("#select-order").value)
} 
     else if (("#select-order").value == "-title") {
    let changeTitle2 = "-name"
    ("#select-order").value = changeTitle2
    } else {
   // renderComics($("#input-search").value, $("#select-order").value)
    console.log($("#select-order").value)
}
//renderCharacters($("#input-search").value, $("#select-order").value)
}
)
$("#btn").addEventListener("click", () => {
    if ($("#select-type").value == "characters"){
        showElement("#render-characters")
        hideElement("#render-cards")
        hideElement("#render-cards-detail")
    renderCharacters($("#input-search").value, $("#select-order").value)
}    else if ($("#select-type").value == "comics"){
    showElement("#render-cards")
    hideElement("#render-characters")
    hideElement("#render-characters-detail")
        renderComics($("#input-search").value, $("#select-order").value)

    }
    
})

$("#init").addEventListener("click", () => {
    if($("#select-type").value == "comics"){
        offset = 0
        renderComics($("#input-search").value, $("#select-order").value, offset)
    } else if($("#select-type").value == "characters") {
        offsetCharacters = 0
        console.log(offsetCharacters)
        renderCharacters($("#input-search").value, $("#select-order").value, offsetCharacters)
        
    }
})

     $("#next").addEventListener("click", () => {
    if($("#select-type").value == "comics" && offset<3000){
        offset += 20
        console.log(offset)
        renderComics($("#input-search").value, $("#select-order").value, offset)
    } else if($("#select-type").value == "characters" && offsetCharacters<780) {
        offsetCharacters += 20
        console.log(offsetCharacters)
        renderCharacters($("#input-search").value, $("#select-order").value, offsetCharacters)
        
    }
     })


     $("#prev").addEventListener("click", () => {
        if($("#select-type").value == "comics" && offset>0){
            offset -= 20
            console.log(offset)
            renderComics($("#input-search").value, $("#select-order").value, offset)
        } else if($("#select-type").value == "characters" && offsetCharacters>0) {
            offsetCharacters -= 20
            console.log(offsetCharacters)
            renderCharacters($("#input-search").value, $("#select-order").value, offsetCharacters)
            
        }
         })
    

     $("#end").addEventListener("click", () => {
        if($("#select-type").value == "comics"){
            offset = 30000
            console.log(offset)
            renderComics($("#input-search").value, $("#select-order").value, offset)
        }
        else if($("#select-type").value == "characters"){
offsetCharacters = 780
renderCharacters($("#input-search").value, $("#select-order").value, offsetCharacters)
        }
       
     })
     $("#modo").addEventListener("click", () => {
        $("#body").classList.toggle("bg-blue-50")
        $("#body").classList.toggle("bg-blue-950")
        if($("#body").classList.contains("bg-blue-950")){
            $("#modo").innerText = "💡 Modo claro"
           $("#modo").classList.add("text-neutral-500")
        }else{
            $("#modo").innerText = "🌙 Modo oscuro"
            $("#modo").classList.remove("text-white")
        }


        // if($("#body").classList.contains("bg-blue-50")){
        //     $("#body").classList.add("bg-blue-950")
        // } else if($("#body").classList.contains("bg-blue-950")){
        //     $("#body").classList.remove("bg-blue-950")
        //     $("#body").classList.add("bg-blue-50")
        // }
            
        }
     )
     
