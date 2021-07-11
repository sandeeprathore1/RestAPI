
var mongoose=require('mongoose');
const confiq=require('../config/config').get(process.env.NODE_ENV);

const stateSchema=mongoose.Schema({
    state:{
        type: String,
        required: true,
        maxlength: 100
    },
});
module.exports=mongoose.model('State',stateSchema);
