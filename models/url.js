import  mongoose from 'mongoose';
const url =new mongoose.Schema({
    url:{
        type:String,
        required:true
        
    },
    userName:{
        type:String
    },
    uniqueid:{
        type:String
    }
} ,{timestamp:true});

const ShopifyApp = mongoose.model('qrcode',url);

export default ShopifyApp;