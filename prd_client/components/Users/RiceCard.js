import React from "react";

const RiceCard = ({ imgUrl, articleName, price, netWeight }) => {

  const colors = ["bg-rose-100", "bg-pink-100", "bg-purple-100", "bg-indigo-100", "bg-cyan-100", "bg-teal-100", "bg-lime-100", "bg-amber-100", "bg-orange-100", "bg-red-100", "bg-stone-100"]
  const col = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div className="w-full cursor-pointer group hover:scale-105 duration-200 h-96 px-3 py-2 ">
        <div className="h-1/4 ">
        </div>
      <div className={`relative rounded-lg h-3/4 p-4 shadow-xl ${col}`}>
        <div className="flex justify-center">
            <img className="group-hover:scale-110 duration-300 absolute -top-24 max-h-52 rounded-lg drop-shadow-xl" src={imgUrl} alt="Shoes" />
        </div>
        <div className="h-20 mb-12"></div>
        <h2 className="text-center font-inter text-xl font-semibold">{articleName}</h2>
        <div className="divider" />
        <div className="flex justify-between">
            <h1 className="font-inter font-medium">{price} Php</h1>
            <h1 className="font-inter font-medium">{netWeight} KG</h1>
        </div>
      </div>
    </div>
  );
};

export default RiceCard;
