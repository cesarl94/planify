### Notas:

---

``npm install`` para actualizar los paquetes

---

Para conectar una db y hacer pruebas locales, tenemos que crear una nueva desde MySQL Workbench basandonos en el .sql que está en Planify_Api. 

Luego, ir al archivo Planify_Api/db.js y rellenar ahí con los datos con los que acabamos de crear nuestro host local de la db.

```js
const db = mysql.createConnection({
  host: '127.0.0.1',      // O 'localhost'
  user: 'root',           // Usuario root
  password: '1234',       // Contraseña
  database: 'tp_basededatos',  // Nombre de la base de datos
  port: 3306              // Puerto por defecto de MySQL
});
```

---