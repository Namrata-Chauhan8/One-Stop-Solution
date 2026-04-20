import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { ProductData } from "../../data/ProductData";
import { useNavigation } from "@react-navigation/native";

const ProductCard = () => {
  const navigation = useNavigation();
  const handleCardPress = (item) => {
    navigation.navigate("Product Details", { product: item });
  };

  const handleAddToCart = (item) => {
    // Alert message for demonstration
    Alert.alert(`${item.title} added to cart!`);
  };

  const renderCard = ({ item }) => {
    return (
      <Pressable style={styles.card} onPress={() => handleCardPress(item)}>
        <Image
          source={{ uri: item.thumbnail }}
          resizeMode="contain"
          style={styles.image}
        />

        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.discountedPrice}</Text>
          <Text style={styles.oldPrice}>${item.price}</Text>
        </View>

        <Text style={styles.rating}>⭐ {item.rating}</Text>

        {/* Add to Cart Button */}
        <Pressable style={styles.button} onPress={() => handleAddToCart(item)}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={ProductData}
      renderItem={renderCard}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    elevation: 3,
    marginTop: 10,
  },

  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
  },

  description: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 6,
  },

  oldPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },

  rating: {
    fontSize: 12,
    marginTop: 4,
  },

  button: {
    marginTop: 8,
    backgroundColor: "#007bff",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
