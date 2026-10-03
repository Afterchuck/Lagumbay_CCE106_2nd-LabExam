import { useAuth } from '@/hooks/useAuth';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const { user, token } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>STUDENT SERVICE PORTAL</Text>
      <Text style={styles.title}>Welcome, {user?.name || 'Student'}</Text>
      <Text style={styles.subtitle}>Your student services in one place.</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Account Overview</Text>
        {user?.id ? (
          <Text style={styles.text}>
            <Text style={styles.boldText}>Student ID: </Text>#{user.id}
          </Text>
        ) : null}
        <Text style={styles.text}>
          <Text style={styles.boldText}>Student Name: </Text>
          {user?.name || '—'}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Email: </Text>
          {user?.email || '—'}
        </Text>
        {user?.username ? (
          <Text style={styles.text}>
            <Text style={styles.boldText}>Username: </Text>
            {user.username}
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Quick Actions</Text>
        {user?.id ? (
          <Link
            href={{
              pathname: '/student/[id]',
              params: { id: String(user.id) },
            }}
            asChild
          >
            <Pressable accessibilityRole="button" style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>View My Student Details</Text>
            </Pressable>
          </Link>
        ) : null}
        <Link href="/students" asChild>
          <Pressable accessibilityRole="button" style={styles.button}>
            <Text style={styles.buttonText}>View All Students</Text>
          </Pressable>
        </Link>
        <Link href="/profile" asChild>
          <Pressable accessibilityRole="button" style={styles.button}>
            <Text style={styles.buttonText}>My Profile</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Session Status</Text>
        <Text style={styles.subtitle}>{token ? 'Authenticated' : 'Not Available'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#f2f5fa',
  },
  eyebrow: {
    color: '#245bb2',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: '#17324d',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#536579',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    gap: 14,
  },
  heading: {
    color: '#17324d',
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    color: '#536579',
    fontSize: 15,
  },
  boldText: {
    color: '#17324d',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#17324d',
    padding: 16,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#245bb2',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});