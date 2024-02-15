// loginApiController
require('dotenv').config();


const mongoDb = require('../../database/configMongoDb.js')
const ObjectId = require('mongodb').ObjectId;

var randtoken = require('rand-token');
const sendEmail = require('../../functions/sendEmail')
const axios = require('axios');
// var moment = require('moment');
const bcrypt = require('bcryptjs')



    // ************ https://www.marlonfalcon.com/posts/encriptar-y-desencriptar-en-javascript
    function encrypt_data(string) {
    string = unescape(encodeURIComponent(string));
    var newString = '',
      char, nextChar, combinedCharCode;
    for (var i = 0; i < string.length; i += 2) {
      char = string.charCodeAt(i);
  
      if ((i + 1) < string.length) {
  
  
        nextChar = string.charCodeAt(i + 1) - 31;
  
  
        combinedCharCode = char + "" + nextChar.toLocaleString('en', {
          minimumIntegerDigits: 2
        });
  
        newString += String.fromCharCode(parseInt(combinedCharCode, 10));
  
      } else {
  
  
        newString += string.charAt(i);
      }
    }
    return newString.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(4, "0"), "");
    }
    function decrypt_data(string) { // lo uso en el middleware
    
        var newString = '',
        char, codeStr, firstCharCode, lastCharCode;
        string = string.match(/.{1,4}/g).reduce((acc, char) => acc + String.fromCharCode(parseInt(char, 16)), "");
        for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        if (char > 132) {
            codeStr = char.toString(10);
    
            firstCharCode = parseInt(codeStr.substring(0, codeStr.length - 2), 10);
    
            lastCharCode = parseInt(codeStr.substring(codeStr.length - 2, codeStr.length), 10) + 31;
    
            newString += String.fromCharCode(firstCharCode) + String.fromCharCode(lastCharCode);
        } else {
            newString += string.charAt(i);
        }
        }
        return newString;
    }

  module.exports = {

    apiLogin: async function (req, res) {

        let email = req.body.email.toLowerCase().trim()
        let password = req.body.password
        let userIP = req.body.userIP
        // let dispositivo = req.body.dispositivo
        let locationUser = req.body.locationUser
        let lugar = `${locationUser.region} - ${locationUser.country}`
    
        let tokenRecapcha = req.body.tokenRecapcha
        let funcionRecapcha = await validarRecapcha(tokenRecapcha)
        funcionRecapcha = JSON.parse(funcionRecapcha)
        console.log( funcionRecapcha )
        let recapchaValid = funcionRecapcha.data.tokenProperties.valid
       if( !recapchaValid ){
         return res.json({ ok: false, status: 'error', email: false, password: false, funcionRecapcha, messaje: 'Robot Detectado', recapchaValid});
       }
    
        const result = await mongoDb.findDocuments('users', {email: email})

        let userToLogin = result.length > 0 ? result[0] : false
    
        let isOkThePassword = userToLogin ? bcrypt.compareSync(password, userToLogin.password) : false;
    
        if (isOkThePassword && userToLogin.isActive == 1) {
          delete userToLogin.password;
          req.session.userLogged = userToLogin;
    
          // guardo en cookie y la sesion en db
          res.cookie('usu', encrypt_data(email), { maxAge: ((1000 * 60) * 60 * 24 * 20) }) //dura 20 dias
          
          // guardo la ip y lugar, si no esta guardado
          let ipEncontrado = false
          userToLogin.dispositivosVinculados.map(dispositivo=>{
              dispositivo.ip == userIP ? ipEncontrado = true : null
            })
            if(!ipEncontrado){
                let newArrayDispositivos = userToLogin.dispositivosVinculados
                newArrayDispositivos.push({ip:userIP, lugar:lugar, date:Date.now(), sesiones: []})
                mongoDb.updateDocuments('users',{email: email },{ dispositivosVinculados: newArrayDispositivos})
            }

          res.json({ ok: true, status: 'verificado', email: true, password: true, messaje: 'Usuario logueado ' + email });
        }
    
        else if (!isOkThePassword && userToLogin && userToLogin.email == email) {
          return res.json({ ok: false, status: 'error', email: true, password: false, messaje: 'contraseña incorrecta ' });
        }
    
        else if (userToLogin.email == email && userToLogin.isActive == 0) {
          return res.json({ ok: false, status: 'error', email: true, password: true, messaje: 'El usuario se encuentra temporalmente deshabilitado ' });
        } else {
          return res.json({ ok: false, status: 'error', email: false, password: false, messaje: 'No se encuentra su email en nuestra base de datos, por favor regístrese primero!' });
        }
        mongoDb.finalizarConexion()
      },
    apiRegistro: async function (req,res){

        let email = req.body.email.toLowerCase().trim()
        let tokenRecapcha = req.body.tokenRecapcha
  
        function validarEmail(valor) {
          re=/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
          if(re.exec(valor)){ return true } else { return false}
        }
  
        if(!validarEmail(email)){
          return res.json({ ok: false, status: 'error', emailInDb: false, solicitudEnviada:false, messaje: 'El email no es valido' });
        }
        
        let funcionRecapcha = await validarRecapcha(tokenRecapcha)
         funcionRecapcha = JSON.parse(funcionRecapcha)
         let recapchaValid = funcionRecapcha.data.tokenProperties.valid
        // console.log( funcionRecapcha )
        if( !recapchaValid ){
          return res.json({ ok: false, status: 'error', emailInDb: false, solicitudEnviada:false, messaje: 'Robot Detectado', recapchaValid});
        }
  
        const resultAllUsers = await ( mongoDb.findDocuments('users', {email : email}) )
  
          if(resultAllUsers.length > 0){
            return res.json({ ok: false, status: 'error', emailInDb: true, solicitudEnviada:false, messaje: 'Su email ya está registrado, puedes iniciar sesión' });
          } else {
          
          //envio del email de verificacion
          var token = randtoken.generate(20);
           var sent = await sendEmail(email, 'Bienvenido! creá tu nueva contraseña.', contEmailHtmlRegisterNewPassword(email,token))
          if (sent.sent ) { // si fue enviado el email

          const resultInsertedUser = await mongoDb.insertDocuments('users',[{
            idUser: resultAllUsers.length, email, createdAt: Date.now(), 
            isActive: 1, token, nombre:'', apellido:'', dni:0, nacimiento:'', 
            verificado: false, dispositivosVinculados: []
          }] )
            console.log(resultInsertedUser)
            mongoDb.finalizarConexion()
          return res.json({ ok: true, status: 'ok', emailInDb: true, solicitudEnviada:true, messaje: `Enviamos un email a ${email}, para que lo verifiques y crees una nueva contraseña. Te damos la bienvenida!!` });
   
        } else {
            return res.json({ ok: false, status: 'error', emailInDb: false, solicitudEnviada:false, messaje: `Ocurrio un error, ${email}` });
          }
  
          }
          
      },
      validarRecapcha: async function (tokenRecapcha) { 
        //console.log('validarRecapcha')
  
         function stringify(obj) {
          let cache = [];
          let str = JSON.stringify(obj, function(key, value) {
            if (typeof value === "object" && value !== null) {
              if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
              }
              // Store value in our collection
              cache.push(value);
            }
            return value;
          });
          cache = null; // reset the cache
          return str;
        }
  
         let databody = {"event": {
          "token": tokenRecapcha,
          "expectedAction": "LOGIN",
          "siteKey": process.env.SiteKey_recapcha
        }}
        // let axiosRecapcha =  await axios.post('https://recaptchaenterprise.googleapis.com/v1/projects/recapchatelasonc-1702043749029/assessments?key='+process.env.ApiKey_Recapcha, databody )
        let axiosRecapcha =  await axios.post('https://recaptchaenterprise.googleapis.com/v1/projects/elibaexpress/assessments?key='+process.env.ApiKey_Recapcha, databody )
               .then(function (response) {
          // console.log(response);
          // console.log('respuesta recapcha');
  
                return stringify(response)
        })
        .catch(function (error) {
          console.log('error');
          return stringify(error)
        });
  
        return axiosRecapcha
      },

      apiUpdatePassword: async (req,res) => {

        var token = req.body.token;
        var email = req.body.email.toLowerCase();
        var password = req.body.password;
      
          const result = await mongoDb.findDocuments('users', {email:email, token: token})
  
          if(result.length > 0 && result[0].token == token){

            const result = await mongoDb.updateDocuments('users',{token:token},{token:'',password: bcrypt.hashSync(password, 10), verificado: true})
            mongoDb.finalizarConexion()
                return res.json({ ok: result.modifiedCount==1, status: 'ok', emailInDb: true, tokenCorrecto:true, messaje: `Tu contraseña fue actualizada con exito!!` });
            } else {
                return res.json({ ok: false, status: 'ok', emailInDb: false, tokenCorrecto:false, messaje: `Error, token o email invalidos, prueba utilizar el link correcto` });
            }
            
      },

      apiGuardarNombreDispositivoVinculado: async (req,res) => {
        let user = req.session.userLogged
        // console.log('userLogged:  ',user)
        let ip = req.body.ip
        let nombreNewDispositivo = req.body.nombreNewDispositivo
        let cod = Date.now()
  
        if(user && ip && nombreNewDispositivo && cod){
  
          // traigo dispositivos con ip
          let users = await mongoDb.findDocuments('users', { email:user.email  })
        //   console.log(users)
          if (users.length > 0) {
            let newArrayDispositivos = users[0].dispositivosVinculados.map(dispositivo => {
                if (dispositivo.ip == ip) {
                    dispositivo.sesiones.push({cod:cod, active:true, nomb:nombreNewDispositivo})  
                } 
                return dispositivo
            })
            mongoDb.updateDocuments('users',{email:user.email},{dispositivosVinculados:newArrayDispositivos}).then(mongoDb.finalizarConexion())
          }

            if(req.cookies.ses){
              let ses = JSON.parse(decrypt_data(req.cookies.ses))
              ses.push(cod)
              let ses2 = JSON.stringify(ses)
              res.cookie('ses', encrypt_data(ses2), { maxAge: ((1000 * 60) * 60 * 24 * 30) }) //dura 30 dias
            } else {
              let ses = JSON.stringify([cod])
              res.cookie('ses', encrypt_data(ses), { maxAge: ((1000 * 60) * 60 * 24 * 30) }) //dura 30 dias
            }
            // console.log(res.cookie)
  
            return res.json({ ok: true, guardado:true, messaje: `Sesion guardada` });
          
          } else {
            return res.json({ ok: false, messaje: `Error, debe estar logueado` });
          }
      },

      apiRecuperarPassword: async (req,res) => {

        var email = req.body.email;
      const result = await mongoDb.findDocuments('users', {email:email})
  
      if(result.length > 0 && result[0].email == email){
          
              var token = randtoken.generate(20);
              var sent = sendEmail(email, 'Recupera tu cuenta!', contEmailHtmlUpdatePassword(email,token));
  
              if (sent != '0') { // fue enviado el email
                const result = await mongoDb.updateDocuments('users',{email:email},{token:token})
                mongoDb.finalizarConexion()
                return res.json({ ok: true, status: 'ok', emailInDb: true, result:result.modifiedCount, solicitudEnviada:true, messaje: `Fue enviado el link de recuperacion de contraseña al email: ${email}, para que lo verifiques y crees una nueva contraseña.   Exitos!` });
  
              } else {                
                  return res.json({ ok: false, status: 'error', emailInDb: true, solicitudEnviada:false, messaje: 'Ocurrio un error, prueba mas tarde' });
              }
  
          } else {
              return res.json({ ok: false, status: 'no registrado', emailInDb: false, solicitudEnviada:false, messaje: `No tenemos registrado el email: ${email}, complete el formulario de registro!` });
          }
          
      },
      cerrarSesion: async (req,res)=>{
        res.clearCookie('usu');
        req.session.destroy();
        return res.redirect('back');
        },

}

let contEmailHtmlRegisterNewPassword = function (email, token) {
    return `
    <div style="text-align:center; border:1px black solid; max-width:fit-content; margin:15px auto; padding:15px; color:'black'; border-radius:10px">
        <h4>Te damos la Bienvenida!!</h4>
        <h5>Te registraste en EliBaExpress, ya puedes crear tu nueva contraseña.</h5>
        <a style="color:green" href="http://localhost:3000?email=${email}&&token=${token}">Crear mi nueva contraseña</a>
        <h5>O usa el siguiente link</h5>
        <a style="color:black" href="http://localhost:3000?email=${email}&&token=${token}">http://localhost:3000?email=${email}&&token=${token}</a>
        <h6>Si no fuiste tu el que lo pediste, puedes descarlarlo. </h6>
    </div>
    `
}
let contEmailHtmlUpdatePassword = function (email, token) {
    return `
    <div style="text-align:center; border:1px black solid; max-width:fit-content; margin:15px auto; padding:15px; color:'black'; border-radius:10px">
        <h4>Actualiza tu contraseña!!</h4>
        <h5>Pediste actualizar tu contraseña en EliBaExpress, ya puedes hacerlo desde aqui:</h5>
        <a style="color:green" href="http://localhost:3000?email=${email}&&token=${token}">Crear mi nueva contraseña</a>
        <h5>O usa el siguiente link</h5>
        <a style="color:black" href="http://localhost:3000?email=${email}&&token=${token}">http://localhost:3000?email=${email}&&token=${token}</a>
        <h6>Si no fuiste tu el que lo pediste, puedes descarlarlo. </h6>
    </div>
    `
}

let validarRecapcha = async function (tokenRecapcha) { 
  //console.log('validarRecapcha')

   function stringify(obj) {
    let cache = [];
    let str = JSON.stringify(obj, function(key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = null; // reset the cache
    return str;
  }

   let databody = {"event": {
    "token": tokenRecapcha,
    "expectedAction": "LOGIN",
    "siteKey": process.env.SiteKey_recapcha  
  }}
  let axiosRecapcha =  await axios.post('https://recaptchaenterprise.googleapis.com/v1/projects/elibaexpress/assessments?key='+process.env.ApiKey_Recapcha, databody )
         .then(function (response) {
    // console.log(response);
    // console.log('respuesta recapcha');

          return stringify(response)
  })
  .catch(function (error) {
    console.log('error');
    return stringify(error)
  });

  return axiosRecapcha
}
