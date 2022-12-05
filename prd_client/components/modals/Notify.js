const Confirm = ({ shown, title, content, onOkay }) => {
  return (
    <>
      <input type="checkbox" className="modal-toggle" />
      <div className={`modal ${shown ? 'modal-open' : ''} bg-base-100/20 backdrop-blur-sm modal-bottom sm:modal-middle`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">
            {title}
          </h3>
          {
            content
          }
          <div className="modal-action">
            <label onClick={()=>onOkay()} className="btn bg-yellow-500 hover:bg-yellow-700 btn-sm">
              Okay
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;
