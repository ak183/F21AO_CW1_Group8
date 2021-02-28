const express = require('express');
const mongoose = require('mongoose');
const dotevn = require ('dotenv');
const path = require('path');
const app = express();
const result = dotevn.config();

console.log(result.parsed);
const PORT = process.env.PORT || 5000;

app.use(express.json());
//app.use(morgan('tiny'));

/* Routes to be imported */
const user = require("./routes/user/user");
const patient = require("./routes/patient/patient_create_edit");
const patientTreatment = require("./routes/patientTreatment/patient_complaint");

app.use('/user', user);
app.use("/patient", patient);
app.use("/patientTreatment", patientTreatment);



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
app.listen(PORT, () => console.log (`Server is started ${PORT}`));

//import routes