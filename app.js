const Express = require('express');
const cors = require('cors');
const Mongoose = require('mongoose');
const Session = require('express-session');
const AuthRouter = require('./routes/AuthRouter');
const vehicleRouter = require('./routes/vehicleRouter')
const EmployeeRouter = require('./routes/EmployeeRouter')
const MongoDbSession = require('connect-mongodb-session')(Session);
require('dotenv').config();

const app = Express();
const port = process.env.Port || 4000;

const corsOptions = {   
    origin: ['http://localhost:4001','http://192.168.0.110:3000'], 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

Mongoose.connect(process.env.MongoDBURI)
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.log("Error in connecting to MongoDB:",err);
})

const store = new MongoDbSession({
    uri: process.env.MongoDBURI,
    collection: 'sessions'
})

app.use(Session({
    secret: process.env.SessionKey,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie : {
        secure : true,
        sameSite : 'none',
        httpOnly : true
    }
}))

app.use(AuthRouter)
app.use(vehicleRouter)
app.use(EmployeeRouter)

                                            


