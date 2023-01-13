import { Button, TextField, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import DisplayCard from "./components/DisplayCard";

function App() {
  var ROSLIB = require("roslib");
  const [rosClient, setRosClient] = React.useState<any>(null);
  const [rosIP, setRosIP] = React.useState("");

  let txt_listener: any;
  let cmd_vel_listener: any;
  let cam_image_listener: any;

  const move = function (linear: any, angular: any) {
    var twist = new ROSLIB.Message({
      linear: {
        x: linear,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: angular,
      },
    });
    cmd_vel_listener.publish(twist);
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

    txt_listener = new ROSLIB.Topic({
      ros: rosClient,
      name: "/txt_msg",
      messageType: "std_msgs/String",
    });

    cmd_vel_listener = new ROSLIB.Topic({
      ros: rosClient,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });

    txt_listener.subscribe(function (m: any) {
      document.getElementById("msg")!.innerHTML = m.data;
      move(1, 0);
    });

    cam_image_listener.subscribe(function (m: any) {
      let imageData = "data:image/png;base64," + m.data;
      // @ts-ignore
      document.getElementById("usb_cam_raw")!.src = imageData;
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

  React.useEffect(() => {
    // const createJoystick = function () {
    //   var options = {
    //     zone: document.getElementById("zone_joystick"),
    //     threshold: 0.1,
    //     position: { left: 50 + "%" },
    //     mode: "static",
    //     size: 150,
    //     color: "#000000",
    //   };
    //
    //   var timer: any;
    //   var manager = require("nipplejs").create(options);
    //
    //   let linear_speed = 0;
    //   let angular_speed = 0;
    //
    //   manager.on("start", function (event: any, nipple: any) {
    //     timer = setInterval(function () {
    //       move(linear_speed, angular_speed);
    //     }, 25);
    //   });
    //
    //   manager.on("move", function (event: any, nipple: any) {
    //     let max_linear = 5.0; // m/s
    //     let max_angular = 2.0; // rad/s
    //     let max_distance = 75.0; // pixels;
    //     let linear_speed =
    //       (Math.sin(nipple.angle.radian) * max_linear * nipple.distance) /
    //       max_distance;
    //     let angular_speed =
    //       (-Math.cos(nipple.angle.radian) * max_angular * nipple.distance) /
    //       max_distance;
    //   });
    //
    //   manager.on("end", function () {
    //     if (timer) {
    //       clearInterval(timer);
    //     }
    //     move(0, 0);
    //   });
    // };
    //
    // createJoystick();
  }, []);

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
          <p>
            Last /txt_msg received: <span id="msg"></span>
          </p>
        </DisplayCard>

        {/* <DisplayCard title="Virual Joystick"> */}
        {/*   <div */}
        {/*     id="zone_joystick" */}
        {/*     style={{ position: "relative", top: "100px" }} */}
        {/*   ></div> */}
        {/* </DisplayCard> */}

        <DisplayCard title="Continuous Tag Stream" flexable={true}>
          {/* <div> */}
          {/*   <img id="usb_cam_raw" /> */}
          {/* </div> */}

          {/* <div */}
          {/*   style={{ border: "red solid 2px", width: "500px", height: "500px" }} */}
          {/* > */}
          {/*   TESTING */}
          {/* </div> */}
        </DisplayCard>
      </Body>

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
