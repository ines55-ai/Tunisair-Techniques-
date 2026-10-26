import { Box, Fade, Grow } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

/**
 * Wrapper pour animer l'apparition d'une page entière.
 * Respecte prefers-reduced-motion : si activé, le contenu
 * apparaît immédiatement sans animation.
 */
function AnimatedPage({
  children,
  animation = 'fade',
  timeout = 600,
  delay = 0,
}) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [show, setShow] = useState(prefersReduced); // immédiat si reduced-motion

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay, prefersReduced]);

  const effectiveTimeout = prefersReduced ? 0 : timeout;

  if (animation === 'grow') {
    return (
      <Grow in={show} timeout={effectiveTimeout}>
        <Box>{children}</Box>
      </Grow>
    );
  }

  return (
    <Fade in={show} timeout={effectiveTimeout}>
      <Box>{children}</Box>
    </Fade>
  );
}

export default AnimatedPage;
