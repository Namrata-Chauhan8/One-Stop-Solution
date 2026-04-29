import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Layout from "../../components/layouts/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  deleteProfilePicture,
  updateProfile,
  updateProfilePicture,
} from "../../redux/features/auth/userAction";

const Profile = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const profile = user?.user ?? user ?? null;
  const routeId = route?.params?.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
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
    if (!profile) {
      dispatch(getUserData()).catch((error) => {
        console.log("Profile load error:", error.message || error);
      });
    }
  }, [dispatch, profile, routeId]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setCountry(profile.country || "");
      setContact(profile.phone || "");
      setProfilePicture(resolveImageUri(profile.profilePicture));
    }
  }, [profile]);

  const uploadSelectedImage = async (asset) => {
    if (!asset?.uri) return;

    setProfilePicture(asset.uri);
    setLocalLoading(true);
    try {
      await dispatch(
        updateProfilePicture(asset.uri, asset.fileName, asset.mimeType),
      );
    } catch (error) {
      setProfilePicture(resolveImageUri(profile?.profilePicture));
      Alert.alert("Error", error.message || "Could not update profile picture");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditPicture = () => {
    Alert.alert(
      "Change Photo",
      "Choose where you want to pick the image from",
      [
        {
          text: "Gallery",
          onPress: async () => {
            const permission =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
              Alert.alert(
                "Permission required",
                "Please allow photo library access to choose a profile picture.",
              );
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (result.canceled || !result.assets?.length) {
              return;
            }

            await uploadSelectedImage(result.assets[0]);
          },
        },
        {
          text: "Camera",
          onPress: async () => {
            const permission =
              await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
              Alert.alert(
                "Permission required",
                "Please allow camera access to take a new profile picture.",
              );
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (result.canceled || !result.assets?.length) {
              return;
            }

            await uploadSelectedImage(result.assets[0]);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  const handleDeletePicture = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to remove your profile picture?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLocalLoading(true);
            try {
              await dispatch(deleteProfilePicture());
              setProfilePicture("");
            } catch (error) {
              Alert.alert(
                "Error",
                error.message || "Could not delete profile picture",
              );
            } finally {
              setLocalLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim() || !address.trim() || !city.trim()) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    setLocalLoading(true);
    try {
      await dispatch(
        updateProfile(
          name.trim(),
          email.trim(),
          password.trim() || undefined,
          address.trim(),
          city.trim(),
          country.trim(),
          contact.trim(),
        ),
      );
      setPassword("");
      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log("Update profile error:", error.message || error);
    } finally {
      setLocalLoading(false);
    }
  };

  const saving = loading || localLoading;

  return (
    <Layout scroll={false}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
              <Text style={styles.headerText}>Edit Profile</Text>
            </View>

            <View style={styles.profilePictureSection}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleEditPicture}>
                <View style={styles.imageContainerWrapper}>
                  <View style={styles.imageContainer}>
                    {resolveImageUri(profilePicture) ? (
                      <Image
                        source={{ uri: resolveImageUri(profilePicture) }}
                        style={styles.image}
                      />
                    ) : (
                      <View style={styles.placeholderAvatar}>
                        <Image
                          source={{
                            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                          }}
                          style={styles.image}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.imageOverlay}>
                    <AntDesign name="camera" size={32} color="#fff" />
                    <Text style={styles.overlayText}>Tap to change</Text>
                  </View>
                </View>
              </TouchableOpacity>

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

            <View style={styles.infoSection}>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  editable={!saving}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Contact</Text>
                <TextInput
                  style={styles.input}
                  value={contact}
                  onChangeText={(text) =>
                    setContact(text.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Enter your contact number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  editable={!saving}
                />
              </View>

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
                  editable={!saving}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                  placeholderTextColor="#999"
                  editable={!saving}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  style={styles.input}
                  value={country}
                  onChangeText={setCountry}
                  placeholder="Enter your country"
                  placeholderTextColor="#999"
                  editable={false}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Leave blank to keep current password"
                  placeholderTextColor="#999"
                  secureTextEntry={true}
                  editable={!saving}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSaveChanges}
              activeOpacity={0.8}
              disabled={saving}
            >
              <View style={styles.saveButtonContent}>
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <AntDesign name="save" size={16} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
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
  placeholderAvatar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
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
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
  },
  overlayText: {
    color: "#fff",
    marginTop: 6,
    fontWeight: "600",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  changePhotoButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  deletePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  deletePhotoButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fafafa",
    color: "#1a1a1a",
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 18,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
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
    height: 30,
  },
});
