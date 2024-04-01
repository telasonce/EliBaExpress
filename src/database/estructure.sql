-- tabla users
let users = {
    idUser: resultAllUsers.length, 
    email, 
    createdAt: Date.now(), 
    isActive: 1, 
    nombre:'', apellido:'', 
    dni:0, 
    nacimiento:'', 
    verificado: false, 
    dispositivosVinculados: [],
    token:'', 
    isAdmin: true,
}

-- tabla products
products = {
    titulo: dataProduct.titulo,
    descripcion: dataProduct.descripcion,
    isActive: false,
    imagenes: [{url,fileId}],
    vistas: 0,
    costo: 0,
    ganancias: [{forma, ganancia, activo, precio}],
    updatedAt: Date.now(),
    etiquetas:'', // por cada ',' lo separa
    categoria:'',
    proveedor: '',
    unidadDeMedida: 'kg. o m. o rollo o u.',
    stock: [
        {
            codStock:879879
            ganancia:30,
            descripcion:'',
            precio:23000,
            disponibilidad: [
                {
                    cod:89989,
                    cantidadDisponible:10,
                    color: 'Azul',
                    medida: 100,
                    isActive:true
                }
            ]
        }
    ]
}

localStorege : 
carrito: [
    { 
        cantidad, cod, codStock
     },
]
 [
    { 
        cantidad:1 , cod:"1054038123630", codStock:"1711652818600"
     }
]

/verificarStock retorna:
    { message:'Get pruducts, carrito, colores', status:'ok', 
    data: {allProducts:products, colores, productsDisponiblesOnline, carritoVerificado, carritoAmostrar} }
carritoAmostrar: [
    {itemCarrito:item, disponibilidad, product}
]
-- carritoUpdatedAt: 098098 Date.now()