import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { queryClient } from '@/lib/queryClient';
import { ensureSignedIn } from '@/lib/auth';

type AuthState = 'loading' | 'ready' | 'error';

export default function RootLayout() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    ensureSignedIn()
      .then(() => setAuthState('ready'))
      .catch((error: Error) => {
        setAuthError(error.message);
        setAuthState('error');
      });
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        {authState !== 'ready' && (
          <View style={styles.overlay}>
            {authState === 'loading' && <ActivityIndicator size="large" color="#1d4ed8" />}
            {authState === 'error' && (
              <>
                <Text style={styles.errorTitle}>Sign-in failed</Text>
                <Text style={styles.errorMessage}>{authError}</Text>
                <Text style={styles.errorHint}>
                  Check your .env file has valid EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY,
                  EXPO_PUBLIC_AUTH_EMAIL and EXPO_PUBLIC_AUTH_PASSWORD, and that the user exists in
                  Supabase Auth.
                </Text>
              </>
            )}
          </View>
        )}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
  },
  errorMessage: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
