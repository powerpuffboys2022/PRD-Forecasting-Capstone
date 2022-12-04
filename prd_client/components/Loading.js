import React from 'react'

import { VscLoading } from "react-icons/vsc"

const Loading = ({ loading }) => {
  return (
    <>{loading && <VscLoading className="text-2xl animate-spin"/>}</>
  )
}

export default Loading