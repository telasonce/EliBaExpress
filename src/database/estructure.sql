-- tabla users
let users = {
    idUser: resultAllUsers.length, email, createdAt: Date.now(), 
    isActive: 1, token, nombre:'', apellido:'', dni:0, nacimiento:'', 
    verificado: false, dispositivosVinculados: [],
    token:'', 
    isAdmin: true,

}

-- tabla products
products = {
    titulo: dataProduct.titulo,
    descripcion: dataProduct.descripcion,
    isActive: false,
    imagenes: [],
    vistas: 0,
    costo: 0,
    ganancias: [],
    updatedAt: Date.now(),
    etiqueta:'',
    categoria:''
}