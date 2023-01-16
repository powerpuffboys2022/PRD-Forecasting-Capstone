import { useState, useEffect } from "react";
import getConfig from 'next/config';

import { TbBuildingWarehouse } from "react-icons/tb";
import { RiScales2Fill } from "react-icons/ri";
import { GiPaperBagFolded } from "react-icons/gi";
import { TiWarning, TiInfo } from "react-icons/ti";
import { BsCloudUpload } from "react-icons/bs";
import { MdOutlineTipsAndUpdates } from "react-icons/md";

import { toast } from "react-toastify";

import { dateMomentBeautify, getDateAgo } from "../../helpers";
import { storage } from "../../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const ProductCard = ({ rice, isNew, onsave, ondelete, onupdate }) => {
  const [loading, setLoading] = useState(false);

  const [fileImg, setFileImg] = useState();
  const [imgUrl, setImgUrl] = useState("/emptyimage.png");
  const [articleName, setArticleName] = useState("");
  const [articleCode, setArticleCode] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.0);
  const [stock, setStock] = useState(0);
  const [pricePerKg, setPricePKg] = useState(0.0);
  const [netWeight, setNetWeight] = useState(0);

  const [sold, setSold] = useState(0);
  const [purchased, setPurchased] = useState(0);

  const { publicRuntimeConfig } = getConfig();

  const handleUpload = () => {
    setLoading(true);
    const storageRef = ref(storage, `/products/${isNew ? uuidv4() : rice._id}`);
    const uploadTask = uploadBytesResumable(storageRef, fileImg);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        toast.error("Failed Uploading Photo", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          save(url);
        });
      }
    );
  };

  const save = async (url) => {
    try {
      setLoading(true);
      const req = await axios.post("/api/prd/rice", {
        mode: isNew ? 1 : 2,
        _id: rice._id,
        content: {
          articleName,
          articleCode,
          price,
          pricePerKg,
          stock,
          description,
          netWeight,
          imgUrl: !url ? imgUrl : url,
        },
      });

      toast.success("Changes saved", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      setFileImg(null);
      onsave();
    } catch (e) {
      console.log(e);
      toast.error("Couldn't save changes", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSelf = async () => {
    try {
      if (isNew) {
        setImgUrl("/emptyimage.png");
        setArticleName("");
        setStock(0);
        setArticleCode("");
        setPrice(0);
        setDescription("");
        setNetWeight(0);
        setPricePKg(0);
        setPurchased(0);
        setSold(0);
        return;
      }
      setLoading(true);
      const req = axios.post("/api/prd/rice", {
        mode: 4,
        content: { _id: rice._id },
      });
      setImgUrl(rice.imgUrl);
      setArticleName(rice.articleName);
      setStock(rice.stock);
      setArticleCode(rice.articleCode);
      setPrice(rice.price);
      setDescription(rice.description);
      setNetWeight(rice.netWeight);
      setPricePKg(rice.pricePerKg);
      setPurchased(rice.purchased);
      setSold(rice.sold);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelf();
  }, [rice]);

  return (
    <div className="pr-2 relative ">
      <div className="bg-white rounded-lg p-4">
        {!isNew && (
          <div className="mt-4 flex justify-center">
            <div data-theme="dracula" className="stats font-helvetica shadow">
              <div className="stat">
                <div className="stat-figure text-4xl text-yellow-400">
                  <GiPaperBagFolded className="text-2xl mr-2 " />
                </div>
                <div className="stat-title">Sold (Sack)</div>
                <div className="stat-value text-yellow-400">{sold}</div>
                <div className="stat-desc">{rice.sold} items sold</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-4xl text-yellow-400">
                  <RiScales2Fill />
                </div>
                <div className="stat-title ">Sold (retail)</div>
                <div className="stat-value text-yellow-400">{purchased}</div>
                <div className="stat-desc">{rice.purchased} kg sold</div>
              </div>

              <div className="stat">
                <div
                  className={
                    "stat-figure text-4xl " +
                    `${
                      stock === 0
                        ? "text-red-500"
                        : `${
                            stock > 1 && stock <= 10
                              ? "text-orange-500"
                              : "text-blue-500"
                          }`
                    }`
                  }
                >
                  <TbBuildingWarehouse />
                </div>

                <div className="stat-title">Stock</div>
                <div
                  className={
                    "stat-value " +
                    `${
                      stock === 0
                        ? "text-red-500"
                        : `${
                            stock > 1 && stock <= 10
                              ? "text-orange-500"
                              : "text-blue-500"
                          }`
                    }`
                  }
                >
                  {stock}
                </div>

                <div className="stat-desc">{stock} stock on hand</div>
              </div>
            </div>
          </div>
        )}
        {/* <img
        src={imgUrl}
        className="mt-4 mx-auto w-72 p-4 rounded-md smooth-shadow2"
      /> */}

        {imgUrl === "/emptyimage.png" ? (
          <div className="mt-6 w-full rounded-lg bg-gray-200">
            <img
              className="h-auto mx-auto w-full"
              src={imgUrl}
              alt={rice.description}
            />
            <p className="text-gray-700 text-center pb-4 text-sm ">
              this product has no image
            </p>
          </div>
        ) : (
          <img
            className="mx-auto w-80 rounded-xl mt-4 drop-shadow-2xl"
            src={imgUrl}
            alt={rice.description}
          />
        )}
        {isNew && (
          <div
            className="flex items-center p-4 animate-pulse mt-6 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <MdOutlineTipsAndUpdates className="text-2xl mr-2 " />
            <span className="sr-only">Note</span>
            <div>
              <span className="font-medium">Note!</span> This product is not yet
              recorded, don&apos;t forget to save.
            </div>
          </div>
        )}
        {stock === 0 && !isNew && (
          <div
            className="flex animate-pulse items-center p-4 mt-6 text-sm text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <TiWarning className="text-2xl mr-2 " />
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Notice!</span> This product is out
              of stock.
            </div>
          </div>
        )}
        {stock <= 10 && stock > 0 && !isNew && (
          <div
            className="flex items-center animate-pulse p-4 mt-6 text-sm text-yellow-700 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400 dark:border-yellow-800"
            role="alert"
          >
            <TiInfo className="text-2xl mr-2 " />
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Notice!</span> This product stock is
              getting low
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <p className="text-sm font-medium text-gray-900 ">
            Change Product Photo
          </p>
          {fileImg && (
            <p
              onClick={() => {
                setImgUrl(rice.imgUrl);
                setFileImg(null);
              }}
              className="text-sm font-medium text-yellow-700 cursor-pointer"
            >
              Revert
            </p>
          )}
        </div>

        <div className="flex mt-2 items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="duration-200 ease-in-out flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <BsCloudUpload className="text-4xl text-gray-500" />
              <p className="mb-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Upload/Change</span> product photo by{" "}
                <span className="font-semibold">clicking here</span>
              </p>
              <p className={`${fileImg? "animate-pulse" : ""} `+" text-sm mt-4 font-medium text-gray-500 dark:text-gray-400"}>
                {fileImg ? `${fileImg.name} - ${(fileImg.size / 1000000).toFixed(2)} MB` : "PNG, JPG or GIF - max size "+(publicRuntimeConfig.maxUploadImage / 1000000)+" MB"}
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files.length === 0) return;
                if (e.target.files[0].size > publicRuntimeConfig.maxUploadImage ){
                    toast.warning("Too large, Image size limit is "+(publicRuntimeConfig.maxUploadImage / 1000000)+" MB", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 3000
                      });
                    return;
                }
                setFileImg(e.target.files[0]);
                setImgUrl(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </label>
        </div>

        <div className="mt-6">
          <label
            htmlFor="articleName"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Article Name
          </label>
          <input
            type="text"
            id="articleName"
            value={articleName}
            onChange={(e) => setArticleName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="articleCode"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Article Code
          </label>
          <input
            type="text"
            id="articleCode"
            value={articleCode}
            onChange={(e) => setArticleCode(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="mt-6 flex justify-between space-x-2">
          <div className="w-1/2">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Price (per sack)
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              id="price"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Price per sack"
              required
            />
          </div>

          <div className="w-1/2">
            <label
              htmlFor="pkg"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Retail Price (per kg)
            </label>
            <input
              value={pricePerKg}
              onChange={(e) => setPricePKg(e.target.value)}
              type="number"
              id="pkg"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Retail price per kg"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between space-x-2">
          <div className="w-1/2">
            <label
              htmlFor="net"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Net Weight
            </label>
            <input
              value={netWeight}
              onChange={(e) => setNetWeight(e.target.value)}
              type="number"
              id="net"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Net Weight"
              required
            />
          </div>

          <div className="w-1/2">
            <label
              htmlFor="stock"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Stock
            </label>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              id="stock"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Stock on hand"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Product Description
          </label>
          <textarea
            id="description"
            rows="4"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write a short description about this product..."
          ></textarea>
        </div>

        <div className={loading ? "opacity-50 animate-pulse" : ""}>
          <p className="block mt-6 text-sm font-medium text-gray-900 ">
            Actions
          </p>
          <div className="mt-2 flex justify-between">
            <button
              disabled={loading}
              type="button"
              onClick={() => {
                fetchSelf();
                toast.success("Changes Discarded", {
                  position: toast.POSITION.BOTTOM_RIGHT,
                });
              }}
              className="duration-200 ease-in-out py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-red-400 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-900 hover:text-red-100 focus:z-10 focus:ring-4 focus:ring-gray-200"
            >
              Undo Changes
            </button>
            <button
              type="button"
              onClick={() => {
                if (fileImg) handleUpload();
                else save();
              }}
              disabled={loading}
              className="duration-200 ease-in-out focus:outline-none text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
            >
              Save Changes
            </button>
          </div>

          {!isNew && (
            <>
              <p className="block mt-6 text-sm font-medium text-gray-900 ">
                Destructive Action
              </p>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  ondelete();
                }}
                className="duration-200 ease-in-out py-1 w-full mt-2 px-5 mr-2 mb-2 text-sm font-medium text-red-400 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Delete Product
              </button>
              <p className="text-sm mt-4 font-medium text-gray-900 ">
                Other Info
              </p>
              <p className="mt-6 text-sm font-medium">
                ID : <span className="font-normal">{rice._id}</span>
              </p>
              <p className="mt-2 text-sm font-medium">
                Added :{" "}
                <span className="font-normal">
                  {dateMomentBeautify(
                    new Date(rice.dateAdded),
                    "MMM Do YYYY, h:mm a"
                  )}
                </span>{" "}
                - {getDateAgo(new Date(), new Date(rice.dateAdded))}{" "}
                <span className="font-normal"> days ago</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
