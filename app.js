 
import Express  from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import router from "./route/route.js";
import { fileURLToPath } from 'url';
import path from 'path';
import shopify from "./config/config.js";
const app = Express();

import connection  from './mongoConnet.js';
connection('mongodb://127.0.0.1:27017/qrcode').then(()=>{
    console.log("Mongodb Connected");
}).catch((err)=>{
    console.log(err);
});
app.use(cors({origin: true}));
app.use(bodyParser.json({limit: '20mb'}));

app.use(router);

app.listen(process.env.PORT,()=>{
    console.log("app is running",process.env.PORT)
});     