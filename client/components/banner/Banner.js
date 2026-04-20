import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Carousel, { PaginationLight } from "react-native-x-carousel";
import React from "react";
import { DATA } from "../../data/BannerData";

const { width } = Dimensions.get("window");

const Banner = () => {
  const renderItem = (data, index) => (
    <View key={data.coverImageUri} style={styles.cardContainer}>
      <Pressable
        onPress={() => {
          Alert.alert(`Clicked Banner ${index}`);
        }}
      >
        <View style={styles.cardWrapper}>
          <Image style={styles.card} source={{ uri: data.coverImageUri }} />
          <View
            style={[
              styles.cornerLabel,
              { backgroundColor: data.cornerLabelColor },
            ]}
          >
            <Text style={styles.cornerLabelText}>{data.cornerLabelText}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        pagination={PaginationLight}
        renderItem={renderItem}
        data={DATA}
        loop
        autoplay
      />
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    width,
  },
  cardWrapper: {
    // borderRadius: 7,
    overflow: "hidden",
  },
  card: {
    width: width,
    height: width * 0.5,
  },
  cornerLabel: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 8,
  },
  cornerLabelText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
  },
});
