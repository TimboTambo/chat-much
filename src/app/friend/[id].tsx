import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import { FormButton, FormError, FormRow, FormSection, formStyles, FormTextInput } from '@/components/form';
import { IntervalPicker } from '@/components/interval-picker';
import { SystemColors } from '@/constants/colors';
import {
  isNameTaken,
  isValidName,
  NAME_MAX_LENGTH,
  NOTE_MAX_LENGTH,
  removeFriend,
  updateFriend,
  useFriend,
  useFriends,
  type Friend,
} from '@/db/friends';
import { dueDate, formatLocalDate } from '@/lib/dates';

export default function EditFriendScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const friend = useFriend(id);

  if (!friend) {
    return <Text style={styles.missing}>This friend no longer exists.</Text>;
  }
  // Keyed so the form resets if the route is reused for another friend.
  return <EditFriendForm key={friend.id} friend={friend} />;
}

function EditFriendForm({ friend }: { friend: Friend }) {
  const friends = useFriends();
  const [name, setName] = useState(friend.name);
  const [interval, setInterval] = useState(friend.interval);
  const [note, setNote] = useState(friend.note ?? '');

  const taken = isNameTaken(name, friends, friend.id);
  const canSave = isValidName(name) && !taken;

  const save = () => {
    try {
      updateFriend(friend.id, { name, interval, note: note || null });
      router.back();
    } catch (e) {
      Alert.alert('Couldn’t save', e instanceof Error ? e.message : String(e));
    }
  };

  const confirmRemove = () => {
    Alert.alert(`Remove ${friend.name}?`, 'Their catch-up history will be deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          router.back();
          removeFriend(friend.id);
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button variant="done" disabled={!canSave} onPress={save}>
          Save
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <ScrollView
        style={formStyles.screen}
        contentContainerStyle={formStyles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled">
        <FormSection
          title="Name"
          footer={taken ? <FormError>You already have a friend called {name.trim()}.</FormError> : undefined}>
          <FormTextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoCapitalize="words"
            maxLength={NAME_MAX_LENGTH}
            accessibilityLabel="Name"
          />
        </FormSection>
        <FormSection>
          <IntervalPicker value={interval} onChange={setInterval} />
          {friend.lastCatchUp ? (
            <FormRow label="Last catch-up">
              <Text style={styles.value}>{formatLocalDate(friend.lastCatchUp)}</Text>
            </FormRow>
          ) : null}
          {friend.lastCatchUp ? (
            <FormRow label="Due">
              <Text style={styles.value}>{formatLocalDate(dueDate(friend.lastCatchUp, interval))}</Text>
            </FormRow>
          ) : null}
        </FormSection>
        <FormSection title="Note">
          <FormTextInput
            value={note}
            onChangeText={setNote}
            placeholder="Optional"
            multiline
            maxLength={NOTE_MAX_LENGTH}
            accessibilityLabel="Note"
          />
        </FormSection>
        <FormSection>
          <FormButton title="Remove friend" destructive onPress={confirmRemove} />
        </FormSection>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  value: {
    fontSize: 17,
    color: SystemColors.secondaryLabel,
  },
  missing: {
    textAlign: 'center',
    padding: 24,
    color: SystemColors.secondaryLabel,
  },
});
