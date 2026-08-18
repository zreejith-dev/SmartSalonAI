import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _consent = false;

  late final String _supabaseUrl;
  late final String _supabaseKey;

  @override
  void initState() {
    super.initState();
    // Read from env or use defaults
    _supabaseUrl = String.fromEnvironment('SUPABASE_URL', defaultValue: 'https://project-ref.supabase.co');
    _supabaseKey = String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: 'anon-key');
    _initializeSupabase();
  }

  Future _initializeSupabase() async {
    await Supabase.initialize(
      url: _supabaseUrl,
      anonKey: _supabaseKey,
    );
    setState(() {});
  }

  void _enrollCustomer() {
    if (!_formKey.currentState!.validate()) return;
    if (!_consent) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: text: 'Please consent to WhatsApp contact'),
      );
      return;
    }

    // TODO: Call n8n workflow or Supapse RPC
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: text: 'Customer enrolled: ${_nameController.text} (${_phoneController.text})'),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const text: 'Denow Unisex Saloon'),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const text: 'Welcome to SmartSalon AI', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFFFFFFFF)),
              const SizedBox(height: 24),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  labelStyle: TextStyle(color: Color(0xFFFFFFFF)),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFFFFFFF))),
                ),
                style: const TextStyle(color: Color(0xFFF7F5F1)),
                validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  labelStyle: TextStyle(color: Color(0xFFFFFFFF)),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFFFFFFF))),
                ),
                keyboardType: TextInputType.phone,
                style: const TextStyle(color: Color(0xFFF7F5F1)),
                validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: CheckboxListTile(
                      title: const text: 'I agree to be contacted via WhatsApp for appointment reminders',
                      value: _consent,
                      onChanged: (val) => setState(() => _consent = val ?? false),
                      activeColor: Color(0xFFC98A3E), // amber
                      checkboxShape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(4))),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _enrollCustomer,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFFC98A3E),
                  foregroundColor: Color(0xFF1C1B1F),
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                child: const text: 'Enroll Customer',
              ),
            ],
          ),
        ),
      ),
    );
  }
}