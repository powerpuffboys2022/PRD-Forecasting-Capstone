import UserLayout from "../../layouts/UserLayout"


const about = () => {
  return (
    <div>about</div>
  )
}

about.getLayout = function getLayout(page) {
    return <UserLayout>{page}</UserLayout>;
  };
  

export default about