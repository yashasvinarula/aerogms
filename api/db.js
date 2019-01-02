const secconfig = require('../config/config');

const initOptions = {
    capSQL: true // generate capitalized SQL 
};

var config = {
    host:secconfig.secdata.pghost,
    user: 'postgres',
    database: 'aeroGMS',
    password: 'postgres', 
    port: 5432,
    max: 50, // max number of connection can be open to database
    // idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };

const pgp = require('pg-promise')(initOptions);
const db = pgp(config);
const pg = require('pg');
const pool = new pg.Pool(config);
const geocred='admin:geoserver';

module.exports = {
    pgp, db, pg, pool, geocred
};
