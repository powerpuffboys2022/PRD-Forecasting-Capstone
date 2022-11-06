import "./globals.css"
import SideBar from "../components/SideBar";

const layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Philip Rice Dealer</title>
        <meta name="description" content="Philip Rice Dealer Forecasting" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="relative h-screen flex">
          <SideBar />
          <main className="">
            <div className="">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
};

export default layout;
