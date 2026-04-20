import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Layout from "../../components/layouts/Layout";
import { UserData } from "../../data/UserData";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const Account = ({ navigation }) => {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{
                uri: UserData?.profilePicture,
              }}
              style={styles.profilePicture}
            />
          </View>
          <Text style={styles.profileName}>Hello, {UserData?.name}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email" size={20} color="#FF6B6B" />
              <Text style={styles.infoText}>{UserData?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={20} color="#FF6B6B" />
              <Text style={styles.infoText}>{UserData?.phone}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.accountContainer}>
        <Text style={styles.accountSettingLabel}>Account Settings</Text>
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => navigation.navigate("Profile", { id: UserData?._id })}
        >
          <AntDesign name="edit" style={styles.editProfileBtnText} />
          <Text style={styles.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => navigation.navigate("My Orders")}
        >
          <AntDesign name="bars" style={styles.editProfileBtnText} />
          <Text style={styles.editProfileBtnText}>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => navigation.navigate("Notification")}
        >
          <AntDesign name="bell" style={styles.editProfileBtnText} />
          <Text style={styles.editProfileBtnText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() =>
            navigation.navigate("Admin Panel", { id: UserData?._id })
          }
        >
          <AntDesign name="setting" style={styles.editProfileBtnText} />
          <Text style={styles.editProfileBtnText}>Admin Panel</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  profileCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    elevation: 8,
  },
  profileImageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#FF6B6B",
    overflow: "hidden",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1F1F1F",
    textTransform: "capitalize",
  },
  infoSection: {
    width: "100%",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#666666",
    marginLeft: 12,
    flex: 1,
  },
  accountContainer: {
    padding: 20,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  accountSettingLabel: {
    fontSize: 18,
    fontWeight: "600",
    borderBottomWidth: 1,
    paddingBottom: 8,
    textAlign: "center",
    borderColor: "lightgray",
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 5,
  },
  editProfileBtnText: {
    fontSize: 16,
    marginRight: 10,
  },
});
