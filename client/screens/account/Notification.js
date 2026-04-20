import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Layout from "../../components/layouts/Layout";

const Notification = () => {
  return (
    <Layout>
      <View style={styles.container}>
        <Text>Oopss...!!! You don't have any notifications yet</Text>
      </View>
    </Layout>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
