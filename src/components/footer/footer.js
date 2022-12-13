/** @jsx jsx */
import { jsx, Box, Container, Image, Text } from 'theme-ui';
import { Link } from '../../components/link';
import data from './footer.data';
import FooterLogo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer sx={styles.footer}>
      <Container>
        <Box sx={styles.footer.footerBottomArea}>
          <Link path='https://oyousaf.uk'>
            <Image src={FooterLogo} alt="Logo" />
          </Link>
          <Box sx={styles.footer.menus}>
            <nav>
              {data.menuItem.map((item,i) => (
                <Link 
                path={item.path}
                key={i}
                label={item.icon}
                sx={styles.footer.link}
                target={item.target}
              /> 
              ))}
            </nav>
          </Box>
          <Text sx={styles.footer.copyright}>
            &copy; {new Date().getFullYear()} حدائق الجنة
          </Text>
        </Box>
      </Container>
    </footer>
  );
}

const styles = {
  footer: {
    footerBottomArea: {
      borderTop: '1px solid',
      borderTopColor: 'border_color',
      display: 'flex',
      pt: [7, null, 8],
      pb: ['40px', null, '100px'],
      textAlign: 'center',
      flexDirection: 'column',
    },
    menus: {
      mt: [3, 4],
      mb: 2,
      nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
      },
    },

    link: {
      fontSize: ['30px'],
      color: 'text',
      fontWeight: '400',
      mb: 2,
      cursor: 'pointer',
      transition: 'all 0.35s',
      display: 'block',
      textDecoration: 'none',
      lineHeight: [1.5, null, 1.8],
      px: [2, null, 4],
      ':hover': {
        color: 'teal',
      },
    },
    copyright: {
      fontSize: [1, '20px'],
      width: '100%',
    },
  },
};
