import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Upload } from "antd";
import { get, patch } from "../../services/RestService";
import { setUnreadChats } from "../../redux/actions/profile";
import DoubleTick from "../../assets/doubleTickIcon.png";
import SingleTick from "../../assets/singleTickIcon.png";
import { SmileOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import EmojiPicker from "./EmojiPicker";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import "./styles.css";
import {
  MainContainer,
  Message,
  MessageInput,
  Sidebar,
  Avatar,
  ConversationList,
  Conversation,
  ChatContainer,
  ConversationHeader,
  MessageList,
  AttachmentButton,
} from "@chatscope/chat-ui-kit-react";
import { io } from "socket.io-client";
import moment from "moment";
import { useLocation } from "react-router";
import { s3Client } from "../../constants";

const Chat = () => {
  const dispatch = useDispatch();
  const messagesRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState();
  const [header, setHeaderData] = useState();
  const [loading, setloading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const inputRef = useRef();
  const [msgInputValue, setMsgInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setmessagesLoading] = useState(false);
  const [socket, setSocket] = useState();
  const userData = JSON.parse(localStorage.getItem("user"));
  const user = userData.user;
  const userId = userData.user._id;
  const accessToken = localStorage.getItem("token");
  const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);

  useEffect(() => {
    let unRead = 0;
    rooms.forEach((room) => {
      if (
        room?.chat[room.chat?.length - 1]?.status === "unread" &&
        room?.chat[room.chat?.length - 1]?.from?.email !== user?.email
      ) {
        unRead++;
      }
    });
    dispatch(setUnreadChats(unRead));
  }, [rooms, user, dispatch]);

  useEffect(() => {
    let SOCKET_URL = process.env.REACT_APP_NODE_ENV == "development" ? process.env.REACT_APP_DEVELOPMENT_SOCKET_URL : process.env.REACT_APP_PRODUCTION_SOCKET_URL
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    setSocket(socket);
  }, []);

  useEffect(() => {
    socket && socket.on("connect", () => { });
    return () => {
      socket && socket.emit("disconnect");
    };
  }, []);

  useEffect(() => {
    if (roomId) {
      socket.emit("join", { user, roomId }, (res) => { });
      getRooms();
      getRooms();
    }
  }, [roomId, userId]);

  const handleSend = (message) => {
    const text = { message: message?.replace(/&nbsp;/g, " ") };
    socket.emit("sendMessage", text, roomId, (res) => {
      getMessages(roomId);
    });
    setMsgInputValue("");
    inputRef.current.focus();
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (res) => {
        getMessages(roomId);
      });
    }
  }, [socket, roomId]);

  useEffect(() => {
    messagesRef.current.scrollIntoView({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    messagesRef.current.scrollIntoView({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    messagesRef.current.scrollIntoView({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const getRooms = () => {
    setloading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    get(`/chat/myRooms`, config)
      .then((res) => {
        setRooms(
          res.result
            ?.filter((room) => room?.chat?.length > 0)
            ?.filter((room) => room?.chat?.length > 0)
        );
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
      });
  };

  const getMessages = (id) => {
    setmessagesLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    get(`/chat/roomMessages/${id}`, config)
      .then((res) => {
        setMessages(res.result?.chat);
        setmessagesLoading(false);
      })
      .catch((err) => {
        setmessagesLoading(false);
      });
  };

  useEffect(() => {
    getRooms();
  }, []);

  const useQueryParams = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQueryParams();
  const roomIdJoin = query.get("roomId");

  useEffect(() => {
    if (roomIdJoin) {
      getMessages(roomIdJoin);
    }
  }, [roomIdJoin]);

  const setHeader = (room) => {
    if (
      room?.chat[room?.chat?.length - 1]?.status === "unread" &&
      room?.chat[room.chat?.length - 1]?.from?.email !== user?.email
    ) {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      patch(`/chat/readMessage/${room?._id}`, {}, config);
    }
    setRoomId(room._id);
    setHeaderData({
      image: room?.users[0]?.image,
      title: room?.users[0]?.firstName + " " + room?.users[0]?.lastName,
    });
  };

  const addEmoji = (chosenEmoji) => {
    const msg = msgInputValue + chosenEmoji.emoji;
    setMsgInputValue(msg);
  };

  const dummyRequest = ({ _, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const sendImageHandler = async (e) => {
    setFileLoading(true);
    if (e.file.percent === 100) {
      try {
        let imageName = e.file.name;

        const options = {
          Key: imageName,
          Bucket: "cdn.carbucks.com",
          Body: e.file.originFileObj,
        };

        await s3Client.send(new PutObjectCommand(options));
        let s3ImageLink = `https://s3.amazonaws.com/cdn.carbucks.com/${imageName}`;
        socket.emit("sendMessage", { message: s3ImageLink }, roomId, (res) => {
          getMessages(roomId);
        });
        setFileLoading(false);
      } catch (error) {
        setFileLoading(false);
      }
    }
  };

  const checkFileMiddleware = (str, ext_input) => {
    if ([undefined, null, ''].includes(str)) return ''
    const extensions = ext_input && Array.isArray(ext_input) ? ext_input : ["exe"]
    var res = false
    str = str.toLowerCase()
    extensions.forEach(e => {
      var reg = new RegExp('\\.' + e + '$')
      if (reg.test(str)) res = true
    })
    return res
  }
  const checkFile = (message) => {
    if (checkFileMiddleware(message, ["jpg", "jpeg", "jpe", "jfif", "jfi", "png"])) {
      return (
        <a
          target="blank"
          rel="noopener"
          href={message}
          className="chat-link"
        >
          <img
            src={message}
            className="chat-img"
          />
        </a>
      );
    }
    else if (message?.substring(0, 8) === "https://") {
      return (
        <a
          target="blank"
          rel="noopener"
          href={message}
          className="chat-link"
        >
          <span>
            {message.replace("https://s3.amazonaws.com/cdn.carbucks.com/", "")}
          </span>
          <CloudDownloadOutlined
            style={{ marginLeft: 10, color: "white", fontSize: 25 }}
          />
        </a>
      )
    }
    else {
      return <> <div className="text_message"> {message} </div></>;
    }
  };


  return (
    <div style={{ height: "90vh" }}>
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <div className="inbox-header">
            <h1>Inbox</h1>
          </div>
          {/* <Search placeholder="Search..." /> */}
          <ConversationList loading={loading}>
            {rooms.length > 0 &&
              rooms?.map((room) => (
                <Conversation
                  onClick={() => {
                    setHeader(room);
                    getMessages(room._id);
                  }}
                  name={`${room?.users[0]?.firstName} ${room?.users[0]?.lastName}`}
                  lastActivityTime={
                    <div className="last-activity-time">
                      <div
                        className={
                          room?.chat[room?.chat?.length - 1]?.status ===
                          "unread" &&
                          room?.chat[room.chat?.length - 1]?.from?.email !==
                          user?.email &&
                          "last-seen"
                        }
                      >
                        {
                          <div className="last-activity-time">
                            <div
                              className={
                                room?.chat[room?.chat?.length - 1]?.status ===
                                "unread" &&
                                room?.chat[room.chat?.length - 1]?.from
                                  ?.email !== user?.email &&
                                "last-seen"
                              }
                            >
                              {moment(
                                room?.chat[room?.chat.length - 1]?.updatedAt
                              ).fromNow()}
                            </div>
                            <div className="unread-messages-count">
                              {room?.chat[room?.chat?.length - 1]?.status ===
                                "unread" &&
                                room?.chat[room.chat?.length - 1]?.from
                                  ?.email !== user?.email &&
                                1}
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                  info={
                    room._id === roomId
                      ? messages[messages.length - 1]?.message
                      : room?.chat[room?.chat.length - 1]?.message
                  }
                >
                  <Avatar
                    src={room?.users[0]?.image}
                  //name={`${room?.users[1]?.firstName} ${room?.users[1]?.lastName}`}
                  />
                </Conversation>
              ))}
          </ConversationList>
        </Sidebar>
        {
          <ChatContainer>
            {header && (
              <ConversationHeader>
                <Avatar src={header.image} />
                <ConversationHeader.Content userName={header.title} />
              </ConversationHeader>
            )}
            <MessageList loading={messagesLoading}>
              <div>
                {messages.length > 0 &&
                  messages.map((m, i) => (
                    <Message
                      key={i}
                      model={{
                        direction: `${userId === (m?.from?._id || m?.to?._id)
                          ? "outgoing"
                          : "incoming"
                          }`,
                      }}
                    >
                      <Message.CustomContent>
                        <div className="message-container">
                          {checkFile(m.message)}
                          {userId === (m?.from?._id || m?.to?._id) && (
                            <div>
                              {m.status === "read" ? (
                                <div className="message-status-icon">
                                  <img
                                    src={DoubleTick}
                                    alt=""
                                    className="double-tick-icon"
                                  />
                                </div>
                              ) : (
                                <div className="message-status-icon">
                                  <img
                                    src={SingleTick}
                                    alt=""
                                    className="double-tick-icon"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Message.CustomContent>
                      <Message.Footer
                        sentTime={moment(m.createdAt).format("DD/MM HH:MM")}
                      />
                    </Message>
                  ))}
              </div>
              <div ref={messagesRef} />
            </MessageList>
            <div
              as={MessageInput}
              style={{
                display: "flex",
                flexDirection: "row",
                borderTop: "1px dashed #d1dbe4",
              }}
            >
              <SmileOutlined
                onClick={togglePicker}
                className="chat-button"
                style={{
                  fontSize: "1.2em",
                  paddingLeft: "0.2em",
                  paddingRight: "0.2em",
                }}
              />
              {pickerOpen && (
                <EmojiPicker onEmojiClick={(e, s) => addEmoji(s)} />
              )}
              <Upload
                className="btn-margin"
                dummyRequest={dummyRequest}
                showUploadList={false}
                onChange={(e) => sendImageHandler(e)}
              >
                <AttachmentButton
                  style={{
                    fontSize: "1.2em",
                    paddingLeft: "0.2em",
                    paddingRight: "0.2em",
                  }}
                />
              </Upload>
              <MessageInput
                ref={inputRef}
                onChange={(msg) => setMsgInputValue(msg)}
                value={msgInputValue}
                attachButton={false}
                onSend={handleSend}
                style={{ flexGrow: 1, borderTop: 0, flexShrink: "initial" }}
              />
            </div>
          </ChatContainer>
        }
      </MainContainer>
    </div>
  );
};

export default Chat;
