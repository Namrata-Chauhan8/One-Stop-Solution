import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Layout from "../../components/layouts/Layout";
import { AntDesign, Feather } from "@expo/vector-icons";

const Dashboard = () => {
  return (
    <Layout>
      <View style={styles.main}>
        <Text style={styles.heading}>Dashboard</Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn}>
            <AntDesign name="product" style={styles.icon} />
            <Text style={styles.btnText}>Manage Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <AntDesign name="unordered-list" style={styles.icon} />
            <Text style={styles.btnText}>Manage Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <AntDesign name="truck" style={styles.icon} />
            <Text style={styles.btnText}>Manage Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <Feather name="users" style={styles.icon} />
            <Text style={styles.btnText}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <Feather name="info" style={styles.icon} />
            <Text style={styles.btnText}>About App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  main: {
    backgroundColor: "lightgray",
    height: "100%",
  },
  heading: {
    backgroundColor: "#000",
    color: "#fff",
    textAlign: "center",
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    borderRadius: 5,
  },
  icon: {
    fontSize: 25,
    marginRight: 20,
    marginLeft: 10,
  },
  btnContainer: {
    margin: 20,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 10,
    marginBottom: 15,
  },
  btnText: {
    fontSize: 16,
  },
});
