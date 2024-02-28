
let loading2 = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`

let idProduct = window.location.pathname.split('/')[4]
// console.log(idProduct)

// Form actualizar titulo y descripcion y etiquetas
let formP1 = document.querySelector('#formP1')
let inputTitulo = document.querySelector('#inputTitulo')
let inputDescripcion = document.querySelector('#inputDescripcion')
let inputEtiquetas = document.querySelector('#inputEtiquetas')
let btnGuardarP1 = document.querySelector('#btnGuardarP1')

formP1.addEventListener('submit', async e=>{
    e.preventDefault()
    btnGuardarP1.innerHTML = loading2
    btnGuardarP1.disabled = true

    try {
        let dataProduct = {titulo: inputTitulo.value, descripcion: inputDescripcion.value, etiquetas:inputEtiquetas.value}
        const res = await fetch( '/api/products/update', {
            method: 'POST', headers: { "Content-Type": "application/json" },
            body: JSON.stringify({dataProduct, idProduct }),  
        });
        const response = await res.json();
        console.log(response)
        
        if (response.status == 'ok') {
            btnGuardarP1.innerHTML = 'Guardado'
        } else{
            btnGuardarP1.innerHTML = 'Reintentar guardar'
        }
        
    } catch (error) {
        btnGuardarP1.innerHTML = 'Reintentar'
    }
    btnGuardarP1.disabled = false


})

// form Subir Imagenes y eliminarlas

let inputFile = document.querySelector('#inputFile')
let sectImagenes = document.querySelector('#sectImagenes')
let feedbackInputFile = document.querySelector('#feedbackInputFile')

inputFile.addEventListener('change', async e =>{

    async function upload(data) {
        try {
          const response = await fetch("/imagekit/upload", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log("Success:", result);
          agregarImagenDom(result.url, result.fileId)
        } catch (error) {
          console.error("Error:", error);
        }
      }
      

        function getBase64(file) {
            return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            });
        }

        inputFile.disabled = true
        let selectedFiles = inputFile.files
        let index = 0
        feedbackInputFile.innerHTML = `Subiendo ${index} / ${selectedFiles.length}`
        for (const file of selectedFiles) {
            await getBase64(file).then( async base64data =>  {
                await upload({imagen:base64data, idProduct})
                index += 1
                feedbackInputFile.innerHTML = `Subiendo ${index} / ${selectedFiles.length}`
        }
      );
    }
    inputFile.disabled = false
    feedbackInputFile.innerHTML = ` ${index} / ${selectedFiles.length}`

})

async function deleteImagen(fileId, e) {
    e.style.backgroundColor = 'black'
    try {
        const response = await fetch("/imagekit/delete", {
          method: "POST", headers: { "Content-Type": "application/json", },
          body: JSON.stringify({imageId:fileId, idProduct}),
        });
        const result = await response.json();
        console.log("Success:", result);
        e.parentElement.remove();

      } catch (error) {
        e.innerHTML = 'X'
        console.error("Error:", error);
      }
}

function agregarImagenDom(url, fileId) {
    sectImagenes.innerHTML += `
    <div class="position-relative m-1" style="width: fit-content;" >
       <svg xmlns="http://www.w3.org/2000/svg" title="Asignar imágen principal" width="30" height="30" fill="currentColor" style="cursor: pointer; color: green;" class="bi bi-star position-absolute top-0 start-0 rounded-pill p-1" onclick="setImagenPrincipal('${fileId}', this)" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>
        <img src="/svg/icons8-eliminar.svg" width="25" height="25" class="position-absolute top-0 end-0 rounded-pill p-1" alt="rrr" style="cursor: pointer; background-color: red;" onclick="deleteImagen('${fileId}', this)">
        <img src=${url} class="img-thumbnail" alt="Img" style="max-width: 4cm; max-height: 4cm;">
    </div>
    `
}

async function setImagenPrincipal(fileId, e) {
  e.style.backgroundColor = 'orange'
  try {
      const response = await fetch("/api/products/admin/update/setImagenPrincipal", {
        method: "POST", headers: { "Content-Type": "application/json", },
        body: JSON.stringify({fileId, idProduct}),
      });
      const result = await response.json();
      console.log("Success:", result);
      e.style.backgroundColor = 'green'
      e.style.color = 'white'

    } catch (error) {
      e.style.backgroundColor = 'none'
      console.error("Error:", error);
    }
}

async function eliminarProducto(e) {
  // let btnEliminarProducto = document.querySelector('#btnEliminarProducto')
  e.innerHTML = loading2
  e.disabled = true 
  e.parentElement.disabled = true 
  e.parentElement.parentElement.parentElement.querySelector('button').disabled = true 
  e.parentElement.parentElement.parentElement.querySelector('button').innerHTML = loading2 

  try {
    const response = await fetch("/api/products/admin/delete", {
      method: "POST", headers: { "Content-Type": "application/json", },
      body: JSON.stringify({idProduct}),
    });
    const result = await response.json();
    console.log("Success:", result);
    e.parentElement.parentElement.parentElement.querySelector('button').innerHTML = 'Producto Eliminado' 
    e.innerHTML = 'Producto Eliminado' 
      setTimeout(function(){
        window.close();
      }, 2000);


  } catch (error) {
    e.parentElement.parentElement.parentElement.querySelector('button').innerHTML = 'Error' + error 
    e.parentElement.parentElement.parentElement.querySelector('button').disabled = false 
    e.innerHTML = 'Eliminar Producto publicado con sus imágenes'
    e.disabled = false 
    // e.style.backgroundColor = 'none'
    console.error("Error:", error);
  }

}


