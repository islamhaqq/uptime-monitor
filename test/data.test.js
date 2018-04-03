const { create, read, update } = require('../lib/data');

// create('whut', 'ayy', {"ay": "yooooo! it's a permanent vacation!"}, err => {
//   if (err) console.log(err);
//   console.log('success!!')
// });

read('whut', 'ay', (err, fileData) => {
  if (err) console.log(err);
  console.log('success!!', JSON.parse(fileData));

  update('whut', 'ay', {"bob": "the builder1"}, err => {
    if (err) console.log(err);
    console.log('success!!');

    read('whut', 'ay', (err, fileData) => {
      if (err) console.log(err);
      console.log('success!!', JSON.parse(fileData));
    });
  });
});
