import {
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Moon, Sun } from "react-feather";

export default function Navbar() {
  const { toggleColorMode } = useColorMode();
  const navbarBackground = useColorModeValue("gray.100", "gray.700");
  const buttonIconColor = useColorModeValue("gray.900", "gray.100");
  const themeButtonIcon = useColorModeValue(<Moon />, <Sun />);

  return (
    <Flex
      p={3}
      width={"100%"}
      justifyContent={"space-between"}
      alignItems={"center"}
      background={navbarBackground}
    >
      <Heading as={"h2"} fontSize={"2xl"}>
        Marketplace Admin
      </Heading>
      <IconButton
        aria-label={"theme toggle"}
        icon={themeButtonIcon}
        fontSize="20px"
        p={1}
        onClick={toggleColorMode}
        bg={navbarBackground}
        color={buttonIconColor}
      />
    </Flex>
  );
}
