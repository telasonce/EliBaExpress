
window.onload = async function e (){
    let products = await getProductsFetch()
    let colores = await getColoresFetch()
    console.log(products, colores);

    renderizarCards(products, colores)
    acomodarColoresEnModal(colores)
} // fin window.onload

var loading = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`

async function getProductsFetch() {
    try {
        const response = await fetch("/api/products/getAllProductsActive");
        const jsonResponse = await response.json();
        // console.log(jsonResponse);
        if (jsonResponse.status == 'ok') {
            return jsonResponse.data
        } else {
            return 'error'
        }
        
    } catch (error) {
        return 'error'
    }
  }
async function getColoresFetch() {
    try {
        const response = await fetch("/api/colores/get");
        const jsonResponse = await response.json();
        // console.log(jsonResponse);
        if (jsonResponse.status == 'ok') {
            return jsonResponse.data
        } else {
            return 'error'
        }
        
    } catch (error) {
        return 'error'
    }
  }

//   let containerArticulos

  function renderizarCards(products = [], colores = []) {

    // products.sort(function (a, b) {
    //     if (a[titulo] < b[titulo]) {
    //       return 1;
    //     }
    //     if (a[titulo] > b[titulo]) {
    //       return -1;
    //     }
    //     return 0;
    //   });

      let sectionContainerArticulos = document.querySelector('#containerArticulos')
      sectionContainerArticulos.innerHTML = ''
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        
        // agrego a la lista de opciones los productos
        let listaOptionsFiltro = document.querySelector('#listaOptionsFiltro')
        listaOptionsFiltro.innerHTML += `<option value="${product.titulo}">`

        // agrego section para editar stock
        const sectionArt = document.createElement("section");
        sectionArt.classList.add('mx-auto', 'my-3', 'fondoGradient')
        sectionArt.style.width = '20cm'
        sectionArt.innerHTML += `
            <p class="text-decoration-underline fw-bold" id="PtituloProducto" >${product.titulo}</p>
            <div>
                
                <article>
                    <label class="form-label  w-25">Unidad de Medida</label>
                    <select class="form-select d-inline w-50" id="selectUnidadMedida" >
                        <option>seleccionar</option>
                        <option ${product.unidadDeMedida == 'mts.' ? 'selected' : ''} value="mts." selected>mts.</option>
                        <option ${product.unidadDeMedida == 'kg.' ? 'selected' : ''} value="kg.">kg.</option>
                        <option ${product.unidadDeMedida == 'rollo' ? 'selected' : ''} value="rollo">rollo</option>
                        <option ${product.unidadDeMedida == 'u.' ? 'selected' : ''} value="u.">u.</option>
                    </select>
                    <label id="feedbakUdeMedida" class="form-label d-inline w-25"></label>
                </article>
    
                <section id="sectStock">
                    
                </section>
                <div class="align-items-center">
                    <button type="button" id="btnAgregarStock" class="btn btn-outline-light  my-1">Agregar Stock</button>
                    <button type="button" id="btnGuardar" class="btn btn-success ms-3 my-1">Guardar</button>
                    <label id="feedbakSection" class="form-label d-inline w-25 ms-3"></label>
                </div>
                
            </div>
            `

            let selectUnidadMedida = sectionArt.querySelector('#selectUnidadMedida')
            let feedbakUdeMedida = sectionArt.querySelector('#feedbakUdeMedida')
            let btnAgregarStock = sectionArt.querySelector('#btnAgregarStock')
            let sectStock = sectionArt.querySelector('#sectStock')
            let btnGuardar = sectionArt.querySelector('#btnGuardar')
            let feedbakSection = sectionArt.querySelector('#feedbakSection')
            let btnAgregarDisponibilidad = sectionArt.querySelector('#btnAgregarDisponibilidad')



            selectUnidadMedida.addEventListener('change', async e => {
                try {
                    feedbakUdeMedida.innerHTML = loading
                    const res = await fetch( '/api/products/admin/update/unidadDeMedida', {
                        method: 'POST', 
                        body: JSON.stringify({idProduct: product._id, unidadDeMedida: selectUnidadMedida.value}),  
                        headers: {  "Content-Type": "application/json" },
                      });
                
                    const resData = await res.json();
    
                    if(resData.status == 'ok'){
                        feedbakUdeMedida.innerHTML = '✅'
                    }
                    // console.log(resData)
                } catch (error) {
                    console.log(error)
                    feedbakUdeMedida.innerHTML = 'reintentar'
                }
            }) //fin funcion guardar unidad de medida

            btnGuardar.addEventListener('click', async e =>{
                e.preventDefault()
                try {
                    e.target.innerHTML = loading
                    e.target.disabled = true
                    feedbakSection.innerHTML = loading

                    let dataStock = []
                    let artsFormsStock = sectionArt.querySelectorAll('#artFormStock')
                    
                    for (let index = 0; index < artsFormsStock.length; index++) {
                        const artFormStock = artsFormsStock[index];
                        let obj = {
                            codStock:  artFormStock.querySelector('#codStock').value || Date.now(),
                            descripcion: artFormStock.querySelector('#inputDescripcion').value,
                            ganancia: artFormStock.querySelector('#inputGanancia').value,
                            precio: artFormStock.querySelector('#labelGanancia').innerHTML,
                            disponibilidad: []
                        }

                        let divsDisponibilidad = artFormStock.querySelectorAll('#divDisponibilidad')
                        for (let index = 0; index < divsDisponibilidad.length; index++) {
                            const divDisponibilidad = divsDisponibilidad[index];
                            obj.disponibilidad.push({
                                cod: divDisponibilidad.querySelector('#cod').value || Math.ceil(Date.now() * Math.random()),
                                cantidadDisponible: divDisponibilidad.querySelector('#inputDisponibilidad').value ,
                                color: divDisponibilidad.querySelector('#selectColor').value,
                                medida: divDisponibilidad.querySelector('#inputMedida').value,
                                isActive: divDisponibilidad.querySelector('#switchStockActivo').checked ,
                            })
                            
                        }
                        // console.log(divsDisponibilidad)
                        dataStock.push(obj)
                    }
                    // console.log(dataStock)

                    const res = await fetch( '/api/products/admin/update/stock', {
                        method: 'POST', 
                        body: JSON.stringify({idProduct: product._id, dataStock}),  
                        headers: {  "Content-Type": "application/json" },
                      });
                
                    const resData = await res.json();
                    e.target.disabled = false
                    e.target.innerHTML = 'Guardar'
                    if(resData.status == 'ok'){
                        feedbakSection.innerHTML = '✅'
                    }
                    // console.log(resData)
                } catch (error) {
                    console.log(error)
                    feedbakSection.innerHTML = 'reintentar'
                }
            })

            function agregarStock(costo=0, unidadDeMedida = 'm.', descripcion='', ganancia=0, disponibilidad=[], precio=0, codStock='') {
                const artFormStock = document.createElement("article");
                artFormStock.id = 'artFormStock'
                artFormStock.classList.add('ms-2', 'border', 'rounded', 'my-1', 'p-1', 'border-warning')
                artFormStock.innerHTML = `
                <input type="hidden" id="codStock" value="${codStock}" >
                    <div>
                        <label class="form-label  w-25 mt-2">Descripcion</label>
                        <input class="form-control form-control-sm d-inline w-50" id="inputDescripcion" type="text" value="${descripcion}" placeholder="Descripcion">
                        <div class="dropdown d-inline w-25">
                            <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Quitar Stock
                            </button>
                            <ul class="dropdown-menu">
                            <li><button id="btnQuitarStock" onclick="quitarStock(this)" class="dropdown-item bg-danger text-white">Eliminar todo este stock</button></li>
                            </ul>
                        </div>
                    </div>
                    

                    <div>
                        <label class="form-label  w-25 mt-2"> % Ganancia</label>
                        <input class="form-control form-control-sm d-inline w-25" id="inputGanancia" onchange="calcularPrecio(this,${costo})" type="number" value="${ganancia}" placeholder="% Ganancia">
                        <label class="form-label  d-inline mt-2"> $ <i class="d-inline" id="labelGanancia">${precio}</i> || costo: $ ${costo}</label>
                    </div>
                    
                    <article class="ms-2">
                        <div class="container text-center">
                            <div class="row align-items-start text-decoration-underline my-2">
                                <div class="col">Disponibilidad</div>
                                <div class="col">Color</div>
                                <div class="col">Medida</div>
                                <div class="col">Acciones</div>
                            </div>
                            
                            <section id="sectDisponibilidad">
                                
                            </section>

                            <div class="row" >
                                <div class="col text-start">
                                    <button type="button" id="btnAgregarDisponibilidad" class="btn btn-outline-light btn-sm  my-3">Agregar Disponibilidad</button>
                                </div>
                            </div>
                            
                        </div>
                    </article>
                `

                function agregarDisponibilidad( cod='', cantidadDisponible=0, color='', medida=0, isActive=false) {
                    const divDisponibilidad = document.createElement("div");
                    divDisponibilidad.id = 'divDisponibilidad'
                    divDisponibilidad.classList.add('row', 'align-items-center', 'border-bottom', 'my-2', 'pb-2')
                    divDisponibilidad.innerHTML = `
                        <input type="hidden" id="cod" value="${cod}">
                            <div class="col">
                                <input class="form-control form-control-sm " type="number" id="inputDisponibilidad" placeholder="${cantidadDisponible}" value="${cantidadDisponible}"> 
                            </div>
                            <div class="col">
                                <select class="form-select form-select-sm" id="selectColor">
                                    <option selected value="${color}">${color || 'seleccionar'}</option>
                                </select>
                            </div>
                            <div class="col">
                                <div class="input-group input-group-sm">
                                    <input class="form-control form-control-sm " type="number" id="inputMedida" placeholder="${medida}" value="${medida}"> 
                                    <span class="input-group-text" id="uDeMedida">${unidadDeMedida}</span>
                                </div>
                            </div>
                            <div class="col">
                                <div class="btn-group" role="group">
                                    <button type="button" id="btnQuitarDisponibilidad" onclick="quitarDisponibilidad(this)" class="btn btn-danger btn-sm">Quitar</button>
                                    <div class="form-check form-switch mx-2">
                                        <input class="form-check-input" type="checkbox" ${isActive ? 'checked' : ''} role="switch" id="switchStockActivo">
                                        <label class="form-check-label pe-1" for="switchStockActivo">activo</label>
                                    </div>
                                </div>
                            </div>
                    `
                    colores.forEach(color => {
                        divDisponibilidad.querySelector('#selectColor').innerHTML += `<option value="${color.color}"> ${color.color} </option>`
                    })
                    artFormStock.querySelector('#sectDisponibilidad').appendChild(divDisponibilidad)
                }

                if (product.stock) {
                    disponibilidad.forEach( objDisponible =>{
                        agregarDisponibilidad(objDisponible.cod, objDisponible.cantidadDisponible, objDisponible.color, objDisponible.medida, objDisponible.isActive)
                    } )
                }

                artFormStock.querySelector('#btnAgregarDisponibilidad').addEventListener('click',e=>{
                    agregarDisponibilidad()
                })
                sectStock.appendChild(artFormStock)
            }
            btnAgregarStock.addEventListener('click',e =>{
                agregarStock(product.costo, product.unidadDeMedida)
            })

           

            // agregar stock al principio
            if (product.stock) {
                product.stock.forEach( stock => {
                    agregarStock(product.costo, product.unidadDeMedida, stock.descripcion, stock.ganancia, stock.disponibilidad, stock.precio, stock.codStock)
                });
            }

            sectionArt.addEventListener('click', e=>{
                feedbakSection.innerHTML = 'Hey, hay cambios sin guardar!!'
            })
            sectionContainerArticulos.appendChild(sectionArt)  //agrego la seccion al dom

            // function cambiosDetectados() {
            // }
      }
    }

    function quitarStock(e) {
        e.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
    }
    function quitarDisponibilidad(e) {
        e.parentElement.parentElement.parentElement.remove()
    }
    function calcularPrecio(e, costo) {
        e.parentElement.querySelector('#labelGanancia').innerHTML = costo + (e.value * costo / 100)
    }


    // filtrar productos 
    let btnFiltrar = document.querySelector('#btnFiltrar')
    let inputFiltro1 = document.querySelector('#inputFiltro1')
    let btnQuitarFiltro = document.querySelector('#btnQuitarFiltro')
    let formFiltro = document.querySelector('#formFiltro')

    formFiltro.onsubmit = e=>{
        e.preventDefault()
    }

    btnFiltrar.addEventListener('click', e=>{
        let sectionContainerArticulos = document.querySelector('#containerArticulos')
        let titulosProductos = sectionContainerArticulos.querySelectorAll('#PtituloProducto')
        
        for (let index = 0; index < titulosProductos.length; index++) {
            const tituloProducto = titulosProductos[index];
            if (tituloProducto.innerHTML.toLowerCase().includes(inputFiltro1.value.toLowerCase())) {
                tituloProducto.parentElement.classList.remove('d-none')
            } else {
                tituloProducto.parentElement.classList.add('d-none')                
            }
        }
    })
   
    btnQuitarFiltro.addEventListener('click', e=>{
        inputFiltro1.value = ''
        btnFiltrar.click()
    })


    // administrar colores 
    let btnAbrirModalColores = document.querySelector('#btnAbrirModalColores')
    let btnCerrarModalColores = document.querySelector('#btnCerrarModalColores')
    let btnCerrarModalColores2 = document.querySelector('#btnCerrarModalColores2')
    let modalColores = document.querySelector('#modalColores')
    btnAbrirModalColores.addEventListener('click',e=>{
        modalColores.classList.add('show','d-block')
    })
    btnCerrarModalColores.addEventListener('click',e=>{
        modalColores.classList.remove('show','d-block')
    })
    btnCerrarModalColores2.addEventListener('click',e=>{
        modalColores.classList.remove('show','d-block')
    })

    let inputNameNewColor = modalColores.querySelector('#inputNameNewColor')
    let inputPickerNEwColor = modalColores.querySelector('#inputPickerNEwColor')
    let btnSaveNewColor = modalColores.querySelector('#btnSaveNewColor')
    
    btnSaveNewColor.addEventListener('click',async e =>{
        // console.log('clickkk',inputNameNewColor.value.length, capitalizePalabras('hola como estas'))
        if (inputNameNewColor.value.length >= 2) {
            inputNameNewColor.value = capitalizePalabras(inputNameNewColor.value)
        try {
                
                btnSaveNewColor.value = '- - -'
                const res = await fetch( '/api/colores/admin/save', {
                    method: 'POST', 
                    body: JSON.stringify({newColor:{color: inputNameNewColor.value, html: inputPickerNEwColor.value}}),  
                    headers: {  "Content-Type": "application/json" },
                });
                
                const resData = await res.json();
                if(resData.status == 'ok'){
                    acomodarColoresEnModal( await getColoresFetch()) 
                    btnSaveNewColor.value = 'Guardar'
                    inputNameNewColor.value = ''
                    return resData.status
                }
                // console.log(resData)
            } catch (error) {
                console.log(error)
                btnSaveNewColor.value = 'Reintentar'
                return 'error'
            }
        }
    })

function acomodarColoresEnModal(colores) {
    let sectColores = modalColores.querySelector('#sectColores')
    sectColores.innerHTML = ''
    colores.forEach(color=>{
        const divFormColor = document.createElement("div");
        divFormColor.classList.add('input-group', 'mb-3', 'input-group-sm')
        divFormColor.id = 'divFormColor'
        divFormColor.innerHTML = `
            <input type="text" id="inputNameColor" class="form-control" placeholder="${color.color}" value="${color.color}">
            <input type="color" id="inputPickerColor" class="form-control form-control-color" style="max-width: 90px;" value="${color.html}">
            <span class="input-group-text" id="infoStatusColor"></span>
            <input type="button" id="btnEliminarColor" class="form-control btn btn-outline-danger btn-sm p-1" style="max-width: 40px;" value="X">
        `
        let inputNameColor = divFormColor.querySelector('#inputNameColor')
        let inputPickerColor = divFormColor.querySelector('#inputPickerColor')
        let infoStatusColor = divFormColor.querySelector('#infoStatusColor')
        let btnEliminarColor = divFormColor.querySelector('#btnEliminarColor')
        
        inputNameColor.onchange = async (e)=>{
            infoStatusColor.innerHTML = loading
            inputNameColor.value = capitalizePalabras(inputNameColor.value)
            let result = await updateColor(color._id, {color:inputNameColor.value, html:inputPickerColor.value})
            if (result == 'ok') {
                infoStatusColor.innerHTML = '✅'
            } else {
                infoStatusColor.innerHTML = 'Error'
            }
        }
        inputPickerColor.onchange = async (e)=>{
            infoStatusColor.innerHTML = loading
            inputNameColor.value = capitalizePalabras(inputNameColor.value)
            let result = await updateColor(color._id, {color:inputNameColor.value, html:inputPickerColor.value})
            if (result == 'ok') {
                infoStatusColor.innerHTML = '✅'
            } else {
                infoStatusColor.innerHTML = 'Error'
            }
        }
        btnEliminarColor.addEventListener('click', async e =>{
            e.innerHTML = loading
            try {
                const res = await fetch( '/api/colores/admin/delete', {
                    method: 'POST', 
                    body: JSON.stringify({idColor:color._id}),  
                    headers: {  "Content-Type": "application/json" },
                  });
            
                const resData = await res.json();
                if(resData.status == 'ok'){
                    e.target.parentNode.remove()
                    return resData.status
                }
            } catch (error) {
                console.log(error)
                e.innerHTML = 'XX'
                return 'error'
            }
        })
        sectColores.appendChild(divFormColor)
    })

    async function updateColor(idColor, data ) {
        try {
            const res = await fetch( '/api/colores/admin/update', {
                method: 'POST', 
                body: JSON.stringify({idColor, data}),  
                headers: {  "Content-Type": "application/json" },
              });
        
            const resData = await res.json();
            if(resData.status == 'ok'){
                return resData.status
            }
        } catch (error) {
            console.log(error)
            return 'error'
        }
    }
}

function capitalizePalabras(texto) {
    return texto.toLowerCase().split(' ').map(palabra=>{
        return palabra.charAt(0).toUpperCase() + palabra.slice(1)
    }).join(' ')
}