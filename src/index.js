const app = require('./app')
/*Just read the port from env variables and start the application server*/
const port = process.env.PORT
app.listen(port,()=>{
    console.log('index.js::node server is up and running at port '+port)
})