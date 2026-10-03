import { API_BASE_URL } from '@/constants/api';
import { type User } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // 1. Validate email and password.
    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both email and password.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // 2. Set loading and clear previous errors.
    setLoading(true);
    setError('');

    try {
      // 3. POST to /login using fetch() and async/await.
      let response: Response;
      try {
        response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password: trimmedPassword,
          }),
        });
      } catch (fetchErr) {
        throw new Error(
          fetchErr instanceof Error ? fetchErr.message : 'Network error. Could not reach server.',
        );
      }

      // Check if server returned a successful login response
      if (response.ok) {
        const payload = await response.json().catch(() => ({}));
        const accessToken = payload.accessToken ?? payload.token ?? payload.access_token;

        if (!accessToken) {
          throw new Error('The server did not return an access token.');
        }

        const userPayload = payload.user ?? payload.profile ?? payload.data ?? {};
        const userData: User = {
          id: userPayload.id ?? userPayload.userId ?? userPayload._id,
          name:
            userPayload.name ??
            userPayload.fullName ??
            userPayload.username ??
            trimmedEmail.split('@')[0],
          email: userPayload.email ?? trimmedEmail,
          role: userPayload.role ?? 'Student',
        };

        // 5. Pass the returned access token and user to the context login().
        await login(accessToken, userData);
        // 6. Navigate using router.replace() after successful authentication.
        router.replace('/');
        return;
      }

      // 4. Fallback for mock/placeholder API (e.g. JSONPlaceholder) where POST /login is 404
      if (response.status === 404 && API_BASE_URL.includes('jsonplaceholder.typicode.com')) {
        if (trimmedPassword !== 'password123') {
          throw new Error('Invalid credentials. Please check your email and password.');
        }

        const userRes = await fetch(
          `${API_BASE_URL}/users?email=${encodeURIComponent(trimmedEmail)}`,
        );

        if (!userRes.ok) {
          throw new Error(`Failed to verify student record (${userRes.status}).`);
        }

        const users = await userRes.json();
        if (!Array.isArray(users) || users.length === 0) {
          throw new Error('Invalid credentials. Student email not found in portal records.');
        }

        const matchedUser = users[0];
        const dynamicToken = `token_${matchedUser.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const userData: User = {
          id: matchedUser.id,
          name: matchedUser.name ?? matchedUser.username ?? trimmedEmail.split('@')[0],
          email: matchedUser.email ?? trimmedEmail,
          role: 'Student',
        };

        await login(dynamicToken, userData);
        router.replace('/');
        return;
      }

      // 4. Check response.ok and parse the returned JSON for error message
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(
        errorPayload?.message ||
          (response.status === 401
            ? 'Invalid email or password.'
            : `Login failed with status ${response.status}.`),
      );
    } catch (err) {
      // 7. Handle login errors and stop loading in finally.
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CCE106 • PRACTICAL EXAMINATION</Text>
        <Text style={styles.title}>Student Service Portal</Text>
        <Text style={styles.subtitle}>Sign in to access student services.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Email"
          placeholder="student@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.feedback} accessibilityLiveRegion="polite">
          {loading && <ActivityIndicator color="#245bb2" accessibilityLabel="Signing in" />}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Login'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f2f5fa',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#245bb2',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17324d',
  },
  subtitle: {
    color: '#536579',
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    color: '#17324d',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c6d2e1',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#17324d',
  },
  feedback: {
    minHeight: 28,
  },
  error: {
    color: '#b42318',
  },
  button: {
    backgroundColor: '#245bb2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});