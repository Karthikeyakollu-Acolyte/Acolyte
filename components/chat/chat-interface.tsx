"use client";
import { MenuIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Sidebar } from './sidebar';
import Image from 'next/image';
import emojis from '../../public/emojis.svg'
import paperclip from '../../public/paperclip.svg'
import send from '../../public/send.svg'
import { motion } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What is the goal of the authors?",
    "What is the main issue discussed in the text?",
    'What is the "old implicit compact" mentioned in the text?',
    "Who are the authors of the text?"
  ];
  const dummy = "While invertebrate brains arise from paired segmental ganglia (each of which is only responsible for the respective body segment) of the ventral nerve cord, vertebrate brains develop axially from the midline dorsal nerve cord as a vesicular enlargement at the rostral end of the neural tube, with centralized control over all body segments. All vertebrate brains can be embryonically divided into three parts: the forebrain (prosencephalon, subdivided into telencephalon and diencephalon), midbrain (mesencephalon) and hindbrain (rhombencephalon, subdivided into metencephalon and myelencephalon). The spinal cord, which directly interacts with somatic functions below the head, can be considered a caudal extension of the myelencephalon enclosed inside the vertebral column. Together, the brain and spinal cord constitute the central nervous system in all vertebrates."
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now(),
        text: `I'm a simulated response to: "${dummy}"`,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-1 flex-col items-center w-full h-[991px] bg-[#F9FAFB] relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-10 h-9 w-9 rounded-lg hover:bg-gray-200"
        onClick={toggleSidebar}
      >
        <MenuIcon className="icon" />
      </Button>

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-[420px]" : "ml-0"
          }`}
      >
        <div className="flex flex-col items-center justify-start h-full px-4 max-w-full text-center overflow-y-auto ">
          {messages.length === 0 ? (
            <div className='my-auto'>
              <h2 className="text-[2.5rem] font-rubik font-medium leading-tight mb-4 text-transparent bg-gradient-to-r from-[#8468D0] to-[#000000] bg-clip-text">
                Hello, to be Doctor.
              </h2>
              <p className="text-[1.75rem] font-rubik font-medium mb-8 text-transparent bg-gradient-to-r from-[#010101] to-[#38A169] bg-clip-text">
                How can I be your companion
              </p>

              <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 mb-16">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
                    onClick={() => setInputMessage(suggestion)}
                  >
                    <p className="text-base">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-full  pt-20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 p-4 mx-24 rounded-lg shadow-md ${message.sender === 'user'
                    ? 'bg-blue-100 text-right ml-auto max-w-[80%]'
                    : 'bg-gray-100 text-left mr-auto max-w-[80%]'
                    }`}
                >
                  {message.sender !== 'user' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className=''>{message.text}</div>
                    </motion.div>
                  ) : (
                    <div>{message.text}</div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

          )}
        </div>

        <div className="h-[76px] mx-auto w-[1393px] px-3.5 py-[13px] mb-11 bg-white rounded-[15px] shadow-[0px_0.19090910255908966px_0.5727272629737854px_0px_rgba(0,0,0,0.11)] border-2 border-[#a69ac7] justify-between items-center inline-flex">
          <input
            type="text"
            placeholder="Type a new message here"
            className="text-black text-2xl font-normal font-['Rubik'] leading-relaxed p-2.5 bg-transparent border-none outline-none w-full"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <div className="justify-end items-center gap-5 flex">
            <Image alt="emojis" src={emojis} />
            <Image alt="paperclip" src={paperclip} />
            <Button onClick={handleSendMessage} className="p-0 bg-transparent hover:bg-transparent">
              <Image alt="send" src={send} />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out ${isSidebarOpen
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none"
          }`}
      >
        <Sidebar />
      </div>
    </div>
  );
}

