
window.onload = async function e (){
    let products = await getProductsFetch()
    renderizarCards(products, 'top10', 'vistas', 10)
    renderizarCardsImagenes(products, 'sectImagenes')
    renderizarPrecios(products, 'sectPrecios')

let formBuscadorHeader = document.querySelector('#formBuscadorHeader')
let btnBuscadorHeader = document.querySelector('#btnBuscadorHeader')
    formBuscadorHeader.addEventListener('submit', e=>{
        e.preventDefault()
        let querySearch = e.target.elements['q'].value
        console.log(findProductsToOrder(querySearch, products))
        
        renderizarCards(findProductsToOrder(querySearch, products), 'resultadosBusqueda', 'orden')

    })
    btnBuscadorHeader.click() //busca desde el principio
} // fin window.onload

var loading = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`

async function getProductsFetch() {
    // containerArticulos.innerHTML = loading
    try {
        const response = await fetch("/api/products/getAllProductsActive");
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        if (jsonResponse.status == 'ok') {
            return jsonResponse.data
        } else {
            return 'error'
        }
        
    } catch (error) {
        return 'error'
    }
  }


function renderizarCards(products, sectionId, orderByColumn, limit = null) {

    products.sort(function (a, b) {
        if (a[orderByColumn] < b[orderByColumn]) {
          return 1;
        }
        if (a[orderByColumn] > b[orderByColumn]) {
          return -1;
        }
        return 0;
      });

      let section = document.querySelector('#'+sectionId)
      section.innerHTML = ''
      let contador = 0
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        
        if (!limit || (limit && contador < limit)  ) {
            contador += 1
            section.innerHTML += `
            <a href="/products/detail/${ product._id }/?t=${ product.titulo.replaceAll(' ', '-').replaceAll('/','-') }" target="_blank" style="text-decoration: none; color: black;">
            <article class="border border-1 rounded m-2 p-1" style="width: 8cm;" >
            ${product.imagenes.length == 0 ? '' : `<img src="${ product.imagenes[0].url}"  alt="img"  style="max-width: 100%; max-height: 7cm;">`}
            
            <div class="ms-2">
            <h4 class="ms-2">${product.titulo}</h4>
            <div class="d-flex mb-2 justify-content-start flex-nowrap align-items-center table-responsive ${ product.etiquetas && product.etiquetas.length > 1 ? '':'d-none'}">
            ${product.etiquetas && product.etiquetas.trim().split(',').map(etiqueta => { if(etiqueta.length > 1) {return `<small class="text-uppercase bg-danger rounded-pill p-2 m-1 text-white" style="min-width: fit-content;">${etiqueta}</small>`} else return '' }).join('')  }
            </div>
            </div>
            </article>
            </a>
            `
            // <img class="${product.imagenes.length == 0 ? 'd-none' : ''}" src="${product.imagenes[0] && product.imagenes[0].url}"  alt="img"  style="max-width: 100%; max-height: 7cm;">
        }
      }
    //   console.log(products)
    }



function findProductsToOrder(querySearch, arrayProducts) {
    let sectResultadosBusqueda = document.querySelector('#sectResultadosBusqueda')
    if (querySearch.length == 0) {
        sectResultadosBusqueda.classList.add('d-none')
    } else {
        sectResultadosBusqueda.classList.remove('d-none')
    }
    querySearch = querySearch.trim().toLowerCase().split(' ')
     arrayProducts.forEach(product => { product.orden = 0}  )
    querySearch.map(palabra => {
        arrayProducts.forEach( product => {
            if (product.titulo.toLowerCase().includes(palabra)) {
                product.orden += 1
            }
            if (product.descripcion.toLowerCase().includes(palabra)) {
                product.orden += 1
            }
            if (product.etiquetas && product.etiquetas.toLowerCase().includes(palabra)) {
                product.orden += 1
            }
            
        });
    })
    arrayProducts = arrayProducts.filter(product => {return product.orden != 0})

    let h3ResultadosBusqueda = document.querySelector('#h3ResultadosBusqueda')
    if (arrayProducts.length == 0) {
        h3ResultadosBusqueda.textContent = 'Sin resultados buscando: ' + querySearch.join(' ')
    } else {
        h3ResultadosBusqueda.textContent = 'Resultados buscando: ' + querySearch.join(' ')
    }
    return arrayProducts
}

// section imagenes con titlo
// let sectImagenes = document.querySelector('#sectImagenes')

function renderizarCardsImagenes(products, sectionId) {

      let section = document.querySelector('#'+sectionId)
      section.innerHTML = ''
    //   let contador = 0
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        
        if ( product.imagenes.length != 0 ) {
            product.imagenes.forEach(imagen => {
                
                section.innerHTML += `
            <a href="/products/detail/${ product._id }/?t=${ product.titulo.replaceAll(' ', '-').replaceAll('/','-') }" target="_blank" style="text-decoration: none; color: black;">
    
                <div class="card text-bg-dark m-2" style="width: 7cm; height: 7cm;">
                    <img src="${imagen.url}" class="img-thumbnail"  alt="img" style="max-width: 100%; max-height: 100%;" >
                    <div class="position-relative">
                        <h5 class="card-title bg-secondary rounded p-2 position-absolute bottom-0 start-0 mx-1">${product.titulo}</h5>
                    </div>
                </div>
    
            </a>
                `
            })
          
        }
      }
    //   console.log(products)
    }


    function renderizarPrecios(products, sectionId) {

      let section = document.querySelector('#'+sectionId)
      section.innerHTML = ''
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        
        if ( product.ganancias.length != 0 ) {
            const newA = document.createElement("a");

            newA.href = `/products/detail/${ product._id }/?t=${ product.titulo.replaceAll(' ', '-').replaceAll('/','-') }`
            newA.style = "text-decoration: none; color: black;"
            newA.target = "_blank"
            newA.innerHTML = `<h6>${product.titulo}</h6>
            `
            
            product.ganancias.forEach( forma  => {
                if (forma.activo) {
                    
                    newA.innerHTML += `
                    <p class="card-text mb-1 ms-3 text-secondary fs-6 fw-lighter"> -- <i> ${forma.forma}</i> <svg style="color:#c6538c;" aria-hidden="true" height="10" viewBox="0 0 16 16" version="1.1" width="10" data-view-component="true" class="octicon octicon-dot-fill mr-2">
                    <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
                    </svg> <b>${ forma.precio } </b></p>
                    `
                }
            })
            newA.innerHTML += `<br>`
            section.appendChild (newA)
        }
      }
    //   console.log(products)
    }
