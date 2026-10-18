import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

import { FormRow, FormSeparator, FormTextInput } from '@/components/form';
import {
  clampCount,
  formatInterval,
  formatUnit,
  INTERVAL_LIMITS,
  INTERVAL_PRESETS,
  INTERVAL_UNITS,
  isPreset,
  type Interval,
  type IntervalUnit,
} from '@/lib/interval';

const CUSTOM = 'custom';

function presetKey({ count, unit }: Interval): string {
  return `${count}-${unit}`;
}

/** Interval rows for a FormSection: preset menu, plus "every N days/weeks/months" when Custom. */
export function IntervalPicker({ value, onChange }: { value: Interval; onChange: (value: Interval) => void }) {
  const [custom, setCustom] = useState(() => !isPreset(value));
  const [countText, setCountText] = useState(String(value.count));

  const selectPreset = (key: string) => {
    if (key === CUSTOM) {
      setCustom(true);
      return;
    }
    const preset = INTERVAL_PRESETS.find((p) => presetKey(p) === key);
    if (preset) {
      setCustom(false);
      setCountText(String(preset.count));
      onChange(preset);
    }
  };

  const changeCount = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setCountText(digits);
    if (digits) onChange({ count: clampCount(Number(digits), value.unit), unit: value.unit });
  };

  const changeUnit = (unit: IntervalUnit) => {
    const count = clampCount(value.count, unit);
    setCountText(String(count));
    onChange({ count, unit });
  };

  return (
    <>
      <FormRow label="Interval">
        <Host matchContents>
          <Picker
            selection={custom ? CUSTOM : presetKey(value)}
            onSelectionChange={(key: string) => selectPreset(key)}
            modifiers={[pickerStyle('menu')]}>
            {INTERVAL_PRESETS.map((p) => (
              <Text key={presetKey(p)} modifiers={[tag(presetKey(p))]}>
                {formatInterval(p)}
              </Text>
            ))}
            <Text modifiers={[tag(CUSTOM)]}>Custom…</Text>
          </Picker>
        </Host>
      </FormRow>
      {custom ? (
        <>
          <FormSeparator />
          <FormRow label="Every">
            <FormTextInput
              value={countText}
              onChangeText={changeCount}
              onBlur={() => setCountText(String(value.count))}
              keyboardType="number-pad"
              maxLength={3}
              textAlign="right"
              accessibilityLabel={`Number of ${value.unit}s, 1 to ${INTERVAL_LIMITS[value.unit]}`}
              style={{ flex: 0, minWidth: 48, minHeight: 0, paddingHorizontal: 0, paddingVertical: 0 }}
            />
          </FormRow>
          <FormSeparator />
          <FormRow label="Unit">
            <Host matchContents>
              <Picker
                selection={value.unit}
                onSelectionChange={(unit: IntervalUnit) => changeUnit(unit)}
                modifiers={[pickerStyle('segmented')]}>
                {INTERVAL_UNITS.map((unit) => (
                  <Text key={unit} modifiers={[tag(unit)]}>
                    {capitalize(formatUnit(value.count, unit))}
                  </Text>
                ))}
              </Picker>
            </Host>
          </FormRow>
        </>
      ) : null}
    </>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
