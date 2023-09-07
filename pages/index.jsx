
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Image from 'next/image';
const BASE_URL = '/';
export default function Home() {
  const [Product, setProduct] = useState([]);
  const [cart, setCart] = useState([]);
  const [locCart, setLocCart] = useState(false)
  useEffect(() => {
    const fun =()=>{
       fetch('https://fakestoreapi.com/products').then(e=>e.json()).then((e)=>{
        setProduct(e.map(e=> ({...e,quan: 1, gst: 12, price: (e.price).toFixed(2)})))
        
        
      })
    }
    fun()
  }, [])
  
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light sticky-top py-2">
        <div className="container-fluid">
          <a className="navbar-brand fs-4" href="#" onClick={()=>setLocCart(false)}>Navbar</a>
          <div className="d-flex gap-2 align-items-center">
            <div className="d-none d-md-block">
              <input type="text" className="form-control" placeholder="Search" aria-describedby="emailHelp"/>
            </div>
            <span class="btn btn-outline-dark position-relative" onClick={()=>setLocCart(!locCart)}>
              cart
              <span class="position-absolute top-0 start-100 translate-middle p-1 px-2 bg-warning border border-light rounded-circle" style={{fontSize:'10px'}}>
              {cart.length}
                <span class="visually-hidden">New alerts</span>
              </span>
            </span>
          </div>
        </div>
      </nav>
      {locCart && <Cart Product={Product} setCart={setCart} Cart={cart} />}
      {!locCart && <Hom Product={Product} setProduct={setProduct} setCart={setCart} cart={cart} />}
      {cart.length >0?
        !locCart?(<button onClick={()=>setLocCart(!locCart)} className="opacity-75 btn btn-primary col-sm-4 col-md-3 col-lg-2 shadow-lg rounded-end my-4 rounded-0 fixed-bottom">{'₹ '+(cart.reduce((a,b)=> a = a+b.price*b.quan, 0)).toFixed(2)}</button>):''
      :''}
    </>
  )
}


function Hom({Product, setCart, cart, setProduct}) {
  const up =(e)=>{
    setProduct(Product.map(x=>{
      if(x.id === e.id){
        x.quan++
      }
      return x
    }));
  }
  const down =(e)=>{
    setProduct(Product.map(x=>{
      if(x.id === e.id){
        if(x.quan === 1){
          x.quan = 1
          setCart(cart.filter(y=> y.id != x.id));
        }else{
          
        x.quan--
        }
      }
      return x
    }));
  }
  const add = (e)=>{
    setCart(cart.concat(e));
    console.log(e);
  }
  return (
    <div className='row mx-0 gy-4 mt-3 col-12 col-md-11 col-lg-10 mx-auto'>
      {Product.map(e=>(
      <div className="card shadow mx-auto col-6 col-md-4 col-lg-3 p-1 border-0 rounded-3" style={{width: '22rem'}} key={e.id}>
        <Image alt={e.title} src={e.image} width={300} height={300} style={{width: '100%',aspectRatio:1,objectFit:'contain'}} className="card-img-top catGrow" />
        <div className="card-body">
          <p className="c-text text-truncate">{e.title}</p>
          <div className="d-flex justify-content-between my-1 align-items-center">
            <div>
              <h6 className="card-text">{'₹ '+(e.price)}</h6>
            </div>
            <div className='d-inline-flex gap-1'>
                <div className="bg-dark text-light px-1">{e.rating.rate} <i className='bi bi-star-fill'/></div>
                <p className='c-text m-0'>{e.rating.count} Reviews</p>
            </div>
          </div>
          {cart.filter((x) =>x.id == e.id).length > 0?(
            <div className='d-flex gap-2'>
                <div className="col d-flex align-items-center justify-content-between border px-3 rounded-2">
                  <span className="cursor-pointer" onClick={() => down(e)}>-</span>
                  <p className={`text-center disabled m-0 p-0`}>{e.quan}</p>
                  <span className="cursor-pointer" onClick={() => up(e)} >+</span>
                </div>
                <div className="col">
                <button className="btn btn-primary w-100" onClick={()=>add(e)}><i className='bi bi-bag me-1' />Checkout</button>
                </div>
          </div>
          
          ):(
            <div className='d-flex gap-2'>
              <button className="btn btn-outline-primary w-50" onClick={()=>add(e)}><i className='bi bi-plus' />Add to Cart</button>
              <button className="btn btn-primary w-50" onClick={()=>add(e)}><i className='bi bi-bag me-1' />Buy Now</button>
            </div>
          )}
          
        </div>
      </div>
      ))}
    </div>
  )
}


function Cart({Cart, setCart}) {
  const onlineCh = async ()=>{
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}
		const data = await axios.post('/api/razorpay', {Razorpay: ((Cart.reduce((a,b)=> a = a+b.price*b.quan, 0))*100).toFixed(2)}).then((t) =>
			t.data
		)

		console.log(data)
		const options = {
			key: "rzp_test_AT7nTPD9PEhBSB",
			currency: data.currency,
			amount: data.id,
			order_id: data.id,
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			image: BASE_URL+'/vercel.svg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
        ch()
			},
			prefill: {
				name,
				email: 'sdfdsjfh2@ndsfdf.com',
				phone_number: '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open() 
  }
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
  const ch =()=>{
    const uu = uuidv4();
    axios.post(BASE_URL+'/api/Order/post',{
      "orderId": uu,
      "userId":"545",
      "amount":`${(Cart.reduce((a,b)=> a = a+b.price, 0))}`,
      "add":"hhjhhhjhj",
      "con":"2474872125"
    }).then((e)=>{
      if(e.data.success){
        axios.post(BASE_URL+'/api/orderDetail/post',
          Cart.map(e=>
            ({
              orderId: uu,
              productId: e.id,
              quantity: e.quan,
              amount: (e.price)

            })
            )
        ).then(e=>{
          if(e.data.status){
            setCart([]);
          }
        }).catch((e)=>console.log( e))
      }
    }).catch((e)=>console.log( e))
  }
  return (
    <>
      {Cart.length > 0?(
      <div className="table-responsive">
        <table className="table overflow-auto">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">quan</th>
              <th scope="col">price</th>
              <th scope="col">IGST</th>
              <th scope="col">CGST</th>
              <th scope="col">BeforeTax </th>
              <th scope="col">Tot</th>
            </tr>
          </thead>
          <tbody>
            {Cart.map(e=>(
            <tr key={e.id}>
              <th scope="row">{e.id}</th>
              <td>{e.title}</td>
              <td>{e.quan}</td>
              <td>{(e.price)}</td>
              <td>{(((e.gst/2)/100)*e.price).toFixed(2)}</td>
              <td>{(((e.gst/2)/100)*e.price).toFixed(2)}</td>
              <td>{((e.price*e.quan)-(((e.gst)/100)*e.price)).toFixed(2)}</td>
              <td>{(e.price*e.quan)}</td>
            </tr>))}
            <tr>
              <th scope="row" onClick={(onlineCh)}>CheckOut</th>
              <td className="text-end">Total</td>
              <td>{(Cart.reduce((a,b)=> a = a+b.quan, 0))}</td>
              <td></td>
              <td>{(Cart.reduce((a,b)=> a = a+(((b.gst/2)/100)*b.price)*b.quan, 0)).toFixed(2)}</td>
              <td>{(Cart.reduce((a,b)=> a = a+(((b.gst/2)/100)*b.price)*b.quan, 0)).toFixed(2)}</td>
              <td>{(Cart.reduce((a,b)=> a = a+((b.price*b.quan)-(((b.gst)/100)*b.price))*b.quan, 0)).toFixed(2)}</td>
              <td>{(Cart.reduce((a,b)=> a = a+b.price*b.quan, 0)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ):(
        <h5 className="text-center text-danger">No Item</h5>
      )}
    </>
  )
}
