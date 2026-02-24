import { NextImage } from '@models/common/NextImage';
import {
  motion,
  MotionProps,
  PanInfo,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { css } from 'stitches.config';

interface Props extends MotionProps {
  imageContent: NextImage | null;
  setNext?: () => void;
  setPrev?: () => void;

  setPrevToBackgroundContent?: () => void;
  setNextToBackgroundContent?: () => void;
}

const FADE_OUT = {
  LEFT: -250,
  RIGHT: 250,
};

const DRAG_BREAK_POINT = 100;
export default function ContentWrapper({
  imageContent,
  setNext,
  setPrev,
  children,
  setPrevToBackgroundContent,
  setNextToBackgroundContent,
  ...props
}: PropsWithChildren<Props>) {
  const x = useMotionValue(0);
  const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const [exitX, setExitX] = useState<string | number>('100%');

  useEffect(() => {
    // 모바일에서 컨텐츠 넘겼을때 스크롤 밀리는 것 방지
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useMotionValueEvent(x, 'change', value => {
    if (value < -20) {
      setNextToBackgroundContent?.();
    }

    if (value > 20) {
      setPrevToBackgroundContent?.();
    }
  });

  useEffect(() => {
    if (exitX === FADE_OUT.LEFT) {
      setNext?.();
    }

    if (exitX === FADE_OUT.RIGHT) {
      setPrev?.();
    }

    return () => {
      setExitX('100%');
    };
  }, [exitX, setNext, setPrev]);

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    if (info.offset.x < -DRAG_BREAK_POINT) {
      return setExitX(FADE_OUT.LEFT);
    }
    if (info.offset.x > DRAG_BREAK_POINT) {
      return setExitX(FADE_OUT.RIGHT);
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
        x,
        width: '100%',
        cursor: 'grab',
      }}
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
      exit={{
        x: exitX,
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.2 },
      }}
      {...props}
    >
      {imageContent != null ? (
        <motion.div
          className={backgroundStyle()}
          style={{
            scale,
            backgroundImage: `url(${imageContent.blurDataURL})`,
            width: '100%',
          }}
        >
          {children}
        </motion.div>
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
