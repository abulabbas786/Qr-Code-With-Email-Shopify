import Express from "express";
const router = Express.Router();
import {createCheckoutWebhook,showQrcode} from "../controller/controller.js"

router.route('/')
.post(createCheckoutWebhook);

router.route('/showqr').get(showQrcode)
export default router;