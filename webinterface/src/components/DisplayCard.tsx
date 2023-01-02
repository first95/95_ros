import { Paper, styled as msc, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";

interface IProps {
  title: string;
  children: any;
}

export default function DisplayCard(props: IProps) {
  return (
    <Container>
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

const Container = msc(Paper)`
  padding: 0.5em;
  margin: 0.5em;
  width: 300px;
  height: 250px;
  border-radius: 10px;
`;
