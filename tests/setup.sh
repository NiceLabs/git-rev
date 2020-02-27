#!/usr/bin/env sh

rm -Rf ./tempRepo
mkdir ./tempRepo
cd ./tempRepo
git init
echo 'test data' > text.tex
git add --all
git commit -am 'init'
echo 'test data' >> text.tex
cd ..
