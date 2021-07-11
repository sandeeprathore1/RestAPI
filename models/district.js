
var mongoose=require('mongoose');
const confiq=require('../config/config').get(process.env.NODE_ENV);

const districtSchema=mongoose.Schema({

    district:{
        type: String,
        required: true,
        maxlength: 100
    },
});

module.exports=mongoose.model('District',districtSchema);
