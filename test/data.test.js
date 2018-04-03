const dataCRUDOps = require('../lib/data');

const { create, read, update } = dataCRUDOps;

create('whut', 'ay', {"ay": "yooooo! it's a permanent vacation!"}, err => {
  if (err) console.log(err);
  console.log('created!!')
  
  read('whut', 'ay', (err, fileData) => {
    if (err) console.log(err);
    console.log('read!!', JSON.parse(fileData));

    update('whut', 'ay', {"bob": "the builder1"}, err => {
      if (err) console.log(err);
      console.log('updated!!');

      read('whut', 'ay', (err, fileData) => {
        if (err) console.log(err);
        console.log('read!!', JSON.parse(fileData));

        dataCRUDOps.delete('whut', 'ay', err => {
          if (err) console.log(err);
          console.log('deleted!!!');
        })
      });
    });
  });
});
