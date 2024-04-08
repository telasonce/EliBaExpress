
var loading = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`

let IpedidoRealizado = document.querySelector('#IpedidoRealizado')
let IpedidoActualizado = document.querySelector('#IpedidoActualizado')
let btnCancelarPedido = document.querySelector('#btnCancelarPedido')
let formEnviarComentario = document.querySelector('#formEnviarComentario')
let btnWhAnunciarCambios = document.querySelector('#btnWhAnunciarCambios')
let btnWhAnunciarCambios2 = document.querySelector('#btnWhAnunciarCambios2')
let formDatosDeEnvio = document.querySelector('#formDatosDeEnvio')
let datesEstados = document.querySelectorAll('#dateEstado')
let datesPagos = document.querySelectorAll('#datePago')

IpedidoRealizado.innerHTML = moment(  Number(IpedidoRealizado.innerHTML) ).format('l LT') + '<br>' + moment(  Number(IpedidoRealizado.innerHTML) ).startOf().fromNow()
IpedidoActualizado.innerHTML = moment(  Number(IpedidoActualizado.innerHTML) ).startOf().fromNow()

for (let index = 0; index < datesEstados.length; index++) {
    const dateEstado = datesEstados[index];
    dateEstado.innerHTML = '('+ moment(  Number(dateEstado.innerHTML) ).format('l LT') + ')'
}
for (let index = 0; index < datesPagos.length; index++) {
    const datePago = datesPagos[index];
    datePago.innerHTML = '('+ moment( (datePago.innerHTML) ).format('l LT') + ')'
}
// moment.locale()
// console.log( moment(  Number(IpedidoRealizado.innerHTML) ).format('l') )
// console.log( moment(  Number(IpedidoRealizado.innerHTML) ).format('LT') )
// console.log( 'day ',moment(  Number(IpedidoRealizado.innerHTML) ).startOf('day').fromNow() )
// console.log( 'hour ',moment(  Number(IpedidoRealizado.innerHTML) ).startOf('hour').fromNow() )
// console.log( 'minut ',moment(  Number(IpedidoRealizado.innerHTML) ).startOf('minut').fromNow() )
// console.log( 'socond ',moment(  Number(IpedidoRealizado.innerHTML )- 6612121212 ).startOf().fromNow() )
// console.log( 'socond ',moment(  Date.now() - 432000000 ).startOf().fromNow() ) // hace 5 dias
// moment(); 
if (btnCancelarPedido) {
    
    btnCancelarPedido.addEventListener('click', async e=>{
        e.preventDefault()
        e.target.innerHTML = loading
        e.target.parentElement.parentElement.parentElement.querySelector('button').innerHTML = loading
        let idpedido = e.target.attributes.idpedido.value
        
        try {
            const res = await fetch( '/pedidos/api/actualizar/cancelar', {
                method: 'POST', 
                body: JSON.stringify({idpedido}),  
                headers: {  "Content-Type": "application/json" },
            });
            
            const resData = await res.json();
            console.log(resData)
            if(resData.status == 'ok'){
                e.target.parentElement.parentElement.parentElement.querySelector('button').innerHTML = '✅'
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
            e.target.innerHTML = 'Reintentar Cancelar Pedido'
            e.target.parentElement.parentElement.parentElement.querySelector('button').innerHTML = 'Reintentar Cancelar Pedido'
        }
        
    })
}

// btnWhAnunciarCambios  link al whatsapp
let linkWhAnunciarCambios = 'https://wa.me/5491130201084/?text='+  encodeURIComponent(location.href +'\n\nHola EliBaExpress!!\nEste es mi pedido, pueden llamarme para coordinar detalles.\nGracias!')
btnWhAnunciarCambios.setAttribute("href", linkWhAnunciarCambios)
if (btnWhAnunciarCambios2) {   
    btnWhAnunciarCambios2.setAttribute("href", linkWhAnunciarCambios)
}

// guardar comentario y bloquear btn si fue enviado,
if (formEnviarComentario) {
    
    formEnviarComentario.addEventListener('submit', async e=>{
        e.preventDefault()
        // e.target.innerHTML = loading
        e.target.querySelector('button').innerHTML = loading
        e.target.querySelector('button').disabled = true 
        let idpedido = e.target.attributes.idpedido.value
        let comentario = e.target.querySelector('#textAreaComentario').value
        try {
            const res = await fetch( '/pedidos/api/actualizar/guardarComentario', {
                method: 'POST', 
                body: JSON.stringify({idpedido, comentario}),  
                headers: {  "Content-Type": "application/json" },
            });
            
            const resData = await res.json();
            console.log(resData)
            if(resData.status == 'ok'){
                e.target.querySelector('button').innerHTML = 'Comentario enviado ✅'
                // window.location.reload()
            } else {
                e.target.querySelector('button').innerHTML = 'Reintentar enviar Comentario'
                e.target.querySelector('button').disabled = false 
            }
        } catch (error) {
            console.log(error)
            e.target.querySelector('button').innerHTML = 'Reintentar enviar Comentario'
            e.target.querySelector('button').disabled = false 
        }
        
    })
}


// guardar  datos de envio
if (formDatosDeEnvio) {
    
    formDatosDeEnvio.addEventListener('submit', async e=>{
        e.preventDefault()

        e.target.querySelector('button').innerHTML = loading
        e.target.querySelector('button').disabled = true 
        let idpedido = e.target.attributes.idpedido.value

        const formData = new FormData(formDatosDeEnvio);
        var object = {};
        formData.forEach(function(value, key){ object[key] = value; });

        try {
            const res = await fetch( '/pedidos/api/actualizar/datosDeEnvio', {
                method: 'POST', headers: {  "Content-Type": "application/json" },
                body: JSON.stringify({idpedido, data:object}),  
            });
            
            const resData = await res.json();
            console.log(resData)
            e.target.querySelector('button').disabled = false 
            if(resData.status == 'ok'){
                e.target.querySelector('button').innerHTML = 'Datos Guardados ✅'
                // window.location.reload()
            } else {
                e.target.querySelector('button').innerHTML = 'Reintentar Guardar Datos'
            }
        } catch (error) {
            console.log(error)
            e.target.querySelector('button').innerHTML = 'Reintentar Guardar Datos'
            e.target.querySelector('button').disabled = false 
        }
        
    })
}