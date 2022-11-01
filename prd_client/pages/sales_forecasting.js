import HomeLayout from "../Layouts/HomeLayout";

const sales_forecasting = () => {
  return <div>Sales Forecasting</div>;
};

sales_forecasting.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default sales_forecasting;
