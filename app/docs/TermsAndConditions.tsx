import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

const TermsAndConditions = () => {
  return (
    <View style={styles.fullScreenContainer}>
      <Stack.Screen options={{ headerTitle: "Terms and Conditions" }} />
      <ScrollView style={styles.container}>
        <Text style={styles.lastUpdated}>Last Updated: November 7, 2025</Text>

        <Text style={styles.paragraph}>
          Welcome to FitCalorie (“we,” “our,” or “us”). These Terms and Conditions (“Terms”) govern your access to and use of the FitCalorie mobile application (the “App”). By downloading or using FitCalorie, you agree to these Terms. Please read them carefully.
        </Text>

        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using FitCalorie, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use the App.
        </Text>

        <Text style={styles.heading}>2. About FitCalorie</Text>
        <Text style={styles.paragraph}>
          FitCalorie is a cross-platform fitness and nutrition tracking app designed to help users monitor their calorie intake and fitness goals. The App provides AI-based food recognition, calorie tracking, and progress analysis features.
          FitCalorie is not a medical or healthcare service and does not provide medical advice. Always consult a qualified healthcare professional before making any changes to your diet or exercise plan.
        </Text>

        <Text style={styles.heading}>3. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be at least 13 years old to use FitCalorie. By using the App, you represent that you meet this age requirement and are legally able to enter into this agreement.
        </Text>

        <Text style={styles.heading}>4. User Accounts</Text>
        <Text style={styles.paragraph}>
          To access certain features, you must create an account using Firebase Authentication. You agree to:
        </Text>
        <Text style={styles.listItem}>• Provide accurate and complete information during registration.</Text>
        <Text style={styles.listItem}>• Maintain the security of your login credentials.</Text>
        <Text style={styles.listItem}>• Notify us immediately of any unauthorized use of your account.</Text>
        <Text style={styles.paragraph}>
          You are responsible for all activity that occurs under your account.
        </Text>

        <Text style={styles.heading}>5. Personal Data</Text>
        <Text style={styles.paragraph}>
          When using FitCalorie, you may provide certain personal information, including:
        </Text>
        <Text style={styles.listItem}>• Email and name</Text>
        <Text style={styles.listItem}>• Weight, height, age, and fitness goals</Text>
        <Text style={styles.paragraph}>
          This information is securely stored using Firebase, Google Cloud, and your device’s local storage. For more details, see our Privacy Policy.
        </Text>

        <Text style={styles.heading}>6. Use of the App</Text>
        <Text style={styles.paragraph}>
          You agree to use the App only for lawful purposes. You may not:
        </Text>
        <Text style={styles.listItem}>• Reverse-engineer, decompile, or modify any part of the App.</Text>
        <Text style={styles.listItem}>• Use the App to transmit malicious code or unauthorized content.</Text>
        <Text style={styles.listItem}>• Interfere with other users’ access to the App.</Text>

        <Text style={styles.heading}>7. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          FitCalorie uses third-party technologies and services, including:
        </Text>
        <Text style={styles.listItem}>• Firebase (for authentication and data storage)</Text>
        <Text style={styles.listItem}>• Google Cloud (for secure backend operations)</Text>
        <Text style={styles.listItem}>• AI-based food recognition APIs</Text>
        <Text style={styles.listItem}>• Expo (for app framework and deployment)</Text>
        <Text style={styles.paragraph}>
          Your use of these services is subject to their respective terms and privacy policies.
        </Text>

        <Text style={styles.heading}>8. In-App Purchases and Advertising</Text>
        <Text style={styles.paragraph}>
          FitCalorie may include advertisements and offer in-app purchases. By making a purchase, you agree to the applicable payment terms of the app store (Google Play or Apple App Store).
          We are not responsible for third-party advertisements or external links shown in the App.
        </Text>

        <Text style={styles.heading}>9. Health Disclaimer</Text>
        <Text style={styles.paragraph}>
          FitCalorie is designed for general fitness and nutrition guidance. It does not provide medical, nutritional, or health advice.
          Always consult your doctor or a licensed healthcare provider before starting any diet or exercise program.
        </Text>

        <Text style={styles.heading}>10. Termination</Text>
        <Text style={styles.paragraph}>
          We may suspend or terminate your access to FitCalorie at any time if we believe you have violated these Terms. Upon termination, your right to use the App will immediately cease.
        </Text>

        <Text style={styles.heading}>11. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the maximum extent permitted by law, FitCalorie and its developers are not liable for any damages arising out of your use or inability to use the App, including data loss or inaccuracies in calorie estimation.
        </Text>

        <Text style={styles.heading}>12. Changes to These Terms</Text>
        <Text style={styles.paragraph}>
          We may update these Terms from time to time. The updated version will be posted within the App and will take effect immediately upon posting.
        </Text>

        <Text style={styles.heading}>13. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms are governed by the laws of Tunisia, without regard to its conflict of law principles.
        </Text>

        <Text style={styles.heading}>14. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns about these Terms, please contact us at:
        </Text>
        <Text style={styles.listItem}>📧 ffitcalorie@gmail.com</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff', // Or a suitable background color
  },
  container: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default TermsAndConditions;
