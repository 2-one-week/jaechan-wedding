import { FeedEntity, RawFeedData } from '@models/Feed';
import { Highlight, RawHighlightData } from '@models/Highlight';
import { Feed } from '@pages/feeds/components/feed/Feed';
import { Footer } from '@pages/feeds/components/footer/Footer';
import { Header } from '@pages/feeds/components/header/Header';
import { HighlightSection } from '@pages/feeds/components/highlight/HighlightSection';
import fs from 'fs';
import { InferGetStaticPropsType } from 'next';
import path from 'path';
import { getPlaiceholder } from 'plaiceholder';

async function readImageBuffer(imageSrc: string) {
  return fs.promises.readFile(path.join(process.cwd(), 'public', imageSrc));
}

export async function getStaticProps() {
  const [feedJson, highlightJson] = await Promise.all([
    (await import('public/assets/data/feeds.json')).default,
    (await import('public/assets/data/highlights.json')).default,
  ]);
  const feedDataset = feedJson.data as RawFeedData[];
  const highlightDatdaset = highlightJson.data as RawHighlightData[];

  const feedsPromises = Promise.all(
    feedDataset.map(async feed => {
      const contents = await Promise.all(
        feed.contents.map(async content => {
          const buffer = await readImageBuffer(content.imageSrc);
          const { base64, metadata } = await getPlaiceholder(buffer);

          return {
            ...content,
            image: {
              src: content.imageSrc,
              width: metadata.width,
              height: metadata.height,
              blurDataURL: base64,
            },
          };
        })
      );

      return {
        ...feed,
        contents,
      } as FeedEntity;
    })
  );

  const highlightPromises = Promise.all(
    highlightDatdaset.map(async highlight => {
      const thumbBuffer = await readImageBuffer(highlight.thumbnailImageSrc);
      const { base64, metadata } = await getPlaiceholder(thumbBuffer, {
        size: 24,
      });
      const contents = await Promise.all(
        highlight.contents.map(async content => {
          const buffer = await readImageBuffer(content.imageSrc);
          const { base64, metadata } = await getPlaiceholder(buffer);

          return {
            ...content,
            image: {
              src: content.imageSrc,
              width: metadata.width,
              height: metadata.height,
              blurDataURL: base64,
            },
          };
        })
      );

      return {
        ...highlight,
        thumbnailImage: {
          src: highlight.thumbnailImageSrc,
          width: metadata.width,
          height: metadata.height,
          blurDataURL: base64,
        },
        contents,
      } as Highlight;
    })
  );

  const [feeds, highlights] = await Promise.all([
    feedsPromises,
    highlightPromises,
  ]);

  return { props: { feeds, highlights } };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function FeedsPage({ feeds, highlights }: Props) {
  return (
    <>
      <Header />
      <HighlightSection highlights={highlights} />
      <Feed feeds={feeds} />
      <Footer />
    </>
  );
}
