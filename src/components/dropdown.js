import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Animated,
} from 'react-native';
import {colors} from '../utils/colors';
import {ChevDown, ChevUp} from '../assets/icons';

const Dropdown = props => {
  const [filterType, setFilterType] = useState(props.data[0]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (isDropdownVisible) {
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownHeight, {
        toValue: props.data.length * 40, // Adjust height based on the number of items
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleItemPress = item => {
    setFilterType(item);
    Animated.timing(dropdownHeight, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setDropdownVisible(false));
    if (props.onSelectItem) {
      props.onSelectItem(item);
    }
  };

  return (
    <View style={[styles.wrapper, props.wrapperStyles]}>
      <TouchableOpacity
        style={[styles.container, props.styles]}
        onPress={toggleDropdown}>
        <Text style={styles.text}>{filterType}</Text>
        {isDropdownVisible ? <ChevUp /> : <ChevDown />}
      </TouchableOpacity>
      {isDropdownVisible && (
        <Animated.View style={[styles.dropdown, {height: dropdownHeight}]}>
          <FlatList
            data={props.data}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleItemPress(item)}>
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  container: {
    backgroundColor: colors.borderColor,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    color: colors.primaryText,
    marginHorizontal: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderColor: colors.borderColor,
    borderWidth: 1,
    zIndex: 2,
    marginTop: 4,
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 100,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    color: colors.primaryText,
  },
});

export default Dropdown;
