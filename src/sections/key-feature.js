/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Container } from 'theme-ui';
import SectionHeader from '../components/section-header';

export default function KeyFeature() {
  return (
   <section sx={{ variant: 'section.keyFeature'}} id="feature">
     <Container>
       <SectionHeader
       slogan="مرحبا"
       title="أهلا و سهلا"
       />
     </Container>
     
   </section>
  );
}