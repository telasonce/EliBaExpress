
// organizo las fechas de los pedidos
let datesPedidoCreatedAt = document.querySelectorAll('#datePedidoCreatedAt')
let datesPedidoUpdatedAt = document.querySelectorAll('#datePedidoUpdatedAt')
let datesEstados = document.querySelectorAll('#dateEstado')

for (let index = 0; index < datesPedidoCreatedAt.length; index++) {
    const datePedidoCreatedAt = datesPedidoCreatedAt[index];
    datePedidoCreatedAt.innerHTML = moment(  Number(datePedidoCreatedAt.innerHTML) ).format('l LT') + '<br>' + moment(  Number(datePedidoCreatedAt.innerHTML) ).startOf().fromNow()
}
for (let index = 0; index < datesPedidoUpdatedAt.length; index++) {
    const datePedidoUpdatedAt = datesPedidoUpdatedAt[index];
    datePedidoUpdatedAt.innerHTML = moment(  Number(datePedidoUpdatedAt.innerHTML) ).startOf().fromNow()
}
for (let index = 0; index < datesEstados.length; index++) {
    const dateEstado = datesEstados[index];
    dateEstado.innerHTML = '('+ moment(  Number(dateEstado.innerHTML) ).format('l LT') + ')'
}