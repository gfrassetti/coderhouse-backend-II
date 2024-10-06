import mongoose from "mongoose"; 

export const connectionDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
        console.log('Conection Succesful')
    } catch (e) {
        console.log('Error connecting db');
    }
}