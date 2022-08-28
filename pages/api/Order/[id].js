import mongoose from "mongoose";
import dbConnect from "../../../db/dbConnect";
import Order from "../../../models/order";
dbConnect();

export default async function handler(req, res) {
    const { id } = req.query
    
    if(req.method === 'POST'){
        try {
            const order = await Order.create(req.body);
            res.status(200).json({success: true, hero:order})
            } catch (error) {
                res.status(400).json({success: false, err: error})
            }   
    }else{
        if(id === 'all'){
            const order = await Order.find();
            res.status(200).json({data: order});
    }else{
        const order = await Order.find({orderId: id});
        res.status(200).json({data: order});
    }
    }
     

  }