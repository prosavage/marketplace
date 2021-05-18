import {
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { Home, Moon, Package, Sun, User } from "react-feather";

export default function Sidebar() {
  const { toggleColorMode } = useColorMode();
  const navbarBackground = useColorModeValue("blue.300", "blue.700");
  const buttonIconColor = useColorModeValue("gray.900", "gray.100");
  const themeButtonIcon = useColorModeValue(<Moon />, <Sun />);

  const links = [
    {
      icon: <Home />,
      aria: "home",
      link: "/",
    },
    {
      icon: <User />,
      aria: "user manager",
      link: "/user",
    },
    {
      icon: <Package />,
      aria: "resource manager",
      link: "/resources",
    },
  ];

  return (
    <Flex h={"100vh"}>
      <Flex
        flexGrow={1}
        borderRadius={25}
        m={3}
        py={5}
        justifyContent={"space-between"}
        alignItems={"center"}
        flexDir={"column"}
        background={navbarBackground}
      >
        <Heading as={"h2"} p={3} fontSize={"2xl"}>
          Admin
        </Heading>
        <Flex flexGrow={1} borderTop={"2px"} px={3} flexDir={"column"}>
          {links.map((link) => (
            <NextLink href={link.link}>
              <IconButton
                my={3}
                icon={link.icon}
                aria-label={link.aria}
                variant={"ghost"}
              />
            </NextLink>
          ))}
        </Flex>
        <IconButton
          aria-label={"theme toggle"}
          icon={themeButtonIcon}
          fontSize="20px"
          p={1}
          m={3}
          onClick={toggleColorMode}
          color={buttonIconColor}
          variant={"ghost"}
        />
      </Flex>
    </Flex>
  );
}
