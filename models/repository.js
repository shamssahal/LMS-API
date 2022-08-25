const mysql2 = require('mysql2/promise');
const Config = require('../configs/dbConfig');

const conn = mysql2.createPool(Config);
module.exports = conn;
