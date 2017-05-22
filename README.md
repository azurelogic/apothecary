# apothecary
Deliver all sorts of tinctures, tonics, and toxins to your node code


```
const apothecary = require('apothecary');

module.exports.handler = (event, context, callback) => {
  apothecary().then(tonic => {
    eval(tonic);

    drinkPotion('before');

    doStuff();

    drinkPotion('after');

    callback();
  })
}
```