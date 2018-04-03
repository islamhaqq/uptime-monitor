const { create, read } = require('../lib/data');

create('whut', 'ayy', {"ay": "yooooo! it's a permanent vacation!"}, err => {
  if (err) console.log(err);
  console.log('success!!')
});
// read('whut', 'ay', (err, fileData) => {
//   if (err) console.log(err);
//   console.log('success!!', JSON.parse(fileData));
// })
