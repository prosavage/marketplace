import {
  Box,
  Flex,
  Heading,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";

export default function RecentDownloads() {
  const statBackground = useColorModeValue("white", "gray.700");
  const labelColor = useColorModeValue("gray.500", "gray.100");

  return (
    <Flex
      m={3}
      flexDirection={"column"}
      width={"100%"}
      background={statBackground}
      borderRadius={5}
      overflow="hidden"
      boxShadow="lg"
    >
      <Box p={3}>
        <Heading as={"h2"} fontSize={"2xl"} color={labelColor}>
          Recent Downloads
        </Heading>
      </Box>
      <Flex flexDirection={"column"}>
        {[1, 2, 3, 4, 5].map((entry) => (
          <RecentDownloadsEntry />
        ))}
      </Flex>
    </Flex>
  );
}

function RecentDownloadsEntry() {
  const borderColor = useColorModeValue("gray.100", "blue.800");
  return (
    <Flex
      flexDirection={"row"}
      p={3}
      borderTop={"1px"}
      borderColor={borderColor}
      alignItems={"center"}
    >
      <SkeletonCircle
        //   isLoaded
        // startColor={"blue.300"}
        // endColor={"blue.500"}
        speed={2}
        size={"50px"}
      />
      <Flex p={3}>
        <p>Ur mom</p>
      </Flex>
    </Flex>
  );
}
