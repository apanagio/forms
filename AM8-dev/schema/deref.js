
var deref = require('json-schema-deref-sync');
var myschema = require('./schema.json');

var fullSchema = deref(myschema);
console.log(JSON.stringify(fullSchema));
