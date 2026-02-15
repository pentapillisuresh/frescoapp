import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDarkMode } from "@/utils/useDarkMode";
import { ChevronLeft, Upload, CheckCircle } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  useFonts,
  Inter_600SemiBold,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";


/* ---------------- INPUT FIELD ---------------- */
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  colors,
  keyboardType = "default",
  maxLength,
  autoCapitalize,
}) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: colors.textSecondary }]}>
      {label}
    </Text>
    <TextInput
      style={[
        styles.input,
        {
          color: colors.text,
          borderColor: colors.border,
          backgroundColor: colors.elevated,
        },
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textTertiary}
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoCapitalize={autoCapitalize}
    />
  </View>
);


export default function WholesaleRegistrationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useDarkMode();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    businessName: "",
    gstNumber: "",
    panNumber: "",
    licenseNumber: "",
    aadhaarNumber: "",
  });

  const [licenseFile, setLicenseFile] = useState(null);
  const [gstFile, setGstFile] = useState(null);

  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  /* ---------------- FILE PICKER ---------------- */
  const pickDocument = async (type: "license" | "gst") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/png", "image/jpeg"],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        if (type === "license") {
          setLicenseFile(result.assets[0]);
        } else {
          setGstFile(result.assets[0]);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const handleNext = () => {
    if (
      !form.businessName ||
      !form.gstNumber ||
      !form.panNumber ||
      !form.licenseNumber ||
      !form.aadhaarNumber
    ) {
      Alert.alert("Missing Details", "Please fill all required fields.");
      return;
    }

    if (form.aadhaarNumber.length !== 12) {
      Alert.alert("Invalid Aadhaar", "Aadhaar must be 12 digits.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = () => {
    if (!licenseFile || !gstFile) {
      Alert.alert("Upload Required", "Please upload all documents.");
      return;
    }

    Alert.alert("Success", "Registration submitted for verification.", [
      { text: "OK", onPress: () => router.replace("/(tabs)") },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <StatusBar style={colors.statusBar} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={colors.text} size={26} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Wholesale Registration
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <InputField
              label="Business Name"
              value={form.businessName}
              onChangeText={(t) =>
                setForm((prev) => ({ ...prev, businessName: t }))
              }
              placeholder="Enter business name"
              colors={colors}
            />

            <InputField
              label="GST Number"
              value={form.gstNumber}
              onChangeText={(t) =>
                setForm((prev) => ({ ...prev, gstNumber: t }))
              }
              placeholder="Enter GSTIN"
              autoCapitalize="characters"
              colors={colors}
            />

            <InputField
              label="PAN Number"
              value={form.panNumber}
              onChangeText={(t) =>
                setForm((prev) => ({ ...prev, panNumber: t }))
              }
              placeholder="Enter PAN"
              autoCapitalize="characters"
              colors={colors}
            />

            <InputField
              label="License Number"
              value={form.licenseNumber}
              onChangeText={(t) =>
                setForm((prev) => ({ ...prev, licenseNumber: t }))
              }
              placeholder="Enter License Number"
              colors={colors}
            />

            <InputField
              label="Aadhaar Number"
              value={form.aadhaarNumber}
              onChangeText={(t) =>
                setForm((prev) => ({
                  ...prev,
                  aadhaarNumber: t.replace(/[^0-9]/g, ""),
                }))
              }
              placeholder="12-digit Aadhaar"
              keyboardType="numeric"
              maxLength={12}
              colors={colors}
            />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Upload Documents
            </Text>

            <TouchableOpacity
              style={[styles.uploadBox, { borderColor: colors.border }]}
              onPress={() => pickDocument("license")}
            >
              <Upload color={colors.primary} size={22} />
              <Text style={[styles.uploadText, { color: colors.text }]}>
                {licenseFile
                  ? licenseFile.name
                  : "Upload Business License (PDF/JPG/PNG)"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadBox, { borderColor: colors.border }]}
              onPress={() => pickDocument("gst")}
            >
              <Upload color={colors.primary} size={22} />
              <Text style={[styles.uploadText, { color: colors.text }]}>
                {gstFile
                  ? gstFile.name
                  : "Upload GST Certificate (PDF/JPG/PNG)"}
              </Text>
            </TouchableOpacity>

            <View style={[styles.infoBox, { backgroundColor: colors.elevated }]}>
              <CheckCircle color={colors.success} size={20} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Documents will be verified within 24 hours.
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: colors.border }]}
                onPress={() => setStep(1)}
              >
                <Text style={[styles.secondaryText, { color: colors.text }]}>
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: colors.primary, flex: 1 }]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 10,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  inputGroup: { marginBottom: 18 },

  label: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },

  primaryButton: {
    height: 55,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },

  uploadBox: {
    height: 100,
    borderWidth: 2,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderStyle: "dashed",
  },

  uploadText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginTop: 6,
    textAlign: "center",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },

  secondaryButton: {
    height: 55,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },

  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginBottom: 16,
  },
});
