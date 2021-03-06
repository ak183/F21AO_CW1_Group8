const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// Import Routes
const authRoute = require('./routes/auth');
const userDetailRoute = require('./routes/userDetail');
const patientRoute = require('./routes/patient');


// connect to DB
const result = dotenv.config();

const PORT = process.env.PORT || 5000;

if (result.parsed.NODE_ENV === 'development'){
    //app.use(logger);
    console.log('Logging Enabled');
}

mongoose.connect(
    "mongodb://localhost:27017/hospitalmanagementsystem",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to database")
  );

//Starting Server
app.listen(PORT, () => console.log(`Server is started ${PORT}`));

// mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true }, { useUnifiedTopology: true },
//     () => console.log('connected to DB')
// );

// Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/user-detail', userDetailRoute);
app.use('/api/patient', patientRoute);

app.listen(3000, () => console.log('Server is up and running'));