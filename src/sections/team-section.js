/** @jsx jsx */
import { jsx, Container, Box } from "theme-ui";

export default function TeamSection() {
  return (
    <section sx={{ variant: "section.testimonial" }} id="hadith">
      <Container sx={styles.containerBox}>
        <Box sx={styles.thumbnail}>
          <div className="powr-rss-feed" id="4cccdec4_1650043664"></div>
          <script src="https://www.powr.io/powr.js?platform=react"></script>
        </Box>
      </Container>
    </section>
  );
}

const styles = {
  grid: {
    mt: [0, null, -6, null, -4],
    gridGap: ["35px 0px", null, 0, null, null, "30px 35px"],
    gridTemplateColumns: [
      "repeat(2,1fr)",
      null,
      "repeat(2,1fr)",
      null,
      "repeat(3,1fr)",
    ],
  },
};