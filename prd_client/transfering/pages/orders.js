import HomeLayout from "../Layouts/HomeLayout";

const orders = () => {
  return <div>Orders</div>;
};

orders.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default orders;
