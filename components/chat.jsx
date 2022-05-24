import React, { useEffect, useState } from "react";
import { useChannel } from "./AblyReactEffect";
import styles from "./AblyChatComponent.module.css";

const AblyChatComponent = () => {
  let inputBox = null;
  let messageEnd = null;
  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);
  const messageTextIsEmpty = messageText.trim().length === 0;
  const [channel, ably] = useChannel("chat-demo", (message) => {
    // Here we're computing the state that'll be drawn into the message history
    // We do that by slicing the last 199 messages from the receivedMessages buffer

    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);

    // Then finally, we take the message history, and combine it with the new message
    // This means we'll always have up to 199 message + 1 new message, stored using the
    // setMessages react useState hook
  });

  const sendChatMessage = (messageText) => {
    channel.publish({ name: "chat-message", data: messageText });
    setMessageText("");
    inputBox.focus();
  };

  const handleFormSubmission = () => {
    sendChatMessage(messageText);
  };

  const handleKeyPress = (event) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  };

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";
    return (
      <span key={index} className={styles.message} data-author={author}>
        {message.data}
      </span>
    );
  });

  useEffect(() => {
    messageEnd.scrollIntoView({ behaviour: "smooth" });
  });

  return (
    <div className="space-y-[0.5] ">
      <div className="flex flex-col  ">
        <h3 className="text-xl bg-slate-500 text-white py-1 px-2 rounded-tr-[3px] rounded-tl-[3px]">
          Live Chat
        </h3>
      </div>

      <div
        className="min-h-[20em] border border-gray-300  overflow-y-auto 
    overflow-x-hidden h-[50%] w-[100%] max-h-[20em]"
      >
        {messages.map((messageContent) => (
          <div
            className="flex p-1"
            id={username === messageContent.author ? "you" : "other"}
          >
            <div
              className={`flex justify-end flex-col 
          ${username === messageContent.author ? "items-start" : "items-end"} `}
            >
              <div
                className={`text-xl ${
                  username === messageContent.author
                    ? "bg-blue-300"
                    : "bg-green-300"
                }
             px-5 py-1 rounded-lg`}
              >
                <p>{messageText}</p>
              </div>

              {/* <div className="flex   space-x-1 items-center justify-center">
                <p className=" font-normal ">{messageContent.time}</p>
                <p className="-mt-[1px]">{messageContent.author}</p>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      <div className="flex  ">
        <input
          type="text"
          className="border   p-4 w-full border-green-500 "
          placeholder="hey... this is a message"
          value={currentMessage}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className=" flex items-center justify-center 
          text-white text-4xl font-bold bg-green-600  px-3 "
          onClick={handleFormSubmission}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default AblyChatComponent;
