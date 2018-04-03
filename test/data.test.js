const { createFile } = require('../lib/data');

createFile('whut', 'ay', {"ay": "yooooo! it's a permanent vacation!"}, err => {
  if (err) console.log(err);
});
