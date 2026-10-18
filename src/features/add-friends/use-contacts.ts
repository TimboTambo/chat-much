import {
  addContactsChangeListener,
  Contact,
  ContactField,
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-contacts';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import type { PickedContact } from '@/features/add-friends/add-flow-context';

export type ContactsAccess = 'loading' | 'full' | 'limited' | 'denied';

type ContactsState = { access: ContactsAccess; contacts: PickedContact[] };

const FIELDS = [ContactField.FULL_NAME] as const;

async function loadContacts(request: boolean): Promise<ContactsState> {
  let permission = await getPermissionsAsync();
  if (request && permission.status === 'undetermined') {
    permission = await requestPermissionsAsync();
  }
  if (!permission.granted) return { access: 'denied', contacts: [] };

  const details = await Contact.getAllDetails(FIELDS);
  const contacts = details
    .map((c) => ({ contactId: c.id, name: c.fullName?.trim() ?? '' }))
    .filter((c) => c.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  return { access: permission.accessPrivileges === 'limited' ? 'limited' : 'full', contacts };
}

/**
 * Asks for contacts access if it hasn't been asked yet, then loads named
 * contacts A–Z. Reloads when contacts change (e.g. more shared under limited
 * access) and when the app returns to the foreground (e.g. from Settings).
 */
export function useContacts(): ContactsState {
  const [state, setState] = useState<ContactsState>({ access: 'loading', contacts: [] });

  useEffect(() => {
    let active = true;
    const refresh = (request: boolean) =>
      loadContacts(request).then(
        (next) => active && setState(next),
        () => active && setState({ access: 'denied', contacts: [] }),
      );

    refresh(true);
    const contactsSub = addContactsChangeListener(() => refresh(false));
    const appStateSub = AppState.addEventListener('change', (s) => {
      if (s === 'active') refresh(false);
    });
    return () => {
      active = false;
      contactsSub.remove();
      appStateSub.remove();
    };
  }, []);

  return state;
}
