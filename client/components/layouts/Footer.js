import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";

const Footer = () => {
  const route = useRoute();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        name="Home"
        style={styles.menuContainer}
        onPress={() => navigation.navigate("Home")}
      >
        <AntDesign
          name="home"
          style={[styles.icon, route.name === "Home" && styles.active]}
        />
        <Text style={[styles.iconText, route.name === "Home" && styles.active]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        name="notification"
        style={styles.menuContainer}
        onPress={() => navigation.navigate("Notification")}
      >
        <AntDesign
          name="bell"
          style={[styles.icon, route.name === "Notification" && styles.active]}
          onPress={() => navigation.navigate("Notification")}
        />
        <Text
          style={[
            styles.iconText,
            route.name === "Notification" && styles.active,
          ]}
        >
          Notification
        </Text>
      </TouchableOpacity>
      <TouchableOpacity name="account" style={styles.menuContainer}>
        <AntDesign
          name="user"
          style={[styles.icon, route.name === "Account" && styles.active]}
          onPress={() => navigation.navigate("Account")}
        />
        <Text
          style={[styles.iconText, route.name === "Account" && styles.active]}
        >
          Account
        </Text>
      </TouchableOpacity>
      <TouchableOpacity name="cart" style={styles.menuContainer}>
        <AntDesign
          name="shopping-cart"
          style={[styles.icon, route.name === "Cart" && styles.active]}
          onPress={() => navigation.navigate("Cart")}
        />
        <Text style={[styles.iconText, route.name === "Cart" && styles.active]}>
          Cart
        </Text>
      </TouchableOpacity>
      <TouchableOpacity name="logout" style={styles.menuContainer}>
        <AntDesign
          name="logout"
          style={[styles.icon, route.name === "Logout" && styles.active]}
          onPress={() => {
            (alert("Logout successfully"), navigation.navigate("Login"));
          }}
        />
        <Text
          style={[styles.iconText, route.name === "Logout" && styles.active]}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  menuContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 25,
    color: "#000000",
  },
  iconText: {
    color: "#000000",
  },
  active: {
    color: "#007AFF",
  },
});
