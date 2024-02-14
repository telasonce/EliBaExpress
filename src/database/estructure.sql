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
    proveedor: ''
}