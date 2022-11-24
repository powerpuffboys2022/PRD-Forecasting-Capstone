import { useState } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai"

const RiceCard2 = ({ uid, _id, imgUrl, articleName, price, netWeight, stock, onAddToCart, gcart }) => {
  const [qty, setQty] = useState(1);
  
  const updateUser = ( nw ) => {
    const response = fetch("/api/prd/updateUser", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateMode : 0,
        _id : uid,
        userData : {
            cart : [...gcart, nw]
        }
      }),
    })
      .then((response) => response.json())
      .then((data) => {
      });
  };

  const isPresent = () =>{
    const present = gcart.filter((v, i) => v._id === _id )
    return present.length > 0
  }

  return (
    <div className="rounded-lg p-4 shadow-xl hover:scale-105 duration-300 bg-base-100">
      <div className="flex justify-center">
        <div
          className="shadow-xl group-hover:scale-110 h-72 w-full bg-cover duration-300 rounded-lg "
          style={{"backgroundImage" : `url(${imgUrl})`}}
          alt="Shoes"
        />
      </div>
      <p className="font-inter text-2xl font-medium text-center mt-6">
        {articleName}
      </p>
      <p className="font-inter mt-4">
        {netWeight} kg Net Weight
      </p>
      <p className="font-inter mt-2">
        {stock} Sack Available
      </p>
      <div className="flex justify-between items-center mt-6">
        <p className="font-medium font-inter text-xl ">₱ {price * qty}</p>
        <div className="flex justify-evenly items-center space-x-3">
            {/* <AiFillMinusCircle onClick={()=>{ if( qty > 1 ) setQty(qty - 1) }} className="text-sm btn btn-sm btn-ghost btn-circle"/> */}
            {/* <p>{qty}</p> */}
            {/* <AiFillPlusCircle onClick={()=>{ if( qty < stock ) setQty(qty + 1) }} className="text-sm btn btn-sm btn-ghost btn-circle"/> */}
        </div>
      </div>
      <button 
      disabled = {isPresent()}
       onClick={() => { 
            const newR = { _id,  qty : 1 }
            
            if(isPresent()) return;

            updateUser(newR)
            onAddToCart();
        }} className={`btn mt-4 btn-wide btn-sm bg-rose-500 text-white ${isPresent() ? 'btn-disabled' : ''}` }>
        {isPresent() ? 'Already On Cart' : 'Add To Cart' }
      </button>
    </div>
  );
};

export default RiceCard2;
