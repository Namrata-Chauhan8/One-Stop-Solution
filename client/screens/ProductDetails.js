import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";

const ProductDetails = ({ route }) => {
  const { product } = route.params;
  const [details, setDetails] = useState([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setDetails(product);
  }, []);

  const handleAddQty = () => {
    if (qty < details.stock) {
      setQty(qty + 1);
    } else {
      alert("Stock limit reached");
    }
  };

  const handleReduceQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };
  return (
    <Layout>
      <Image source={{ uri: details.thumbnail }} style={styles.image} />
      <View style={styles.container}>
        <Text style={styles.title}>{details.title}</Text>
        <Text style={styles.price}>
          <Text style={styles.label}>Price :</Text> ${details.price}
        </Text>
        <Text style={styles.description}>{details.description}</Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnCart}
            onPress={() => alert(`Added ${qty} items to cart`)}
            disabled={details.stock === 0}
          >
            <Text style={styles.btnCartText}>
              {details.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnQty}
              onPress={handleReduceQty}
              disabled={qty === 1}
            >
              <Text style={styles.btnQtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.btnQtyText}>{qty}</Text>
            <TouchableOpacity style={styles.btnQty} onPress={handleAddQty}>
              <Text style={styles.btnQtyText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Layout>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100% ",
  },
  container: {
    marginVertical: 15,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    textAlign: "left",
  },
  price: {
    fontSize: 16,
    textAlign: "left",
  },
  label: {
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    textAlign: "left",
    color: "gray",
    textTransform: "capitalize",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 10,
    gap: 10,
  },
  btnCart: {
    width: "30%",
    height: 50,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnQty: {
    width: "20%",
    backgroundColor: "lightgray",
    alignItems: "center",
    marginHorizontal: 10,
  },
  btnQtyText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
