import React from "react";
import { Text } from "theme-ui";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

import Mixpanel from "../util/mixpanel";

const examples = [
  {
    title: " First Steps",
    subtitle:
      "Learn how to use smart contracts, switch accounts, and view account state.",
    emoji: "🏃",
    link: "https://docs.onflow.org/tutorial/cadence/01-first-steps/"
  },
  {
    title: "Hello, World!",
    subtitle:
      "Write your first contract on Flow. This is the perfect place to start to get the hang of the fundamentals of Cadence.",
    emoji: "🌎",
    link: "https://docs.onflow.org/tutorial/cadence/02-hello-world/"
  },
  {
    title: "Mint Fungible Tokens",
    subtitle:
      "Create and sell digital assets of your own in this tutorial! This tutorial will teach you the basics of creating, storing, and moving digital assets and tokens.",
    emoji: "💸",
    link: "https://docs.onflow.org/tutorial/cadence/03-fungible-tokens/"
  },
  {
    title: "Create Non-Fungible Tokens",
    subtitle:
      "Create and shape your own unique digital objects. Here you’ll learn what really makes blockchains magic - the ability for unique items to be created, shared, and stored forever.",
    emoji: "😺",
    link: "https://docs.onflow.org/tutorial/cadence/04-non-fungible-tokens/"
  },
  {
    title: "Build a Marketplace",
    subtitle:
      "Put it all together in a marketplace! This tutorial will teach you how to turn all the concepts you’ve learned into a place for people to share their creations with the community.",
    emoji: "🤝",
    link: "https://docs.onflow.org/tutorial/cadence/05-marketplace-setup/"
  },
  {
    title: "Expand Non-Fungible Tokens",
    subtitle:
      "This tutorial is for the brave and the bold, an opportunity to discover what resources make possible - resources owning other resources. If you can imagine it, you can create it.",
    emoji: "🤠",
    link: "https://docs.onflow.org/tutorial/cadence/07-resources-compose/"
  }
];

const ExamplesContainer = styled(motion.div)`
  position: fixed;
  display: flex;
  flex-direction: row;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  bottom: 0;
  justify-content: center;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
    -moz-appearance: none;
    -webkit-appearance: none;
  }
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: -1;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;

  & h3 {
    font-size: 1.5rem;
  }

  & svg {
    cursor: pointer;
  }
`;

const Example = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  min-height: 250px;
  max-width: 325px;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  margin-top: 1rem;
  //border: 2px solid rgb(240, 240, 240);
  border-radius: 10px;
  padding: 2rem;
  cursor: pointer;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.07);
  transition: box-shadow 0.2s, border 0.2s;
  background: white;

  &:hover {
    //border: 2px solid rgba(0, 255, 55, 0.32);
    box-shadow: 0 0 15px 0 rgba(0, 255, 55, 0.32);
  }

  .title {
    margin-bottom: 1rem;
    font-size: 22px;
    color: #333;
    font-weight: 700;
  }

  .subtitle {
    font-size: 22px;
    line-height: 22px;
    font-size: 15px;
  }

  .emoji {
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

const Examples: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  const ExampleContainers = {
    visible: {
      display: "flex",
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      },
      zIndex: 1
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1
      },
      zIndex: -1
    }
  };

  const exampleItem = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ease: [1, 0.5, 0, 0]
      }
    },
    hidden: {
      opacity: 0,
      x: 200,
      transition: {
        ease: [1, 0.5, 0, 0]
      }
    }
  };

  return (
    <ExamplesContainer
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={ExampleContainers}
    >
      <Background onClick={triggerClose} />
      <Stack>
        <Header>
          <h3>Playground Tutorials</h3>
          <IoMdClose size={34} onClick={triggerClose} />
        </Header>
        <Row>
          {examples.map((_example: any, index: number) => {
            return (
              <a
                href={_example.link}
                target="_blank"
                rel="noopener"
                key={index}
                onClick={() => {
                  Mixpanel.track("Load example project", {
                    link: _example.link,
                    title: _example.title
                  });
                }}
              >
                <motion.div variants={exampleItem} key={index}>
                  <Example>
                    <Text className="emoji">{_example.emoji}</Text>
                    <Text className="title">{_example.title}</Text>
                    <Text className="subtitle">{_example.subtitle}</Text>
                  </Example>
                </motion.div>
              </a>
            );
          })}
        </Row>
      </Stack>
    </ExamplesContainer>
  );
};

export default Examples;
