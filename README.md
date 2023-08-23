# Proyecto Backend CoderHouse - Documentación

Este documento proporciona una visión general del proyecto backend desarrollado en el marco del curso de backend de CoderHouse. El proyecto consiste en un E-Commerce en constante construcción a lo largo de múltiples entregas del curso. A continuación, se detallan los aspectos clave del proyecto, incluyendo su definición y componentes esenciales.

## Definición del Proyecto

El Proyecto Backend CoderHouse es un E-Commerce en desarrollo que se ha construido de manera incremental a medida que se avanzaba en el curso de backend. El objetivo principal del proyecto es aplicar los conceptos y técnicas aprendidos durante el curso para crear una aplicación funcional y escalable.

La parte frontal del proyecto utiliza el motor de plantillas Handlebars y en ciertos puntos retorna datos en formato JSON sin un diseño visual específico. Se han empleado diversos paquetes y herramientas para garantizar el funcionamiento adecuado de la aplicación.

## Componentes Principales

### Paquetes Utilizados

- **Express**: Framework de servidor web para Node.js que simplifica la creación de aplicaciones web robustas y flexibles.
- **Multer**: Biblioteca para gestionar el manejo de archivos, aunque aún no ha sido implementada en el proyecto.
- **Handlebars**: Motor de plantillas para generar contenido HTML de manera dinámica.
- **Mongoose**: Biblioteca de modelado de objetos para MongoDB, que facilita la interacción con la base de datos.
- **Dotenv**: Herramienta para gestionar variables de entorno y configuraciones externas.
- **Bcrypt**: Utilizado para el hash de contraseñas y asegurar la seguridad en la autenticación.
- **Morgan**: Middleware para generar registros de solicitudes HTTP.
- **Nodemailer**: Aunque presenta errores en la implementación actual, se prevé su uso para la gestión de correos electrónicos.
- **Passport**: Marco de autenticación para Node.js que se utiliza para autenticación local.
- **Passport con Github**: Extensión de Passport para permitir la autenticación mediante GitHub.
- **Swagger**: Herramienta de documentación utilizada para describir y visualizar la API.
- **uuid**: Generador de códigos aleatorios para identificación única.
- **winston**: Biblioteca de registro para Node.js que se emplea para generar registros y seguimiento de actividades.

### Paquetes Utilizados en QA (Quality Assurance)

- **Chai**: Biblioteca de aserciones para realizar pruebas más legibles y expresivas.
- **Mocha**: Marco de pruebas que se utiliza en conjunto con Chai para realizar pruebas unitarias y de integración.
- **Supertest**: Biblioteca para realizar pruebas de API simulando solicitudes HTTP.

### Módulos Principales

- **Servidor**: Configuración y creación del servidor Express.
- **Enrutador**: Definición de rutas y controladores para gestionar las solicitudes HTTP.
- **Modelos en Mongoose**: Definición de esquemas y modelos para interactuar con la base de datos MongoDB.
- **DAO's (Data Access Objects)**: Capa de acceso a datos que encapsula las operaciones de la base de datos.
- **DTO's (Data Transfer Objects)**: Objetos para transferir datos entre diferentes capas de la aplicación.
- **Controladores**: Lógica que maneja las solicitudes y respuestas de la API.
- **Config**: Configuración global de la aplicación.
- **Handlers de Errores**: Manejo y respuesta a errores generados durante la ejecución.
- **Logs con Winston**: Generación de registros para seguimiento y depuración.
- **Middleware de Control de Acceso**: Intermediario para gestionar la autenticación y la autorización en las solicitudes.

## Ejecución Local del Proyecto

Para ejecutar el proyecto en un entorno local, puedes utilizar el siguiente comando:

```bash
$ npm run start
```