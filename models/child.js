
var mongoose=require('mongoose');
const confiq=require('../config/config').get(process.env.NODE_ENV);

const childSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 100
    },
    sex:{
        type: String,
        required: true,
        maxlength: 100
    },
    dob:{
        type: String,
        required: true,
        maxlength: 100
    },
    fathersName:{
        type: String,
        required: true,
        maxlength: 100
    },
    mothersName:{
        type: String,
        required: true,
        maxlength: 100
    },
    state:{
        type: String,
        required: true,
        maxlength: 100
    },
    district:{
        type: String,
        required: true,
        maxlength: 100
    },
});

module.exports=mongoose.model('Child',childSchema);
