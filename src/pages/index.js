import React from "react";
import { ThemeProvider } from "theme-ui";
import theme from "../theme";
import ReactGA from 'react-ga';

const TRACKING_ID = "UA-110473979-1";

ReactGA.initialize(TRACKING_ID);

import SEO from "../components/seo";
import Layout from "../components/layout";
import Banner from "../sections/banner";
import KeyFeature from "../sections/key-feature";
import Makkah from "../sections/service-section";
import Madinah from "../sections/core-feature";
import WorkFlow from "../sections/workflow";
import TeamSection from "../sections/team-section";
import TestimonialCard from "../sections/testimonial";

export default function IndexPage() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <SEO title="حدائق الجنة" />
        <Banner />
        <KeyFeature />
        <Makkah />
        <Madinah />
        <WorkFlow />
        <TeamSection />
        <TestimonialCard />
      </Layout>
    </ThemeProvider>
  );
}
