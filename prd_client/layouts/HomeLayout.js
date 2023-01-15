import SideBar from "../components/SideBar";

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-row min-h-screen bg-[#f2f5fa] text-gray-800">
      <SideBar />
      <main className="main  flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        {children}
      </main>
    </div>
  );
};

export default HomeLayout;
