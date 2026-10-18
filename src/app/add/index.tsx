import { Contact, ContactAccessButton } from 'expo-contacts';
import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { FormButton, FormSection, formStyles } from '@/components/form';
import { SystemColors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';
import { normalizeName, useFriends } from '@/db/friends';
import { useAddFlow, type PickedContact } from '@/features/add-friends/add-flow-context';
import { useContacts } from '@/features/add-friends/use-contacts';

type RowState = 'available' | 'selected' | 'added' | 'nameSelected';

export default function SelectContactsScreen() {
  const { access, contacts } = useContacts();
  const friends = useFriends();
  const flow = useAddFlow();
  const [query, setQuery] = useState('');

  const addedIds = new Set(friends.map((f) => f.contactId).filter(Boolean));
  const addedNames = new Set(friends.map((f) => normalizeName(f.name)));
  const selectedNames = new Set(flow.drafts.map((d) => normalizeName(d.name)));

  const rowState = (c: PickedContact): RowState => {
    if (flow.isSelected(c.contactId)) return 'selected';
    if (addedIds.has(c.contactId) || addedNames.has(normalizeName(c.name))) return 'added';
    if (selectedNames.has(normalizeName(c.name))) return 'nameSelected';
    return 'available';
  };

  const needle = query.trim().toLocaleLowerCase();
  const visible = needle ? contacts.filter((c) => c.name.toLocaleLowerCase().includes(needle)) : contacts;
  const count = flow.drafts.length;

  const header = (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button onPress={() => router.dismiss()}>Cancel</Stack.Toolbar.Button>
      </Stack.Toolbar>
      {access === 'full' || access === 'limited' ? (
        <>
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
              variant="done"
              disabled={count === 0}
              onPress={() => router.push('/add/review')}>
              {count > 0 ? `Next (${count})` : 'Next'}
            </Stack.Toolbar.Button>
          </Stack.Toolbar>
          <Stack.SearchBar
            placeholder="Search"
            hideWhenScrolling={false}
            onChangeText={(e) => setQuery(e.nativeEvent.text)}
            onCancelButtonPress={() => setQuery('')}
          />
        </>
      ) : null}
    </>
  );

  if (access === 'loading') {
    return (
      <View style={[formStyles.screen, styles.center]}>
        {header}
        <ActivityIndicator />
      </View>
    );
  }

  if (access === 'denied') {
    return (
      <View style={formStyles.screen}>
        {header}
        <View style={formStyles.content}>
          <FormSection footer="Chat Much uses your contacts so you can choose which friends to keep in touch with. You can turn on access in Settings, or add people by name.">
            <FormButton title="Open Settings" onPress={() => Linking.openSettings()} />
            <FormButton title="Add by name" onPress={() => router.push('/add/by-name')} />
          </FormSection>
        </View>
      </View>
    );
  }

  return (
    <View style={formStyles.screen}>
      {header}
      <FlatList
        style={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        data={visible}
        keyExtractor={(c) => c.contactId}
        renderItem={({ item }) => (
          <ContactRow contact={item} state={rowState(item)} onPress={() => flow.toggle(item)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={access === 'limited' ? <LimitedAccessHeader query={query} /> : null}
        ListEmptyComponent={
          <Text style={styles.empty}>{needle ? `No contacts match “${query.trim()}”.` : 'No contacts with a name.'}</Text>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <FormSection>
              <FormButton title="Add by name" onPress={() => router.push('/add/by-name')} />
            </FormSection>
          </View>
        }
      />
    </View>
  );
}

/** Limited access (iOS 18+): share more contacts without leaving the app. */
function LimitedAccessHeader({ query }: { query: string }) {
  return (
    <View style={styles.limited}>
      <Text style={styles.limitedText}>Chat Much can only see the contacts you’ve shared.</Text>
      {ContactAccessButton.isAvailable() && query.trim() ? (
        <ContactAccessButton query={query.trim()} style={styles.accessButton} />
      ) : null}
      <Pressable accessibilityRole="button" onPress={() => void Contact.presentAccessPicker()}>
        <Text style={styles.link}>Share more contacts…</Text>
      </Pressable>
    </View>
  );
}

function ContactRow({ contact, state, onPress }: { contact: PickedContact; state: RowState; onPress: () => void }) {
  const disabled = state === 'added' || state === 'nameSelected';
  const checked = state === 'selected' || state === 'added';
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <SymbolView
        name={checked ? 'checkmark.circle.fill' : 'circle'}
        size={22}
        tintColor={disabled ? SystemColors.tertiaryLabel : checked ? SystemColors.tint : SystemColors.tertiaryLabel}
      />
      <Text style={[styles.name, disabled && styles.disabledText]} numberOfLines={1}>
        {contact.name}
      </Text>
      {state === 'added' ? <Text style={styles.badge}>Added</Text> : null}
      {state === 'nameSelected' ? <Text style={styles.badge}>Same name selected</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  row: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: SystemColors.cell,
  },
  pressed: {
    backgroundColor: SystemColors.fill,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: SystemColors.separator,
    marginLeft: Spacing.three + 22 + Spacing.three,
  },
  name: {
    flex: 1,
    fontSize: 17,
    color: SystemColors.label,
  },
  disabledText: {
    color: SystemColors.secondaryLabel,
  },
  badge: {
    fontSize: 15,
    color: SystemColors.secondaryLabel,
  },
  empty: {
    textAlign: 'center',
    color: SystemColors.secondaryLabel,
    padding: Spacing.four,
  },
  footer: {
    paddingVertical: Spacing.four,
  },
  limited: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  limitedText: {
    fontSize: 15,
    color: SystemColors.secondaryLabel,
  },
  accessButton: {
    height: 56,
  },
  link: {
    fontSize: 17,
    color: SystemColors.tint,
  },
});
