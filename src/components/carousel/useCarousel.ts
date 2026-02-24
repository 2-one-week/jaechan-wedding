import { KeenSliderOptions } from 'keen-slider';
import { useKeenSlider } from 'keen-slider/react';
import { useState } from 'react';

export interface Options extends KeenSliderOptions {
  defaultIndex?: number;
}

export function useCarousel(options?: Options) {
  const [index, setIndex] = useState(options?.defaultIndex ?? 0);
  const [size, setSize] = useState(0);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    ...options,
    created: s => {
      setSize(s.track.details.slides.length);
    },
    slideChanged: s => {
      options?.slideChanged?.(s);
      setIndex(s.track.details.rel);
    },
  });

  return {
    index,
    setIndex,
    sliderRef,
    slider,
    size,
  };
}
