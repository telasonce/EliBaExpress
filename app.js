const express = require('express');
const app = express();

// para utilizar cookies
const cookies = require('cookie-parser');
app.use(cookies());

// puerto habilitado
const PORT = process.env.PORT || 3000;

// para usar la sesion
const session = require('express-session')
app.use(session({secret:'Mensaje Secreto bla bla', resave:false ,saveUninitialized:false}))

app.use(express.static('src/public')); // Recursos estaticos
app.set("view engine", "ejs")
app.set('views', __dirname + '/src/views')  //Para cambiar de carpeta de views

const userLoggedMiddleware = require('./src/middlewares/userLoguedMiddleware');
app.use(userLoggedMiddleware);

// esto es para put y delete
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//para que el formulario llegue en formato json
app.use(express.urlencoded({ extended: false ,limit: '50mb'})); 
app.use(express.json({limit: '50mb'}));

app.listen(PORT,() => console.log("Servidor abierto en el puerto : " + PORT, 'http://localhost:' + PORT));

const rutasMain = require('./src/routes/main.routes');
app.use('/', rutasMain)

const rutasImageKit = require('./src/routes/imageKit.routes');
app.use('/imageKit', rutasImageKit)

const rutasApi = require('./src/routes/api.routes');
app.use('/api', rutasApi)

const rutasProducts = require('./src/routes/products.routes');
app.use('/products', rutasProducts)

const rutasPedidos = require('./src/routes/pedidos.routes');
app.use('/pedidos', rutasPedidos)

app.use((req,res,next)=>{
    res.status(404).render('main/not-found')
})