const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONNECTION_STRING,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

