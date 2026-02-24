import { NextImage } from '@models/common/NextImage';
import { motion, PanInfo } from 'framer-motion';
import { PropsWithChildren, useCallback, useEffect } from 'react';
import { css } from 'stitches.config';

interface Props {
  imageContent: NextImage | null;
  setNext?: () => void;
  setPrev?: () => void;
  direction?: number;
}

const DRAG_BREAK_POINT = 100;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? '100%' : '-100%',
    scale: 0.85,
    opacity: 0.5,
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 400, damping: 35 },
      scale: { duration: 0.3 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? '-30%' : '30%',
    scale: 0.85,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

export default function ContentWrapper({
  imageContent,
  setNext,
  setPrev,
  children,
  direction = 0,
}: PropsWithChildren<Props>) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    if (info.offset.x < -DRAG_BREAK_POINT) {
      setNext?.();
      return;
    }
    if (info.offset.x > DRAG_BREAK_POINT) {
      setPrev?.();
      return;
    }
  }

  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const half = rect.width / 2;

      if (clickX < half) {
        setPrev?.();
      } else {
        setNext?.();
      }
    },
    [setNext, setPrev]
  );

  return (
    <motion.section
      className={wrapperStyle()}
      style={{
        width: '100%',
        cursor: 'grab',
      }}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      onDragEnd={handleDragEnd}
      onClick={handleTap}
      whileTap={{ cursor: 'grabbing' }}
    >
      {imageContent != null ? (
        <div
          className={backgroundStyle()}
          style={{
            backgroundImage: `url(${imageContent.blurDataURL})`,
            width: '100%',
          }}
        >
          {children}
        </div>
      ) : null}
    </motion.section>
  );
}

const wrapperStyle = css({
  backgroundColor: '$transparent',
  height: '100vh',
  position: 'absolute',
  top: 0,
});

const backgroundStyle = css({
  br: '$3',
  backgroundSize: 'cover',
  height: '100%',
});
