
import dbConnect from "../../db/dbConnect";
import orderDetail from "../../models/orderDetail";
dbConnect();

export default async function handler(req, res) {
    try {
        const orderdetail = await orderDetail.create(req.body);
        res.status(200).json({status: true, data: orderdetail});
        return ;

    } catch (error) {
      res.status(400).json({status: true, data: error});
      return ;
    }
    
  }
  