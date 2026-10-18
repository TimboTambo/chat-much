import { createContext, use, useState, type ReactNode } from 'react';

import { DEFAULT_INTERVAL, type Interval } from '@/lib/interval';
import { DEFAULT_LAST_SPOKE, type LastSpokeChoice } from '@/lib/last-spoke';

export type PickedContact = {
  contactId: string;
  name: string;
};

export type ReviewDraft = PickedContact & {
  interval: Interval;
  lastSpoke: LastSpokeChoice;
};

type AddFlow = {
  /** Selected contacts in selection order, with their review settings. */
  drafts: ReviewDraft[];
  isSelected: (contactId: string) => boolean;
  toggle: (contact: PickedContact) => void;
  remove: (contactId: string) => void;
  update: (contactId: string, changes: Partial<Pick<ReviewDraft, 'interval' | 'lastSpoke'>>) => void;
};

const AddFlowContext = createContext<AddFlow | null>(null);

/** Holds the selection across the Select and Review screens, so Back keeps it. */
export function AddFlowProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<ReviewDraft[]>([]);

  const value: AddFlow = {
    drafts,
    isSelected: (contactId) => drafts.some((d) => d.contactId === contactId),
    toggle: (contact) =>
      setDrafts((prev) =>
        prev.some((d) => d.contactId === contact.contactId)
          ? prev.filter((d) => d.contactId !== contact.contactId)
          : [...prev, { ...contact, interval: DEFAULT_INTERVAL, lastSpoke: DEFAULT_LAST_SPOKE }],
      ),
    remove: (contactId) => setDrafts((prev) => prev.filter((d) => d.contactId !== contactId)),
    update: (contactId, changes) =>
      setDrafts((prev) => prev.map((d) => (d.contactId === contactId ? { ...d, ...changes } : d))),
  };

  return <AddFlowContext value={value}>{children}</AddFlowContext>;
}

export function useAddFlow(): AddFlow {
  const flow = use(AddFlowContext);
  if (!flow) throw new Error('useAddFlow must be used inside AddFlowProvider');
  return flow;
}
