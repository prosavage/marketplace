import { ChakraProvider, Flex } from "@chakra-ui/react";
import type { AppProps /*, AppContext */ } from "next/app";
import * as React from "react";
import Navbar from "../components/app/Navbar";

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Flex width={"100vw"} flexDirection={"column"} alignItems={"center"}>
        <Navbar />

        <Flex
          flexDirection={"column"}
          width={"100%"}
          height={"100%"}
          maxWidth={"1920px"}
        >
          <Component {...pageProps} />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
