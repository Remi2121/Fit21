import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';
import {
  initialize,
  readRecords,
  requestPermission,
} from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';


const useHealthData = (date: Date) => {
  const permissions: HealthKitPermissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.Steps,
        AppleHealthKit.Constants.Permissions.FlightsClimbed,
        AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      ],
      write: [],
    },
  };

  const [hasPermissions, setHasPermission] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);

  // iOS - Apple HealthKit
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log('HealthKit not available', err);
        return;
      }

      if (!isAvailable) {
        console.log('HealthKit is not available on this device');
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error initializing HealthKit', err);
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions || Platform.OS !== 'ios') {
      return;
    }

    const options: HealthInputOptions = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps:', err);
        setSteps(0);
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting flights climbed:', err);
        setFlights(0);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting distance walking/running:', err);
        setDistance(0);
        return;
      }
      setDistance(results.value);
    });
  }, [hasPermissions, date]);

  // Android - Health Connect
  const readSampleData = async () => {
    try {
      const isInitialized = await initialize();
      console.log(' Health Connect initialized:', isInitialized);

      const grantedPermissions = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'FloorsClimbed' },
      ]);
      console.log(' Permissions granted:', grantedPermissions);

      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime: new Date(date.setHours(0,0,0,0)) .toISOString(),
        endTime: new Date(date.setHours(23,59,59,999)) .toISOString(),
      };

      // Steps
      const stepsResult = await readRecords('Steps', {
        timeRangeFilter,
      });
      console.log(steps);
      const totalSteps = stepsResult.records.reduce((sum, cur) => sum + (cur.count ?? 0), 0);
      console.log('Total steps:', totalSteps);
      setSteps(totalSteps);

      // Distance
      const distanceResult = await readRecords('Distance', {
        timeRangeFilter,
      });
      const totalDistance = distanceResult.records.reduce((sum, cur) => sum + (cur.distance?.inMeters ?? 0), 0);
      console.log('Total distance (meters):', totalDistance);
      setDistance(totalDistance);

      // Floors Climbed
      const floorsClimbedResult = await readRecords('FloorsClimbed', {
        timeRangeFilter,
      });
      const totalFloorsClimbed = floorsClimbedResult.records.reduce((sum, cur) => sum + (cur.floors ?? 0), 0);
      console.log('Total floors climbed:', totalFloorsClimbed);
      setFlights(totalFloorsClimbed);

    } catch (error) {
      console.error('Error reading Health Connect data:', error);
      setSteps(0);
      setDistance(0);
      setFlights(0);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    readSampleData();
  }, [date]);

  return { steps, flights, distance };
};

export default useHealthData;
