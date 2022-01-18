#!/bin/bash

err(){
    echo "E: $*" >>/dev/stderr
}

if [[ -z $1 || ! -f $1 ]]; then
    err "A megadott fájl nem található!";
    exit;
fi

zipfile=$1

filename_no_extension="${zipfile%.*}"

if [[ ! -d $filename_no_extension ]]; then
    echo "zip kicsomagolása...";
    unzip -d $filename_no_extension $zipfile;
fi

echo "könyvtárváltás..."
cd $filename_no_extension

echo "ffmpeg inputfájl elkészítése..."
fname=ffmpeg_input

touch $fname

cat /dev/null > $fname

read -ra ido_lista < hangkulcsidok.txt

ido_lista_hossz=${#ido_lista[@]}

for ((i=2; i<"$ido_lista_hossz"; i++));
do
    printf "file \'image_$(($i-2)).png\'\nduration " >> $fname
    echo "scale=2; ${ido_lista[$i]}-${ido_lista[$(($i-1))]}" | bc >> $fname
done

ffmpeg -f concat -i ffmpeg_input -i *.mp3 -c:v libx264 -pix_fmt yuv420p output.mp4
