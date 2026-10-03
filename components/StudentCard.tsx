import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type Student = {
  id?: string | number;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  course?: string | null;
  address?: {
    street?: string | null;
    suite?: string | null;
    city?: string | null;
    zipcode?: string | null;
    geo?: { lat?: string | null; lng?: string | null };
  } | null;
  company?: {
    name?: string | null;
    catchPhrase?: string | null;
    bs?: string | null;
  } | null;
};

export default function StudentCard({ student }: { student: Student }) {
  const { user } = useAuth();

  const isMe = Boolean(
    user &&
      ((user.id != null && student.id != null && String(user.id) === String(student.id)) ||
        (user.email &&
          student.email &&
          user.email.toLowerCase().trim() === student.email.toLowerCase().trim()) ||
        (user.name &&
          student.name &&
          user.name.toLowerCase().trim() === student.name.toLowerCase().trim())),
  );

  const handleViewDetails = () => {
    if (student.id == null) {
      return;
    }

    router.push({
      pathname: '/student/[id]',
      params: { id: String(student.id) },
    });
  };

  return (
    <View style={[styles.card, isMe && styles.myCard]}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{student.name || 'Name not available'}</Text>
        {isMe ? (
          <View style={styles.meBadge}>
            <Text style={styles.meBadgeText}>Me</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.text}>{student.email || 'Email not available'}</Text>
      {student.course ? <Text style={styles.text}>{student.course}</Text> : null}

      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={handleViewDetails}
      >
        <Text style={styles.buttonText}>{isMe ? 'View My Details' : 'View Details'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    gap: 8,
  },
  myCard: {
    borderWidth: 1.5,
    borderColor: '#245bb2',
    backgroundColor: '#f8fbff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    color: '#17324d',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  meBadge: {
    backgroundColor: '#245bb2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  meBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  text: {
    color: '#536579',
  },
  button: {
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#245bb2',
    fontWeight: '600',
  },
});
