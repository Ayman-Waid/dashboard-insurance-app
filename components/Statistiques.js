import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart, ChartConfig } from 'react-native-chart-kit';
import Menu from './Menu'; // Import Menu component


const Statistiques = () => {
  const [usersCount, setUsersCount] = useState(null);
  const [carsCount, setCarsCount] = useState(null);
  const [packsData, setPacksData] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fakeUsersCount = Array.from({ length: 7 }, () => Math.floor(Math.random() * 5));
    const fakeCarsCount = Array.from({ length: 7 }, () => Math.floor(Math.random() * 5));
    const fakePacksData = {
      gold: Math.floor(Math.random() * 10),
      platinum: Math.floor(Math.random() * 10),
      basic: Math.floor(Math.random() * 10),
      silver: Math.floor(Math.random() * 10),
    };

    const now = new Date();
    const pastWeek = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      pastWeek.push(date.toLocaleDateString());
    }

    setUsersCount(fakeUsersCount);
    setCarsCount(fakeCarsCount);
    setPacksData(fakePacksData);
    setTimeline(pastWeek);
  }, []);

  if (usersCount === null || carsCount === null || packsData === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const chartConfig: ChartConfig = {
    backgroundGradientFrom: '#022c43',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#053f5e',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const renderChart = (data, type) => {
    switch (type) {
      case 'Line':
        return (
          <LineChart
            data={{
              
              datasets: [{ data }],
            }}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            withVerticalLines={false}
            withHorizontalLines={false}
            withInnerLines={false}
          />
        );
      case 'Bar':
        return (
          <BarChart
            data={{
              datasets: [{ data }],
            }}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            withVerticalLines={false}
            withHorizontalLines={false}
            withInnerLines={false}
          />
        );
      case 'Pie':
        return (
          <PieChart
            data={Object.keys(data).map((item, index) => ({
              name: item,
              population: data[item],
              color: ['#FF5733', '#FFC300', '#33FF57', '#339CFF'][index % 4],
              legendFontColor: '#fff',
              legendFontSize: 15,
            }))}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.menu}>
    <Menu style={styles.menuitem}/>
    </View>

      <Text style={styles.header}>Statistics</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Users</Text>
          {renderChart(usersCount, 'Line')}
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Cars</Text>
          {renderChart(carsCount, 'Bar')}
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Packs</Text>
          {renderChart(packsData, 'Pie')}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff',
    alignItems: 'center',
    padding: 15,
    width : '100%',

  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    zIndex : -1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#053f5e',
    textAlign: 'center',
    marginVertical: 20,
    zIndex : -1,

  },
  chartContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#053f5e',
    padding: 0,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,

  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
    marginLeft : 10,
    marginTop: 10,

  },
  chart: {
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#fff',
  },
  menu :{
    padding : 10,
    right : 170,
    top : -30,
    zIndex : 1,
    width:'110%',
    marginLeft : 390,
    margin : 20
    

  },
 
});

export default Statistiques;
