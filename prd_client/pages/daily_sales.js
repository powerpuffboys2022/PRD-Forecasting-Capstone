import HomeLayout from "../Layouts/HomeLayout";

const daily_sales = () => {
  return <div>Daily Sales</div>;
};

daily_sales.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default daily_sales;
