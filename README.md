### Notas:<br>

Usamos MySQL Server 8

---

``npm install`` para actualizar los paquetes

---

Para conectar una db y hacer pruebas locales, podemos ejecutar el backend con ``cd .\Planify_Api\`` y luego ``node index`` y luego se nos pedirá ingresar el root password que hayamos elegido cuando instalamos MySQL. 

Este password se pide en tiempo de ejecución para no tener que subir contraseñas al repositorio público.

La configuración de la db se puede hacer desde el archivo [flags.js](Planify_Api/flags.js), donde podremos establecer los parámetros de conexión a nuestra db, permitiendonos así conectarnos a una db ya creada, o crear una nueva llamada ``basedepruebas`` acorde a las sentencias en el [script con todas las sentencias sql.](Planify_Api/basedepruebas.sql) La constante ``ExecuteSQLSentences`` en [flags.js](Planify_Api/flags.js) va a definir si creamos la db o nos conectamos a una ya existente.

Si está en true, y ejecutamos el proyecto, esto borrará la db de pruebas (llamada ``basedepruebas``) si ya existía y creará una nueva a partir de los datos que estén en el [script con todas las sentencias sql](Planify_Api/basedepruebas.sql) y esto nos permitirá al equipo usar una db ficticia para el desarrollo del proyecto y tenerla así cargada en el repositorio. Las sentencias se ejecutarán en orden, y el orden de ejecución es importante, así que hay que cuidar de no incluír datos que dependan de otros datos que aún no se crearon. <br><br>
Por ejemplo:
* Definiciones de tablas con FOREIGN_KEYS de otras tablas que aún no se crearon
* Insertar objetos en tablas que aún no se crearon
* Insertar objetos con FOREIGN_KEYS de mentira. Los datos deben existir.

---

TODO:<br>
Problemas: 
* No se puede establecer conexión
* Error: No database selected