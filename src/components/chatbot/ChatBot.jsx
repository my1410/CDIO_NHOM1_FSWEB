import { useState, useRef, useEffect } from "react";
import {
  FloatButton,
  Drawer,
  Input,
  Button,
  Avatar,
  Spin,
  message,
} from "antd";

import {
  MessageOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import axios from "axios";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "👋 Xin chào! Tôi là Fashion AI. Hãy mô tả phong cách bạn thích để tôi tư vấn outfit phù hợp.",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userText,
      },
    ]);

    setInputMessage("");
    setLoading(true);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "🔐 Bạn cần đăng nhập để sử dụng Fashion AI.",
          },
        ]);

        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/ai/recommend",
        {
          stylePreferences: userText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: res.data.aiFeedback || "Xin lỗi, tôi chưa có gợi ý phù hợp.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            error.response?.data?.message ||
            "⚠️ Fashion AI hiện không khả dụng. Vui lòng thử lại sau.",
        },
      ]);

      message.error("Không thể kết nối Fashion AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        onClick={() => setOpen(true)}
        style={{
          right: 30,
          bottom: 30,
        }}
      />

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        width={420}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Avatar
              icon={<RobotOutlined />}
              style={{
                background: "#1677ff",
              }}
            />

            <div>
              <div
                style={{
                  fontWeight: 700,
                }}
              >
                Fashion AI
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: loading ? "#1677ff" : "#52c41a",
                }}
              >
                {loading ? "Đang tư vấn..." : "Online"}
              </div>
            </div>
          </div>
        }
        styles={{
          body: {
            display: "flex",
            flexDirection: "column",
            padding: 0,
            height: "100%",
          },
        }}
      >
        {/* CHAT CONTENT */}

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            background: "#f8fafc",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  gap: 10,
                  maxWidth: "85%",
                }}
              >
                <Avatar
                  icon={
                    msg.role === "user" ? <UserOutlined /> : <RobotOutlined />
                  }
                />

                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 16,
                    background: msg.role === "user" ? "#1677ff" : "#ffffff",
                    color: msg.role === "user" ? "#ffffff" : "#111827",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <Avatar icon={<RobotOutlined />} />

              <div
                style={{
                  background: "#fff",
                  padding: 12,
                  borderRadius: 16,
                }}
              >
                <Spin
                  indicator={
                    <LoadingOutlined
                      spin
                      style={{
                        fontSize: 18,
                      }}
                    />
                  }
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}

        <div
          style={{
            padding: 15,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 10,
            background: "#fff",
          }}
        >
          <Input
            size="large"
            value={inputMessage}
            disabled={loading}
            placeholder="Hỏi Fashion AI..."
            onChange={(e) => setInputMessage(e.target.value)}
            onPressEnter={handleSend}
          />

          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={loading}
            size="large"
            onClick={handleSend}
          />
        </div>
      </Drawer>
    </>
  );
};

export default ChatBot;
