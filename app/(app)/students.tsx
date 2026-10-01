/* eslint-disable @typescript-eslint/no-unused-vars -- State setters and loader are exam placeholders. */
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StudentCard, { type Student } from '@/components/StudentCard';

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadStudents = async () => {
    // TODO EXAM: 1. Set loading and clear previous errors.
    // TODO EXAM: 2. Call GET /students using fetch() and async/await.
    // TODO EXAM: 3. Include Authorization: Bearer TOKEN from useAuth() if required.
    // TODO EXAM: 4. Check response.ok and handle 401 Unauthorized.
    // TODO EXAM: 5. Parse JSON and save the student array to state.
    // TODO EXAM: 6. Handle errors and stop loading inside finally.
  };

  useEffect(() => {
    // TODO EXAM: Call loadStudents() when the screen loads.
  }, []);

  // TODO EXAM: Use filter() to return students whose name matches the search text.
  const filteredStudents = students;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <TextInput style={styles.input} accessibilityLabel="Search students" placeholder="Search by name" value={search} onChangeText={setSearch} />
      {loading ? (
        <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading students…</Text><Text style={styles.note}>Complete loadStudents() to finish this state.</Text></View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite"><Text style={styles.error}>{error}</Text><Pressable accessibilityRole="button" onPress={loadStudents}><Text style={styles.link}>Try Again</Text></Pressable></View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={({ item }) => <StudentCard student={item} />}
          ListEmptyComponent={<View style={styles.state}><Text style={styles.text}>No students found.</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f2f5fa' },
  title: { fontSize: 28, fontWeight: '700', color: '#17324d', marginBottom: 20 },
  input: { padding: 14, borderWidth: 1, borderColor: '#c6d2e1', borderRadius: 8, backgroundColor: '#ffffff', color: '#17324d', marginBottom: 20 },
  state: { padding: 24, gap: 12, alignItems: 'center' },
  text: { color: '#536579' },
  note: { color: '#536579', fontSize: 12 },
  error: { color: '#b42318' },
  link: { color: '#245bb2', padding: 12 },
});
