import { Platform, PlatformColor, type ColorValue } from 'react-native';

function ios(name: string, fallback: string): ColorValue {
  return Platform.OS === 'ios' ? PlatformColor(name) : fallback;
}

/** iOS semantic colours; they follow light/dark mode automatically. */
export const SystemColors = {
  groupedBackground: ios('systemGroupedBackground', '#F2F2F7'),
  cell: ios('secondarySystemGroupedBackground', '#FFFFFF'),
  label: ios('label', '#000000'),
  secondaryLabel: ios('secondaryLabel', '#3C3C4399'),
  tertiaryLabel: ios('tertiaryLabel', '#3C3C434D'),
  placeholder: ios('placeholderText', '#3C3C434D'),
  separator: ios('separator', '#3C3C434A'),
  tint: ios('systemBlue', '#007AFF'),
  destructive: ios('systemRed', '#FF3B30'),
  fill: ios('tertiarySystemFill', '#7676801F'),
} as const;
