
window.onload = async function e (){
    let products = await getProductsFetch()
    renderizarCards(products, 'top10', 'vistas', 10)

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