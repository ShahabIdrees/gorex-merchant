import React from 'react';
import {View} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
} from 'victory-native';
import {ScreenWidth} from '../utils/constants';
import {colors} from '../utils/colors';

// Define a mapping from fuel_type integers to string labels
const fuelTypeMapping = {
  1: 'Super',
  2: 'Diesel',
  3: 'CNG',
  4: 'LPG',
};

// Define all fuel types with their string labels
const fuelTypes = [
  {fuel_type: 'Super', litre_fuel: 0},
  {fuel_type: 'Diesel', litre_fuel: 0},
  {fuel_type: 'CNG', litre_fuel: 0},
  {fuel_type: 'LPG', litre_fuel: 0},
];

const SalesComponent = ({data = []}) => {
  // Create a map of the passed data
  const dataMap = data.reduce((acc, curr) => {
    const fuelTypeLabel = fuelTypeMapping[curr.fuel_type];
    if (fuelTypeLabel) {
      acc[fuelTypeLabel] = curr.litre_fuel;
    }
    return acc;
  }, {});

  // Ensure all fuel types are represented, with 0 sales if not passed
  const completeData = fuelTypes.map(fuel => ({
    ...fuel,
    litre_fuel: dataMap[fuel.fuel_type] || 0,
  }));

  // Calculate total sales
  const totalSales = completeData.reduce(
    (acc, curr) => acc + curr.litre_fuel,
    0,
  );

  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <VictoryChart
        domainPadding={{x: 30}}
        theme={VictoryTheme.material}
        width={ScreenWidth - 40}
        height={300}
        domain={{
          y: [0, Math.max(...completeData.map(d => d.litre_fuel), 100)],
        }}>
        <VictoryAxis />
        <VictoryAxis dependentAxis tickFormat={x => `${x}L`} />

        <VictoryLabel
          x={30} // Adjust x and y position as needed
          y={20}
          text={`Overall Sales: ${totalSales}L`}
          textAnchor="start"
          style={{
            fontSize: 16,
            fill: colors.black,
            fontWeight: '700',
          }}
        />

        <VictoryBar
          data={completeData}
          x="fuel_type"
          y="litre_fuel"
          barWidth={20}
          barRatio={0.8}
          cornerRadius={{topLeft: 10, topRight: 10}}
          labels={({datum}) => `${datum.litre_fuel}L`} // Add labels to the bars
          labelComponent={
            <VictoryLabel
              dy={-4} // Adjust the label position
              style={{
                fontSize: 12,
                fill: colors.black,
                fontWeight: '500',
              }}
            />
          }
          style={{
            data: {
              fill: colors.brandAccentColor,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
};

export default SalesComponent;
