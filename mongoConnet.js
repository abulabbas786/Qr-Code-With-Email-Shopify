import mongoose  from 'mongoose';

const connection = async function connectingToMongo(port){
    mongoose.connect(port);
}

export default connection;