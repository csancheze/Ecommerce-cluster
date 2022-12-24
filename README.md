# Base de Datos con Mongo ![MIT](https://img.shields.io/apm/l/vim-mode?style=plastic)

  ## Description
 
  Un ejercicio de ecommerce usando clusters y nginx

  
  ## Table of Contents
  
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)
  - [Contributing](#license)
  - [Tests](#license)
  - [Questions](#license)
  
  ## Installation
  
Descarga el repositorio

Instala las librerias requeridas

``` npm i ```
  
  ## Usage
  
  
Seguir instrucciones de instalación.

Usa los scripts:
    - "start": "nodemon src/server.js",
    - "node-fork": "node src/server.js -p 8081",
    - "node-cluster": "node src/server.js -p 8081 -m CLUSTER",
    - "babel": "babel server.js -o index.js",
    - "pm2-fork": "pm2 start index.js -p 8081",
    -  "pm2-cluster": "pm2 start index.js -i 0 -p 8081",
    - "nginx-node-cluster": "node server.js -p 8081",
    - "forever-fork": "forever start server.js -p 8082"

  ## License
  
  
Copyright (c) 2022, Cesar Fernando Sanchez All rights reserved.
Licensed under the MIT license. 

  
  
[License](./MIT_license.txt)

  
  ## How to Contribute
  

  
  ## Questions
  
  If you have any question feel free to check my Github 
  
Username:csancheze
  
[Github](https://github.com/csancheze)

  or send me and email
  
<cesanchezesc@gmail.com>
