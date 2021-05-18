import { ChakraProvider, Flex } from "@chakra-ui/react";
import type { AppProps /*, AppContext */ } from "next/app";
import * as React from "react";
import Sidebar from "../components/app/Sidebar";

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Flex width={"100vw"} flexDirection={"row"} alignItems={"center"}>
        <Sidebar />
        <Flex
          flexDirection={"column"}
          width={"80%"}
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
