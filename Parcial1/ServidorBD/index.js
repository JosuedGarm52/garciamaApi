const express = require('express');
const app = express();
var cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
var mysql = require('mysql');
var mysql2 = require('mysql2/promise');

app.use(express.json())
app.use(cors());

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
    // setup the logger
    app.use(morgan('combined', { stream: accessLogStream }))
    
    app.get('/', function (req, res) {
    res.send('hello, world!')
});

const dataDeBase = {
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'ejemplo'
}
app.get("/alumnos",async (req,resp)=>{
    try{
        //req.query o req.body o red.params
        const conexion = await mysql2.createConnection(dataDeBase);
        const [rows, fields] = await conexion.query('select * from ejemplo.nombre ');
        if(rows.length == 0){
            resp.status(404);
            resp.json({mensaje:"Usuario no existe"})
        }else{
            resp.json(rows);
        }
    }catch(err){
        resp.status(500).json({mensaje: "Error de conexion",tipo: err.message, sql : err.sqlMessage})
    }
    
});
app.get("/alumnos/:id",async (req,resp)=>{
    try{
        //req.query o req.body o red.params
        console.log(req.params.id);
        const conexion = await mysql2.createConnection(dataDeBase);
        const [rows, fields] = await conexion.query('select * from ejemplo.nombre where id='+req.params.id);
        if(rows.length == 0){
            resp.status(404);
            resp.json({mensaje:"Usuario no existe"})
        }else{
            resp.json(rows);
        }
    }catch(err){
        resp.status(500).json({mensaje: "Error de conexion",tipo: err.message, sql : err.sqlMessage})
    }
    
});

app.delete("/alumnos",async (req,resp)=>{
    try{
        const variable = req.query.idUsuario;
        console.log(variable);
        const conexion = await mysql2.createConnection(dataDeBase);
        const queryy = 'delete from ejemplo.nombre where id='+variable;
        console.log(queryy);
        const [rows, fields] = await conexion.query(queryy);
        if(rows.affectedRows == 0){
            resp.json({mensaje:"Registro no eliminado"});
        }else{
            resp.json({mensaje:"Registro eliminado"});
        }
    }catch(err){
        resp.status(500).json({mensaje: "Error de conexion",tipo: err.message, sql : err.sqlMessage})
    }
    
});
app.put("/alumnos",async (req,resp)=>{
    try{
        const variable = parseInt(req.query.IdUsuario);
        const objeto = req.body;
        if (typeof variable !== 'number') {
            throw new Error('La variable no es un número.');
        }
        const conexion = await mysql2.createConnection(dataDeBase);
        
        let campos =  Object.keys(objeto);
        
        let sentenciasql = "";
        let cadenaUpdate = "update ejemplo.nombre "
        let cadenaSet = "SET ";
        let cadenaWhere = " where ";
        
        sentenciasql += cadenaUpdate + cadenaSet;
        let x = 1;
        campos.forEach(capos=>{
            if(x != 1)
            {
                sentenciasql += ", "
            }
            //console.log(capos+'='+objeto[capos]);
            if(typeof objeto[capos] === 'string')
            {
                sentenciasql += capos + "='" + objeto[capos] + "'";
            }else
            {
                sentenciasql += capos+'='+objeto[capos]
            }
            x =2;
        });
        sentenciasql += cadenaWhere
        sentenciasql += campos[0]+' = '+variable;
        console.log(sentenciasql);
        const [rows, fields] = await conexion.query(sentenciasql);
        if(rows.affectedRows == 0){
            resp.json({mensaje:"Registro sin cambios"});
        }else{
            resp.json({mensaje:"Registro tuvo cambios"});
        }
    }catch(err){
        resp.status(500).json({mensaje: "Error de conexion",tipo: err.message, sql : err.sqlMessage})
    }
    
});

app.patch("/alumnos/:id", async (req, resp) => {
    try {
      const variable = parseInt(req.query.IdUsuario);
      const conexion = await mysql2.createConnection(dataDeBase);
      const sql = 'UPDATE ejemplo.nombre SET nombre = ?, apellido = ? WHERE id = ?';
      const { nombre, apellido } = req.body;
      const [result] = await conexion.execute(sql, [nombre, apellido, variable]);
      
      if (result.affectedRows === 0) {
        resp.status(404).json({ mensaje: "Usuario no encontrado" });
      } else {
        resp.json({ mensaje: "Usuario actualizado exitosamente" });
      }
    } catch (err) {
      resp.status(500).json({ mensaje: "Error de conexión", tipo: err.message, sql: err.sqlMessage });
    }
  });
app.get("/alumnos/:id",async (req,resp)=>{
    try{
        //req.query o req.body o red.params
        console.log(req.params.id);
        const conexion = await mysql2.createConnection(dataDeBase);
        const [rows, fields] = await conexion.query('select * from ejemplo.nombre where id='+req.params.id);
        if(rows.length == 0){
            resp.status(404);
            resp.json({mensaje:"Usuario no existe"})
        }else{
            resp.json(rows);
        }
    }catch(err){
        resp.status(500).json({mensaje: "Error de conexion",tipo: err.message, sql : err.sqlMessage})
    }
});
app.get("/alumnos/:carrera",(req,resp)=>{
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'ejemplo'
    });
    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
       
        console.log('connected as id ' + connection.threadId);
    });
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
            console.log('The solution is: ', results[0].solution);
            connection.end();
            resp.jsonp(results);
    });
});

app.listen(8080,(req,resp)=>{
    console.log("Servidor express escuchando");
});