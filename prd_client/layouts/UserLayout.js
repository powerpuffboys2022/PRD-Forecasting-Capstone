import UserNav from "../components/Navbar/UserNav";

const HomeLayout = ({ children }) => {
  return (
    <div className="relative h-screen">
      <UserNav />
      <main className="pt-8">
        <div className="">{children}</div>
      </main>
    </div>
  );
};

export default HomeLayout;
