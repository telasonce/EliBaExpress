
const mongoDb = require('../database/configMongoDb')

const axios = require('axios');

async function decrypt_data(string) {

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



async function  userLoggedMiddleware (req, res, next) {

	 if(!req.session.userLogged){

		res.locals.isLogged = false;

		if(  req.cookies.usu != undefined && req.cookies.ses != undefined ) {
			let emailInCookie = await decrypt_data(req.cookies.usu) ;
			let sesionesEnCookiesjson = await decrypt_data(req.cookies.ses )
			let sesionesEnCookies = JSON.parse(sesionesEnCookiesjson)

			try {
				
				await axios.get('https://api.ipify.org?format=json') // busco la ip
				.then( async response =>  {
					let ipUsuario = response.data.ip
					
					const resultUsers = await mongoDb.findDocuments('users', {email: emailInCookie})
					
					let autorizado = false
					let ipEncontrado = false
					if (resultUsers.length >= 1) {
						let usuarioEncontrado = resultUsers[0]
						usuarioEncontrado.dispositivosVinculados.map(dispositivo => {
							dispositivo.ip == ipUsuario ? ipEncontrado = true : null
							dispositivo.sesiones.map( sesion => {
								sesionesEnCookies.map(cod => {
									if(sesion.cod == cod && sesion.active){
										autorizado = true 
									}
								})
							})
						})
						
						delete usuarioEncontrado.password
						
						if( emailInCookie == usuarioEncontrado.email && usuarioEncontrado.isActive == 1 && autorizado ){
							req.session.userLogged = usuarioEncontrado;
							if(!ipEncontrado){
								let newArrayDispositivos = usuarioEncontrado.dispositivosVinculados
								newArrayDispositivos.push({ip:ipUsuario, lugar:'-', sesiones: []})
								mongoDb.updateDocuments('users',{email: usuarioEncontrado.email },{ dispositivosVinculados: newArrayDispositivos})
							}
						} else {
							res.locals.emailGuardado = emailInCookie
						}
					}
				})
				// 
			} catch (error) {
				console.log(error)
				return
			}
			} else if (req.cookies.usu != undefined) {
				let emailInCookie = await decrypt_data(req.cookies.usu) ;
				res.locals.emailGuardado = emailInCookie
			}
		} 
		if (req.session.userLogged) {
			res.locals.isLogged = true;
			res.locals.userLogged = req.session.userLogged;
		} 
		next();
		
}
module.exports = userLoggedMiddleware;
