const functions = require('firebase-functions');
const fetch = require("node-fetch");
const fs = require("fs");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.download = functions.https.onRequest((request, response)=>{
    const data = request.body;
    response.set('Access-Control-Allow-Origin', '*');
    response.set("Access-Control-Allow-Methods", "POST");
    response.set('Access-Control-Allow-Headers', '*');
    response.writeHead(200,{'Content-Type': 'image/jpeg'});
    return fetch(`https://i.nhentai.net/galleries/${data.gallery}/${data.page}.${data.filetype}`,{
        headers: {
            "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
        }
    })
    .then(raw=>{
        //console.log(raw);
        return raw.blob();
    })
    .then(blob=>{
        return blob.arrayBuffer();
    })
    .then(arraybuffer=>{
        let uint8array = new Uint8Array(arraybuffer);
        return uint8array;
    })
    .then(uint8array=>{
        //console.log(uint8array);
        return Buffer.from(uint8array);
    })
    .then(buffer=>{
        //console.log(buffer);
        response.write(buffer);
        return 0;
    })
    .catch(error=>{
        console.error(error);
    })
    .finally(result=>{
        response.end();
    })
})