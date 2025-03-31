const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
require("dotenv").config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env or default to 5000

const allowedOrigins = [
  "http://localhost:5173",
  "http://yourdomain.com",
  "http://anotherdomain.com",
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
}));

// Configure CORS to allow specific origin
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST"],
//   credentials: true,
// }));

// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   methods: ["GET", "POST"],
//   credentials: true,
// }));

app.use(express.json());

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,      // Load from .env
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Load from .env
});

app.post("/api/create-order", async (req, res) => {
  console.log("I am in create order");
  const { name, email, phone, slot } = req.body;
  const amount = 100000; // 1000 INR in paise

  const options = {
    amount,
    currency: "INR",
    receipt: `receipt_order_${slot}_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const response = await razorpayInstance.orders.create(options);
    console.log("Order created successfully:", response);
    res.json({
      orderId: response.id,
      amount: response.amount,
      amountInINR: response.amount / 100,
      currency: response.currency,
      key: process.env.RAZORPAY_KEY_ID, // Use env variable here too
      name,
      email,
      phone,
    });
  } catch (error) {
    console.error("Detailed error during order creation:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: "An error occurred during payment initiation",
      details: error.message,
      stack: error.stack
    });
  }
});

app.post("/api/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const crypto = require("crypto");
  
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Load from .env
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failure" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// FIXME: working code but code need to update render.com code

// // Backend code (index.js)
// const express = require("express");
// const cors = require("cors");
// const Razorpay = require("razorpay");

// const app = express();
// const port = 5000;

// // Configure CORS to allow specific origin
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST"],
//   credentials: true,
// }));
// app.use(express.json());

// const razorpayInstance = new Razorpay({
//   key_id: "rzp_test_Snd9OMrYNUF0ML",
//   key_secret: "5hknLwnO2woAztzFZuxeXLkh",
// });

// app.post("/api/create-order", async (req, res) => {
//   console.log("iam in create order");
//   const { name, email, phone, slot } = req.body;
//   const amount = 100000; // 1000 INR in paise (correct for Razorpay)

//   const options = {
//     amount, // Remains in paise for Razorpay
//     currency: "INR",
//     receipt: `receipt_order_${slot}_${Date.now()}`,
//     payment_capture: 1,
//   };

//   try {
//     const response = await razorpayInstance.orders.create(options);
//     console.log("Order created successfully:", response);
//     res.json({
//       orderId: response.id,
//       amount: response.amount, // Amount in paise for Razorpay compatibility
//       amountInINR: response.amount / 100, // Add human-readable amount in INR
//       currency: response.currency,
//       key: "rzp_test_Snd9OMrYNUF0ML",
//       name,
//       email,
//       phone,
//     });
//   } catch (error) {
//     console.error("Detailed error during order creation:", error.response ? error.response.data : error.message);
//     res.status(500).json({ 
//       error: "An error occurred during payment initiation",
//       details: error.message,
//       stack: error.stack
//     });
//   }
// });

// app.post("/api/verify-payment", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//   const crypto = require("crypto");
  
//   const generated_signature = crypto
//     .createHmac("sha256", "5hknLwnO2woAztzFZuxeXLkh")
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (generated_signature === razorpay_signature) {
//     res.json({ status: "success" });
//   } else {
//     res.status(400).json({ status: "failure" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// TODO: old code

// // Backend code (index.js)
// const express = require("express");
// const cors = require("cors");
// const Razorpay = require("razorpay");

// const app = express();
// const port = 5000;

// // Configure CORS to allow specific origin
// app.use(cors({
//   origin: "http://localhost:5173", // Adjust if your frontend runs on a different port
//   methods: ["GET", "POST"],
//   credentials: true,
// }));
// app.use(express.json());

// const razorpayInstance = new Razorpay({
//   key_id: "rzp_test_Snd9OMrYNUF0ML",
//   key_secret: "5hknLwnO2woAztzFZuxeXLkh",
// });

// app.post("/api/create-order", async (req, res) => {
//   console.log("iam in create order")
//   const { name, email, phone, slot } = req.body;
//   const amount = 100000; // 1000 INR in paise

//   const options = {
//     amount,
//     currency: "INR",
//     receipt: `receipt_order_${slot}_${Date.now()}`,
//     payment_capture: 1,
//   };

//   try {
//     const response = await razorpayInstance.orders.create(options);
//     console.log("Order created successfully:", response); // Log success
//     res.json({
//       orderId: response.id,
//       amount: response.amount,
//       currency: response.currency,
//       key: "rzp_test_Snd9OMrYNUF0ML",
//       name,
//       email,
//       phone,
//     });
//   } catch (error) {
//     console.error("Detailed error during order creation:", error.response ? error.response.data : error.message);
//     res.status(500).json({ 
//       error: "An error occurred during payment initiation",
//       details: error.message,
//       stack: error.stack
//     });
//   }
// });

// app.post("/api/verify-payment", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//   const crypto = require("crypto");
  
//   const generated_signature = crypto
//     .createHmac("sha256", "5hknLwnO2woAztzFZuxeXLkh")
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (generated_signature === razorpay_signature) {
//     res.json({ status: "success" });
//   } else {
//     res.status(400).json({ status: "failure" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });