import { API_BASE_URL } from '@/constants/api';
import { type User } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ProfileRecord = User & {
  phone?: string;
  website?: string;
  course?: string;
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: string;
  };
  company?: {
    name?: string;
    catchPhrase?: string;
  };
};

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileRecord | null>(user ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. GET /profile with fetch(), async/await, and the Bearer token.
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 2. Handle 401 Unauthorized
      if (response.status === 401) {
        await logout();
        throw new Error('Session expired or unauthorized. Please log in again.');
      }

      // 3. Handle successful profile response
      if (response.ok) {
        const data = await response.json();
        const payload = data.user ?? data.profile ?? data.data ?? data;
        setProfile(payload as ProfileRecord);
        return;
      }

      // 4. Fallback for mock/placeholder API where GET /profile is 404
      if (response.status === 404 && API_BASE_URL.includes('jsonplaceholder.typicode.com')) {
        const studentId = user?.id ?? 1;
        const studentRes = await fetch(`${API_BASE_URL}/users/${studentId}`);

        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setProfile({
            ...user,
            ...studentData,
          });
          return;
        }

        // Fallback to user from AuthContext
        if (user) {
          setProfile(user);
          return;
        }
      }

      throw new Error(`Could not load profile (${response.status}).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load profile.');
    } finally {
      setLoading(false);
    }
  }, [token, user, logout]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const confirmLogout = async () => {
    setShowConfirmModal(false);
    setIsLoggingOut(true);
    try {
      // Brief pause to display the logout loading state cleanly
      await new Promise((resolve) => setTimeout(resolve, 800));
      await logout();
    } catch {
      // Ignore cleanup error
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.stateText}>Loading profile…</Text>
        </View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={loadProfile}>
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Personal Information</Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Name: </Text>
            {profile?.name || user?.name || '—'}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Email: </Text>
            {profile?.email || user?.email || '—'}
          </Text>
          {profile?.username ? (
            <Text style={styles.text}>
              <Text style={styles.boldText}>Username: </Text>
              {profile.username}
            </Text>
          ) : null}
          {profile?.phone ? (
            <Text style={styles.text}>
              <Text style={styles.boldText}>Phone: </Text>
              {profile.phone}
            </Text>
          ) : null}
          {profile?.website ? (
            <Text style={styles.text}>
              <Text style={styles.boldText}>Website: </Text>
              {profile.website}
            </Text>
          ) : null}

          {profile?.address ? (
            <>
              <Text style={styles.sectionHeader}>Address</Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Street: </Text>
                {profile.address.street || '—'}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>City: </Text>
                {profile.address.city || '—'}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Zipcode: </Text>
                {profile.address.zipcode || '—'}
              </Text>
            </>
          ) : null}
        </View>
      )}

      <View style={styles.statusCard}>
        <Text style={styles.sectionHeader}>Session Details</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Status: </Text>
          {token ? 'Authenticated' : 'Not Available'}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Token Type: </Text>
          Bearer
        </Text>
      </View>

      {user?.id ? (
        <Link
          href={{
            pathname: '/student/[id]',
            params: { id: String(user.id) },
          }}
          asChild
        >
          <Pressable accessibilityRole="button" style={styles.viewRecordButton}>
            <Text style={styles.viewRecordButtonText}>View My Complete Student Page</Text>
          </Pressable>
        </Link>
      ) : null}

      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => setShowConfirmModal(true)}
      >
        <Text style={styles.buttonText}>LOGOUT</Text>
      </Pressable>

      {/* Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to log out of your student portal session?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.modalConfirmButton}
                onPress={confirmLogout}
              >
                <Text style={styles.modalConfirmText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logging Out Loading Screen */}
      <Modal transparent animationType="fade" visible={isLoggingOut}>
        <View style={styles.modalOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#245bb2" />
            <Text style={styles.loadingTitle}>Signing Out…</Text>
            <Text style={styles.loadingSubtitle}>Securing your student session…</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 14, borderRadius: 12 },
  statusCard: { backgroundColor: '#ffffff', padding: 20, gap: 10, borderRadius: 12 },
  sectionHeader: { color: '#17324d', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  text: { color: '#536579', fontSize: 15 },
  boldText: { color: '#17324d', fontWeight: '600' },
  state: { padding: 24, gap: 12, alignItems: 'center' },
  stateText: { color: '#536579' },
  error: { color: '#b42318' },
  link: { color: '#245bb2', padding: 12, fontWeight: '600' },
  viewRecordButton: {
    backgroundColor: '#17324d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewRecordButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  button: { backgroundColor: '#b42318', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700', letterSpacing: 0.5 },

  // Modal & Loading Overlay Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 50, 77, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17324d',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#536579',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c6d2e1',
    backgroundColor: '#ffffff',
  },
  modalCancelText: {
    color: '#536579',
    fontWeight: '600',
  },
  modalConfirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#b42318',
  },
  modalConfirmText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  loadingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#17324d',
    marginTop: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#536579',
    textAlign: 'center',
  },
});
