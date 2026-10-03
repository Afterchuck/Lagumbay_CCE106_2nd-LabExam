import { useAuth } from '@/hooks/useAuth';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  // TODO EXAM: Load GET /profile with fetch(), async/await, and the Bearer token.
  // TODO EXAM: Add loading/error state with useState and call the loader using useEffect.
  // TODO EXAM: Check response.ok, handle 401 Unauthorized, and display returned profile data.
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Name: {user?.name || '—'}</Text>
        <Text style={styles.text}>Email: {user?.email || '—'}</Text>
        <Text style={styles.text}>Role: {user?.role || '—'}</Text>
        {!user && <Text style={styles.note}>No profile loaded yet.</Text>}
      </View>
      <Text style={styles.text}>Session Status: {token ? 'Authenticated' : 'Not Available'}</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={logout}><Text style={styles.buttonText}>LOGOUT</Text></Pressable>
      <Text style={styles.note}>Exam starter: complete logout() in AuthContext.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  note: { color: '#536579', fontSize: 12 },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
