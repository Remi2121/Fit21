import { StyleSheet, Text, View } from 'react-native';

type ValueProps = {
  label: string;
  values: string;
};

const Value = ({ label, values }: ValueProps) => (
  <View >
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{values}</Text>
  </View>
);

const styles = StyleSheet.create({
  label: {
    color: 'white',
  },
  value: {
    fontSize: 45,
    color: '#AFB3BE',
    fontWeight: '500',
  },
});

export default Value ;
