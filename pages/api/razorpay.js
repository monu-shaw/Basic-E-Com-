const Razorpay = require('razorpay');

export default async function handler(req, res) {
    var instance = new Razorpay({ key_id: 'rzp_test_AT7nTPD9PEhBSB', key_secret: 'SIWowZH7VhfGOWaasnHCGu85' })
    const retData = await instance.orders.create({
        amount: +req.body.Razorpay,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
          key1: "value3",
          key2: "value2"
        }
      }).then(response => response)
      .catch(error => {
        console.log(error);
      });
      console.log(typeof(+req.body.Razorpay));
    res.status(200).json(retData)
  }