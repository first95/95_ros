import { Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import DisplayCard from "./components/DisplayCard";

function App() {
  const [rosClient, setRosClient] = useState(undefined);

  return (
    <Container>
      <Header>
        <Typography style={{ fontSize: "32px" }}>ROS Web Interface</Typography>
      </Header>
      <Body>
        <DisplayCard title={"ROS Version: v1.0.0"}>
          <Typography>This is a test card</Typography>
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

const Header = styled.div`
  flex: 0;
  margin: 25px;
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
