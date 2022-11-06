import HomeLayout from "../Layouts/HomeLayout";

const inventory = () => {
  return <div>Inventory</div>;
};

inventory.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default inventory;
