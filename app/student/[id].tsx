import { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudent = async () => {
    if (!id || !/^\d+$/.test(id)) {
      setError('Invalid student ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (response.status === 404) throw new Error('Student not found.');
      if (!response.ok) throw new Error(`Could not load student (${response.status}).`);
      setStudent((await response.json()) as Student);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load student.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStudent();
  }, [id]);

  const initials = student?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'ST';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Details</Text>

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading student...</Text>
        </View>
      ) : error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
      ) : !student ? (
        <Text style={styles.text}>No student record available.</Text>
      ) : null}

      {student ? (
        <>
          <View style={styles.headerCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View style={styles.headerTextWrap}>
              <Text style={styles.name}>{student.name || 'Student'}</Text>
              <Text style={styles.course}>{student.course || 'No course assigned'}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <InfoTile label="Student ID" value={String(student.id ?? '—')} />
            <InfoTile label="Username" value={student.username || '—'} />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <DetailRow label="Email" value={student.email} />
            <DetailRow label="Phone" value={student.phone} />
            <DetailRow label="Website" value={student.website} />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Address</Text>
            <DetailRow label="Street" value={student.address?.street} />
            <DetailRow label="Suite" value={student.address?.suite} />
            <DetailRow label="City" value={student.address?.city} />
            <DetailRow label="ZIP" value={student.address?.zipcode} />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Company</Text>
            <DetailRow label="Name" value={student.company?.name} />
            <DetailRow label="Catch phrase" value={student.company?.catchPhrase} />
            <DetailRow label="Business" value={student.company?.bs} />
          </View>
        </>
      ) : null}

      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? 'Not available'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 18,
    backgroundColor: '#f2f5fa',
  },
  title: {
    color: '#17324d',
    fontSize: 28,
    fontWeight: '700',
  },
  state: {
    gap: 12,
    alignItems: 'center',
    paddingVertical: 20,
  },
  error: {
    color: '#b42318',
    fontSize: 16,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dfeafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#245bb2',
    fontWeight: '700',
    fontSize: 18,
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#17324d',
    fontSize: 22,
    fontWeight: '700',
  },
  course: {
    color: '#536579',
    fontSize: 14,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  tileLabel: {
    color: '#6b7b8a',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tileValue: {
    color: '#17324d',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },
  sectionTitle: {
    color: '#17324d',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 4,
  },
  rowLabel: {
    color: '#536579',
    fontSize: 15,
    flex: 1,
  },
  rowValue: {
    color: '#17324d',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  text: {
    color: '#536579',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#245bb2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
