const mysql = require("mysql");

class Db {
  constructor(database) {
    const dbOptions = {
      host: "127.0.0.1",
      user: "root",
      password: "password",
      port: 3306,
      database,
    };

    this.database = database;
    this.connection = mysql.createConnection(dbOptions);
  }

  start() {
    return new Promise((resolve, reject) => {
      const onConnect = (error) => {
        if (error) reject(error);
        console.log(`Successfully connected to ${this.database} database.`);
        resolve();
      };

      this.connection.connect(onConnect);
    });
  }

  end(message) {
    this.connection.end();
    console.log(
      message || `Successfully closed connection to ${this.database}.`
    );
  }

  selectAll(tableName) {
    return new Promise((resolve, reject) => {
      const handleQuery = (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      };

      this.connection.query(`SELECT * FROM ${tableName}`, handleQuery);
    });
  }

  query(sqlQuery) {
    return new Promise((resolve, reject) => {
      const handleQuery = (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      };

      this.connection.query(sqlQuery, handleQuery);
    });
  }

  parameterisedQuery(sqlQuery, args, info = false) {
    return new Promise((resolve, reject) => {
      const handleQuery = (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      };

      const query = this.connection.query(sqlQuery, args, handleQuery);

      if (info) {
        console.log(query.sql);
      }
    });
  }
}

module.exports = Db;
