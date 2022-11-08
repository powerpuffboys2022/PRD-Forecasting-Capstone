import { useRouter } from "next/router";
import { useState } from "react";

const userProfile = () => {

    const router = useRouter();

    const [ userName, setUserName ] = useState();
    const [ password, setPassword ] = useState();
    const [ profileUrl, setProfileUrl ] = useState();

  return (
    <div>
        
    </div>
  )
}

export default userProfile