
var loading = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`


// fetchs
async function bloquearUsuario(e, idUser) {
    e.innerHTML = loading
    try {
        const res = await fetch( '/api/admin/bloquearUsuario', {
            method: 'POST', 
            body: JSON.stringify({idUser: idUser}),  
            headers: {  "Content-Type": "application/json" },
          });
    
        const resData = await res.json();
        console.log(resData);
        e.innerHTML = 'Bloquear'
        if (resData.status == 'ok') {
            e.classList.add('d-none')
            e.parentElement.querySelector('#btnActivar').classList.remove('d-none')
        } else {
            return 'error'
        }
        
    } catch (error) {
        console.log(error);
        return 'error'
    }
  }

  async function activarUsuario(e, idUser) {
    e.innerHTML = loading
    try {
        const res = await fetch( '/api/admin/activarUsuario', {
            method: 'POST', 
            body: JSON.stringify({idUser: idUser}),  
            headers: {  "Content-Type": "application/json" },
          });
    
        const resData = await res.json();
        console.log(resData);
        e.innerHTML = 'Activar'
        if (resData.status == 'ok') {
            e.classList.add('d-none')
            e.parentElement.querySelector('#btnBloquear').classList.remove('d-none')
        } else {
            return 'error'
        }
        
    } catch (error) {
        console.log(error);
        return 'error'
    }
  }

  async function asignarAdministradorUsuario(e, idUser) {
    e.innerHTML = loading
    try {
        const res = await fetch( '/api/admin/asignarAdministradorUsuario', {
            method: 'POST', 
            body: JSON.stringify({idUser: idUser}),  
            headers: {  "Content-Type": "application/json" },
          });
    
        const resData = await res.json();
        console.log(resData);
        e.innerHTML = 'Asig. Administrador'
        if (resData.status == 'ok') {
            e.classList.add('d-none')
            e.parentElement.querySelector('#btnVisitante').classList.remove('d-none')
        } else {
            return 'error'
        }
        
    } catch (error) {
        console.log(error);
        return 'error'
    }
  }

  async function desasignarAdministradorUsuario(e, idUser) {
    e.innerHTML = loading
    try {
        const res = await fetch( '/api/admin/desasignarAdministradorUsuario', {
            method: 'POST', 
            body: JSON.stringify({idUser: idUser}),  
            headers: {  "Content-Type": "application/json" },
          });
    
        const resData = await res.json();
        console.log(resData);
        e.innerHTML = 'Asig. Visitante'
        if (resData.status == 'ok') {
            e.classList.add('d-none')
            e.parentElement.querySelector('#btnAdministrador').classList.remove('d-none')
        } else {
            return 'error'
        }
        
    } catch (error) {
        console.log(error);
        return 'error'
    }
  }