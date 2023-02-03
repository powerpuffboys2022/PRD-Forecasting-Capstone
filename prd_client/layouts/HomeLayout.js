import SideBar from "../components/SideBar";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-row min-h-screen bg-[#f5f8fa] text-gray-800">
                      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        limit={1}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <SideBar />
      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        {children}
      </main>
    </div>
  );
};

export default HomeLayout;
