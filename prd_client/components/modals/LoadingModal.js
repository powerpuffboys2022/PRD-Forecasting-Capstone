import { AiOutlineLoading } from "react-icons/ai"

const Confirm = ({ shown, message}) => {
  return (
    <>
      <input type="checkbox" className="modal-toggle" />
      <div className={`modal ${shown ? 'modal-open' : ''} bg-base-100/20 backdrop-blur-sm modal-bottom sm:modal-middle`}>
        <div className="modal-box bg-base-100/80 shadow-none p-4">
            <AiOutlineLoading className="text-4xl animate-spin mx-auto my-12"/>
            <p className="tracking-wider mx-auto text-center">{message}</p>
        </div>
      </div>
    </>
  );
};

export default Confirm;
