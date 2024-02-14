

window.onload = async function e (){
    let products = await getProductsFetch()
    renderizarCards(products, 'top10', 'vistas', 10)
}

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

      let contador = 0
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        
        if (!limit || (limit && contador < limit)  ) {
            contador += 1
            section.innerHTML += `
            <a href="/products/detail/${ product._id }/?t=${ product.titulo.replaceAll(' ', '-').replaceAll('/','-') }" target="_blank" style="text-decoration: none; color: black;">
            <article class="border border-1 rounded m-2 p-1" style="width: 8cm;" >
            <img class="${product.imagenes.length == 0 ? 'd-none' : ''}" src="${product.imagenes[0] && product.imagenes[0].url}"  alt="img"  style="max-width: 100%; max-height: 7cm;">
            <div class="ms-2">
            <h4 class="ms-2">${product.titulo}</h4>
            <div class="d-flex mb-2 justify-content-start flex-nowrap align-items-center table-responsive ${ product.etiquetas && product.etiquetas.length > 1 ? '':'d-none'}">
            ${product.etiquetas && product.etiquetas.trim().split(',').map(etiqueta => { if(etiqueta.length > 1) {return `<small class="text-uppercase bg-danger rounded-pill p-2 m-1 text-white" style="min-width: fit-content;">${etiqueta}</small>`} else return '' }).join('')  }
            </div>
            </div>
            </article>
            </a>
            `
            
        }
      }
    //   console.log(products)
    }

