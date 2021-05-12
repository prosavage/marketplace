import { Flex, Text } from "@chakra-ui/react";
import RecentDownloads from "../components/dashboard/RecentDownloads";
import Stats from "../components/dashboard/Stats";

const IndexPage = () => (
  <Flex flexDirection={"column"}>
    <Text px={3} fontWeight={"bold"} fontSize={"4xl"} mb={6}>
      Overview
    </Text>
    <Flex width={"100%"}>
      <Flex direction={"column"}>
        <Stats />
      </Flex>
      <Flex maxWidth={"350px"} width={"100%"}>
        <RecentDownloads />
      </Flex>
    </Flex>
  </Flex>
);

export default IndexPage;
