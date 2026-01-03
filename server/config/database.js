import mongoose from 'mongoose';

const Connection = async () => {
    const URL = process.env.DATABASE
    try {
        await mongoose.connect(URL,{ useNewUrlParser: true})
        console.log("connected") ;
    } catch (error) {
        console.log('Error while connecting to the database ', error);
    }
};

export default Connection;