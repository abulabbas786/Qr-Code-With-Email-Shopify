import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });
import Shopify from 'shopify-api-node';
const shopify = new Shopify({
  shopName: process.env.STORE_URL,
  accessToken:  process.env.SHOPIFY_ACCESS_TOKEN
});

  export default shopify;