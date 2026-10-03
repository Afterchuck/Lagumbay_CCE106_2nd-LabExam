import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
  const { token, authLoading } = useAuth();

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f2f5fa',
        }}
      >
        <ActivityIndicator size="large" color="#245bb2" />
      </View>
    );
  }

  return (
    <Stack
      initialRouteName={token ? '(app)' : 'sign-in'}
      screenOptions={{ headerTintColor: '#17324d' }}
    >
      <Stack.Protected guard={!token}>
        <Stack.Screen name="sign-in" options={{ title: 'Sign In', headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(token)}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="student/[id]" options={{ title: 'Student Details' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
