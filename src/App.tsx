import React, { useState, useEffect } from "react";
import "./App.css";
import { List, Input, Button, Row, Col } from "antd";
const { TextArea } = Input;
import {
  SwapOutlined,
  ApiOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ReactJson from "react-json-view";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";
import packageJson from "../package.json";

let socket: Socket | undefined = undefined;
const requestsHistoryKey = "requestsHistory";
type RequestHistory = {
  key: string;
  emitName: string;
  title: string;
  request: any;
  response: any;
}[];
function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
function App() {
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");
  const [ip, setIp] = useState<string>("");
  const [emitName, setEmitName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [request, setRequest] = useState<string>("");
  const [response, setResponse] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [requestsHistory, setRequestsHistory] = useState<RequestHistory>([]);

  useEffect(() => {
    const rqhry = localStorage.getItem(requestsHistoryKey);
    const ip = localStorage.getItem("ip");
    const emitName = localStorage.getItem("emitName");
    if (ip) setIp(ip);
    if (emitName) setEmitName(emitName);
    if (rqhry) setRequestsHistory(JSON.parse(rqhry));
  }, []);

  const onConnectClick = async () => {
    setConnectionStatus("connecting");
    socket = io(ip);
    socket.on("connect", () => {
      setConnectionStatus("connected");
    });
    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });
    if (connectionStatus === "disconnected") socket.connect();
    else if (connectionStatus === "connected") {
      socket.disconnect();
      socket.close();
      socket = undefined;
      setConnectionStatus("disconnected");
    } else {
      socket.disconnect();
      socket.close();
      socket = undefined;
      setConnectionStatus("disconnected");
    }
  };

  const onInputChange = (e: any) => {
    setIp(e.target.value);
    localStorage.setItem("ip", e.target.value);
  };
  const onEmitNameChange = (e: any) => {
    setEmitName(e.target.value);
    localStorage.setItem("emitName", e.target.value);
  };
  const onTitleChange = (e: any) => {
    setTitle(e.target.value);
    localStorage.setItem("title", e.target.value);
  };

  const onKeyPress = (e: any) => {
    if (e.key !== "Enter") return;
    onConnectClick();
  };
  const onRequestInputChange = (e: any) => {
    setRequest(e.target.value);
  };
  // const onRequestKeyPress = (e: any) => {
  //   if (e.key !== "Enter") return;
  //   sendRequest();
  // };

  const sendRequest = () => {
    setLoading(true);
    if (!socket) {
      return;
    }
    const requestJson = isJson(request) ? JSON.parse(request) : request;
    socket.emit(emitName, requestJson, (response: any) => {
      setLoading(false);
      saveRequest(request, response, emitName);
      setResponse(response);
    });
  };

  const saveRequest = (request: any, response: any, emitName: string) => {
    const requestsHistory = localStorage.getItem(requestsHistoryKey);
    if (requestsHistory) {
      const arr: any[] = JSON.parse(requestsHistory);
      arr.push({ key: nanoid(3), emitName, title, request, response });
      localStorage.setItem(requestsHistoryKey, JSON.stringify(arr));
      setRequestsHistory(arr);
    } else {
      const data = [{ key: nanoid(3), emitName, title, request, response }];
      localStorage.setItem(requestsHistoryKey, JSON.stringify(data));
      setRequestsHistory(data);
    }
  };

  const removeRequest = (requestKey: string) => {
    const requestsHistory: string | null =
      localStorage.getItem(requestsHistoryKey);
    let arr: RequestHistory = requestsHistory && JSON.parse(requestsHistory);
    arr = arr.filter((item) => item.key !== requestKey);
    localStorage.setItem(requestsHistoryKey, JSON.stringify(arr));
    setRequestsHistory(arr);
  };

  const cancelRequest = () => {
    setLoading(false);
  };
  const openRequest = (requestKey: string) => {
    const target = requestsHistory.find((item) => item.key === requestKey);

    target && setRequest(target.request);
    target && setResponse(target.response);
    target && setEmitName(target.emitName);
    target && setTitle(target.title);
  };

  return (
    <div className="grid-container">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={packageJson.repository.url}
      >
        <div className="githubLink">github &#x1F5D7;</div>
      </a>
      <div className="top-panel">
        <Row gutter={[8, 8]} style={{ width: "100%" }}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Input
              disabled={connectionStatus === "connected"}
              placeholder="Socketio address: example: http://localhost:8000"
              size="large"
              value={ip}
              onChange={onInputChange}
              onKeyPress={onKeyPress}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Input
              placeholder="Emit Name"
              size="large"
              value={emitName}
              onChange={onEmitNameChange}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Row gutter={8} justify="space-between">
              <Col span="20">
                <Input
                  placeholder="Title"
                  size="large"
                  value={title}
                  onChange={onTitleChange}
                />
              </Col>
              <Col span="4">
                <Button
                  onClick={onConnectClick}
                  type="default"
                  disabled={ip.length === 0}
                  size="large"
                >
                  {connectionStatus === "connected" ? <CheckOutlined /> : <></>}
                  {connectionStatus === "disconnected" ? (
                    <ApiOutlined />
                  ) : (
                    <></>
                  )}
                  {connectionStatus === "connecting" ? (
                    <LoadingOutlined />
                  ) : (
                    <></>
                  )}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="request">
        <TextArea
          style={{ height: "100%" }}
          placeholder="Requset Body"
          bordered={false}
          value={request}
          onChange={onRequestInputChange}
        />
        <Button
          onClick={sendRequest}
          disabled={emitName.length === 0 || connectionStatus !== "connected"}
        >
          {connectionStatus !== "connected" ? "Disconnected" : "SEND"}
        </Button>
        {loading ? <Button onClick={cancelRequest}>CANCEL</Button> : <></>}
      </div>
      <div className="response">
        {loading ? <LoadingOutlined /> : <ReactJson src={response} />}
      </div>

      <div className="list">
        <List
          itemLayout="horizontal"
          dataSource={requestsHistory.slice().reverse()}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a
                  key="list-loadmore-edit"
                  onClick={() => {
                    openRequest(item.key);
                  }}
                >
                  Open
                </a>,
                <a
                  key="list-loadmore-more"
                  style={{ color: "red" }}
                  onClick={() => {
                    removeRequest(item.key);
                  }}
                >
                  Remove
                </a>,
              ]}
            >
              <List.Item.Meta
                avatar={<SwapOutlined />}
                title={<b>{item.title || item.key}</b>}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default App;
