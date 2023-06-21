import React, { useState } from "react";
import { Box, Image } from "theme-ui";
import { Scrollbars } from "react-custom-scrollbars";
import Drawer from "../../components/drawer";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { Link } from "react-scroll";
import menuItems from "./header.data";
import social from "./social.data";
import { FaTwitter, FaYoutube } from "react-icons/fa";

export default function MobileDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Drawer
      width="320px"
      drawerHandler={
        <Box sx={styles.handler}>
          <IoMdMenu size="30px" />
        </Box>
      }
      open={isDrawerOpen}
      toggleHandler={() => setIsDrawerOpen((prevState) => !prevState)}
      closeButton={<IoMdClose size="30px" />}
      drawerStyle={styles.drawer}
      closeBtnStyle={styles.close}
    >
      <Scrollbars autoHide>
        <Box sx={styles.content}>
          <Box sx={styles.menu}>
            {menuItems.map((menuItem, i) => (
              <Link
                activeClass="active"
                to={menuItem.path}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                key={i}
                onClick={() => setIsDrawerOpen(false)}
              >
                {menuItem.label}
              </Link>
            ))}
          </Box>

          <Box sx={styles.menuFooter}>
            <Box sx={styles.social}>
              <Box as="span" sx={styles.social.icon}>
                <a href="https://twitter.com/oyousaf_" target="_blank">
                  <FaTwitter
                    style={styles.social.icon}
                    onClick={() => setIsDrawerOpen(false)}
                  />
                </a>
              </Box>

              <Box as="span">
                <a href="https://www.youtube.com/@oyousaf_" target="_blank">
                  <FaYoutube
                    style={styles.social.icon}
                    onClick={() => setIsDrawerOpen(false)}
                  />
                </a>
              </Box>
            </Box>
          </Box>
        </Box>
      </Scrollbars>
    </Drawer>
  );
}

const styles = {
  handler: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0",
    width: "30px",

    "@media screen and (min-width: 1024px)": {
      display: "none",
    },
  },

  drawer: {
    width: "100%",
    height: "100%",
    backgroundColor: "dark",
  },

  close: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "25px",
    right: "30px",
    zIndex: "1",
    cursor: "pointer",
  },

  content: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    pt: "100px",
    pb: "40px",
    px: "30px",
    backgroundColor: "#bfa68b",
  },

  menu: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    a: {
      fontSize: "16px",
      fontWeight: "500",
      color: "text_white",
      py: "15px",
      cursor: "pointer",
      borderBottom: "1px solid #e8e5e5",
      transition: "all 0.25s",
      "&:hover": {
        color: "teal",
      },
      "&.active": {
        color: "accent",
      },
    },
  },

  menuFooter: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    mt: "auto",
  },

  social: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    a: {
      color: "white",
      cursor: "pointer",
      "&:hover": {
        color: "teal",
      },
    },

    icon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "text",
      fontSize: 30,
      mr: "15px",
      transition: "all 0.25s",
      cursor: "pointer",
      ":last-child": {
        mr: "0",
      },
      "&:hover": {
        color: "teal",
      },
    },
  },

  button: {
    color: "white",
    fontSize: "14px",
    fw: "700",
    height: "45px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    py: "0",
  },
};
