import {
  Flex,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Stats() {
  return (
    // <Wrap spacing={{ base: 4, lg: 10 }}>
    //   <WrapItem>
    //     <Statistic name={"Total Users"} value={"10,000"} />
    //   </WrapItem>

    //   <WrapItem>
    //     <Statistic name={"Today's Revenue"} value={"$542,675"} />
    //   </WrapItem>

    //   <WrapItem>
    //     <Statistic name={"Logins Today"} value={"1,156"} />
    //   </WrapItem>

    //   <WrapItem>
    //     <Statistic name={"Downloads Today"} value={"600"} />
    //   </WrapItem>
    // </Wrap>
    // <SimpleGrid p={3} minChildWidth="10em" spacing={10}>
    //   <Statistic name={"Total Users"} value={"10,000"} />
    //   <Statistic name={"Today's Revenue"} value={"$542,675"} />
    //   <Statistic name={"Logins Today"} value={"1,156"} />
    //   <Statistic name={"Downloads Today"} value={"600"} />
    // </SimpleGrid>
    <Flex flexWrap={"wrap"}>
      <Statistic name={"Total Users"} value={"10,000"} />
      <Statistic name={"Today's Revenue"} value={"$542,675"} />
      <Statistic name={"Logins Today"} value={"1,156"} />
      <Statistic name={"Downloads Today"} value={"600"} />
    </Flex>
  );
}

function Statistic(props: { name: string; value: string }) {
  const statBackground = useColorModeValue("white", "gray.700");
  const labelColor = useColorModeValue("gray.500", "gray.100");
  return (
    <Flex m={3}>
      <Stat
        px={5}
        py={3}
        background={statBackground}
        boxShadow="lg"
        borderRadius={5}
        minWidth={"250px"}
        justifyContent={"space-evenly"}
      >
        <Flex flexWrap={"wrap"} flexDirection={"column"}>
          <StatLabel color={labelColor}>{props.name}</StatLabel>
          <Flex alignItems={"center"}>
            <StatNumber fontSize={"3xl"}>{props.value}</StatNumber>
            <StatHelpText p={3}>
              <StatArrow type="increase" />
              23.2%
            </StatHelpText>
          </Flex>
        </Flex>
      </Stat>
    </Flex>
  );
}
