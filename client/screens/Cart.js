import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { CartData } from "../data/CartData";

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState(
    CartData.map((item) => ({ ...item, quantity: 1 })),
  );

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.discountedPrice || item.price) * item.quantity,
      0,
    );
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const getDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.discountedPrice) {
        return total + (item.price - item.discountedPrice) * item.quantity;
      }
      return total;
    }, 0);
  };

  const deliveryFee = 50; // static for now

  const getFinalTotal = () => {
    return getSubtotal() - getDiscount() + deliveryFee;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>

        <View style={styles.priceRow}>
          {item.discountedPrice ? (
            <>
              <Text style={styles.oldPrice}>${item.price}</Text>
              <Text style={styles.discountPrice}>${item.discountedPrice}</Text>
            </>
          ) : (
            <Text style={styles.price}>${item.price}</Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          {/* Quantity Controls */}
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => decreaseQty(item.id)}
            >
              <Text>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => increaseQty(item.id)}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>

          {/* Remove Button */}
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeItem(item.id)}
          >
            <Text style={{ color: "#fff" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListFooterComponent={
              <View style={styles.billContainer}>
                <Text style={styles.billTitle}>Price Details</Text>

                <View style={styles.billRow}>
                  <Text>Subtotal</Text>
                  <Text>${getSubtotal()}</Text>
                </View>

                <View style={styles.billRow}>
                  <Text>Discount</Text>
                  <Text style={{ color: "green" }}>- ${getDiscount()}</Text>
                </View>

                <View style={styles.billRow}>
                  <Text>Delivery Fee</Text>
                  <Text>${deliveryFee}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.billRow}>
                  <Text style={styles.totalText}>Total Amount</Text>
                  <Text style={styles.totalText}>${getFinalTotal()}</Text>
                </View>
              </View>
            }
          />

          {/* Sticky Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() =>
                navigation.navigate("Checkout", { total: getFinalTotal() })
              }
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
            <Text style={styles.total}>Pay ${getFinalTotal()}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  description: {
    fontSize: 12,
    color: "#555",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  oldPrice: {
    textDecorationLine: "line-through",
    color: "#888",
    marginRight: 8,
  },

  discountPrice: {
    color: "red",
    fontWeight: "bold",
  },

  price: {
    fontWeight: "bold",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  qtyText: {
    marginHorizontal: 10,
    fontSize: 16,
  },

  removeBtn: {
    backgroundColor: "red",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  billContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
  },

  billTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },

  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutBtn: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "40%",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
