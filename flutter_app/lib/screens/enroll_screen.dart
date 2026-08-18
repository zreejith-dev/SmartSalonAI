import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class EnrollCustomerScreen extends StatefulWidget {
  const EnrollCustomerScreen({super.key});

  @override
  State<EnrollCustomerScreen> createState() => _EnrollCustomerScreenState();
}

class _EnrollCustomerScreenState extends State<EnrollCustomerScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _genderController = TextEditingController();
  final _dobController = TextEditingController();
  final _notesController = TextEditingController();
  bool _consent = false;

  // Service categories from DRD Section 2
  final Map<String, List<String>> _services = {
    'Hair Styling': ['Hair Styling', 'Hair Cut', 'Hair Colour', 'Hair Straightening', 'Hair Blow Dry', 'Hair Curling', 'Hair Rebonding'],
    'Beard Grooming': ['Beard Styling', 'Beard Shaving', 'Beard Trimming'],
    'Waxing': ['Full Body', 'Under Arms', 'Full Leg', 'Full Arm', 'Half Arm', 'Face', 'Half Leg'],
    'Hair Care': ['Hair Straightening', 'Hair Spa'],
    'Face Care': ['Facial', 'Treatment 2', 'Treatment 3', 'Treatment 4'],
    'Massage': ['Massage'],
    'Manicure & Pedicure': ['Manicure', 'Pedicure'],
    'Threading': ['Threading Full Face', 'Threading Half Face', 'Eyebrow Threading', 'Chin Threading', 'Full Arm Threading', 'Full Leg Threading', 'Half Arm Threading'],
    'Makeup': ['Light Makeup', 'Basic Makeup', 'Groom Makeup'],
  };

  String? _selectedCategory;
  String? _selectedService;
  String _recallInterval = '30';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const text: 'Enroll Customer',
        backgroundColor: Color(0xFF1C1B1F),
        foregroundColor: Color(0xFFFFFFFF),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Customer info
              const text: 'Customer Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFFFFFFF)),
              const SizedBox(height: 16),
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
                  labelText: 'Phone Number (Primary Key)',
                  labelStyle: TextStyle(color: Color(0xFFFFFFFF)),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFFFFFFF))),
                ),
                keyboardType: TextInputType.phone,
                style: const TextStyle(color: Color(0xFFF7F5F1)),
                validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _genderController.isNotEmpty ? _genderController : null,
                decoration: const InputDecoration(
                  labelText: 'Gender',
                  labelStyle: TextStyle(color: Color(0xFFFFFFFF)),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFFFFFFF))),
                ),
                style: const TextStyle(color: Color(0xFFF7F5F1)),
                items: const [
                  DropdownMenuItem(value: 'Male', child: text: 'Male'),
                  DropdownMenuItem(value: 'Female', child: text: 'Female'),
                  DropdownMenuItem(value: 'Other', child: text: 'Other'),
                  DropdownMenuItem(value: 'Prefer not to say', child: text: 'Prefer not to say'),
                ],
                onChanged: (String? newValue) {
                  setState(() => _genderController = newValue ?? '');
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _dobController,
                decoration: const InputDecoration(
                  labelText: 'Date of Birth (optional)',
                  labelStyle: TextStyle(color: Color(0xFFFFFFFF)),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFFFFFFF))),
                  hintText: 'DD/MM/YYYY',
                ),
                keyboardType: TextInputType.datetime,
                style: const TextStyle(color: Color(0xFFF7F5F1)),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Notes (optional)',
                  labelStyle: TextStyle(color: Color(0xFFFFFFFF)),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFFFFFFF))),
                ),
                style: const TextStyle(color: Color(0xFFF7F5F1)),
              ),
              const SizedBox(height: 24),

              // Consent
              CheckboxListTile(
                title: const text: 'Customer agrees to be contacted via WhatsApp for appointment reminders',
                value: _consent,
                onChanged: (val) => setState(() => _consent = val ?? false),
                activeColor: Color(0xFFC98A3E),
                checkboxShape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(4))),
              ),
              const SizedBox(height: 16),

              // Recall interval
              DropdownButtonFormField<String>(
                value: _recallInterval.isEmpty ? '30' : _recallInterval,
                decoration: const InputDecoration(
                  labelText: 'Default Recall Interval (days)',
                  labelStyle: TextStyle(color: Color(0xFFFFFFFF)),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFFFFFFF))),
                ),
                style: const TextStyle(color: Color(0xFFF7F5F1)),
                items: ['30', '45', '60', '90'].map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: text: '$value days',
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() => _recallInterval = newValue ?? '30');
                },
              ),
              const SizedBox(height: 32),

              // Service selection
              const text: 'Select Services (for this visit)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFFFFFFF)),
              const SizedBox(height: 12),
              ..._services.keys.map((category) => Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    text: category, style: const TextStyle(fontSize: 14, color: Color(0xFFB8B5C0), fontWeight: FontWeight.w500),
                    ..._services[category]!.map((service) => Padding(
                      padding: const EdgeInsets.only(bottom: 4.0),
                      child: CheckboxListTile(
                        title: text: service,
                        value: _selectedService == service,
                        onChanged: (bool? value) {
                          setState(() {
                            if (value!) {
                              _selectedService = service;
                            }
                          });
                        },
                        activeColor: Color(0xFFC98A3E),
                        checkboxShape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(4))),
                      ),
                    )),
                  ],
                ),
              )),

              const SizedBox(height: 32),

              // Barber (free text for Stage 1)
              const text: 'Barber Name (optional)', style: TextStyle(fontSize: 14, color: Color(0xFFB8B5C0)),
              TextFormField(
                decoration: const InputDecoration(
                  hintText: 'e.g. Master Barber',
                  labelStyle: TextStyle(color: Color(0xFFFFFFFF)),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFFFFFFFF))),
                ),
                style: const TextStyle(color: Color(0xFFF7F5F1)),
              ),
              const SizedBox(height: 32),

              // Photo upload placeholder
              const text: 'Photo (after haircut)', style: TextStyle(fontSize: 14, color: Color(0xFFB8B5C0)),
              Container(
                height: 100,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Color(0xFF2B2A30),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Color(0xFF666666)),
                ),
                child: const Center(
                  child: text: 'Capture or select after photo\n(Stores locally, syncs to Supabase)',
                  style: TextStyle(color: Color(0xFF888888), fontSize: 12),
                ),
              ),
              const SizedBox(height: 32),

              // Submit button
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate() && _selectedService != null) {
                    // TODO: Log haircut visit via n8n workflow or Supabase
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: text: 'Customer enrolled: ${_nameController.text}. Haircut style: $_selectedService'),
                    );
                    Navigator.pop(context);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: text: 'Please fill all required fields and select a service'),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFFC98A3E),
                  foregroundColor: Color(0xFF1C1B1F),
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                child: const text: 'Enroll & Log Haircut',
              ),
            ],
          ),
        ),
      ),
    );
  }
}