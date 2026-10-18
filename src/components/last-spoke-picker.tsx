import { DatePicker, Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

import { FormRow, FormSeparator } from '@/components/form';
import { formatLocalDate, fromLocalDate, toLocalDate, today } from '@/lib/dates';
import type { Interval } from '@/lib/interval';
import {
  LAST_SPOKE_LABELS,
  resolveLastSpoke,
  type LastSpokeChoice,
  type LastSpokeOption,
} from '@/lib/last-spoke';

const OPTIONS = Object.keys(LAST_SPOKE_LABELS) as LastSpokeOption[];

/** "Last spoke" rows for a FormSection: quick options, plus a native date picker (no future dates). */
export function LastSpokePicker({
  value,
  interval,
  onChange,
}: {
  value: LastSpokeChoice;
  interval: Interval;
  onChange: (value: LastSpokeChoice) => void;
}) {
  const resolved = resolveLastSpoke(value, interval);

  const select = (option: LastSpokeOption) => {
    onChange(option === 'date' ? { option, date: resolved } : { option });
  };

  return (
    <>
      <FormRow label="Last spoke">
        <Host matchContents>
          <Picker
            selection={value.option}
            onSelectionChange={(option: LastSpokeOption) => select(option)}
            modifiers={[pickerStyle('menu')]}>
            {OPTIONS.map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {option === 'today' || option === 'date'
                  ? LAST_SPOKE_LABELS[option]
                  : `${LAST_SPOKE_LABELS[option]} (${formatLocalDate(resolveLastSpoke({ option }, interval))})`}
              </Text>
            ))}
          </Picker>
        </Host>
      </FormRow>
      {value.option === 'date' ? (
        <>
          <FormSeparator />
          <FormRow label="Date">
            <Host matchContents>
              <DatePicker
                selection={fromLocalDate(resolved)}
                range={{ end: fromLocalDate(today()) }}
                displayedComponents={['date']}
                onDateChange={(date) => onChange({ option: 'date', date: toLocalDate(date) })}
              />
            </Host>
          </FormRow>
        </>
      ) : null}
    </>
  );
}
