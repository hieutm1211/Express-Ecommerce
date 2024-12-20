const { model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'ApiKeys';

// Declare the Schema of the Mongo model
var apikeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    permission:{
        type:[String],
        required:true,
        enum:['0000', '1111', '2222'],
    },
},{
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apikeySchema);