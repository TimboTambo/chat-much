import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormSection, formStyles } from '@/components/form';
import { IntervalPicker } from '@/components/interval-picker';
import { LastSpokePicker } from '@/components/last-spoke-picker';
import { SystemColors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';
import { addFriends } from '@/db/friends';
import { useAddFlow, type ReviewDraft } from '@/features/add-friends/add-flow-context';
import { resolveLastSpoke } from '@/lib/last-spoke';

export default function ReviewScreen() {
  const flow = useAddFlow();

  const save = () => {
    try {
      addFriends(
        flow.drafts.map((d) => ({
          name: d.name,
          contactId: d.contactId,
          interval: d.interval,
          note: null,
          lastSpoke: resolveLastSpoke(d.lastSpoke, d.interval),
        })),
      );
      router.dismissTo('/');
    } catch (e) {
      Alert.alert('Couldn’t save', e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button variant="done" disabled={flow.drafts.length === 0} onPress={save}>
          Save
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <ScrollView
        style={formStyles.screen}
        contentContainerStyle={formStyles.content}
        contentInsetAdjustmentBehavior="automatic">
        {flow.drafts.length === 0 ? (
          <Text style={styles.empty}>Nobody left to add. Go back to choose contacts.</Text>
        ) : (
          flow.drafts.map((draft) => <DraftSection key={draft.contactId} draft={draft} />)
        )}
      </ScrollView>
    </>
  );
}

function DraftSection({ draft }: { draft: ReviewDraft }) {
  const flow = useAddFlow();
  return (
    <FormSection>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {draft.name}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${draft.name} from this batch`}
          hitSlop={Spacing.two}
          onPress={() => flow.remove(draft.contactId)}>
          <SymbolView name="xmark.circle.fill" size={22} tintColor={SystemColors.tertiaryLabel} />
        </Pressable>
      </View>
      <IntervalPicker value={draft.interval} onChange={(interval) => flow.update(draft.contactId, { interval })} />
      <LastSpokePicker
        value={draft.lastSpoke}
        interval={draft.interval}
        onChange={(lastSpoke) => flow.update(draft.contactId, { lastSpoke })}
      />
    </FormSection>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: SystemColors.label,
  },
  empty: {
    textAlign: 'center',
    color: SystemColors.secondaryLabel,
    padding: Spacing.four,
  },
});
