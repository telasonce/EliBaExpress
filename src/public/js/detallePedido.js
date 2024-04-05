
let IpedidoRealizado = document.querySelector('#IpedidoRealizado')
let IpedidoActualizado = document.querySelector('#IpedidoActualizado')
let datesEstados = document.querySelectorAll('#dateEstado')

IpedidoRealizado.innerHTML = moment(  Number(IpedidoRealizado.innerHTML) ).format('l LT') + '<br>' + moment(  Number(IpedidoRealizado.innerHTML) ).startOf().fromNow()
IpedidoActualizado.innerHTML = moment(  Number(IpedidoActualizado.innerHTML) ).startOf().fromNow()

for (let index = 0; index < datesEstados.length; index++) {
    const dateEstado = datesEstados[index];
    dateEstado.innerHTML = '('+ moment(  Number(dateEstado.innerHTML) ).format('l LT') + ')'
}
// moment.locale()
console.log( moment(  Number(IpedidoRealizado.innerHTML) ).format('l') )
console.log( moment(  Number(IpedidoRealizado.innerHTML) ).format('LT') )
console.log( 'day ',moment(  Number(IpedidoRealizado.innerHTML) ).startOf('day').fromNow() )
console.log( 'hour ',moment(  Number(IpedidoRealizado.innerHTML) ).startOf('hour').fromNow() )
console.log( 'minut ',moment(  Number(IpedidoRealizado.innerHTML) ).startOf('minut').fromNow() )
console.log( 'socond ',moment(  Number(IpedidoRealizado.innerHTML )- 6612121212 ).startOf().fromNow() )
console.log( 'socond ',moment(  Date.now() - 432000000 ).startOf().fromNow() ) // hace 5 dias
// moment(); 