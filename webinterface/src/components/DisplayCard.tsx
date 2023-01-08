import { Paper, styled as msc, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

interface IProps {
  title: string;
  children: any;
  scale?: number;
}

export default function DisplayCard(props: IProps) {
  let scale = props.scale ?? 1;

  return (
    <Container scale={scale}>
      <Header>
        <Typography>{props.title}</Typography>
      </Header>

      <Content>{props.children}</Content>
    </Container>
  );
}

const Content = styled.div``;

const Header = styled.div`
  border-bottom: 1px gray solid;
`;

const Container = msc<any>(Paper)`
  padding: 0.5em;
  margin: 0.5em;
  width: calc(300px * ${(props) => props.scale});
  height: calc(250px * ${(props) => props.scale});
  border-radius: 10px;
`;
