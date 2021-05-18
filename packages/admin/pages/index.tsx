import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";

function IndexPage() {
  return (
    <Flex maxW={"800px"} flexDirection={"column"}>
      <Box p={5}>
        <Heading>Dashboard here lmao</Heading>
      </Box>
    </Flex>
  );
}

export default IndexPage;
