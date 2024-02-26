# Documentación del Proyecto - Trabajo Final del Curso de Backend

¡Bienvenido al proyecto final del curso de Backend de Coderhouse! En este repositorio encontrarás la implementación de un sistema backend para una aplicación de comercio electrónico (ecommerce). A continuación, encontrarás una guía sobre cómo configurar, ejecutar y contribuir a este proyecto.

## Descripción del Proyecto

El proyecto consiste en el desarrollo de un backend para una aplicación de ecommerce. Se proporciona una API RESTful que permite la gestión de productos, carritos de compra y usuarios. La aplicación utiliza tecnologías como Node.js, Express.js y MongoDB para su implementación.

## Configuración

1. **Clonar el Repositorio**: Primero, clona este repositorio en tu máquina local utilizando el siguiente comando:

    ```
    git clone <https://github.com/TomyReiv/curso_Backend_Coderhouse.git>
    ```

2. **Instalar Dependencias**: Una vez clonado el repositorio, navega al directorio del proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias:

    ```
    npm install
    ```

3. **Configurar Variables de Entorno**: El proyecto utiliza variables de entorno para la configuración. Copia el archivo `.env.example` y renómbralo como `.env`, luego configura las variables según sea necesario.

4. **Configurar la Base de Datos**: Asegúrate de tener una instancia de MongoDB en ejecución. Puedes configurar la conexión a la base de datos en el archivo `.env` utilizando la variable `DB_HOST`.

## Ejecución

Una vez completada la configuración, puedes ejecutar el servidor utilizando el siguiente comando:

    ```
    npm run dev
    ```

El servidor estará en funcionamiento en el puerto especificado en el archivo `.env`.

## Uso

Puedes interactuar con la API utilizando herramientas como Postman o CURL. La documentación de la API está disponible en la ruta `/api-docs`.


## Notas Importantes

- **Pruebas Integrales**: Para realizar las pruebas integrales, asegúrate de comentar las líneas señaladas en el código que pueden interferir con las pruebas.
    `//jwtAuth en cada router`
    `//Comentar para pasar los test de product`
    `//fin`

- **Eliminacion de usuarios inactivos**: Los usuarios inactivos se eliminan con la clase UserInactiveProcess que usar la funcion cron de node-cron. Esta programada para activarse cada 5min y elimina los usuarios inactivos despues de dos dias y cuanta con la opcin de prueba para inactivos luego de 5 minutos.
    `//utils/deleteInactives.js`