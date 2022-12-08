const Confirm = ({ shown, title, description, onAccept, onDecline, acceptText, declineText }) => {
  return (
    <>
      <input type="checkbox" className="modal-toggle" />
      <div className={`modal ${shown ? 'modal-open' : ''} bg-base-100/20 backdrop-blur-sm modal-bottom sm:modal-middle`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {title}
          </h3>
          <p className="py-4">
            {description}
          </p>
          <div className="modal-action">
            <label onClick={()=>onAccept()} className="btn hover:bg-yellow-500 hover:text-white btn-sm">
              {acceptText}
            </label>
            <label onClick={()=>onDecline()} className="btn btn-error btn-sm">
              {declineText}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;
