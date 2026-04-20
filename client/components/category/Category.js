import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { categoriesData } from "../../data/CategoriesData";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Category = () => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.text} onPress={()=>navigation.navigate(item?.path)}>
          <FontAwesome name={item.icon} size={20} color="black" />
          <Text>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={categoriesData}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
