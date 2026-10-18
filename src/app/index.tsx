import { Link, router, Stack } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { SystemColors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';
import { useFriends, type Friend } from '@/db/friends';
import { dueDate, formatLocalDate } from '@/lib/dates';
import { formatInterval } from '@/lib/interval';

// A basic list for spec 001. Spec 002 replaces it with the overdue-sorted home list.
export default function FriendsScreen() {
  const friends = useFriends();

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="plus" accessibilityLabel="Add friends" onPress={() => router.push('/add')} />
      </Stack.Toolbar>
      <FlatList
        style={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        data={friends}
        keyExtractor={(f) => f.id}
        renderItem={({ item }) => <FriendRow friend={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No friends yet</Text>
            <Text style={styles.subtitle}>Tap + to add people from your contacts.</Text>
          </View>
        }
      />
    </>
  );
}

function FriendRow({ friend }: { friend: Friend }) {
  const due = friend.lastCatchUp ? `due ${formatLocalDate(dueDate(friend.lastCatchUp, friend.interval))}` : null;
  return (
    <Link href={{ pathname: '/friend/[id]', params: { id: friend.id } }} asChild>
      <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.subtitle}>{[formatInterval(friend.interval), due].filter(Boolean).join(' · ')}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: SystemColors.cell,
  },
  row: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    gap: Spacing.half,
  },
  pressed: {
    backgroundColor: SystemColors.fill,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: SystemColors.separator,
    marginLeft: Spacing.three,
  },
  name: {
    fontSize: 17,
    color: SystemColors.label,
  },
  subtitle: {
    fontSize: 15,
    color: SystemColors.secondaryLabel,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: SystemColors.label,
  },
});
