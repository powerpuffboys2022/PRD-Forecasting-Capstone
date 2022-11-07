import SideBar from "../components/SideBar";

const HomeLayout = ({ children }) => {
  return (
    <div className="relative h-screen flex">
      <SideBar />
      <main className="">
        <div className="">{children}</div>
      </main>
    </div>
  );
};

export default HomeLayout;
