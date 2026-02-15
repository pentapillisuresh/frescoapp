import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDarkMode } from "@/utils/useDarkMode";
import { ChevronLeft, Phone, Shield } from "lucide-react-native";
import {
  useFonts,
  Inter_600SemiBold,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useDarkMode();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  // Handle phone input - only numbers
  const handlePhoneChange = (text) => {
    // Remove all non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhone(numericValue);
  };

  // Handle OTP input - only numbers
  const handleOtpChange = (text) => {
    // Remove all non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setOtp(numericValue);
  };

  const handleSendOtp = () => {
    if (phone.length === 10) {
      // Here you would typically make an API call to send OTP
      setShowOtp(true);
      Alert.alert("Success", "OTP sent successfully to " + phone);
    } else {
      Alert.alert("Invalid", "Please enter a valid 10-digit mobile number");
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      // Here you would typically verify the OTP with your backend
      Alert.alert("Success", "Phone number verified successfully");
      router.push("/role-selection");
    } else {
      Alert.alert("Invalid", "Please enter a valid 6-digit OTP");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A0A0A", "#1A1A1A"]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.keyboardView, { paddingTop: insets.top }]}
      >
        <StatusBar style="light" />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft color="#FFFFFF" size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.title}>FRESCO</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your fresh experience
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <View style={styles.inputDivider} />
                <TextInput
                  placeholder="98765 43210"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={10}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  contextMenuHidden={true}
                  selectTextOnFocus={true}
                />
                {phone.length === 10 && (
                  <View style={styles.phoneCheck}>
                    <View style={styles.checkDot} />
                  </View>
                )}
              </View>
            </View>

            {showOtp && (
              <View style={[styles.inputWrapper, { marginTop: 16 }]}>
                <Text style={styles.inputLabel}>Enter OTP</Text>
                <View style={styles.otpContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <View
                      key={index}
                      style={[
                        styles.otpBox,
                        otp.length > index && styles.otpBoxFilled,
                      ]}
                    >
                      <Text style={styles.otpText}>
                        {otp[index] || ""}
                      </Text>
                    </View>
                  ))}
                </View>
                <TextInput
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="transparent"
                  style={styles.hiddenInput}
                  keyboardType="numeric"
                  maxLength={6}
                  value={otp}
                  onChangeText={handleOtpChange}
                  autoFocus={showOtp}
                  contextMenuHidden={true}
                  selectTextOnFocus={true}
                />
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                {
                  opacity: (showOtp ? otp.length === 6 : phone.length === 10) ? 1 : 0.5,
                },
              ]}
              onPress={showOtp ? handleVerify : handleSendOtp}
              activeOpacity={0.8}
              disabled={showOtp ? otp.length !== 6 : phone.length !== 10}
            >
              <LinearGradient
                colors={
                  showOtp
                    ? ["#089A21", "#0FB83E"]
                    : ["#EF6C00", "#F57C00"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {showOtp ? "Verify & Continue" : "Send Verification Code"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <Shield color="rgba(255,255,255,0.5)" size={14} />
              <Text style={styles.securityText}>
                We'll send a one-time password to verify your number
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{" "}
              <Text style={styles.footerLink}>Terms</Text> and{" "}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#0A0A0A',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 42,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  formContainer: {
    marginVertical: 30,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    height: 60,
    overflow: "hidden",
  },
  countryCode: {
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  inputDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#FFFFFF",
    paddingHorizontal: 16,
  },
  phoneCheck: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#089A21",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxFilled: {
    borderColor: "#089A21",
    backgroundColor: "rgba(8,154,33,0.15)",
  },
  otpText: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
  button: {
    height: 60,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  securityText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 18,
  },
  footerLink: {
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.8)",
    textDecorationLine: "underline",
  },
});