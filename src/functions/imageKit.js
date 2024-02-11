
require('dotenv').config();

var ImageKit = require("imagekit");

var imagekit =  new ImageKit({
    publicKey : "public_tAjAFkMUzFWcvIH4yfX4wN0ZMR0=",
    privateKey : process.env.privateKey_ImageKit,
    urlEndpoint : "https://ik.imagekit.io/EliBaExpress"
});

// imagekit.upload({
//     file : '', //required
//     fileName : "my_file_name.jpg",   //required
//     extensions: [
//         {
//             name: "google-auto-tagging",
//             maxTags: 5,
//             minConfidence: 95
//         }
//     ]
// }).then(response => {
//     console.log(response);
// }).catch(error => {
//     console.log(error);
// });

// imagekit.upload({
//     // path.resolve(__dirname, './assets/img/logo.svg')
//     file : fs.readFileSync(  path.resolve(__dirname,"../public/img/imagen1.jpg")), //required
//     // file : (  "../public/img/imagen1.jpg"), //required
//     // file : (  "../public/img/imagen1.jpg"), //required
//     fileName : Date.now()+ "Img.jpg", //required
//     // folder : "/img", //optional
//     tags : ["a ver este tagggg","tag2"], //optional
//     fileType:'image' 
// })
// .then(response => {
//     console.log(response);
// })
// .catch(error => {
//     console.log(error);
// });


// imagekit.listFiles({
//     // skip : 10,
//     // limit : 10
// }).then(response => {
//     console.log(response);
// }).catch(error => {
//     console.log(error); 
// });

// let funcionesImagKit = {
//     upload : async function (nameFile){
//         try {
//             let resultado = imagekit.upload({
//                 file : fs.readFileSync(  path.resolve(__dirname,`../public/img/`+nameFile)), //required
//                 fileName : Date.now()+ nameFile.split('.')[1], //required
//                 fileType:'image' ,
//                 // folder : "/img", //optional
//                 // tags : ["a ver este tagggg","tag2"], //optional
//             }, async function(error, result) {
//                 if(error) console.log(error);
//                 else console.log(result);
//             })
//             return resultado
//         } catch (error) {
//             console.log(error)
//         }
//     }
// }

// imagekit.deleteFile("file_id")
// .then(response => {
//     console.log(response);
// })
// .catch(error => {
//     console.log(error);
// });

module.exports = imagekit