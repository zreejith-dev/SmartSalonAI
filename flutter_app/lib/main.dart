import 'package:flutter/material.dart';
import 'screens/onboarding_screen.dart';

void main() {
  runApp(const SmartSalonApp());
}

class SmartSalonApp extends StatelessWidget {
  const SmartSalonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartSalon AI',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Color(0xFF1C1B1F), // ink
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1C1B1F), // ink
          foregroundColor: Color(0xFFFFFFFF), // paper
          elevation: 0,
        ),
        useMaterial3: true,
        colorScheme: ColorScheme.dark(
          primary: Color(0xFFC98A3E), // amber
          onPrimary: Color(0xFF1C1B1F), // ink
          surface: Color(0xFF2B2A30), // ink-soft
          onSurface: Color(0xFFF7F5F1), // paper
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Color(0xFF1C1B1F),
        colorScheme: ColorScheme.dark(
          primary: Color(0xFFC98A3E),
          onPrimary: Color(0xFF1C1B1F),
          surface: Color(0xFF2B2A30),
          onSurface: Color(0xFFF7F5F1),
        ),
      ),
      themeMode: ThemeMode.dark,
      home: const OnboardingScreen(),
    );
  }
}