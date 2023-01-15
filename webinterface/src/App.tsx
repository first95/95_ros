import { Button, TextField, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import DisplayCard from "./components/DisplayCard";

function App() {
  var ROSLIB = require("roslib");
  const [rosClient, setRosClient] = React.useState<any>(null);
  const [rosIP, setRosIP] = React.useState("");

  let lidar_listener: any;
  let cam_image_listener: any;
  let tf_listener: any;

  const log = (message: string) => {
    // @ts-ignore
    var logArea = document.getElementById("log");
    // @ts-ignore
    logArea.innerText = logArea.innerText + message + "<br />";
  };

  const onRosSubscribe = (rosClient: any) => {
    if (!rosClient) {
      console.log("Error: rosClient is invalid!");
      return;
    }

    cam_image_listener = new ROSLIB.Topic({
      ros: rosClient,
      name: "/tag_detections_image/compressed",
      messageType: "sensor_msgs/CompressedImage",
    });

    tf_listener = new ROSLIB.Topic({
      ros: rosClient,
      name: "/tf",
      messageType: "tf2_msgs/TFMessage",
    });

    cam_image_listener.subscribe(function (m: any) {
      let imageData = "data:image/png;base64," + m.data;
      // @ts-ignore
      document.getElementById("usb_cam_raw")!.src = imageData;
    });

    tf_listener.subscribe(function (m: any) {
      console.log("TF Data: ", m);
      let transformData = m.data;
      log(transformData);
    });
  };

  const onRosConnect = () => {
    if (rosIP === "") {
      console.log("Error: rosIP is not valid!");
      return;
    }

    const webSocketUrl = "ws://" + rosIP + ":9090";

    const ros = new ROSLIB.Ros({
      url: webSocketUrl,
    });

    ros.on("connection", () => {
      console.log("Connected to ROS websocket server on", webSocketUrl);
      document.getElementById("status")!.innerHTML = "Connected";
      setRosClient(ros);
    });

    ros.on("error", (error: any) => {
      console.log("Error connecting to ROS websocket server: ", error);
      document.getElementById("status")!.innerHTML = "Error";
      setRosClient(undefined);
    });

    ros.on("close", () => {
      console.log("Closed connection to ROS websocket server on", webSocketUrl);
      document.getElementById("status")!.innerHTML = "Closed";
      setRosClient(undefined);
    });

    onRosSubscribe(ros);
  };

  const onRosDisconnect = () => {
    if (rosClient) rosClient.close();
  };

  return (
    <Container>
      <Header>
        <Typography variant="h3" style={{ marginRight: "0.5em" }}>
          ROS Web Interface
        </Typography>
        <TextField
          label="Robot IP"
          variant="outlined"
          value={rosIP}
          onChange={(event) => {
            setRosIP(event.target.value);
          }}
        />
        <Button
          style={{ margin: "0.5em" }}
          onClick={() => {
            onRosConnect();
          }}
        >
          Connect
        </Button>
      </Header>
      <Body>
        <DisplayCard title={"ROS Status"}>
          <p>
            Connection status: <span id="status">Unknown</span>
          </p>
        </DisplayCard>

        <DisplayCard title="Continuous Tag Stream" flexable={true}>
          <div>
            <img id="usb_cam_raw" />
          </div>
        </DisplayCard>

        <DisplayCard title="LiDAR Raw Output">
          <div id={"lidar_log"}></div>
        </DisplayCard>
      </Body>

      <hr style={{ color: "white", width: "100%" }} />

      <Body
        style={{
          border: "red solid 2px",
          maxHeight: "250px",
          display: "flex",
          flexWrap: "wrap",
          overflow: "scroll",
          overflowWrap: "anywhere",
        }}
        id="log"
      ></Body>

      <Footer></Footer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const IPInput = styled.div`
  margin: 2em;
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  flex: 0;
  margin: 25px;
  display: flex;
`;

const Body = styled.div`
  flex: 1;
  margin: 25px;
  display: flex;
  flex-wrap: wrap;
`;

const Footer = styled.div`
  flex: 0;
`;

export default App;
