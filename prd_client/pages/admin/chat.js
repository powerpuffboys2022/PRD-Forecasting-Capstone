import Head from "next/head";
import { useState, useEffect } from "react";

import HomeLayout from "../../layouts/HomeLayout";
import ChatContent from "../../components/ChatContent";
import axios from "axios";

const ChatSupport = () => {
  const [list, setList] = useState([]);
  const [focusedChat, setFocusedChat] = useState();
  const [requesting, setRequesting] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const loadList = async () => {
    try {
      setRequesting(true);
      const response = await axios.post("/api/prd/chat", {
        mode: 1,
        filter: { isDeleted : false },
        content: {},
        project: {
          _id: 1,
          ownerId: 1,
          adminUnread: 1,
          "ownerInfo.userName": 1,
          "ownerInfo.imgUrl": 1,
          "ownerInfo.email": 1,
          "ownerInfo.userType": 1,
        },
      });
      setList(response.data);
      setRequesting(false);
      setTrigger(Date.now())
    } catch (e) {}
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (requesting) return;
      await loadList();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-inter overflow-y-scroll h-screen bg-[#f5f8fa]">
      <Head>
        <title>Daily Sales</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <link itemProp="image" href="cover.png" />
        <meta itemProp="name" content="Philip Rice Dealer" />
        <meta
          itemProp="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta itemProp="image" content="cover.png" />

        <meta
          property="og:url"
          content="https://prd-forecasting-capstone.vercel.app"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Philip Rice Dealer" />
        <meta
          property="og:description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta property="og:image" content="cover.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Philip Rice Dealer" />
        <meta
          name="twitter:description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta name="twitter:image" content="cover.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-4 py-4 px-6 h-full">
        <p className="text-lg text-gray-800">Chat With Customer</p>
        <p className="text-xs text-gray-500">Customer Support</p>
        <div className="flex items-center justify-start h-5/6 bg-gray-100 mt-4">
          <div className="bg-white rounded-lg mr-2 p-4 w-3/6 max-w-lg h-full ">
            <p className="h-1_12">Customers</p>
            <div className="w-full h-10_12 mt-4 overflow-y-scroll">
              {list.map((cht, i) => (
                <div
                  key={i}
                  onClick={(e) => setFocusedChat(cht.ownerInfo[0])}
                  className="py-3 cursor-pointer group items-center flex justify-start space-x-3"
                >
                  <div className="avatar cursor-pointer">
                    <div className="w-10 rounded-full">
                      <img src={cht.ownerInfo[0].imgUrl} />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-blue-300 duration-200 ease-in text-gray-700">
                      {cht.ownerInfo[0].userName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {cht.ownerInfo[0].email}
                    </p>
                  </div>
                  {cht.adminUnread && (
                    <div className="flex w-full justify-end">
                      <svg
                        className="h-10 text-blue-500 animate-pulse"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x="0" y="0" width="24" height="24" />
                          <path
                            d="M21,12.0829584 C20.6747915,12.0283988 20.3407122,12 20,12 C16.6862915,12 14,14.6862915 14,18 C14,18.3407122 14.0283988,18.6747915 14.0829584,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,8 C3,6.8954305 3.8954305,6 5,6 L19,6 C20.1045695,6 21,6.8954305 21,8 L21,12.0829584 Z M18.1444251,7.83964668 L12,11.1481833 L5.85557487,7.83964668 C5.4908718,7.6432681 5.03602525,7.77972206 4.83964668,8.14442513 C4.6432681,8.5091282 4.77972206,8.96397475 5.14442513,9.16035332 L11.6444251,12.6603533 C11.8664074,12.7798822 12.1335926,12.7798822 12.3555749,12.6603533 L18.8555749,9.16035332 C19.2202779,8.96397475 19.3567319,8.5091282 19.1603533,8.14442513 C18.9639747,7.77972206 18.5091282,7.6432681 18.1444251,7.83964668 Z"
                            fill="currentColor"
                          />
                          <circle
                            fill="currentColor"
                            opacity="0.3"
                            cx="19.5"
                            cy="17.5"
                            r="2.5"
                          />
                        </g>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="ml-2 bg-white rounded-lg w-full h-full overflow-hidden">
            {!focusedChat ? (
              <div className="midall">
                <p className="text-center inline-flex gap-1 items-center text-xs text-gray-500">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      className="group-hover:text-[#abb5e2] text-[#ced1dd] "
                      d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"
                    />
                    <path
                      className="group-hover:text-blue-400 text-[#e3e4ea] "
                      d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"
                    />
                  </svg>
                  Select a conversation...
                </p>
              </div>
            ) : (
              <ChatContent
                chatWith={focusedChat.userName}
                onClose={() => setFocusedChat(null)}
                resellerId={focusedChat.ownerId}
                trigger={trigger}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ChatSupport.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default ChatSupport;
