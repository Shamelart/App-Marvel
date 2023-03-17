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

const $$ = (element) => {
	return document.querySelectorAll(element);
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

	/***** Varables para Seleccion de una Card *****/
	const $comicDetail = $(".container");

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
					console.log(info.data.results)
					comicsTotal = info.data.total

					$results.innerHTML = ""
					for (let i = 0; i < characters.length; i++) {
						$results.innerHTML +=
							`<div class="comic" id=${characters[i].id}>
                        		<div class="comic-img-container">
                            		<img src=${characters[i].thumbnail.path + "." + characters[i].thumbnail.extension} alt="" class="comic-img">
                        		</div>           
                        		<h3 class="comic-title">${characters[i].title}</h3>            
                     		</div>`
					}

					$resultsCount.innerHTML = ""
					$resultsCount.innerHTML = `<span class="results-number">${comicsTotal}</span>
                    Comics`
					btnPaginado();
					crearCardComic();

				})
				.catch(error => console.log("ERROR", error));
		} else {
			fetch(`https://gateway.marvel.com//v1/public/${urlParameter}?offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}${order}${search}`)
				.then(response => response.json())
				.then(info => {
					characters = info.data.results;
					console.log(info.data.results)
					charactersTotal = info.data.total
					$results.innerHTML = "";
					for (let i = 0; i < characters.length; i++) {
						$results.innerHTML +=
							`<div class="comic" id=${characters[i].id}>
                  				<div class="comic-img-container">
                        			<img src=${characters[i].thumbnail.path + "." + characters[i].thumbnail.extension} alt="" class="comic-img">
                    			</div>
                    			<h3 class="comic-title">${characters[i].name}</h3>
                  			</div>`;
					};

					$resultsCount.innerHTML = ""
					$resultsCount.innerHTML = `<span class="results-number">${charactersTotal}</span>`
					btnPaginado();
					crearCardCharacter();
				})
				.catch(error => console.log("Error", error));
		}
	}
	paint();

	/***** Funtion Seleccion de Card Comics*****/
	const crearCardComic = () => {
		const cardsComics = $$(".comic");
		cardsComics.forEach((comic) => {
			comic.addEventListener(("click"), (e) => {
				e.preventDefault();
				crearDetalleComic(comic.id);
			});
		});
	}

	/***** Funtion Seleccion de Card Characters*****/
	const crearCardCharacter = () => {
		const cardsComics = $$(".comic");
		cardsComics.forEach((character) => {
			character.addEventListener(("click"), (e) => {
				e.preventDefault();
				crearDetalleCharacter(character.id);
			});
		});
	}


	const crearDetalleComic = (id) => {
		fetch(`https://gateway.marvel.com//v1/public/${urlParameter}/${id}?offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}${order}${search}${date}`)
			.then(response => response.json())
			.then(info => {
				characters = info.data.results[0];

				let descripcion = characters.variantDescription;
				let img = `${characters.thumbnail.path + "." + characters.thumbnail.extension}`;

				if (descripcion === null || descripcion === "") {
					descripcion = "Lo sentimos, no hay información disponible";
				};

				if (img === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {
					img = "/images/img-not-found";
				};

				$comicDetail.innerHTML = `
					<div class= "card-detalle-contenedor">
						<div class= "card-comic-detalle-contenedor">
							<div class= "comic-img-contenedor">
								<img class= "comic-img" src="${img}">
							</div>
							<div class= "comic-contenido-contenedor">
								<h2 class= "comic-contenido-titulo">${characters.title}</h2>
								<h3>Publicado:</h3>
								<p>${characters.dates[1].date}</p>
								<h3>Descripción: </h3>
								<p>${descripcion}</p>
								<h3>Número de comcs:</h3>
								<span class="results-number">${characters.pageCount}</span>						
							</div>
						</div>`;
			})

			.catch(error => console.log("Error", error));
	}

	const crearDetalleCharacter = (id) => {
		fetch(`https://gateway.marvel.com//v1/public/${urlParameter}/${id}?offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}${order}${search}`)
			.then(response => response.json())
			.then(info => {
				characters = info.data.results[0];
				console.log(characters)
				let img = `${characters.thumbnail.path + "." + characters.thumbnail.extension}`;
				let description = `${characters.description}`;
				if (description === null || description === "") {
					description = "Lo sentimos, no hay información disponible";
				};

				if (img === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {
					img = "/images/img-not-found";
				};

				$comicDetail.innerHTML = `
					<div class= "card-detalle-contenedor">
						<div class= "card-comic-detalle-contenedor">
							<div class= "comic-img-contenedor">
								<img class= "comic-img" src="${img}">
							</div>
							<div class= "comic-contenido-contenedor">
								<h2 class= "comic-contenido-titulo">${characters.name}</h2>
								<h3>Fecha de modificación:</h3>
								<p>${characters.modified}</p>
								<h3>Descripción: </h3>
								<p>${description}</p>
								<h3>Número de Historias:</h3>
								<span class="results-number">${characters.stories.available}</span>
							</div>	
						</div>
					</div>`;
			})

			.catch(error => console.log("Error", error));
	}


	/***** Cambio de value en la opcion de Personajes */
	$searchType.addEventListener("change", (e) => {
		e.preventDefault()
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
		const $cardDetalleContenedor = $(".card-detalle-contenedor");
		if ($cardDetalleContenedor != null) {
			if ($cardDetalleContenedor.style.display === "block") {
				$cardDetalleContenedor.style.display = "none";
			} else {
				$cardDetalleContenedor.style.display = "none";
			}
		}

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