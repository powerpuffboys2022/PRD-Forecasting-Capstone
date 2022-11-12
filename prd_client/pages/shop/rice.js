import UserLayout from "../../layouts/UserLayout"

const rice = () => {
  return (
    <div>rice</div>
  )
}

rice.getLayout = function getLayout(page) {
    return <UserLayout>{page}</UserLayout>;
  };
  

export default rice