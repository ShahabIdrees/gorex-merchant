import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
// import Eye from '../assets/icons/Eye.svg';
// import EyeSlash from '../assets/icons/EyeSlash.svg';
import {Eye, EyeSlash} from '../assets/icons';

const LoginInput = ({
  marginTop,
  label,
  placeholder,
  labelColor = '#000',
  placeHolderColor = '#999',
  isSecureEntry = false,
  inputType,
  handleChangeText,
}) => {
  const [secureText, setSecureText] = useState(isSecureEntry);

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  return (
    <View style={[styles.container, {marginTop}]}>
      <Text style={[styles.label, {color: labelColor}]}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={secureText}
          placeholder={placeholder}
          placeholderTextColor={placeHolderColor}
          keyboardType={inputType || 'default'} // Assign keyboard type
          onChangeText={handleChangeText}
        />
        {isSecureEntry && (
          <TouchableOpacity onPress={toggleSecureText} style={styles.icon}>
            {secureText ? (
              <EyeSlash width={24} height={24} />
            ) : (
              <Eye width={24} height={24} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 60,
    fontSize: 16,
  },
  icon: {
    padding: 10,
  },
});

export default LoginInput;
