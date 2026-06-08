import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import HeaderComponent from "../components/layout/HeaderComponent";
import FooterComponent from "../components/layout/FooterComponent";
import ChatBot from "../components/chatbot/ChatBot";

const MainLayout = () => {
  return (
    <Layout>
      <HeaderComponent />

      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>

      <FooterComponent />

      {/* CHATBOT */}
      <ChatBot />
    </Layout>
  );
};

export default MainLayout;
