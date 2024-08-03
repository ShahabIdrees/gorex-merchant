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

const data = [
  {fuelType: 'Super', sales: 30},
  {fuelType: 'Diesel', sales: 65},
  {fuelType: 'CNG', sales: 42},
  {fuelType: 'LPG', sales: 19},
];

const SalesComponent = () => {
  // Calculate total sales
  const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);

  return (
    <View>
      <VictoryChart
        domainPadding={{x: 40}}
        theme={VictoryTheme.material}
        width={ScreenWidth - 80}
        height={300}>
        <VictoryAxis />
        <VictoryAxis dependentAxis tickFormat={x => `${x}L`} />

        {/* Custom component to display total sales */}
        <VictoryLabel
          x={30} // Adjust x and y position as needed
          y={30}
          text={`${totalSales}`}
          textAnchor="start"
          style={{
            fontSize: 16,
            fill: colors.black,
            fontWeight: '700',
          }}
        />
        <VictoryLabel
          x={80} // Adjust x and y position as needed
          y={30}
          text="Overall Sales"
          textAnchor="start"
          style={{fontSize: 14, fill: 'black'}}
        />

        <VictoryBar
          data={data}
          x="fuelType"
          y="sales"
          barWidth={20}
          barRatio={0.8}
          cornerRadius={{topLeft: 10, topRight: 10}}
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
