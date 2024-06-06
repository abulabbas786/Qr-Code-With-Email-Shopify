import Express from "express";
import shopify from '../config/config.js';
import axios from 'axios';
import fs from 'fs'; // Import the file system module
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import ShopifyApp from "../models/url.js";
let createCheckoutWebhook = async (req, res, next) => {
  try {
    let orderid = req.body.id;
    let order = await shopify.order.get(orderid, { fields: 'line_items' });
    let orderProperties = order.line_items[0].properties;
    
    console.log(orderProperties)
    let orderProperties1 = orderProperties;
    orderProperties = await createTableHTML(orderProperties);
    // Generate QR code as a Base64 image
    let readableProperties = formatOrderProperties(orderProperties1);
    let strippedString = readableProperties.replace(/(<([^>]+)>)/gi, "");
    let qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(strippedString));
    let uniqueid = Math.random(2);
    orderProperties1.forEach((data) =>{
      if(data.name == 'Email'){
           ShopifyApp.create({
              url:qrCodeDataUrl,
              userName: data.value,
              uniqueid: uniqueid
           })
      }
    
    })
    // Send email with QR code
    await sendMail(qrCodeDataUrl,readableProperties,uniqueid);

    console.log(qrCodeDataUrl);
    res.send('OK');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

function formatOrderProperties(properties) {
  let formattedProperties = '';
  properties.forEach(property => {
    formattedProperties += `<p><strong>${property.name}:</strong> ${property.value}</p>`;
   
  });
  return formattedProperties;
}

async function sendMail(qrCodeDataUrl,readableProperties,uniqueid) {
 
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    requireTLS: true,
    auth: {
      user: "syedabulabbasrizvi@cedcommerce.com",
      pass: "L&J9d5HdTjGq",
    },
  });
  let url=`https://4440-103-97-184-106.ngrok-free.app/showqr?uniqueid=${uniqueid}`
  const mailOptions = {
    from: 'syedabulabbasrizvi@cedcommerce.com', // sender address
    to: "syedabulabbasrizvi@cedcommerce.com", // list of receivers
    subject: "Your Order Details", // Subject line
    text: "Here is your QR code containing your order details.", // plain text body
    html: `<p>Hello,</p>
            ${url}
           <p>Click above URL To Get your QRcode :</p>
           ${readableProperties}
           <p>Thank you for your order!</p>`, // html body
    // attachments: [
    //   {
    //     filename: 'qr-code.png',
    //     path: qrCodeDataUrl,
    //     cid: 'qrcode' // same cid value as in the html img src
    //   }
    // ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


function createTableHTML(data) {
  let tableHTML = '<table border="1">';
  data.forEach(item => {
      tableHTML += '<tr>';
      tableHTML += `<td>${item.name}</td>`;
      tableHTML += `<td>${item.value}</td>`;
      tableHTML += '</tr>';
  });
  tableHTML += '</table>';
  return tableHTML;
}
function propertiesToPlainText(properties) {
  return properties.map(prop => `${prop.name}: ${prop.value}`).join('\n');
}

let showQrcode = async (req,res)=>{
  const uniqueid = await req.query.uniqueid; 
  let result = await ShopifyApp.findOne({uniqueid:uniqueid});
    console.log(result.url)
    console.log("Unique ID:", uniqueid); 
    let finalImage  = `<img src="${result.url}">`;
    res.send(finalImage);
}
export  {createCheckoutWebhook,showQrcode};