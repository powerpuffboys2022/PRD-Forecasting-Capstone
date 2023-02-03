const CustomConfirm = ({ shown, title, content }) => {
  return (
    <>
      <input type="checkbox" className="modal-toggle" />
      <div className={`modal font-inter ${shown ? 'modal-open' : ''} bg-base-100/20 backdrop-blur-sm modal-bottom sm:modal-middle`}>
        <div className="modal-box">
          <h3 className="font-medium text-lg">
            {title}
          </h3>
          { content }
        </div>
      </div>
    </>
  );
};

export default CustomConfirm;
