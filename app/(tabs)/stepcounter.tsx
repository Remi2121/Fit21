import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RingProgress from '../stepcounter/components/RingProgress';
import Value from '../stepcounter/components/Value';
import useHealthData from '../stepcounter/hooks/useHealthData';

const STEPS_GOAL =10_000;

export default function App() {
  // ✅ month is 0-based: 6 = July
  const { steps, flights, distance } = useHealthData( new Date(2025,6,4));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step Counter</Text>

      <RingProgress radius={150} strokeWidth={50} progress={steps / 10000} />

      <View style={styles.values}>
        <Value label="Steps" values={steps.toString()} />
        <Value label="Distance" values={`${(distance / 1000).toFixed(2)} km`} />
        <Value label="Flights Climbed" values={flights.toString()} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,
  },
  header: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  values: {
    flexDirection: 'row',
    gap: 55,
    flexWrap: 'wrap',
    marginTop: 100,
  },
});