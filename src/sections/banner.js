/** @jsx jsx */
import { jsx, Container, Box, Heading, Image, Button, Text } from "theme-ui";
import { Link } from "react-scroll";
import BannerImg from "../assets/jordan.jpg";

import { FiChevronDown } from "react-icons/fi";

export default function Banner() {
  return (
    <section sx={styles.banner} id="home">
      <Container sx={styles.banner.container}>
        <Box sx={styles.banner.contentBox}>
          <Heading as="h1" variant="heroPrimary">
            إحياء الأمة بعلم الدين المقدس{" "}
          </Heading>
          <Text as="p" variant="heroSecondary">
            Reviving the Ummah with sacred knowledge of the Deen
          </Text>
          <Link to="feature" spy={true} smooth={true} duration={500}>
            <Button variant="tealBtn">
              <FiChevronDown size={24} />
            </Button>
          </Link>
        </Box>
        <Box sx={styles.banner.imageBox}>
          <Image src={BannerImg} alt="banner" />
        </Box>
      </Container>
    </section>
  );
}

const styles = {
  banner: {
    pt: ["140px", "145px", "155px", "170px", null, null, "180px", "215px"],
    pb: [2, null, 0, null, 2, 0, null, 5],
    position: "relative",
    zIndex: 2,
    container: {
      minHeight: "inherit",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    contentBox: {
      width: ["100%", "90%", "535px", null, "57%", "60%", "68%", "60%"],
      mx: "auto",
      textAlign: "center",
      mb: ["40px", null, null, null, null, 7],
    },
    imageBox: {
      justifyContent: "center",
      textAlign: "center",
      display: "inline-flex",
      mb: [0, null, -6, null, null, "-40px", null, -3],
      img: {
        position: "relative",
        height: [245, "auto"],
      },
    },
  },
};
