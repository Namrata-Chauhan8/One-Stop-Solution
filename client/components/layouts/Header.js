import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

const Header = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    console.log(searchText);
    setSearchText("");
  };

  return (
    <View style={{ height: 90 }} backgroundColor="lightgray">
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
          <FontAwesome name="search" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  inputBox: {
    borderWidth: 0.3,
    width: "100%",
    position: "absolute",
    left: 10,
    height: 40,
    color: "black",
    backgroundColor: "white",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  searchIcon: {
    position: "absolute",
    left: "95%",
  },
  icon: {
    color: "#ba3c3c",
    fontSize: 18,
  },
});
