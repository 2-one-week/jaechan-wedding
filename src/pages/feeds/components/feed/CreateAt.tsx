import Text from '@components/text';

interface Props {
  children: string | number;
}

export function CreateAt({ children }: Props) {
  return (
    <Text weight="extralight" size="sm" css={{ color: '$gray400', mt: '$4' }}>
      {children}
    </Text>
  );
}
