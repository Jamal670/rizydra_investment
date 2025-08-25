const app = require('./app');
require('./config/db');

app.listen(5000, () => {
  console.log('Server running on port 5000');
}); 
 