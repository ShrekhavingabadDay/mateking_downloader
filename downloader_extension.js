// ==UserScript==
// @name         Mateking downloader
// @version      0.1
// @description  Download mateking mathsplanations as zip files to then convert them to videos
// @author       Sanyi
// @match        http*://www.mateking.hu/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.21.15/plugins/export/libs/FileSaver.js/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var canvas = document.getElementById("canvas");
    var zip = new JSZip();
    var savable = new Image();

    function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

    var jobbnyil = new KeyboardEvent("keydown", { key : "ArrowRight", keyCode : 39 })
    var space = new KeyboardEvent("keydown", { key : " ", keyCode : 32 } );

    function nextFrame(){
        document.dispatchEvent(jobbnyil);
        document.dispatchEvent(space);
        document.dispatchEvent(space);
    }

    function urlToPromise(url) {
        return new Promise(function(resolve, reject) {
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    // saving the mp3 file and the array containg the timestamps
    zip.file("hang.mp3", urlToPromise(hangforras), {binary:true});
    zip.file("hangkulcsidok.txt", HangKulcsIdok.join(' '));
    console.log(HangKulcsIdok.join(' '));

    async function saveZip(){

        for (var i = 0; i<HangKulcsIdok.length-1; i++){
            nextFrame();
            await sleep(2000);
            savable.src = canvas.toDataURL();
            zip.file("image_"+i.toString()+".png", savable.src.substr(savable.src.indexOf(',')+1), {base64: true})
        }

        zip.generateAsync({type:"blob"},
            function updateCallback(metadata) {
                var msg = "Elkészült: " + metadata.percent.toFixed(2) + " %";
                if(metadata.currentFile) {
                    msg += ", jelenlegi fájl = " + metadata.currentFile;
                }
                console.log(msg);
            }
        )
        .then(function callback(blob) {

            // see FileSaver.js
            saveAs(blob, window.location.href.split('/')[5]+".zip");

            alert("Kész!");

        }, function (e) {
            console.log(e);
        });

    }

    saveZip();

})();
