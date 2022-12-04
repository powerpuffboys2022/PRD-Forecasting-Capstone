const Loading2 = ({ loading }) => {
  return (
    <>{loading && <progress className="progress w-32"></progress>}</>
  )
}

export default Loading2