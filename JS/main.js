/***** API Marvel *****/
const ts = Date.now();
const publicKey = `a069b27fc454b657869523342c461452`;
const privateKey = `5755fb89a39e380bf08797893a2c1b9ea4de1661`;

const hash = md5(`${ts}${privateKey}${publicKey}`);

let urlParameter = `comics`;
let order = "";
let search = "";
let date = "";
let charactersTotal = 0;
let comicsTotal = 0;


/***** DOM *****/
const $ = (element) => {
    return document.querySelector(element);
}

window.addEventListener("load", (e) => {
    e.preventDefault();

    const $results = $(".results");
    const $searchType = $("#search-type");
    const $searchButton = $(".search-button");
    const $searchInput = $("#search-input");
    const $searchOrden = $("#search-orden");
    const $resultsSection = $(".results-section");
    const $resultsNumber = $(".results-number ");
    const $resultsCount = $(".results-count");
    const $cardSection =$(".card-section");

    /***** Variables Paginado *****/
    const $btnNextPage = $(".next-page");
    const $btnInitPage = $(".init-page");
    const $btnPreviusPage = $(".previus-page");
    const $btnLastPage = $(".last-page");

    /***** Variable Auxiliares ****/
    let characters = "";
    let offset = 0;


    /***** Funcion pintar Comics y Characters *****/
    const paint = () => {
        if (urlParameter === "comics") {
            fetch(`https://gateway.marvel.com//v1/public/${urlParameter}?offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}${order}${search}${date}`)
                .then(response => response.json())
                .then(info => {
                    characters = info.data.results
                    comicsTotal = info.data.total
                    $results.innerHTML = ""
                    for (let i = 0; i < characters.length; i++) {
                        $results.innerHTML += `<div class="comic" id=${characters[i].id}>
                                <div class="comic-img-container">
                                    <img src=${characters[i].thumbnail.path + "." + characters[i].thumbnail.extension} alt="" class="comic-img">
                                </div>           
                                <h3 class="comic-title">${characters[i].title}</h3>            
                            </div>`
                    }
                    $resultsCount.innerHTML = ""
                    $resultsCount.innerHTML = `<span class="results-number">${comicsTotal}</span>
                    RESULTADOS`
                    btnPaginado();
                })
                .catch(error => console.log("ERROR", error));
        } else {
            fetch(`https://gateway.marvel.com//v1/public/${urlParameter}?offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}${order}${search}`)
                .then(response => response.json())
                .then(info => {
                    characters = info.data.results;
                    charactersTotal = info.data.total
                    console.log(charactersTotal)
                    $results.innerHTML = "";
                    for (let i = 0; i < characters.length; i++) {
                        $results.innerHTML += `<div class="comic" id=${characters[i].id}>
                    <div class="comic-img-container">
                        <img src=${characters[i].thumbnail.path + "." + characters[i].thumbnail.extension} alt="" class="comic-img">
                    </div>
                    <h3 class="comic-title">${characters[i].name}</h3>
                    </div>`;
                    };
                    $resultsCount.innerHTML = ""
                    $resultsCount.innerHTML = ` <span class="results-number">${charactersTotal}</span>
                    RESULTADOS`
                    btnPaginado();
                })
                .catch(error => console.log("Error", error));
        }
    }
    paint();

    const comic = document.querySelectorAll

    /***** Cambio de value enla opcioness de Personajes */
    $searchType.addEventListener("change", () => {
        if ($searchType.value === "Personajes") {
            $searchOrden.innerHTML = ""
            $searchOrden.innerHTML =
                `<option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>`
        }
    })

    /**** Filtrado por Search *****/
    $searchButton.addEventListener("click", (e) => {
        e.preventDefault()
        offset = 0

        if ($searchType.value === "Comics") {
            urlParameter = "comics"
        } else {
            urlParameter = "characters"
        }

        if ($searchOrden.value === "A-Z") {
            order = ""
        } else if ($searchType.value === "Comics") {
            order = `&orderBy=-title`
        } else {
            order = `&orderBy=-name`
        }

        if ($searchInput.value === "") {
            search = ""
        } else if ($searchType.value === "Comics") {
            search = `&titleStartsWith=${$searchInput.value}`
        } else {
            search = `&nameStartsWith=${$searchInput.value}`
        }

        if ($searchOrden.value === "mas-nuevos") {
            date = ""
        } else if ($searchType.value === "Comics") {
            date = `&orderBy=focDate`
        }
        if ($searchOrden.value === "mas-viejos") {
            date = ""
        } else if ($searchType.value === "Comics") {
            date = `&orderBy=-focDate`
        }

        paint()
    })


   

    /***** Paginado *****/
    $btnNextPage.addEventListener("click", () => {
        if ($searchType.value === "Comics") {
            if (offset + 20 < comicsTotal) {
                offset = offset + 20
            }
        } else {
            if (offset + 20 < charactersTotal) {
                offset = offset + 20
            }
        }
        paint()
    })

    $btnPreviusPage.addEventListener("click", () => {
        if ($searchType.value === "Comics") {
            if (offset - 20 < comicsTotal && offset - 20 >= 0) {
                offset = offset - 20
            }
        } else {
            if (offset - 20 < charactersTotal && offset - 20 >= 0) {
                offset = offset - 20
            }
        }
        paint();
    });

    $btnInitPage.addEventListener("click", () => {
        if (offset !== 0) {
            offset = 0
        }
        paint();
    });

    $btnLastPage.addEventListener("click", () => {
        if ($searchType.value === "Comics") {
            if (offset + 20 < comicsTotal) {
                while (offset + 20 <= comicsTotal) {
                    offset += 20
                }
            }
        } else {
            if (offset + 20 <= charactersTotal) {
                while (offset + 20 <= charactersTotal) {
                    offset += 20
                }
            }
        }
        paint();
    })


    /***** Function Botones Paginado *****/
    const btnPaginado = () => {
        if (offset < 20) {
            $btnPreviusPage.classList.add("desactived");
            $btnInitPage.classList.add("desactived");
        } else {
            $btnPreviusPage.classList.remove("desactived");
            $btnInitPage.classList.remove("desactived");
        }

        if (offset + 20 > comicsTotal) {
            $btnNextPage.classList.add("desactived");
            $btnLastPage.classList.add("desactived");
        } else {
            $btnNextPage.classList.remove("desactived");
            $btnLastPage.classList.remove("desactived");
        }
    }
})







