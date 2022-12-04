import UserNav from "../components/Navbar/UserNav";

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const HomeLayout = ({ children }) => {
  return (
    <div className="relative h-screen">
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
        theme="light"
      />
      <UserNav />
      <main className="pt-8">
        <div className="">{children}</div>
      </main>
    </div>
  );
};

export default HomeLayout;
