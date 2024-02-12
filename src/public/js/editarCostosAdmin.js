
const dateNow = Date.now();
const hoy = new Date(dateNow).toLocaleDateString();


let containerArticulos = document.querySelector('#containerArticulos')
var loading = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`

window.onload = async function() { 
    mostrarArticulos() 
}

// Fetchs

async function getProductsFetch() {
    containerArticulos.innerHTML = loading
    try {
        const response = await fetch("/api/products/admin/getAllProducts");
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

  // fucion q muestra los proveedores en el input para filtrar
  let mostrarProveedores = (articulos) => {
    let listaProveedores = document.querySelector('#listaProveedores')
    let arrayproveedores = articulos.map(articulo => { return articulo.proveedor })
    const dataArr = new Set(arrayproveedores);
    let proveedores = [...dataArr];

    listaProveedores.innerHTML = ''
    proveedores.forEach(proveedor => {
        listaProveedores.innerHTML += `<option value="${proveedor}">`
    })
  }

let mostrarArticulos = async function() {
    let productos = await getProductsFetch()
    containerArticulos.innerHTML = ''

    if( productos == 'error') {
        containerArticulos.innerHTML = 'Ocurrio un error recargue la pagina'
        return 
    }
    // mostrarProveedores(productos)

    productos.forEach( async articulo => {
        
        const div = document.createElement("div");
        
        div.innerHTML = `
        <article class="mx-auto p-1" style="max-width: 20cm;">
        <form class="border border-dark mb-1 p-1 rounded" id="formProducto">

            <input type="hidden" name="idProduct" value="${articulo._id}">
            <div class="d-flex flex-wrap  mx-0">
                <i class="text-lowercase  opacity-50 h-75" id="categoria">${articulo.categoria || ''} | ${articulo.vistas} vistas</i> 
                <div class="btn-group w-75 ms-auto" role="group" >
                    <a href="/products/detail/${articulo._id}/" target="_blank" class="btn btn-outline-primary border mt-2">Ver</a>
                    <a href="/products/update/${articulo._id}/" target="_blank" class="btn btn-outline-primary border mt-2">Editar</a>
                    <button id="btnPausarArt" class="btn btn-outline-danger text-center mt-2 border ${articulo.isActive? '':'d-none'}">Pausar</button>
                    <button id="btnActivarArt" class="btn btn-outline-success text-center mt-2 border ${articulo.isActive ? 'd-none' : ''}">Activar</button>
                </div>
            </div>
                <h5 class="mt-0 d-inline" id="tituloProducto"> ${articulo.titulo}</h5>
            <div class=" d-flex justify-content-around mx-0">
                <div class="form-floating">
                    <input type="number" min="0" required="" class="form-control" name="costo" id="inputcosto" value="${articulo.costo}"> <label>Costo</label>
                </div>
                <div class="form-floating">
                    <input type="text" class="form-control" name="proveedor" id="inputProveedor" value="${articulo.proveedor || ''}">
                    <label>Proveedor</label>
                </div>
            </div>
    
            <div id="divPrecios">   </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <a></a>
                    <button type="submit" id="btnActualizar" class="btn btn-secondary border-4">Actualizar</button>
                    <button class="btn btn-outline-primary m-1 btn-sm" type="button" id="btnAgregarForma" >+</button>
                </div>
            
        </form>
    </article>
        `

    //     div.innerHTML = `
    //     <form class="border border-dark mb-1 p-1 rounded" id="formProducto">

    //     <input type="hidden" name="idArticulo" value="${articulo.id}">
    //     <div class="row g-2  mx-0">
    //         <i class="text-lowercase text-white bg-dark opacity-50 w-50" id="categoria">${articulo.categoria} | ${articulo.vistas} <i class="fa-regular fa-eye"></i></i> 
    //         <a class="w-25 opacity-50 text-center text-info bg-dark" href="/products/detail/${articulo.id}/${articulo.titulo.replaceAll('/','').split(' ').join('-')}" target="_blank">Ver</a> 
    //         <a class="w-25 opacity-50 text-end text-info bg-dark" href="/admin/editProduct/${articulo.id}/" target="_blank">Editar</a> 
    //         <h5 class="mt-0 d-inline" id="tituloArticulo" > ${articulo.titulo}</h5>
    //         <div class="form-check form-switch mt-0 ms-1 col">
    //             <input class="form-check-input" ${articulo.precioactivo == 1 ? 'checked' : ''} value="1" name="precioactivo" type="checkbox" role="switch" id="precioactivo${articulo.id}">
    //             <label class="form-check-label" for="precioactivo${articulo.id}">Precio Activo</label>
    //         </div>
    //         <div class="form-check form-switch mt-0 ms-2 mb-2 col">
    //             <input class="form-check-input" ${articulo.ventaonline == 1 ? 'checked' : ''} value="1" name="ventaonline" type="checkbox" role="switch" id="ventaonline${articulo.id}">
    //             <label class="form-check-label" for="ventaonline${articulo.id}">Venta Online</label>
    //         </div>
    //     </div>
    //     <div class="row g-3 mx-0">
    //         <div class="col"><div class="form-floating">
    //                 <input type="number" min=0 required class="form-control" name="costo" id="inputcosto" value="${articulo.costo}"> <label>Costo</label>
    //             </div></div>

    //         <div class="col input-group position-relative">
    //             <div class="form-floating">
    //                 <input type="number" class="form-control" name="porcentajebarrani" min=0 required id="porcentajebarrani" value="${articulo.porcentajebarrani}">
    //                 <label class="p-2 mt-2">% Barrani</label>
    //             </div>
    //             <span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger" id="precioBarrani" >
    //                 $250<span class="visually-hidden"></span></span>
    //         </div>

    //         <div class="col input-group position-relative">
    //             <div class="form-floating">
    //                 <input type="number" class="form-control" name="porcentajefinal" min=0 required id="porcentajefinal" value="${articulo.porcentajefinal}">
    //                 <label class="p-2 mt-2">% Final</label>
    //             </div>
    //             <span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger" id="precioFinal" >
    //                 $290<span class="visually-hidden"></span></span>
    //         </div>

    //     </div>

    //     <div class="row g-3 mx-0">
    //         <div class="col">
    //             <div class="form-floating">
    //                 <input type="text" class="form-control" name="proveedor" id="inputProveedor" value="${articulo.proveedor}">
    //                 <label>Proveedor</label>
    //             </div>
    //         </div>

    //         <div class="col text-center mt-4">
    //             <button type="submit" id="btnActualizar" class="btn btn-secondary border-3">Actualizar</button>
    //         </div>

    //         <div class="col">
    //             <button id="btnPausarArt" class="btn btn-outline-danger text-center mt-2 border ${articulo.isactive == 1 ? '' : 'd-none'}" >Pausar Articulo</button>
    //             <button id="btnActivarArt" class="btn btn-outline-success text-center mt-2 border ${articulo.isactive == 1 ? 'd-none' : ''}" >Activar Articulo</button>
    //         </div>

    //     </div>
    //     <hr>
    // </form>
    //     `
        let formProducto = div.querySelector('#formProducto')
        let btnActualizar = div.querySelector('#btnActualizar')
        let btnPausarArt = div.querySelector('#btnPausarArt')
        let btnActivarArt = div.querySelector('#btnActivarArt')
        let divPrecios = div.querySelector('#divPrecios')
        let inputCosto = div.querySelector('#inputcosto')        
        let btnAgregarForma = div.querySelector('#btnAgregarForma')        

        function agregarInputsForma$(forma='', ganancia='0', activo = false) {
            const div = document.createElement("div");
           
            div.innerHTML = `
            <div class="input-group m-1 mb-2" id="divForma">
                <input type="text" name="forma" id="forma" value="${forma}" class="form-control" placeholder="Forma">
                <div class="position-relative d-inline" style="max-width: 3cm;">
                    <span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-info" id="precio">$000</span>
                    <input type="number" value="${ganancia}" id="ganancia" name="ganancia" class="form-control" placeholder="% Ganancia">
                </div>
                <span class="input-group-text p-0 ps-1">
                    <div class="form-check form-switch mt-0 ">
                        <input class="form-check-input" ${activo ? 'checked' : ''} value="1" id="precioactivo" name="precioactivo" type="checkbox" role="switch">
                    </div>
                </span>
                <button class="btn btn-outline-danger px-2 py-1" type="button" onclick="this.parentElement.remove()">X</button>
            </div>
            `

            function calcularPrecios () {

                let inputGanancia = div.querySelector('#ganancia')
                let labelPrecio = div.querySelector('#precio')
                labelPrecio.innerHTML = '$' + Math.round(inputCosto.value * ( (inputGanancia.value / 100) + 1 ))

                btnActualizar.innerHTML = 'Actualizar'
            }

            let inputGanancia = div.querySelector('#ganancia')
            inputGanancia.addEventListener('keyup',e=>{ calcularPrecios() })
        calcularPrecios() //calcular al inicio tambien


            divPrecios.appendChild(div)
        }

        btnAgregarForma.addEventListener('click',e=>{ agregarInputsForma$() })

        // articulo.ganancias.push({forma:'banana', ganancia:90, activo:false})   //test

        await articulo.ganancias.map( ganancia => {
            agregarInputsForma$(ganancia.forma, ganancia.ganancia, ganancia.activo)
        })
       
        btnActivarArt.onclick = async function (e){
            e.preventDefault()
            try {
                const res = await fetch( '/api/products/admin/reactivarProducto', {
                    method: 'POST', 
                    body: JSON.stringify({idProduct: articulo._id}),  
                    headers: {  "Content-Type": "application/json" },
                  });
            
                const resData = await res.json();
                btnActivarArt.classList.remove('border','border-warning') //borra la alerta

                if(resData.status == 'ok'){
                    btnPausarArt.classList.remove('d-none')
                    btnActivarArt.classList.add('d-none')
                }
                // console.log(resData)
            } catch (error) {
                console.log(error)
                btnActivarArt.classList.add('border','border-warning')
            }
        }
       
        btnPausarArt.onclick = async function (e){
            e.preventDefault()
            try {
                const res = await fetch( '/api/products/admin/pausarProducto', {
                    method: 'POST', 
                    body: JSON.stringify({idProduct: articulo._id}),  
                    headers: { "Content-Type": "application/json" },
                  });
            
                const resData = await res.json();
                btnPausarArt.classList.remove('border','border-warning') //borra la alerta

                if(resData.status == 'ok'){
                    btnPausarArt.classList.add('d-none')
                    btnActivarArt.classList.remove('d-none')
                }
                // console.log(resData)
            } catch (error) {
                console.log(error)
                btnPausarArt.classList.add('border','border-warning')
            }
        }

        inputCosto.addEventListener('keyup', e=>{
            let divsFormas = div.querySelectorAll('#divForma')
            for (let index = 0; index < divsFormas.length; index++) {
                const divForma = divsFormas[index];
                
                let inputGanancia = divForma.querySelector('#ganancia')
                let labelPrecio = divForma.querySelector('#precio')
                labelPrecio.innerHTML = '$' + Math.round(inputCosto.value * ( (inputGanancia.value / 100) + 1 ))
            }

            btnActualizar.innerHTML = 'Actualizar'
        })

        formProducto.onsubmit = async function (e) { 
            e.preventDefault()

            const data = new FormData(formProducto);

            console.log(Array.from(data));
            const objdata = {};
            data.forEach((value, key) => (objdata[key] = value));
            console.log(objdata);
            
            objdata.ganancias = []
            // console.log(e.target)
            let divsForma = e.target.querySelectorAll('#divForma') || false
            if (divsForma) {
                for (let index = 0; index < divsForma.length; index++) {
                    const element = divsForma[index];
                    let forma = element.querySelector('#forma').value
                    let precio = element.querySelector('#precio').innerHTML
                    let ganancia = element.querySelector('#ganancia').value
                    let precioactivo = element.querySelector('#precioactivo').checked ? true : false
                    objdata.ganancias.push({
                        forma, ganancia, activo: precioactivo, precio
                    })
                }
            }

            btnActualizar.classList.add('border-warning')
            btnActualizar.innerHTML = loading
            try {
                const res = await fetch( '/api/products/admin/update/costosYganancias', {
                    method: 'POST',
                    body: JSON.stringify({data:objdata}),  
                    headers: {
                        "Content-Type": "application/json"
                      }
                  });
            
                const resData = await res.json();
            if(resData.status == 'ok'){
                btnActualizar.innerHTML = 'Actualizado'
                btnActualizar.classList.add('border-success')
                btnActualizar.classList.remove('border-warning')

            }else{
                btnActualizar.innerHTML = 'Reintentar'
                btnActualizar.classList.add('border-danger-subtle')
                btnActualizar.classList.remove('border-warning')
                btnActualizar.classList.remove('border-success')

            }
                console.log(resData);
              } catch (err) {
                console.log(err.message);

                    btnActualizar.innerHTML = 'Reintentar'
                    btnActualizar.classList.add('border-danger-subtle')
                    btnActualizar.classList.remove('border-warning')
                    btnActualizar.classList.remove('border-success')

              }
        }
        containerArticulos.appendChild(div)
    });
}

/*



// Editar costos masivamente

let inputPorcentajeIncremento = document.querySelector('#inputPorcentajeIncremento')
let btnAplicarIncremento = document.querySelector('#btnAplicarIncremento')
let sectProgreso = document.querySelector('#sectProgreso')
let barProgreso = document.querySelector('#barProgreso')
let verde = barProgreso.querySelector('#verde')
let rojo = barProgreso.querySelector('#rojo')
let alertasProgreso = document.querySelector('#alertasProgreso')


btnAplicarIncremento.addEventListener('click', async e => {
    // console.log('aguarde')

    sectProgreso.classList.remove('d-none')
    alertasProgreso.innerHTML = `Aumentando costos un ${inputPorcentajeIncremento.value}% <br>`
    btnAplicarIncremento.disabled  = true

    try {
        let articulos = await getProductsFetch()


    let totalActualizados = 0
    let totalErrores = 0

    await articulos.forEach( async (articulo, index) => {
        try {
            articulo.costo =  Math.ceil(articulo.costo * (inputPorcentajeIncremento.value / 100 + 1) )
            articulo.fecha = hoy

            const res = await fetch( '/admin/actualizarCosto/', {
                method: 'POST',
                body: JSON.stringify({data:articulo}),  
                headers: {
                    "Content-Type": "application/json"
                  }
              });
        
            const resData = await res.json();
            if(resData.rowCount){
                console.log(articulo.titulo)
                console.log(articulo.costo)
                totalActualizados += 1
                verde.style.width = (totalActualizados * 100 / articulos.length ) + '%'
                verde.innerHTML = `${totalActualizados} / ${articulos.length}`
                if (totalActualizados == articulos.length) {
                    verde.innerHTML = 'Completado!'
                }
                // alertasProgreso.innerHTML += `-ok: - ${articulo.titulo} <br>` 

            } else {
                totalErrores += 1
                rojo.style.width = (totalErrores * 100 / articulos.length ) + '%'
                rojo.innerHTML = `${totalErrores} / ${articulos.length}`
                alertasProgreso.innerHTML += `-Eror con: - ${articulo.titulo} <br>` 
            }
            console.log(index, articulo)
            console.log(resData)
            
            
        } catch (error) {
            console.log(error)
            totalErrores += 1
            rojo.style.width = (totalErrores * 100 / articulos.length ) + '%'
            rojo.innerHTML = `${totalErrores} / ${articulos.length}`
            alertasProgreso.innerHTML += `-Eror con: - ${articulo.titulo} <br> ${error} <br>` 
        }
    })

} catch (error) {
    alertasProgreso.innerHTML = `Error de conexión vuelva a intentar`
    btnAplicarIncremento.disabled  = false
}
    btnAplicarIncremento.disabled  = false
    inputPorcentajeIncremento.value = 0
    mostrarArticulos() 

})

// Filtrar articulos por titulo o proveedor, con opciones q muestren los proveedores

let formFiltrar = document.querySelector('#formFiltrar')
let btnFiltrar = document.querySelector('#btnFiltrar')
let inputFiltrar = document.querySelector('#inputFiltrar')
let btnReset = document.querySelector('#btnReset')

formFiltrar.addEventListener('submit', e => {
    e.preventDefault()
    let arrayArticulos = containerArticulos.querySelectorAll('#formProducto')
    let queryAfiltrar = inputFiltrar.value.toUpperCase()

    for (let index = 0; index < arrayArticulos.length; index++) {
        const divArticulo = arrayArticulos[index];
        let tituloArticulo = divArticulo.querySelector('#tituloArticulo').innerHTML.toUpperCase()
        let proveedorArticulo = divArticulo.querySelector('#inputProveedor').value.toUpperCase()

        if( tituloArticulo.includes(queryAfiltrar) || proveedorArticulo.includes(queryAfiltrar) ){
            divArticulo.classList.remove('d-none')
        } else {
            divArticulo.classList.add('d-none')
        }
    }
})

btnReset.onclick = function (e) {
    let arrayArticulos = containerArticulos.querySelectorAll('#formProducto')
    for (let index = 0; index < arrayArticulos.length; index++) {
        const element = arrayArticulos[index];
        element.classList.remove('d-none')
    }    
}


// pausar todos los precios

let btnPausarPrecios = document.querySelector('#btnPausarPrecios')

btnPausarPrecios.onclick = async function () {
    
    sectProgreso.classList.remove('d-none')
    alertasProgreso.innerHTML = `Pausando todos los precios ... <br>`
    btnAplicarIncremento.disabled  = true
    btnPausarPrecios.disabled  = true

    try {
        let articulos = await getProductsFetch()


    let totalActualizados = 0
    let totalErrores = 0

    await articulos.forEach( async (articulo, index) => {
        try {
            articulo.precioactivo = 0

            const res = await fetch( '/admin/actualizarCosto/', {
                method: 'POST',
                body: JSON.stringify({data:articulo}),  
                headers: {
                    "Content-Type": "application/json"
                  }
              });
        
            const resData = await res.json();
            if(resData.rowCount){
               
                totalActualizados += 1
                verde.style.width = (totalActualizados * 100 / articulos.length ) + '%'
                verde.innerHTML = `${totalActualizados} / ${articulos.length}`
                if (totalActualizados == articulos.length) {
                    verde.innerHTML = 'Completado!'
                }

            } else {
                totalErrores += 1
                rojo.style.width = (totalErrores * 100 / articulos.length ) + '%'
                rojo.innerHTML = `${totalErrores} / ${articulos.length}`
                alertasProgreso.innerHTML += `-Eror con: - ${articulo.titulo} <br>` 
            }
            
            
        } catch (error) {
            console.log(error)
            totalErrores += 1
            rojo.style.width = (totalErrores * 100 / articulos.length ) + '%'
            rojo.innerHTML = `${totalErrores} / ${articulos.length}`
            alertasProgreso.innerHTML += `-Eror con: - ${articulo.titulo} <br> ${error} <br>` 
        }
    })

} catch (error) {
    alertasProgreso.innerHTML = `Error de conexión vuelva a intentar`
    btnAplicarIncremento.disabled  = false
    btnPausarPrecios.disabled  = false
}
    btnAplicarIncremento.disabled  = false
    inputPorcentajeIncremento.value = 0
    btnPausarPrecios.innerHTML = 'Precios pausados'
    mostrarArticulos() 
}



// Activar todos los precios

let btnActivarPrecios = document.querySelector('#btnActivarPrecios')

btnActivarPrecios.onclick = async function () {
    
    sectProgreso.classList.remove('d-none')
    alertasProgreso.innerHTML = `Activando todos los precios ... <br>`
    btnAplicarIncremento.disabled  = true
    btnActivarPrecios.disabled  = true

     try {
        let articulos = await getProductsFetch()


    let totalActualizados = 0
    let totalErrores = 0

    await articulos.forEach( async (articulo, index) => {
        try {
            articulo.precioactivo = 1
          

            const res = await fetch( '/admin/actualizarCosto/', {
                method: 'POST',
                body: JSON.stringify({data:articulo}),  
                headers: {
                    "Content-Type": "application/json"
                  }
              });
        
            const resData = await res.json();
            if(resData.rowCount){
               
                totalActualizados += 1
                verde.style.width = (totalActualizados * 100 / articulos.length ) + '%'
                verde.innerHTML = `${totalActualizados} / ${articulos.length}`
                if (totalActualizados == articulos.length) {
                    verde.innerHTML = 'Completado!'
                }

            } else {
                totalErrores += 1
                rojo.style.width = (totalErrores * 100 / articulos.length ) + '%'
                rojo.innerHTML = `${totalErrores} / ${articulos.length}`
                alertasProgreso.innerHTML += `-Eror con: - ${articulo.titulo} <br>` 
            }
            
            
        } catch (error) {
            console.log(error)
            totalErrores += 1
            rojo.style.width = (totalErrores * 100 / articulos.length ) + '%'
            rojo.innerHTML = `${totalErrores} / ${articulos.length}`
            alertasProgreso.innerHTML += `-Eror con: - ${articulo.titulo} <br> ${error} <br>` 
        }
    })

} catch (error) {
    alertasProgreso.innerHTML = `Error de conexión vuelva a intentar`
    btnAplicarIncremento.disabled  = false
    btnActivarPrecios.disabled  = false
}
    btnAplicarIncremento.disabled  = false
    inputPorcentajeIncremento.value = 0
    btnActivarPrecios.innerHTML = 'Precios Activados'
     await mostrarArticulos() 
}

 */