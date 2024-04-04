


window.onload = async function e (){
    let dataProductsYcarrito = await getProductsVerificarCarritoFetch()
    // let allProducts = dataProductsYcarrito.allProducts
    // let colores = dataProductsYcarrito.colores
    // let productsDisponiblesOnline = dataProductsYcarrito.productsDisponiblesOnline
    // let carritoVerificado = dataProductsYcarrito.carritoVerificado
    // let carritoAmostrar = dataProductsYcarrito.carritoAmostrar

    console.log(dataProductsYcarrito);

    renderizarCarrito(dataProductsYcarrito)
    calcularYrenderizarTotales()
} // fin window.onload

var loading = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`


// local storage
// let arrayCarrito =  [
//     { 
//         cantidad:10 , cod:"1054038123630", codStock:"1711652818600"
//      }
// ]
if (!localStorage.getItem('carrito') || localStorage.getItem('carrito') == 'undefined') {
    localStorage.setItem('carrito', JSON.stringify([]));
}
let carrito = JSON.parse( localStorage.getItem('carrito') );

async function getProductsVerificarCarritoFetch() {
    try {
        const res = await fetch( '/pedidos/api/verificarCarrito', { 
            method: 'POST', 
            body: JSON.stringify({ carrito: JSON.parse(localStorage.getItem('carrito')) }),  
            headers: {  "Content-Type": "application/json" },});
        const resData = await res.json();
        // console.log(resData);
        if (resData.status == 'ok') {
            return resData.data
        } else {
            return 'error'
        }        
    } catch (error) {
        console.log(error);
        return 'error'
    }
  }


function renderizarCarrito(dataProductsYcarrito = {}) {
    let containerCarrito = document.querySelector('#containerCarrito')
    containerCarrito.innerHTML = ''

// arreglo el carrito lo paso a el correcto verificado!!
localStorage.setItem('carrito', JSON.stringify(dataProductsYcarrito.carritoVerificado));

    dataProductsYcarrito.carritoAmostrar.forEach( item => {
        const sectionArt = document.createElement("section");
        sectionArt.classList.add('container', 'my-3', 'fondoGradient')
        sectionArt.style.width = '8cm'
        sectionArt.innerHTML += `
            <div class="row">
                <div class="col-4 ms-auto">
                    <button class="btn btn-danger btn-sm" id="btnQuitarItem">QUITAR</button>
                </div>
            </div>
            <div class="row ">
                <a href="/products/detail/${item.product._id}/?t=${item.product.titulo.replaceAll(' ', '-').replaceAll('/','-')} " target="_blank" class="text-warning"><p class="col mb-1"> ${item.product.titulo} </p></a>
            </div>
            <div class="row text-end">
                <p class="ms-auto py-0 mb-0 px-1 text-truncate opacity-50" id="codStock">codStock ${item.stock.codStock}</p>
            </div>
            <div class="row text-center">
                <p class="col py-0 px-1 mb-2">${item.stock.descripcion}</p>
            </div>
            <div class="row">
                <div class="col-6 mx-auto">
                    <div class="input-group mb-3 " >
                        <button class="btn btn-outline-light" type="button" id="restar1item">-</button>
                        <input type="number" id="inputNumCantidad" class="form-control" disabled placeholder="${item.itemCarrito.cantidad}"  value="${item.itemCarrito.cantidad}" min="1" max="${item.disponibilidad.cantidadDisponible}">
                        <button class="btn btn-outline-light" type="button" id="sumar1item">+</button>
                    </div>
                </div>
            </div>
            <div class="row text-center">
                <p class="col mb-1 text-decoration-underline">color</p>
                <p class="col mb-1 text-decoration-underline">medida</p>
            </div>
            <div class="row text-center">
                <div class="col-2 rounded my-auto ms-2" style="width: 20px;height: 20px;background-color: ${ item.disponibilidad.color.split('||')[1]  };"></div>
                <p class="col mb-2"> ${item.disponibilidad.color.split('||')[0]} </p>
                <p class="col mb-2"> ${item.disponibilidad.medida} ${item.product.unidadDeMedida} </p>
            </div>
            
            <div class="row">
                <p class="col mb-1 pe-0">$${item.stock.precio} <i>por ${item.product.unidadDeMedida}</i> </p>
                <p class="col mb-1 fw-bold">Total $<i class="ps-1" id="iTotalArt">${ item.stock.precio * item.itemCarrito.cantidad * item.disponibilidad.medida }</i> </p>
            </div>
            <div class="row">
                <i class="col py-0 mb-0 px-1 text-truncate opacity-50" id="codDisponibilidad">cod ${item.disponibilidad.cod}</i>
            </div>
        `

        let btnRestar1item = sectionArt.querySelector('#restar1item')
        let btnSumar1item = sectionArt.querySelector('#sumar1item')
        let inputNumCantidad = sectionArt.querySelector('#inputNumCantidad')
        let iTotalArt = sectionArt.querySelector('#iTotalArt')
        let btnQuitarItem = sectionArt.querySelector('#btnQuitarItem')

        btnRestar1item.addEventListener('click',e=>{
            let carrito = JSON.parse(localStorage.getItem('carrito'));
            carrito.map(( element , index) => {
                if (item.itemCarrito.cod == element.cod) {
                    if (carrito[index].cantidad > 1) {
                        carrito[index].cantidad -= 1
                        inputNumCantidad.value = carrito[index].cantidad
                        iTotalArt.innerHTML = item.stock.precio * carrito[index].cantidad * item.disponibilidad.medida
                    }
                }
            })
            localStorage.setItem('carrito', JSON.stringify(carrito));
            calcularYrenderizarTotales()
        })
        btnSumar1item.addEventListener('click',e=>{
            let carrito = JSON.parse(localStorage.getItem('carrito'));
            carrito.map(( element , index) => {
                if (item.itemCarrito.cod == element.cod) {
                    if (carrito[index].cantidad < item.disponibilidad.cantidadDisponible) {
                        carrito[index].cantidad += 1
                        inputNumCantidad.value = carrito[index].cantidad
                        iTotalArt.innerHTML = item.stock.precio * carrito[index].cantidad * item.disponibilidad.medida
                    }
                }
            })
            localStorage.setItem('carrito', JSON.stringify(carrito));
            calcularYrenderizarTotales()
        })
        btnQuitarItem.addEventListener('click',e=>{
            let carrito = JSON.parse(localStorage.getItem('carrito'));
            carrito.map(( element , index) => {
                if (item.itemCarrito.cod == element.cod) {
                    // carrito = carrito.splice(index+1,1)
                    carrito = carrito.filter(itemSeg => {
                        return itemSeg.cod != element.cod
                    })
                }
            })
            e.target.parentElement.parentElement.parentElement.remove()
            localStorage.setItem('carrito', JSON.stringify(carrito));
            calcularYrenderizarTotales()
        })

        containerCarrito.appendChild(sectionArt)
    });

}

function calcularYrenderizarTotales() {
    let containerCarrito = document.querySelector('#containerCarrito')

    // total productos
    let iTotalProductos = document.querySelector('#iTotalProductos')
    let inputsNumCantidad = containerCarrito.querySelectorAll('#inputNumCantidad')
    let contador = 0
    for (let index = 0; index < inputsNumCantidad.length; index++) {
        const inputcantidad = inputsNumCantidad[index];
        contador += Number(inputcantidad.value)
    }
    iTotalProductos.innerHTML = contador
    
    // total a pagar
    let iTotalArts = containerCarrito.querySelectorAll('#iTotalArt')
    let iTotalApagar = document.querySelector('#iTotalApagar')
    let contador2 = 0
    for (let index = 0; index < iTotalArts.length; index++) {
        const iTotalArt = iTotalArts[index];
        contador2 += Number(iTotalArt.innerHTML)
    }
    iTotalApagar.innerHTML = contador2
}

let btnVaciarCarrito = document.querySelector('#btnVaciarCarrito')
btnVaciarCarrito.addEventListener('click',e=>{
    localStorage.setItem('carrito', JSON.stringify([]));
    let containerCarrito = document.querySelector('#containerCarrito')
    containerCarrito.innerHTML = ''
    calcularYrenderizarTotales()
})


// Realizar pedido
let btnRealizarPedido = document.querySelector('#btnRealizarPedido')
btnRealizarPedido.addEventListener('click', async e => {
    btnRealizarPedido.innerHTML = loading
    btnRealizarPedido.disabled = true

    try {
        const res = await fetch( '/pedidos/api/realizarPedido', { 
            method: 'POST', 
            body: JSON.stringify({ carrito: JSON.parse(localStorage.getItem('carrito')) }),  
            headers: {  "Content-Type": "application/json" },});
        const resData = await res.json();
        console.log(resData);
        if (resData.status == 'ok') {
            btnRealizarPedido.innerHTML = 'Pedido Guardado Correctamente ' + loading
            
            // carrito vuelve a 0
            localStorage.setItem('carrito', JSON.stringify([]));
            
            // redireccionamiento al pedido
            window.location.href = '/pedidos/detalle/'+ resData.data.resDB.insertedIds[0]

            return resData.data
        } else {
            btnRealizarPedido.innerHTML = resData.message
            return 'error'
        }        
    } catch (error) {
        btnRealizarPedido.innerHTML = error.message
        btnRealizarPedido.disabled = false
        console.log(error);
        return 'error'
    }

})

//                 <div class="col-2 rounded my-auto ms-2" style="width: 20px;height: 20px;background-color: ${  dataProductsYcarrito.colores.filter(color => color.color == item.disponibilidad.color)[0].html   };"></div>
