import { Pressable, StyleSheet, Text, View } from 'react-native';

// TODO EXAM: Match these fields to the provided API response.
export type Student = {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  course?: string | null;
};

export default function StudentCard({ student }: { student: Student }) {
  const handleViewDetails = () => {
    // TODO EXAM: Check that the student has an id.
    // TODO EXAM: Use Expo Router to navigate to /student/[id] with this student's id.
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{student.name || 'Name not available'}</Text>
      <Text style={styles.text}>{student.email || 'Email not available'}</Text>
      {student.course ? <Text style={styles.text}>{student.course}</Text> : null}
      <Pressable accessibilityRole="button" style={styles.button} onPress={handleViewDetails}>
        <Text style={styles.buttonText}>View Details</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 12, backgroundColor: '#ffffff', marginBottom: 12, gap: 8 },
  name: { color: '#17324d', fontSize: 18, fontWeight: '600' },
  text: { color: '#536579' },
  button: { paddingVertical: 12, alignSelf: 'flex-start' },
  buttonText: { color: '#245bb2', fontWeight: '600' },
});
