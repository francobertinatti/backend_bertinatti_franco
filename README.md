# Proyecto Backend CoderHouse
* Definición
* Componentes
### Aclaración
Este proyecto aun se encuentra incompleto. Requiere de una destructuración base con implementación en Docker (evitando errores con Nodemailer por suposición del autor) y Nest.js (Para una mayor prolijidad del codigo y aplicación de patrones de diseño)

## Definición
Proyecto construido entrega tras entrega en el curso de backend de CoderHouse, se trata de un E-Commerce, aplicando todos los temas vistos en el curso. El front es bastante simple usando Handlebars, en ciertos puntos solo retorna en formato JSON sin ningun front.

## Componentes
Paquetes a utilizar
* Express
* Multer (Instalado pero aun no implementado)
* Handlebars
* Mongoose
* Dotenv
* Bcrypt para hasheo de contraseñas
* Morgan
* Nodemailer (Aun con errores)
* Passport
* Passport con Github
* Swagger para documentar
* uuid: Generador de codigo aleatorio
* winston para realizar loggeo

Paquetes a utilizar en QA
* Chai
* Mocha
* Supertest

Modulos
* Servidor
* Enrutador
* Modelos en Mongoose
* DAO's
* DTO's
* Controladores
* Config
* Handlers de errores
* Logs con Winston
* Middleware de control de acceso

Para ejecutar el proyecto en local, se puede hacer con:
```
$ npm run start
```