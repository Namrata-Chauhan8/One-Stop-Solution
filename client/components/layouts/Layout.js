import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import Footer from "./Footer";
import { SafeAreaView } from "react-native-safe-area-context";

const Layout = ({ children, scroll = true }) => {
  return (
    <View style={styles.container}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}

      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
  },

  footer: {
    height: 60,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
