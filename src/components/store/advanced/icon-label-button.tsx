import { ReactNode } from 'react';
import Link from 'next/link';
import { Button, ButtonVariant } from '@/components/store/base/button';
import { Box } from '@/components/store/base/box';
import { Font } from '@/components/store/base/font';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

interface IconLabelButtonProps {
  /** Design system variant for the underlying Button */
  variant: ButtonVariant;
  /** Destination URL */
  href: string;
  /** Optional target attribute (e.g., "_blank") */
  target?: string;
  /** Optional icon element */
  icon?: ReactNode;
  /** Text label displayed next to the icon */
  label: string;
  /** Full width flag – defaults to true */
  fullWidth?: boolean;
  /** Size token (sm/md/lg) – defaults to sm */
  size?: 'sm' | 'md' | 'lg';
}

export const IconLabelButton = ({
  variant,
  href,
  target,
  icon,
  label,
  fullWidth = true,
  size = 'md',
}: IconLabelButtonProps) => (
  <Button asChild variant={variant} fullWidth={fullWidth} size={size}>
    <Link href={href} target={target}>
      <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
        {icon}
        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black">
          {label}
        </Font>
      </Box>
    </Link>
  </Button>
);
