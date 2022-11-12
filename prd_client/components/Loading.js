import React from 'react'

import { VscLoading } from "react-icons/vsc"

const Loading = ({ loading }) => {
  return (
    <>{loading && <VscLoading className="h-8 animate-spin"/>}</>
  )
}

export default Loading