"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiUser,
  FiMessageSquare,
  FiInfo,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "@/api/psychiatristService";

type Message = {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content:
        "Hello! I'm your AI Mental Health Assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatContainerRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => scrollToBottom();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) return;

    setSessionStarted(true);
    setMessages([
      {
        id: 1,
        content: `Hello ${userName}! I'm your AI Mental Health Assistant. How are you feeling today?`,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setError("");

    setIsTyping(true);

    try {
      const recentMessages = messages.slice(-5);

      const response = await sendChatMessage(
        inputMessage,
        userName,
        recentMessages
      );

      const messageContent =
        typeof response.message === "object"
          ? response.message.therapeutic_insight ||
            JSON.stringify(response.message)
          : response.message;

      const aiMessage: Message = {
        id: messages.length + 2,
        content: messageContent,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || "Failed to get response. Please try again.");
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-xl mx-auto px-4 py-12">
          <Link
            href="/psychiatrist"
            className="flex items-center font-medium hover:underline mb-8 text-blue-700"
          >
            <FiArrowLeft className="mr-2" /> Back to Mental Health Services
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-xl shadow-xl backdrop-blur-sm bg-white/90 border border-gray-100"
          >
            <h1 className="text-3xl font-bold text-center mb-6">
              Mental Health Conversation
            </h1>
            <p className="mb-8 text-center text-gray-600">
              Please provide your name to begin a confidential conversation with
              our AI Mental Health Assistant.
            </p>

            <form onSubmit={handleStartSession}>
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white border-gray-300 text-gray-700"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Start Conversation
              </motion.button>
            </form>

            <div className="mt-8 text-sm flex items-start p-4 rounded-lg bg-blue-50 text-gray-700">
              <FiInfo className="mr-2 flex-shrink-0 mt-0.5" size={18} />
              <p>
                This conversation is private and provides general guidance only.
                For serious mental health concerns, please consult with a
                healthcare professional.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/psychiatrist"
            className="flex items-center font-medium hover:underline text-blue-700"
          >
            <FiArrowLeft className="mr-2" /> Back to Services
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl shadow-xl overflow-hidden flex-1 flex flex-col backdrop-blur-sm bg-white/90 border border-gray-100"
        >
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
                className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-3"
              >
                <FiMessageSquare className="text-white" size={24} />
              </motion.div>
              <div>
                <h1 className="font-bold text-xl md:text-2xl">
                  AI Mental Health Conversation
                </h1>
                <p className="text-white/80 text-sm">
                  Confidential • Supportive • Informational
                </p>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-l-4 border-red-500 p-4 mx-4 my-2 bg-red-50"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/70"
            style={{
              height: "calc(70vh - 120px)",
              scrollbarWidth: "thin",
              scrollbarColor: "#94A3B8 #F1F5F9",
            }}
          >
            <div className="space-y-5 pb-2">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="h-10 w-10 rounded-full flex items-center justify-center mr-2 mt-1 bg-blue-100 text-blue-600">
                        <FiMessageSquare size={18} />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      <p
                        className={
                          message.sender === "user" ? "text-white" : ""
                        }
                      >
                        {message.content}
                      </p>
                      <div
                        className={`flex items-center text-xs mt-2 font-light ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        <FiClock className="mr-1" size={10} />
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {message.sender === "user" && (
                      <div className="h-10 w-10 rounded-full flex items-center justify-center ml-2 mt-1 bg-blue-600 text-white">
                        <FiUser size={18} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="h-10 w-10 rounded-full flex items-center justify-center mr-2 bg-blue-100 text-blue-600">
                    <FiMessageSquare size={18} />
                  </div>
                  <div className="rounded-2xl p-4 shadow-md bg-white">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-blue-500"
                      ></motion.div>
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.2,
                        }}
                        className="w-2 h-2 rounded-full bg-blue-500"
                      ></motion.div>
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.4,
                        }}
                        className="w-2 h-2 rounded-full bg-blue-500"
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t bg-white/90 border-gray-200 mt-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all bg-white border-gray-300 text-gray-800 focus:ring-blue-400 focus:border-blue-400"
                disabled={isTyping}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="rounded-lg px-5 py-3 shadow-md transition-all disabled:opacity-50 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:from-blue-300 disabled:to-blue-400"
                disabled={isTyping || !inputMessage.trim()}
              >
                <FiSend size={20} />
              </motion.button>
            </form>

            <div className="flex items-center mt-4 text-xs text-gray-600">
              <FiInfo className="mr-1" size={12} />
              <span>
                This is an AI assistant. For serious mental health concerns,
                please consult with a licensed professional.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
