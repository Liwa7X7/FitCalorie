import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

const PrivacyPolicy = () => {
  return (
    <View style={styles.fullScreenContainer}>
      <Stack.Screen options={{ headerTitle: "Privacy Policy" }} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>🔒 FitCalorie – Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: November 7, 2025</Text>

        <Text style={styles.paragraph}>
          This Privacy Policy explains how FitCalorie (“we,” “our,” or “us”) collects, uses, and protects your personal information when you use our mobile application.
        </Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          When using FitCalorie, we may collect:
        </Text>
        <Text style={styles.listItem}>• Account Information: Email and name (via Firebase Authentication)</Text>
        <Text style={styles.listItem}>• Fitness Data: Weight, height, age, and fitness goals</Text>
        <Text style={styles.listItem}>• App Usage Data: Information stored on your device to track progress</Text>
        <Text style={styles.listItem}>• Camera Data: Images used for AI food recognition (processed securely and not stored permanently)</Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:
        </Text>
        <Text style={styles.listItem}>• Provide and improve app functionality</Text>
        <Text style={styles.listItem}>• Enable secure authentication</Text>
        <Text style={styles.listItem}>• Personalize user experience and fitness recommendations</Text>
        <Text style={styles.listItem}>• Store user progress and data securely</Text>
        <Text style={styles.listItem}>• Display ads and manage in-app purchases</Text>

        <Text style={styles.heading}>3. Data Storage and Security</Text>
        <Text style={styles.paragraph}>
          Your data is securely stored using:
        </Text>
        <Text style={styles.listItem}>• Firebase for authentication and database services</Text>
        <Text style={styles.listItem}>• Google Cloud for secure backend storage</Text>
        <Text style={styles.listItem}>• Local device storage for user preferences</Text>
        <Text style={styles.paragraph}>
          We take reasonable technical and organizational measures to protect your information from unauthorized access or loss.
        </Text>

        <Text style={styles.heading}>4. Advertising and In-App Purchases</Text>
        <Text style={styles.paragraph}>
          FitCalorie may show advertisements and offer in-app purchases. Ads are provided by third-party networks that may collect anonymous data for ad personalization and performance measurement.
          You can disable ad personalization in your device settings.
        </Text>

        <Text style={styles.heading}>5. Data Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell or rent your personal data. We may share information only with:
        </Text>
        <Text style={styles.listItem}>• Service providers (Firebase, Google Cloud, AI APIs)</Text>
        <Text style={styles.listItem}>• Law enforcement authorities if required by law</Text>

        <Text style={styles.heading}>6. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your personal information only as long as necessary to provide the service and comply with legal obligations. You may request deletion of your account and data at any time by contacting us.
        </Text>

        <Text style={styles.heading}>7. Children’s Privacy</Text>
        <Text style={styles.paragraph}>
          FitCalorie is intended for users aged 13 and above. We do not knowingly collect data from children under 13. If we learn that we have collected such data, we will delete it immediately.
        </Text>

        <Text style={styles.heading}>8. Health Disclaimer</Text>
        <Text style={styles.paragraph}>
          FitCalorie provides general fitness and nutrition guidance and is not a substitute for professional medical advice. Always consult your doctor before making any changes to your health routine.
        </Text>

        <Text style={styles.heading}>9. Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy periodically. The updated version will be posted within the App with a new “Last Updated” date.
        </Text>

        <Text style={styles.heading}>10. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy or your data, contact us at:
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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

export default PrivacyPolicy;
