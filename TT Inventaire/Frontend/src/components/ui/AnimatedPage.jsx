import { Box, Fade, Grow } from '@mui/material';
import { useState, useEffect } from 'react';

/**
 * Wrapper pour animer l'apparition d'une page entière
 * 
 * @param {ReactNode} children - Contenu de la page
 * @param {string} animation - Type d'animation : 'fade' | 'grow' | 'slide'
 * @param {number} timeout - Durée de l'animation en ms
 */
function AnimatedPage({ 
  children, 
  animation = 'fade', 
  timeout = 600,
  delay = 0,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const renderAnimation = () => {
    switch (animation) {
      case 'grow':
        return (
          <Grow in={show} timeout={timeout}>
            <Box>{children}</Box>
          </Grow>
        );
      
      case 'fade':
      default:
        return (
          <Fade in={show} timeout={timeout}>
            <Box>{children}</Box>
          </Fade>
        );
    }
  };

  return renderAnimation();
}

export default AnimatedPage;
