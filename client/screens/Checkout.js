import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Layout from "../components/layouts/Layout";
import React from "react";

const Checkout = ({ navigation }) => {
  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.heading}>Payment Options</Text>
        <Text style={styles.price}>Total Amount : $1249</Text>
        <View style={styles.paymentCard}>
          <Text style={styles.paymentMethod}>Choose Payment Method</Text>
          <TouchableOpacity style={styles.paymentBtn}>
            <Text style={styles.paymentBtnText}>Cash on Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentBtn}
            onPress={() => navigation.navigate("Payment")}
          >
            <Text style={styles.paymentBtnText}>Online(Credit/Debit Card)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "500",
    marginVertical: 20,
  },
  price: {
    fontSize: 20,
    marginBottom: 10,
    color: "gray",
  },
  paymentCard: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  paymentMethod: {
    fontSize: 18,
    color: "gray",
    fontWeight: "500",
    marginVertical: 10,
  },
  paymentBtn: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  paymentBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
