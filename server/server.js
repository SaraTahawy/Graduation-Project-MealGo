require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const createCouponRoute = require('./createCoupon'); // استدعاء ملف createCoupon.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

// نستخدم route
app.use('/api/admin', createCouponRoute);

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
