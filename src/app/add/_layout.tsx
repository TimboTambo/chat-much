import { Stack } from 'expo-router';

import { AddFlowProvider } from '@/features/add-friends/add-flow-context';

export default function AddLayout() {
  return (
    <AddFlowProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Add friends' }} />
        <Stack.Screen name="review" options={{ title: 'Review' }} />
        <Stack.Screen name="by-name" options={{ title: 'Add by name' }} />
      </Stack>
    </AddFlowProvider>
  );
}
