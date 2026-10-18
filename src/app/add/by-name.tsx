import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { FormError, FormSection, formStyles, FormTextInput } from '@/components/form';
import { IntervalPicker } from '@/components/interval-picker';
import { LastSpokePicker } from '@/components/last-spoke-picker';
import { addFriends, isNameTaken, isValidName, NAME_MAX_LENGTH, NOTE_MAX_LENGTH, useFriends } from '@/db/friends';
import { DEFAULT_INTERVAL } from '@/lib/interval';
import { DEFAULT_LAST_SPOKE, resolveLastSpoke } from '@/lib/last-spoke';

export default function AddByNameScreen() {
  const friends = useFriends();
  const [name, setName] = useState('');
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);
  const [lastSpoke, setLastSpoke] = useState(DEFAULT_LAST_SPOKE);
  const [note, setNote] = useState('');

  const taken = isNameTaken(name, friends);
  const canSave = isValidName(name) && !taken;

  const save = () => {
    try {
      addFriends([
        { name, contactId: null, interval, note: note || null, lastSpoke: resolveLastSpoke(lastSpoke, interval) },
      ]);
      router.dismissTo('/');
    } catch (e) {
      Alert.alert('Couldn’t save', e instanceof Error ? e.message : String(e));
    }
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
            autoFocus
            autoCapitalize="words"
            autoComplete="name"
            maxLength={NAME_MAX_LENGTH}
            accessibilityLabel="Name"
          />
        </FormSection>
        <FormSection>
          <IntervalPicker value={interval} onChange={setInterval} />
          <LastSpokePicker value={lastSpoke} interval={interval} onChange={setLastSpoke} />
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
      </ScrollView>
    </>
  );
}
