import { useState } from "react";
import { toast } from "react-toastify";

const CancelConfirm = ({ onAccept, onDecline, acceptText, declineText }) => {
  const [message, setMessage] = useState("");
  return (
    <>
      <div>
        <p className="mt-5">Let us know why this order needs to be canceled</p>
        <textarea
          id="message"
          rows="4"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
          className="mt-4 block p-2.5 w-full text-sm text-gray-900 outline-none bg-gray-50 rounded-lg border border-gray-300 ring ring-transparent ease-in-out duration-150 focus:ring-red-100"
          placeholder="Write your reason here..."
        ></textarea>
      </div>
      <div className="modal-action">
        <label
          onClick={() => onDecline()}
          className="btn btn-ghost hover:bg-rose-500 hover:text-white btn-sm "
        >
          {declineText}
        </label>
        <label
          onClick={() => {
            if (message.length === 0) {
              toast.warning("Reason is required", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
              return;
            }
            onAccept(message);
          }}
          className="btn hover:bg-yellow-500 hover:text-white btn-ghost btn-sm"
        >
          {acceptText}
        </label>
      </div>
    </>
  );
};

export default CancelConfirm;
