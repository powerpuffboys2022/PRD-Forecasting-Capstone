import { useState, useEffect } from "react";
import { dateMomentBeautify, getDateAgo, statusToWord } from "../../helpers";

import {
    MdOutlineClose,
    MdPendingActions,
    MdLocalShipping,
    MdLocalPhone,
} from "react-icons/md";
import { FaHandshake, FaDirections } from "react-icons/fa";
import {
    AiOutlineFileDone,
    AiOutlineStop,
    AiFillDelete,
    AiFillCheckCircle,
} from "react-icons/ai";
import { VscLoading } from "react-icons/vsc";
import { IoMdCheckmark } from "react-icons/io";
import { CiReceipt } from "react-icons/ci";

import getConfig from "next/config";
import { toast } from "react-toastify";
import axios from "axios";
import { itMatchesOne } from "daisyui/src/lib/postcss-prefixer/utils";

const OrderComponent = ({
    _id,
    editorData,
    onUpdate,
    onDelete,
    onAccept,
    onDecline,
    close,
}) => {
    const { publicRuntimeConfig } = getConfig();
    const [loading, setLoading] = useState(false);

    const [partnerData, setPartnerData] = useState();
    const [orderData, setOrderData] = useState();
    const [you, setYou] = useState();

    const [qty, setQty] = useState(0);

    const loadPartner = async () => {
        try {
            const request = await axios.post("/api/prd/userInfo", {
                _id: orderData.userId,
            });
            setPartnerData(request.data);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const init = async () => {
        try {
            setLoading(true);
            const request = await axios.post("/api/prd/transaction", {
                mode: 4,
                content: { _id },
            });
            setOrderData(request.data);
            let q = 0;
            request.data.rice.forEach((r) => {
                q += r.qty;
            });
            setQty(q);
        } catch (e) { }
    };

    useEffect(() => {
        loadPartner();
    }, [orderData]);

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="p-4 w-full">
            <div className="flex justify-between items-center">
                <p className="text-2xl font-medium mt-4">Order Details</p>
                <MdOutlineClose
                    onClick={() => close()}
                    className="text-2xl cursor-pointer text-gray-400 hover:text-gray-700"
                />{" "}
            </div>
            <p className="inline-flex gap-2 mt-4 items-center">
                <CiReceipt className="text-xl" />{" "}
                {orderData ? (
                    <span className="text-sm">{orderData._id}</span>
                ) : (
                    <VscLoading className="text-sm animate-spin" />
                )}
            </p>

            <div className="p-4 mt-4 w-full border rounded-md mx-auto">
                <div className="flex flex-col items-center">
                    {loading ? (
                        <>
                            <VscLoading className="text-xl animate-spin" />
                        </>
                    ) : (
                        <>
                            {partnerData ? (
                                <>
                                    <div className="w-full flex justify-center">
                                        <div className="avatar">
                                            <div className="w-48 rounded-full smooth-shadow2">
                                                <img src={partnerData.imgUrl} className="" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center text-lg font-medium inline-flex items-center text-gray-600 mt-4">
                                        <span>{partnerData.userName}</span>
                                    </p>
                                    <p className="text-center inline-flex items-center text-gray-600 mt-4">
                                        <FaHandshake className="text-2xl mr-2" />
                                        <span>PRD Partner</span>
                                    </p>
                                    <p className="text-center text-xs text-gray-600 mt-4">
                                        Joined on{" "}
                                        {dateMomentBeautify(
                                            new Date(partnerData.dateJoined),
                                            "MMMM Do YYYY"
                                        )}
                                    </p>
                                </>
                            ) : (
                                <p className="text-center text-sm text-red-700">
                                    couldn&apos;t load partner data
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {orderData && orderData.status === -1 && (
                <div className="bg-red-50 mt-6 p-4 w-full ">
                    <div
                        className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                        role="alert"
                    >
                        <AiOutlineStop className="text-xl mr-2 text-red-600" />
                        <span className="sr-only">canceled</span>
                        <div>
                            <span className="font-medium">This order has been canceled.</span>
                        </div>
                    </div>
                    <p className="mt-4 text-rose-700 ">
                        <span className="text-gray-700 font-medium">Reason : </span>
                        {orderData.reason}
                    </p>
                </div>
            )}

            {orderData && orderData.status === 1 && (
                <div
                    className="mt-6 flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                    role="alert"
                >
                    <svg
                        aria-hidden="true"
                        className="flex-shrink-0 inline w-5 h-5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="w-full">
                        <span className="font-medium">Pending! </span> This order is waiting
                        for your confirmation
                        <div className="mt-4 flex justify-start items-center">
                            <button
                                onClick={() => onAccept(orderData)}
                                type="button"
                                className="text-sm text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-2 py-1 text-center inline-flex items-center mr-2 mb-2"
                            >
                                Accept <IoMdCheckmark className="ml-2 text-sm" />
                            </button>
                            <button
                                onClick={() => {
                                    onDecline(orderData);
                                }}
                                type="button"
                                className="text-sm text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-2 py-1 text-center inline-flex items-center mr-2 mb-2"
                            >
                                Decline <AiOutlineStop className="ml-2 text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {orderData && (
                <>
                    <div className="p-4 border mt-6 rounded-md">
                        <p className="text-lg font-medium">Tracking / Status</p>
                        <p className="text-sm text-gray-500 mt-2 ">
                            Tracking helps identify what is the status of the order. This will
                            reflect to the user tracking record as well.
                        </p>
                        <ol className="ml-6 mt-6 relative text-gray-500 border-l border-gray-200">
                            <li
                                className={
                                    "mb-10 ml-6 " +
                                    `${orderData.status >= 1 ? "text-yellow-600" : ""}`
                                }
                            >
                                <span className=" absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white ">
                                    <MdPendingActions className="text-2xl" />
                                </span>
                                <h3 className="font-medium leading-tight">Placed</h3>
                                <p className="text-sm text-gray-500">
                                    {dateMomentBeautify(
                                        new Date(orderData.placedDate),
                                        "MMMM DD, YYYY"
                                    )}{" "}
                                    <span className="text-xs font-medium">
                                        ({getDateAgo(new Date(), new Date(orderData.placedDate))}{" "}
                                        days ago)
                                    </span>
                                </p>
                            </li>

                            {orderData.status === -1 ? (
                                <li
                                    className={
                                        "ml-6 " +
                                        `${orderData.status === -1 ? "text-red-700 " : ""}`
                                    }
                                >
                                    <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white ">
                                        <AiOutlineStop className="text-2xl" />
                                    </span>
                                    <h3 className="font-medium leading-tight">Canceled</h3>
                                    <p className="text-sm text-gray-500">
                                        {dateMomentBeautify(
                                            new Date(orderData.trackingDates.canceledDate),
                                            "MMMM DD, YYYY"
                                        )}{" "}
                                        <span className="text-xs font-medium">
                                            (
                                            {getDateAgo(
                                                new Date(),
                                                new Date(orderData.trackingDates.canceledDate)
                                            )}{" "}
                                            days ago)
                                        </span>
                                    </p>
                                </li>
                            ) : (
                                <>
                                    <li
                                        className={
                                            "mb-10 ml-6 " +
                                            `${orderData.status >= 2 ? "text-blue-600 " : ""}`
                                        }
                                    >
                                        <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white ">
                                            <AiOutlineFileDone className="text-2xl" />
                                        </span>
                                        <h3 className="font-medium leading-tight">Processed</h3>
                                        {!orderData.trackingDates.processed ? (
                                            <p className="text-sm">-</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {dateMomentBeautify(
                                                    new Date(orderData.trackingDates.processed),
                                                    "MMMM DD, YYYY"
                                                )}{" "}
                                                <span className="text-xs font-medium">
                                                    (
                                                    {getDateAgo(
                                                        new Date(),
                                                        new Date(orderData.trackingDates.processed)
                                                    )}{" "}
                                                    days ago)
                                                </span>
                                            </p>
                                        )}
                                    </li>
                                    <li
                                        className={
                                            "mb-10 ml-6 " +
                                            `${orderData.status >= 3 ? "text-indigo-600 " : ""}`
                                        }
                                    >
                                        <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white ">
                                            <MdLocalShipping className="text-2xl" />
                                        </span>
                                        <h3 className="font-medium leading-tight">Shipped</h3>
                                        {!orderData.trackingDates.shipped ? (
                                            <p className="text-sm">-</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {dateMomentBeautify(
                                                    new Date(orderData.trackingDates.shipped),
                                                    "MMMM DD, YYYY"
                                                )}{" "}
                                                <span className="text-xs font-medium">
                                                    (
                                                    {getDateAgo(
                                                        new Date(),
                                                        new Date(orderData.trackingDates.shipped)
                                                    )}{" "}
                                                    days ago)
                                                </span>
                                            </p>
                                        )}
                                    </li>
                                    <li
                                        className={
                                            "ml-6 " +
                                            `${orderData.status === 4 ? "text-green-600" : ""}`
                                        }
                                    >
                                        <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white ">
                                            <AiFillCheckCircle className="text-2xl" />
                                        </span>
                                        <h3 className="font-medium leading-tight">Completed</h3>
                                        {!orderData.trackingDates.completed ? (
                                            <p className="text-sm">-</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {dateMomentBeautify(
                                                    new Date(orderData.trackingDates.completed),
                                                    "MMMM DD, YYYY"
                                                )}{" "}
                                                <span className="text-xs font-medium">
                                                    (
                                                    {getDateAgo(
                                                        new Date(),
                                                        new Date(orderData.trackingDates.completed)
                                                    )}{" "}
                                                    days ago)
                                                </span>
                                            </p>
                                        )}
                                    </li>
                                </>
                            )}
                        </ol>
                    </div>

                    <div className="p-4 border rounded-md mt-6">
                        <p className="text-lg font-medium">Items </p>
                        <p className="mt-2 text-sm text-gray-500">You can check the items current stock and other details by clicking the name of the item. </p>

                        <div className="relative overflow-x-auto mt-6 rounded-md">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 rounded-l-lg">
                                            Rice Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Qty
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Base Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 rounded-r-lg">
                                            Cost
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.rice.map((r, i) => (
                                        <tr key={i} className="bg-white dark:bg-gray-800">
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                <a
                                                    target="_blank"
                                                    className="hover:link"
                                                    href={`/admin/inventory?srch=${r._id}`}
                                                    rel="noopener noreferrer"
                                                >
                                                    {r.name}{" "}
                                                    <span className="text-xs text-gray-500">
                                                        ( {r.netWeight} kg )
                                                    </span>
                                                </a>
                                            </th>
                                            <td className="px-6 py-4">{r.qty}x</td>
                                            <td className="px-6 py-4">
                                                {r.price.toLocaleString("en-US")}
                                            </td>
                                            <td className="px-6 py-4">
                                                {(r.price * r.qty).toLocaleString("en-US")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-100">
                                    <tr className="font-semibold text-gray-900 dark:text-white">
                                        <th scope="row" className="px-6 py-3 text-base">
                                            Total
                                        </th>
                                        <td className="px-6 py-3">{qty}</td>
                                        <td></td>
                                        <td className="px-6 py-3">
                                            Php {orderData.totalPrice.toLocaleString("en-US")}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 p-4 mb-6 border rounded-md">
                        <p className="text-lg font-medium">Delivery</p>
                        <p className="mt-2 text-sm text-gray-500">
                            The details below will be used for delivery purposes
                        </p>
                        {partnerData ? (
                            <>
                                <p className="text-sm mt-5">
                                    <span className="inline-flex gap-2">
                                        <FaDirections className="text-xl" /> {partnerData.address}
                                    </span>
                                </p>
                                <p className="text-sm mt-4">
                                    <span className="inline-flex gap-2">
                                        <MdLocalPhone className="text-xl" /> {partnerData.contact}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <VscLoading className="text-xl animate-spin" />
                        )}
                    </div>
                </>
            )}

            <div className="h-2"></div>
        </div>
    );
};

export default OrderComponent;
