import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../redux/features/auth/userAction";

const Account = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const profile = user?.user ?? user ?? null;
  const resolveImageUri = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (typeof value.uri === "string") return value.uri;
      if (typeof value.url === "string") return value.url;
      return "";
    }
    return "";
  };

  useEffect(() => {
    dispatch(getUserData()).catch((error) => {
      console.log("Profile error:", error.message || error);
    });
  }, [dispatch]);

  if (loading && !profile) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{
                uri:
                  resolveImageUri(profile?.profilePicture) ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.profilePicture}
            />
          </View>
          <Text style={styles.profileName}>
            Hello, {profile?.name || "User"}
          </Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email" size={20} color="#FF6B6B" />
              <Text style={styles.infoText}>{profile?.email || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={20} color="#FF6B6B" />
              <Text style={styles.infoText}>{profile?.phone || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color="#FF6B6B"
              />
              <Text style={styles.infoText}>
                {[profile?.address, profile?.city, profile?.country]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.accountContainer}>
        <Text style={styles.accountSettingLabel}>Account Settings</Text>
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => navigation.navigate("Profile", { id: profile?._id })}
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
        {profile?.role === "admin" ? (
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() =>
              navigation.navigate("Admin Panel", { id: profile?._id })
            }
          >
            <AntDesign name="setting" style={styles.editProfileBtnText} />
            <Text style={styles.editProfileBtnText}>Admin Panel</Text>
          </TouchableOpacity>
        ) : null}
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
