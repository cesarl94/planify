### Notas:<br>

Usamos MySQL Server 8

---

``npm install`` para actualizar los paquetes

---

Para conectar una db y hacer pruebas locales, podemos ejecutar el backend ejecutando el NPM Script ``start``. Esto actualizará todas las dependencias y luego se nos pedirá ingresar el root password que hayamos elegido cuando instalamos MySQL. 

Este password se pide en tiempo de ejecución para no tener que subir contraseñas al repositorio público.

La configuración de la db se puede hacer desde el archivo [flags.js](Planify_Api/flags.js), donde podremos establecer los parámetros de conexión a nuestra db, permitiendonos así conectarnos a una db ya creada, o crear una nueva llamada ``basedepruebas`` acorde a las sentencias en el [script con todas las sentencias sql.](Planify_Api/basedepruebas.sql) La constante ``ExecuteSQLSentences`` en [flags.js](Planify_Api/flags.js) va a definir si creamos la db o nos conectamos a una ya existente.

Si está en true, y ejecutamos el proyecto, esto borrará la db de pruebas (llamada ``basedepruebas``) si ya existía y creará una nueva a partir de los datos que estén en el [script con todas las sentencias sql](Planify_Api/basedepruebas.sql) y esto nos permitirá al equipo usar una db ficticia para el desarrollo del proyecto y tenerla así cargada en el repositorio. Las sentencias se ejecutarán en orden, y el orden de ejecución es importante, así que hay que cuidar de no incluír datos que dependan de otros datos que aún no se crearon. <br><br>
Por ejemplo:
* Definiciones de tablas con FOREIGN_KEYS de otras tablas que aún no se crearon
* Insertar objetos en tablas que aún no se crearon
* Insertar objetos con FOREIGN_KEYS de mentira. Los datos deben existir.

---

## Endpoints

### GETs
* ``api/estados``: Devuelve un arreglo de estados que representan cada columna. No se requieren parámetros. La estructura devuelta es la siguiente:
    ```json
    [
        {
            "id_estado": 1,
            "orden": 0,
            "nombre": "Backlog"
        },
        // ...
    ]
    ```
* ``api/estados/tareas``: Devuelve un arreglo de objetos que sirven para rellenar la escena principal, en la que vemos los estados, que representan las columnas, y las miniaturas de las tareas que hay en cada tarea, con los usuarios asignados. No se requieren parámetros. La estructura devuelta es la siguiente:
    ```json
    [
        {
            "id_estado": 1,
            "Nombre": "Backlog",
            "id_tarea": 1,
            "nombre": "Mejorar el diseño del home",
            "descripcion": "Cambiar la distribución de los botones en la parte...",
            "Nombre_apellido": "Juan Pérez"
        },
        // ...
    ]
    ```

### POSTs

* ``api/newregister``: Usado para crear un nuevo usuario. La petición se debe realizar con los siguientes valores dentro del body:
    * ``correo``: Debe ser un string con el formato ``a@a.a`` de hasta 250 caracteres de largo.
    * ``nombre``: Debe ser un string que contenga entre 3 y 100 caracteres y que no contenga números.
    * ``apellido``: Debe ser un string que contenga entre 3 y 100 caracteres y que no contenga números.
    * ``hash``: Debe ser un string que representa el password encriptado del usuario. El password ingresado debe pasar por el encriptador [``bcrypt``](https://www.npmjs.com/package/bcrypt) con el valor saltRounds en 10. Ejemplo de cómo obtenerlo:
        ```js
        // Generador de hash
        const saltRounds = 10; // Ajustar según el nivel de seguridad deseado
        bcrypt.hash(`userPassword`, saltRounds, (err, hash) => {
            if (err) {
                console.error(`Error al generar el hash:`, err);
            } else {
                console.log(`Hash generado:\n${hash}`);
                // Hash generado:
                // $2b$10$aXmeD65jXJfqwkkAIKzU2uaAvQiLzaISGpKeT22RCN7D7pi6.5nwi
            }
        });
        ```
    Con esos parámetros crearemos un nuevo usuario. En el proceso, podemos obtener o un estado de error 400 con explicación correspondiente, si es que algo salió mal, o un estado 201 si todo salió bien. Y la estructura devuelta sería la siguiente:
    ```json
    {
        "id_usuario": 4,
        "correo": "juan.perez@gmail.com",
        "nombre": "Juan",
        "apellido": "Perez"
    }
    ```
* ``api/newstate``: Usado para crear un nuevo estado para las tareas, lo cual se representa por medio de columnas. La petición se debe realizar con los siguientes valores dentro del body:
    * ``nombre``: El nombre del estado/columna, debe ser un string de al menos 1 y hasta 50 caracteres de largo. Pueden ser números.
    * ``orden``: Un entero que nos servirá para elegir la ubicación de la columna en el tablero. Las columnas deberán ser ordenadas moviendo a la derecha las que tengan los números mas altos.

    Con esos parámetros crearemos un nuevo estado/columna. En el proceso, podemos obtener o un estado de error 400 con explicación correspondiente, si es que algo salió mal, o un estado 201 si todo salió bien. Y la estructura devuelta sería la siguiente:
    ```json
    {
        "id_estado": 5,
        "nombre": "Testing",
        "orden": "5"
    }
    ```
* ``api/newtask``: Usado para crear una nueva tarea. La petición se debe realizar con los siguientes valores dentro del body:
    * ``nombre``: El título de la tarea, debe ser un string de al menos 1 y hasta 100 caracteres de largo. Pueden ser números.
    * ``orden``: Un entero que nos servirá para elegir la ubicación de la tarea en la columna. Las tareas deberán ser ordenadas moviendo abajo a las que tengan los números mas altos.
    * ``id_estado``: Una clave foránea (FK) que representa el id del estado en la tabla estados.

    Con esos parámetros crearemos una nueva tarea. En el proceso, podemos obtener o un estado de error 400 con explicación correspondiente, si es que algo salió mal, o un estado 201 si todo salió bien. Y la estructura devuelta sería la siguiente:
    ```json
    {
        "id_tarea": 5,
        "nombre": "Hacer algo importante",
        "orden": "3",
        "id_estado": 1,
        "fecha_creacion": "2024-11-28T15:30:00Z"
    }
    ```

### PUTs

* ``api/updatestate``: Usado para modificar un estado/columna. La petición se debe realizar con los valores detallados a continuación dentro del body. Cabe destacar que hay parámetros opcionales, pero la petición debe tener al menos uno de los parámetros opcionales:
    * ``id_estado``: Un entero que representa la PK del estado/columna a modificar.
    * ``nombre`` (opcional): El nombre del estado/columna, debe ser un string de al menos 1 y hasta 50 caracteres de largo. Pueden ser números.
    * ``orden`` (opcional): Un entero que nos servirá para elegir la ubicación de la columna en el tablero. Las columnas deberán ser ordenadas moviendo a la derecha las que tengan los números mas altos. 

    Con esos parámetros modificaremos un estado/columna. En el proceso, podemos obtener o un estado de error 400 con explicación correspondiente, si es que algo salió mal, o un estado 201 si todo salió bien. Y la estructura devuelta sería igual a la estructura proporcionada.


---
TODO:<br>
Problemas: 
* No se puede establecer conexión