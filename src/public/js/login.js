

let url = new URL(window.location);
const searchParams = url.searchParams;

let emailQuery = searchParams.get('email');
let tokenQuery = searchParams.get('token');

// console.log(url, searchParams, emailQuery, tokenQuery)

var loading = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`


let btnModalIngresar = document.querySelector('#btnModalIngresar')
let divFormIngresar = document.querySelector('#divFormIngresar')
let btncerrar = document.querySelector('#btncerrar')
let btnCerrar2 = document.querySelector('#btnCerrar2')
let bodyModalIngresar = document.querySelector('#bodyModalIngresar')
let formIngreso = document.querySelector('#formIngreso')
let divAlertaIngreso = document.querySelector('#divAlertaIngreso')
let divAlertaVerificado = document.querySelector('#divAlertaVerificado')
let divTextoRegistro = document.querySelector('#divTextoRegistro')
let feedbackbtnNewPassword = document.querySelector('#feedbackbtnNewPassword')

let inputEmailLog = document.querySelector('#inputEmailLog')
let inputPassword = document.querySelector('#inputPassword')
let inputEmailRegis = document.querySelector('#inputEmailRegis')

// let feedbackEmailLog = document.querySelector('#feedbackEmailLog')
// let feedbackPassword = document.querySelector('#feedbackPassword')
// let feedbackEmailRegis = document.querySelector('#feedbackEmailRegis')

let btnIniciarSesion = document.querySelector('#btnIniciarSesion')
let btnRecuperarCont = document.querySelector('#btnRecuperarCont')
let btnRegistrarme = document.querySelector('#btnRegistrarme')
let btnNewPassword = document.querySelector('#btnNewPassword')


// bodyModalIngresar.innerHTML = htmlLogin

divFormIngresar.classList.add('d-block') // se abre al ingresar

btnModalIngresar.addEventListener('click', async e =>{
    divFormIngresar.classList.add('d-block')
})
btncerrar.onclick = ( e =>{
    divFormIngresar.classList.remove('d-block')
})
btnCerrar2.onclick = ( e =>{
    divFormIngresar.classList.remove('d-block')
})

formIngreso.addEventListener('submit', (e) => {
    e.preventDefault()
  })

  function validateEmail($email) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test($email);
}




function validarEmail(valor) {
    re=/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
    if(re.exec(valor)){ return true } else { return false}
  }


//   login
  btnIniciarSesion.addEventListener('click', async (e) => {
    // e.preventDefault()
    if(!inputEmailLog.value || !inputPassword.value || !validarEmail(inputEmailLog.value)){
        inputPassword.classList.add('is-invalid')
        inputEmailLog.classList.add('is-invalid')
        divAlertaIngreso.innerHTML = 'Complete los datos correctamente'
        divAlertaIngreso.classList.remove('d-none')

        return
    }
    btnIniciarSesion.innerHTML = loading

    // ***** verifico recapcha
    await grecaptcha.enterprise.ready(async () => {
        // const tokenRecapcha = await grecaptcha.enterprise.execute('6LcgDiopAAAAAA0xf-wdujzO8rWOt25-RTyiPBzl', {action: 'LOGIN'});
        const tokenRecapcha = await grecaptcha.enterprise.execute('6LeYbmIpAAAAAPklcozZY4agcs1RQ3jfNQWyqi48', {action: 'LOGIN'});

    // ** verifico ip y ubicación
    getIP().then(response => {
        userIP = response.ip;
        getInfoIp(userIP).then( async locationUser => {
            
                // console.log('ip y locationUser ',{locationUser:locationUser, userIP:userIP})
                // return {locationUser:locationUser, userIP:userIP}
            
            
                
                const res = await fetch( '/api/apiLogin', {
                    method: 'POST',
                    body: JSON.stringify({email: inputEmailLog.value, password: inputPassword.value,
                         locationUser:locationUser, userIP:userIP, dispositivo:navigator.userAgent, tokenRecapcha:tokenRecapcha }),  
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                const resData = await res.json();
                console.log(resData)
                
                divAlertaIngreso.innerHTML = resData.messaje
                divAlertaIngreso.classList.remove('d-none')
                // btnIniciarSesion.innerHTML = loading
                
                if (resData.email && resData.password && resData.ok) {
                    // si esta todo ok:
                    btnIniciarSesion.innerHTML = resData.status
                    btnIniciarSesion.disabled = true
                    divAlertaVerificado.innerHTML = 'Sesión iniciada'
                    divAlertaVerificado.classList.remove('d-none')
                    mostrarInputNombDisp(userIP)
                    // if(window.location.href.includes('resetPassword')){
                    //     window.location.href = '/'
                    //     return
                    // }else{
                    //     location.reload();
                    //     return
                    // }
                }
                
                if (!resData.email && !resData.password && !resData.ok) {
                    btnIniciarSesion.innerHTML = 'Iniciar Sesion'
                    inputEmailRegis.value = inputEmailLog.value
                    inputEmailRegis.classList.add('is-valid')
                }
                
                if(resData.email) {
                    inputEmailLog.classList.remove('is-invalid')
                    inputEmailLog.classList.add('is-valid')
                    btnIniciarSesion.innerHTML = 'Iniciar Sesion'
                } else {
                    inputEmailLog.classList.add('is-invalid')
                    inputEmailLog.classList.remove('is-valid')
                    btnIniciarSesion.innerHTML = 'Iniciar Sesion'
                }
                
                if(resData.password) {
                    inputPassword.classList.remove('is-invalid')
                    inputPassword.classList.add('is-valid')
                    btnIniciarSesion.innerHTML = 'Iniciar Sesion'
                } else {
                    inputPassword.classList.add('is-invalid')
                    inputPassword.classList.remove('is-valid')
                    btnIniciarSesion.innerHTML = 'Iniciar Sesion'
                }
                
                if (resData.email && resData.password && !resData.ok) {
                    inputPassword.disabled = true
                    inputEmailLog.disabled = true
                    btnIniciarSesion.disabled = true
                    btnIniciarSesion.innerHTML = 'X'
                }
                
            });
        }); //fin api ip
    }) //fin recapcha
    })
            


//   registro ***************
  btnRegistrarme.addEventListener('click', async e =>{
    if(!inputEmailRegis.value  || !validarEmail(inputEmailRegis.value)){
        inputEmailRegis.classList.add('is-invalid')
        divAlertaIngreso.innerHTML = 'Complete correctamente el email para registrarte'
        divAlertaIngreso.classList.remove('d-none')
        return
    }
    btnRegistrarme.innerHTML = loading
    btnRegistrarme.disabled = true

    await grecaptcha.enterprise.ready(async () => {
        // const tokenRecapcha = await grecaptcha.enterprise.execute('6LcgDiopAAAAAA0xf-wdujzO8rWOt25-RTyiPBzl', {action: 'LOGIN'});
        const tokenRecapcha = await grecaptcha.enterprise.execute('6LeYbmIpAAAAAPklcozZY4agcs1RQ3jfNQWyqi48', {action: 'LOGIN'});


    const res = await fetch( '/api/apiRegistro', {
        method: 'POST',
        body: JSON.stringify({email: inputEmailRegis.value, tokenRecapcha:tokenRecapcha }),  
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    const resData = await res.json();
    console.log(resData)

    divAlertaIngreso.innerHTML = resData.messaje
    divAlertaIngreso.classList.remove('d-none')

    if (!resData.ok && resData.emailInDb && !resData.solicitudEnviada) {
        // ya esta registrado
        btnRegistrarme.innerHTML = 'Ye está Registrado'
        inputEmailRegis.disabled = true
        inputEmailRegis.classList.add('is-valid')
        inputEmailRegis.classList.remove('is-invalid')

        inputEmailLog.value = inputEmailRegis.value
        inputEmailLog.classList.add('is-valid')
        inputPassword.focus()
        
    } else if(resData.recapchaValid == 'false') {
        // Robot detectado
        btnRegistrarme.disabled = true
        btnRegistrarme.innerHTML = 'Robot detectado'
        inputEmailRegis.disabled = true

    } else if( resData.ok && resData.emailInDb && resData.solicitudEnviada ) {
        // se resistro correctmente
        btnRegistrarme.disabled = true
        btnRegistrarme.innerHTML = 'Registrado correctamente'
        inputEmailRegis.disabled = true
        inputEmailRegis.classList.add('is-valid')
        inputEmailRegis.classList.remove('is-invalid')
            
        localStorage.setItem("redirect", document.location.pathname+document.location.search);

        window.open(new URL('https://'+inputEmailRegis.value.split('@')[1]), "_blank");
    } else {
        // error o email invalido
        btnRegistrarme.disabled = false
        btnRegistrarme.innerHTML = 'Registrarme'
        inputEmailRegis.disabled = false
        inputEmailRegis.classList.add('is-invalid')
        inputEmailRegis.classList.remove('is-valid')
    }

}) // fin recapcha
  })




// Recuperar Contraseña **************
btnRecuperarCont.addEventListener('click', async e=>{

    if(!inputEmailLog.value  || !validarEmail(inputEmailLog.value)){
        inputEmailLog.classList.add('is-invalid')
        divAlertaIngreso.innerHTML = 'Complete correctamente el email para recuperar la contraseña'
        divAlertaIngreso.classList.remove('d-none')
        return
    } else {
        inputEmailLog.classList.remove('is-invalid')
        inputEmailLog.classList.add('is-valid')
    }
    btnRecuperarCont.innerHTML = loading
    btnRecuperarCont.disabled = true

    const res = await fetch( '/api/apiRecuperarPassword', {
        method: 'POST',
        body: JSON.stringify({email: inputEmailLog.value }),  
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    const resData = await res.json();
    console.log(resData)

    divAlertaIngreso.innerHTML = resData.messaje
    divAlertaIngreso.classList.remove('d-none')

    if(resData.ok && resData.emailInDb && resData.solicitudEnviada){
        // enviada
        localStorage.setItem("redirect", document.location.pathname+document.location.search);

        btnRecuperarCont.innerHTML = 'Solicitud enviada'
        window.open(new URL('https://'+inputEmailLog.value.split('@')[1]), "_blank");

    } else if(resData.status == 'error'){
        btnRecuperarCont.innerHTML = 'Error, reintente'
        btnRecuperarCont.disabled = false
        inputEmailLog.classList.add('is-invalid')
    } else if(!resData.ok && !resData.emailInDb && !resData.solicitudEnviada){
        btnRecuperarCont.innerHTML = 'Email no registrado, Recuperar contraseña'
        btnRecuperarCont.disabled = false
        inputEmailRegis.value = inputEmailLog.value
        inputEmailRegis.focus()
        inputEmailLog.classList.add('is-invalid')
    }
})



// Update  Contraseña

if(emailQuery && tokenQuery){
    inputEmailLog.value = emailQuery
    inputEmailLog.classList.add('is-valid')
    btnNewPassword.classList.remove('d-none')
    feedbackbtnNewPassword.classList.remove('d-none')
    btnIniciarSesion.classList.add('d-none')
    btnRecuperarCont.classList.add('d-none')
    divTextoRegistro.classList.add('d-none')
    

btnNewPassword.addEventListener('click', async e=>{

    if(!inputEmailLog.value  || !validarEmail(inputEmailLog.value)){
        inputEmailLog.classList.add('is-invalid')
        inputEmailLog.classList.remove('is-valid')
        divAlertaIngreso.innerHTML = 'Complete correctamente el email para recuperar la contraseña'
        divAlertaIngreso.classList.remove('d-none')
        return
    }
    if( !inputPassword.value){
        inputPassword.classList.add('is-invalid')
        inputPassword.classList.remove('is-valid')
        divAlertaIngreso.innerHTML = 'Complete correctamente su nueva contraseña'
        divAlertaIngreso.classList.remove('d-none')
        return
    }
    btnNewPassword.innerHTML = loading
    btnNewPassword.disabled = true

    const res = await fetch( '/api/apiUpdatePassword', {
        method: 'POST',
        body: JSON.stringify({email: emailQuery, token: tokenQuery, password:inputPassword.value }),  
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    const resData = await res.json();
    console.log(resData)

    divAlertaIngreso.innerHTML = resData.messaje
    divAlertaIngreso.classList.remove('d-none')

    if(resData.ok && resData.emailInDb && resData.tokenCorrecto){
        // enviada
        btnNewPassword.innerHTML = 'Actualizada correctamente'
        // window.open(new URL('https://'+inputEmailLog.value.split('@')[1]), "_blank");
        
        let click_event = new CustomEvent('click');
        btnIniciarSesion.dispatchEvent(click_event);
    } else {
        btnNewPassword.innerHTML = 'Error'
        // btnNewPassword.disabled = false
        inputEmailLog.classList.add('is-invalid')
        setTimeout(function(){
            const redirect = localStorage.getItem("redirect");
            window.location.href = (redirect || '/')
        }, 2000);
    } 
    // else if(!resData.ok && !resData.emailInDb && !resData.solicitudEnviada){
    //     btnNewPassword.innerHTML = 'Email no registrado, Recuperar contraseña'
    //     btnNewPassword.disabled = false
    //     inputEmailRegis.value = inputEmailLog.value
    //     inputEmailRegis.focus()
    //     inputEmailLog.classList.add('is-invalid')
    // }
})

}

    const getIP = async () => {
        return await fetch('https://api.ipify.org?format=json')
        .then(response => response.json());
    }

    const getInfoIp = async (ip) => {
        return await fetch('https://ipwhois.app/json/' + ip + '?lang=es')
        .then(response => response.json());
    }

 function mostrarInputNombDisp(ip) {
    let formGuardarNombLog = document.querySelector('#formGuardarNombLog')
    let inputNomblog = document.querySelector('#inputNomblog')
    let btnGuardarNombLog = document.querySelector('#btnGuardarNombLog')
    
    formGuardarNombLog.classList.remove('d-none')
    formIngreso.classList.add('d-none')
    
    formGuardarNombLog.onsubmit = async e => {
        e.preventDefault()
        btnGuardarNombLog.innerHTML = loading
        btnGuardarNombLog.disabled = true
        const res = await fetch( '/api/apiGuardarNombreDispositivoVinculado', {
            method: 'POST',
            body: JSON.stringify({ip, nombreNewDispositivo:inputNomblog.value }),  
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        const resData = await res.json();
        console.log(resData)
        btnGuardarNombLog.innerHTML = resData.messaje

        const redirect = localStorage.getItem("redirect");

        if(window.location.href.includes('resetPassword')){
            localStorage.removeItem("redirect");
            window.location.href = redirect || '/'
            return
        }else{
            if (redirect) {
                localStorage.removeItem("redirect");
                window.location.href = redirect
                return
            } else {
                location.reload();
                return
            }
        }
    }
 }