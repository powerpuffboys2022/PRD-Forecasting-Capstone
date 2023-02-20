import SideBar from "../components/SideBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeLayout = ({ children }) => {
  return (
    <>
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
        <main className="hidden md:flex main flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
          {children}
        </main>
        {/* <p className="block md:hidden"> Please use bigger screen to manage PRD</p> */}
      </div>
      {/* <div className="flex md:hidden justify-center w-screen h-screen mx-8">
        <div className="mt-16 mx-auto">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <svg
              fill="currentColor"
              className="h-8"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10.5 18a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"></path>
              <path
                fillRule="evenodd"
                d="M7.125 1.5A3.375 3.375 0 003.75 4.875v14.25A3.375 3.375 0 007.125 22.5h9.75a3.375 3.375 0 003.375-3.375V4.875A3.375 3.375 0 0016.875 1.5h-9.75zM6 4.875c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v14.25c0 .621-.504 1.125-1.125 1.125h-9.75A1.125 1.125 0 016 19.125V4.875z"
              ></path>
            </svg>
            <svg
              className="h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z"
              ></path>
            </svg>
          </div>
          <p className="text-xs text-gray-600 text-center mt-8">
            Sorry, your screen is too small, use table, pc or laptop to manage
            PRD
          </p>
        </div>
      </div> */}
    </>
  );
};

export default HomeLayout;
