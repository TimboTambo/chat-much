import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { SystemColors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';

/** An iOS inset-grouped section, like a Settings table. */
export function FormSection({ title, footer, children }: { title?: string; footer?: ReactNode; children: ReactNode }) {
  const rows = Children.toArray(children).filter(Boolean);
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text> : null}
      <View style={styles.card}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 ? <FormSeparator /> : null}
            {row}
          </Fragment>
        ))}
      </View>
      {typeof footer === 'string' ? <Text style={styles.footer}>{footer}</Text> : footer}
    </View>
  );
}

/** For components that render several rows inside one FormSection child. */
export function FormSeparator() {
  return <View style={styles.separator} />;
}

export function FormRow({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rowValue}>{children}</View>
    </View>
  );
}

export function FormTextInput(props: TextInputProps) {
  return <TextInput placeholderTextColor={SystemColors.placeholder} {...props} style={[styles.input, props.style]} />;
}

export function FormButton({
  title,
  onPress,
  destructive,
  disabled,
}: {
  title: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Text
        style={[
          styles.button,
          { color: destructive ? SystemColors.destructive : SystemColors.tint },
          disabled && styles.disabled,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  return <Text style={[styles.footer, { color: SystemColors.destructive }]}>{children}</Text>;
}

export const formStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SystemColors.groupedBackground,
  },
  content: {
    paddingVertical: Spacing.three,
    gap: Spacing.four,
  },
});

const styles = StyleSheet.create({
  section: {
    marginHorizontal: Spacing.three,
  },
  sectionTitle: {
    fontSize: 13,
    color: SystemColors.secondaryLabel,
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  card: {
    backgroundColor: SystemColors.cell,
    borderRadius: 10,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: SystemColors.separator,
    marginLeft: Spacing.three,
  },
  row: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  rowValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 17,
    color: SystemColors.label,
  },
  input: {
    flex: 1,
    minHeight: 44,
    fontSize: 17,
    color: SystemColors.label,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
  },
  button: {
    fontSize: 17,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    backgroundColor: SystemColors.fill,
  },
  footer: {
    fontSize: 13,
    color: SystemColors.secondaryLabel,
    marginHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
});
