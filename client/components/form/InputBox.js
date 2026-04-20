// components/InputField.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const InputField = ({
  label,
  icon,
  iconType = "Feather", // support multiple icon sets
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  editable = true,
  secure = false, // for password
  multiline = false, // for textarea
  numberOfLines = 1, // for textarea height
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const IconComponent = iconType === "MaterialIcons" ? MaterialIcons : Feather;

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.container, error && styles.errorBorder]}>
        {icon && (
          <IconComponent
            name={icon}
            size={20}
            color="#999"
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
          secureTextEntry={secure && !showPassword}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />

        {secure && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  errorBorder: {
    borderColor: "red",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    color: "#000",
    paddingVertical: 8,
  },
  eyeIcon: {
    padding: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
});
