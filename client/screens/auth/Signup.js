import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/form/InputBox";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
    }

    if (!contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(contact.replace(/\D/g, ""))) {
      newErrors.contact = "Contact must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        console.log("Signup successful:", {
          email,
          password,
          address,
          city,
          contact,
        });
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAddress("");
        setCity("");
        setContact("");
        // Navigate to home screen
        navigation.replace("Home");
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.log("Signup error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="shopping-bag" size={60} color="#FF6B6B" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Create a new account to start shopping
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <InputField
                label="Email"
                icon="mail"
                placeholder="you@example.com"
                value={email}
                keyboardType="email-address"
                editable={!loading}
                error={errors.email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <InputField
                label="Password"
                icon="lock"
                iconType="MaterialIcons"
                placeholder="Enter your password"
                value={password}
                secure={true}
                editable={!loading}
                error={errors.password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <InputField
                label="Confirm Password"
                icon="lock"
                iconType="MaterialIcons"
                placeholder="Confirm your password"
                value={confirmPassword}
                secure={true}
                editable={!loading}
                error={errors.confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Address Input */}
            <View style={styles.inputGroup}>
              <InputField
                label="Address"
                icon="location-on"
                iconType="MaterialIcons"
                placeholder="Enter your address"
                value={address}
                editable={!loading}
                error={errors.address}
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => {
                  setAddress(text);
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>

            {/* City Input */}
            <View style={styles.inputGroup}>
              <InputField
                label="City"
                icon="location-city"
                iconType="MaterialIcons"
                placeholder="Enter your city"
                value={city}
                editable={!loading}
                error={errors.city}
                onChangeText={(text) => {
                  setCity(text);
                  if (errors.city) setErrors({ ...errors, city: "" });
                }}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
            </View>

            {/* Contact Input */}
            <View style={styles.inputGroup}>
              <InputField
                label="Contact Number"
                icon="phone"
                iconType="MaterialIcons"
                placeholder="Enter your contact number"
                value={contact}
                keyboardType="phone-pad"
                editable={!loading}
                error={errors.contact}
                onChangeText={(text) => {
                  // Remove all non-numeric characters
                  const numericOnly = text.replace(/[^0-9]/g, "");
                  setContact(numericOnly);
                  if (errors.contact) setErrors({ ...errors, contact: "" });
                }}
              />
              {errors.contact && (
                <Text style={styles.errorText}>{errors.contact}</Text>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login Options */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <AntDesign name="google" size={24} color="#FF6B6B" />
                  <Text style={{ color: "#FF6B6B", fontWeight: "700" }}>
                    Google
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.signupLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginTop: 6,
  },

  forgotPassword: {
    fontSize: 14,
    color: "#FF6B6B",
    textAlign: "right",
    fontWeight: "500",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#999",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6B6B",
  },
});
