
let formUploadImageKit = document.querySelector('#formUploadImageKit')
let inputImage = document.querySelector('#inputImage')

formUploadImageKit.addEventListener('submit', e => {
    e.preventDefault()

    async function upload(data) {
        try {
          const response = await fetch("/imagekit/upload", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json", },
          });
          const result = await response.json();
          console.log("Success:", result);
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

      let file = inputImage.files[0]
      getBase64(file).then(
        base64data =>  {
            upload({imagen:base64data})
        }
      );


})

