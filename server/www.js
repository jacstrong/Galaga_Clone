const express = require('express')
const path = require('path')

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
const port = process.env.PORT || 3031;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
