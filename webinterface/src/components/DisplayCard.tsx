import { Paper, styled as msc, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

interface IProps {
  title: string;
  children: any;
  scale?: number;
  flexable?: boolean;
}

export default function DisplayCard(props: IProps) {
  let scale = props.scale ?? 1;

  return (
    <Container scale={scale} flexable={props.flexable}>
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
  height: 300px;
  min-width: 400px;

  ${(props) => (props.flexable ? "display: flex;" : "")}
  ${(props) => (props.flexable ? "flex: 0;" : "")}
  flex-direction: column;

  ${(props) =>
    props.flexable
      ? ""
      : `width: calc(300px * ${props.scale}); height: calc(250px * ${props.scale});`}

  border-radius: 10px;
`;
