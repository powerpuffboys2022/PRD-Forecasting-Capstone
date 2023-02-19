import { useState } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";

const RiceCard2 = ({
  uid,
  _id,
  imgUrl,
  articleName,
  price,
  netWeight,
  stock,
  description,
  onAddToCart,
  gcart,
}) => {
  const [qty, setQty] = useState(1);

  const updateUser = (nw) => {
    const response = fetch("/api/prd/updateUser", {
      method: "POST", 
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        filter : { _id :uid },
        content: {
          cart: [...gcart, nw],
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Added To Cart", {
          position: toast.POSITION.TOP_LEFT,
        });
        onAddToCart();
      })
      .catch((err) => {
        toast.error("Add to cart failed", {
          position: toast.POSITION.TOP_LEFT,
        });
      });
  };

  const isPresent = () => {
    const present = gcart.filter((v, i) => v._id === _id);
    return present.length > 0;
  };

  return (
    <div className="mountedanimater relative p-4 group hover:scale-105 bg-white/90 duration-300 hover:bg-yellow-500 hover:drop-shadow-2xl hover:z-0">
      <div className="flex justify-center">
        <div
          className="h-72 w-5/6 bg-cover bg-transparent bg-center duration-300 rounded-lg "
          style={{ backgroundImage: `url(${imgUrl})` }}
          alt="Shoes"
        />
      </div>
      <div className="mt-4 group-hover:text-white">
        <p className="text-center text-lg font-bold tracking-wider">
          {articleName}
        </p>
        <p className="my-2 opacity-80 font-inter">{description}</p>
        <div className="flex justify-between items-center">
          <p className="font-medium">{netWeight} Kg</p>
          <p className="font-medium">₱ {price}</p>
        </div>
        <button
          disabled={isPresent()}
          onClick={() => {
            const newR = { _id, qty: 1 };
            if (isPresent()) return;
            updateUser(newR);
          }}
          className={`btn mt-4 w-full btn-sm bg-yellow-500 rounded-none btn-ghost group-hover:btn-outline hover:bg-yellow-400 text-white ${
            isPresent() ? "btn-disabled" : ""
          }`}
        >
          {isPresent() ? "Already On Cart" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
};


export default RiceCard2;
