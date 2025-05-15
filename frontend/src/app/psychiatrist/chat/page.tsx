"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiUser,
  FiMessageSquare,
  FiInfo,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Sample responses - this would be replaced by actual backend integration
  const sampleResponses = [
    "I understand how challenging that can be. Could you tell me more about when these feelings started?",
    "Thank you for sharing that with me. Have you discussed these feelings with anyone else?",
    "It's important to acknowledge these emotions. How have you been coping with them so far?",
    "That sounds difficult to manage. Have you noticed any specific triggers for these feelings?",
    "I appreciate your openness. What kind of support are you looking for today?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI typing
    setIsTyping(true);

    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      const randomResponse =
        sampleResponses[Math.floor(Math.random() * sampleResponses.length)];

      const aiMessage: Message = {
        id: messages.length + 2,
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (!sessionStarted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <Link
          href="/psychiatrist"
          className="flex items-center text-blue-600 mb-8"
        >
          <FiArrowLeft className="mr-2" /> Back to Mental Health Services
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">
            Start Conversation
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Please provide your name to begin a confidential conversation with
            our AI Mental Health Assistant.
          </p>

          <form onSubmit={handleStartSession}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Conversation
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-500 flex items-start">
            <FiInfo className="mr-2 flex-shrink-0 mt-0.5" />
            <p>
              This conversation is private and provides general guidance only.
              For serious mental health concerns, please consult with a
              healthcare professional.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/psychiatrist"
        className="flex items-center text-blue-700 font-medium mb-4 hover:underline"
      >
        <FiArrowLeft className="mr-2" /> Back to Mental Health Services
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
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
              className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3"
            >
              <FiMessageSquare className="text-white" size={20} />
            </motion.div>
            <div>
              <h1 className="font-bold text-xl">
                AI Mental Health Conversation
              </h1>
              <p className="text-white text-sm">
                Confidential • Supportive • Informational
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 h-[60vh] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-1">
                    <FiMessageSquare size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white shadow-md"
                  }`}
                >
                  <p
                    className={
                      message.sender === "user" ? "text-white" : "text-gray-800"
                    }
                  >
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 text-right ${
                      message.sender === "user"
                        ? "text-blue-200"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.sender === "user" && (
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center ml-2 mt-1">
                    <FiUser size={16} />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  <FiMessageSquare size={16} />
                </div>
                <div className="bg-white rounded-lg p-3 shadow-md">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      className="w-2 h-2 rounded-full bg-blue-400"
                    ></motion.div>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 rounded-full bg-blue-400"
                    ></motion.div>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 rounded-full bg-blue-400"
                    ></motion.div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors shadow-md"
            >
              <FiSend />
            </motion.button>
          </form>

          <div className="flex items-center mt-3 text-xs text-gray-700">
            <FiInfo className="mr-1" />
            <span>
              This is an AI assistant. For serious mental health concerns,
              please consult with a licensed professional.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
