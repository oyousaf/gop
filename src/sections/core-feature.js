/** @jsx jsx */
import { jsx, Container, Box, Button, Image } from 'theme-ui';
import { keyframes } from '@emotion/core';
import TextFeature from 'components/text-feature';
import { useState } from 'react';
import ModalVideo from 'react-modal-video';
import { IoIosPlay } from 'react-icons/io';

import madinah from 'assets/madinah.png';

const data = {
  subTitle: 'Live From',
  title: 'Madinah al-Munawwarah',
};

export default function CoreFeature() {
  const [videoOpen,setVideoOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault ();

    setVideoOpen(true);
  }

  return (
   <section sx={{variant: 'section.coreFeature'}} id="madinah">
    <Container sx={styles.containerBox}>
      <Box sx={styles.contentBox}>
        <TextFeature subTitle={data.subTitle} title={data.title}
        />
      </Box>
      <Box sx={styles.thumbnail}>
        <Image src={madinah} alt="Madinah" />
        <Button
            sx={styles.videoBtn}
            onClick={handleClick}
            aria-label="Play"
          >
            <span>
              <IoIosPlay />
            </span>
          </Button>
      </Box>
    </Container>
    <ModalVideo
        channel="youtube"
        isOpen={videoOpen}
        videoId="gUC3TjCrwRw"
        onClose={() => setVideoOpen(false)}
        autoplay='1'
      />
   </section>
  );
}

const playPluse = keyframes`
  from {
    transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1);
    opacity: 1;
  }

  to {
	transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1.5);
    opacity: 0;
  }
`;

const styles = {
  containerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: ['wrap', null, null, 'nowrap'],
    pb: [0, 7, 0, null, 7],
  },
  contentBox: {
    flexShrink: 0,
    px: [0, null, '30px', 0],
    textAlign: ['center', null, null, 'left'],
    width: ['100%', '80%', null, 340, 400, 430, null, 485],
    pb: ['50px', '60px', null, 0],
    mx: ['auto', null, null, 0],
    '.description': {
      pr: [0, null, 6, 7, 6],
    },
  },
  thumbnail: {
    display: 'inline-flex',
    position: 'relative',
    mr: 'auto',
    ml: ['auto', null, null, null, 7],
    '> img': {
      position: 'relative',
      zIndex: 1,
      height: [310, 'auto'],
    },
  },
  shapeBox: {
    position: 'absolute',
    bottom: -65,
    right: -165,
    zIndex: -1,
    display: ['none', 'inline-block', 'none', null, 'inline-block'],
  },
  videoBtn: {
    zIndex: 2,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: ['60px', null, '80px', null, '100px'],
    height: ['60px', null, '80px', null, '100px'],
    p: '0px !important',
    backgroundColor: 'transparent',
    '&::before': {
      position: 'absolute',
      content: '""',
      left: '50%',
      top: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
      display: 'block',
      width: ['60px', null, '80px', null, '100px'],
      height: ['60px', null, '80px', null, '100px'],
      backgroundColor: 'teal',
      borderRadius: '50%',
      animation: `${playPluse} 1.5s ease-out infinite`,
      opacity: 0.5,
    },
    '> span': {
      backgroundColor: 'rgba(255,255,255,0.5)',
      width: 'inherit',
      height: 'inherit',
      textAlign: 'center',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.5s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      zIndex: 2,
    },
    svg: {
      fontSize: [40, null, 48, null, 62],
    },
  },
};
