import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import Layout from "../../components/layouts/Layout";
import { UserData } from "../../data/UserData";

const Profile = ({ navigation }) => {
  const [name, setName] = useState(UserData.name);
  const [email, setEmail] = useState(UserData.email);
  const [password, setPassword] = useState(UserData.password);
  const [profilePicture, setProfilePicture] = useState(UserData.profilePicture);
  const [address, setAddress] = useState(UserData.address);
  const [city, setCity] = useState(UserData.city);
  const [contact, setContact] = useState(UserData.contact);

  const handleEditPicture = () => {
    Alert.alert("Edit Picture", "Choose from camera or gallery");
  };

  const handleDeletePicture = () => {
    Alert.alert(
      "Delete Picture",
      "Are you sure you want to delete your profile picture?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            setProfilePicture("");
            Alert.alert("Deleted", "Profile picture removed");
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleSaveChanges = () => {
    Alert.alert("Success", "Profile updated successfully!");
    navigation.goBack();
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.headerText}>Edit Profile</Text>
            </View>

            {/* Profile Picture Section */}
            <View style={styles.profilePictureSection}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleEditPicture}>
                <View style={styles.imageContainerWrapper}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri:
                          profilePicture ||
                          "https://via.placeholder.com/150?text=No+Image",
                      }}
                      style={styles.image}
                    />
                  </View>
                  {/* Overlay hint on image */}
                  <View style={styles.imageOverlay}>
                    <AntDesign name="camera" size={32} color="#fff" />
                    <Text style={styles.overlayText}>Tap to change</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={handleEditPicture}
                  activeOpacity={0.7}
                >
                  <AntDesign name="camera" size={18} color="#fff" />
                  <Text style={styles.changePhotoButtonText}>Change Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deletePhotoButton}
                  onPress={handleDeletePicture}
                  activeOpacity={0.7}
                >
                  <AntDesign name="delete" size={18} color="#fff" />
                  <Text style={styles.deletePhotoButtonText}>Delete Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Information Section */}
            <View style={styles.infoSection}>
              {/* Name */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Email */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                />
              </View>

              {/* Contact */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Contact</Text>
                <TextInput
                  style={styles.input}
                  value={contact}
                  onChangeText={setContact}
                  placeholder="Enter your contact number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Address */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              {/* City */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Password */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={true}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
              activeOpacity={0.8}
            >
              <View style={styles.saveButtonContent}>
                <AntDesign name="save" size={16} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.spacing} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default Profile;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
  },
  headerSection: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  profilePictureSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageContainerWrapper: {
    position: "relative",
    width: 160,
    height: 160,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  changePhotoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  changePhotoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  deletePhotoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  deletePhotoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.84,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  multilineInput: {
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  spacing: {
    height: 20,
  },
});
