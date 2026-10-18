import { asc, eq, max, sql } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import { useCallback } from 'react';

import { db } from '@/db/client';
import { catchUps, friends } from '@/db/schema';
import { useLiveData } from '@/db/use-live-data';
import type { LocalDate } from '@/lib/dates';
import type { Interval } from '@/lib/interval';

export const NAME_MAX_LENGTH = 60;
export const NOTE_MAX_LENGTH = 500;

export type Friend = {
  id: string;
  name: string;
  contactId: string | null;
  interval: Interval;
  note: string | null;
  createdAt: string;
  /** Latest catch-up date; null only if a friend somehow has no catch-ups. */
  lastCatchUp: LocalDate | null;
};

export type NewFriend = {
  name: string;
  contactId: string | null;
  interval: Interval;
  note: string | null;
  lastSpoke: LocalDate;
};

/** Names match when equal after trimming, ignoring case. */
export function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= NAME_MAX_LENGTH;
}

function cleanNote(note: string | null): string | null {
  const trimmed = note?.trim() ?? '';
  return trimmed ? trimmed.slice(0, NOTE_MAX_LENGTH) : null;
}

function selectFriends() {
  return db
    .select({
      id: friends.id,
      name: friends.name,
      contactId: friends.contactId,
      intervalCount: friends.intervalCount,
      intervalUnit: friends.intervalUnit,
      note: friends.note,
      createdAt: friends.createdAt,
      lastCatchUp: max(catchUps.date),
    })
    .from(friends)
    .leftJoin(catchUps, eq(catchUps.friendId, friends.id))
    .groupBy(friends.id);
}

type SelectedFriend = Awaited<ReturnType<typeof selectFriends>>[number];

function toFriend({ intervalCount, intervalUnit, ...rest }: SelectedFriend): Friend {
  return { ...rest, interval: { count: intervalCount, unit: intervalUnit } };
}

const WATCHED_TABLES = ['friends', 'catch_ups'] as const;

export function getFriends(): Friend[] {
  return selectFriends()
    .orderBy(asc(sql`${friends.name} collate nocase`))
    .all()
    .map(toFriend);
}

export function useFriends(): Friend[] {
  return useLiveData(getFriends, WATCHED_TABLES);
}

export function useFriend(id: string): Friend | undefined {
  const read = useCallback(() => {
    const row = selectFriends().where(eq(friends.id, id)).get();
    return row ? toFriend(row) : undefined;
  }, [id]);
  return useLiveData(read, WATCHED_TABLES);
}

export function isNameTaken(name: string, existing: readonly Friend[], excludeId?: string): boolean {
  const key = normalizeName(name);
  return existing.some((f) => f.id !== excludeId && normalizeName(f.name) === key);
}

export class DuplicateNameError extends Error {
  constructor(public readonly friendName: string) {
    super(`You already have a friend called ${friendName}`);
  }
}

/** Creates all friends, each with an initial catch-up on their last-spoke date. */
export function addFriends(drafts: readonly NewFriend[]): void {
  const now = new Date().toISOString();
  db.transaction((tx) => {
    const taken = new Set(
      tx
        .select({ name: friends.name })
        .from(friends)
        .all()
        .map((f) => normalizeName(f.name)),
    );
    for (const draft of drafts) {
      const name = draft.name.trim();
      const key = normalizeName(name);
      if (!isValidName(name)) throw new Error('Invalid name');
      if (taken.has(key)) throw new DuplicateNameError(name);
      taken.add(key);

      const friendId = randomUUID();
      tx.insert(friends)
        .values({
          id: friendId,
          name,
          contactId: draft.contactId,
          intervalCount: draft.interval.count,
          intervalUnit: draft.interval.unit,
          note: cleanNote(draft.note),
          createdAt: now,
        })
        .run();
      tx.insert(catchUps).values({ id: randomUUID(), friendId, date: draft.lastSpoke, createdAt: now }).run();
    }
  });
}

export function updateFriend(id: string, changes: { name: string; interval: Interval; note: string | null }): void {
  const name = changes.name.trim();
  if (!isValidName(name)) throw new Error('Invalid name');
  if (isNameTaken(name, getFriends(), id)) throw new DuplicateNameError(name);
  db.update(friends)
    .set({
      name,
      intervalCount: changes.interval.count,
      intervalUnit: changes.interval.unit,
      note: cleanNote(changes.note),
    })
    .where(eq(friends.id, id))
    .run();
}

/** Deletes the friend; their catch-ups go with them (ON DELETE CASCADE). */
export function removeFriend(id: string): void {
  db.delete(friends).where(eq(friends.id, id)).run();
}
