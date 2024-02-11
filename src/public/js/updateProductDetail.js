
let loading2 = `  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> <span class="visually-hidden" role="status"></span>`

let idProduct = window.location.pathname.split('/')[3]
// console.log(idProduct)

// Form actualizar titulo y descripcion
let formP1 = document.querySelector('#formP1')
let inputTitulo = document.querySelector('#inputTitulo')
let inputDescripcion = document.querySelector('#inputDescripcion')
let btnGuardarP1 = document.querySelector('#btnGuardarP1')

formP1.addEventListener('submit', async e=>{
    e.preventDefault()
    btnGuardarP1.innerHTML = loading2
    btnGuardarP1.disabled = true

    try {
        let dataProduct = {titulo: inputTitulo.value, descripcion: inputDescripcion.value}
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
        <img src="/svg/icons8-eliminar.svg" width="25" height="25" class="position-absolute top-0 end-0 rounded-pill p-1" alt="rrr" style="cursor: pointer; background-color: red;" onclick="deleteImagen('${fileId}', this)">
        <img src=${url} class="img-thumbnail" alt="Img" style="max-width: 4cm; max-height: 4cm;">
    </div>
    `
}