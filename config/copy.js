var fs = require('fs-extra')

// we will add config later here, right now the translation files are not being copied even though
// they are in assets.
var dependencies = [
  ['src/assets/data', 'www/assets']
];

console.log('Executing application custom copies...', dependencies);
dependencies.forEach(function (value) {
  fs.copy(value[0], value[1], function (err) {
    if (err) return console.error(err)
    console.log("Copy files from '"+value[0]+"' to '"+value[1]+"'... Success!");
  });
});
