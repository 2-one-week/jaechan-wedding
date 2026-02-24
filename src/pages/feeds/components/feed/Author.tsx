import Text from '@components/text';
import { CSSProps } from '@utils/styles';

interface Props extends CSSProps {
  children: string | number;
}

export function Author({ children, css }: Props) {
  return (
    <Text elementType="span" weight="bold" size="medium" css={css}>
      {children}
    </Text>
  );
}
