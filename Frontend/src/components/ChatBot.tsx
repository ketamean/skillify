import { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { axiosForm } from "../config/axios";
interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Add a welcome message when chat is first opened
    if (!isOpen && chatHistory.length === 0) {
      setChatHistory([
        {
          role: "assistant",
          text: "Hi there! I'm your Skillify assistant. How can I help you find courses today?",
        },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");

    const updatedChatHistory = [
      ...chatHistory,
      { role: "user" as "user" | "assistant", text: userMessage },
    ];
    setChatHistory(updatedChatHistory);

    setIsLoading(true);

    try {
      const response = await axiosForm.post("/api/ai/chat", {
        message: userMessage,
        history: updatedChatHistory,
      });

      if (response.status !== 200) {
        throw new Error("Error in API response");
      }

      const data = await response.data;

      setChatHistory([
        ...updatedChatHistory,
        { role: "assistant", text: data.reply },
      ]);
    } catch (error) {
      console.error("Error communicating with AI service:", error);
      setChatHistory([
        ...updatedChatHistory,
        {
          role: "assistant",
          text: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat bubble button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors ${
          isOpen ? "bg-red-500" : "bg-vibrant-green hover:bg-deepteal"
        }`}
      >
        {isOpen ? (
          <FaTimes className="text-white text-xl" />
        ) : (
          <FaRobot className="text-white text-xl" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-3xl h-[600px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-vibrant-green text-white p-3 flex items-center">
            <FaRobot className="mr-2" />
            <h3 className="font-medium">Skillify Assistant</h3>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-3 overflow-y-auto">
            <div className="space-y-3">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${
                    chat.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      chat.role === "user"
                        ? "bg-deepteal text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {chat.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: "600ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeyPress}
                placeholder="Ask about courses..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-vibrant-green"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className={`p-2 rounded-r-lg ${
                  !message.trim() || isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-vibrant-green hover:bg-deepteal text-white"
                }`}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
