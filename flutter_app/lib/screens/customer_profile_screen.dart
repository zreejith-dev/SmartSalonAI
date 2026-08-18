import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class CustomerProfileScreen extends StatefulWidget {
  final String phone;
  const CustomerProfileScreen({required this.phone, super.key});

  @override
  State<CustomerProfileScreen> createState() => _CustomerProfileScreenState();
}

class _CustomerProfileScreenState extends State<CustomerProfileScreen> {
  late final String _phone;
  late SupabaseClient _supabase;
  List<Map<String, dynamic>> _visitHistory = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _phone = widget.phone;
    _supabase = Supabase.instance.client;
    _loadVisitHistory();
  }

  Future _loadVisitHistory() async {
    setState(() => _isLoading = true);
    try {
      final result = await _supabase
          .from('haircut_visits')
          .select()
          .eq('customer_phone', _phone)
          .order('visit_date', ascending: false);

      setState(() {
        _visitHistory = result as List<Map<String, dynamic>>;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future _deleteCustomer() async {
    final confirmed = await showDialog(
      context: context,
      builder: => AlertDialog(
        title: const text: 'Delete Customer',
        content: const text: 'Are you sure you want to delete this customer and all their visit history? This cannot be undone.',
        actions: [
          textButton(onPressed: () => Navigator.of(context).pop(false), text: 'Cancel'),
          textButton(onPressed: () => Navigator.of(context).pop(true), text: 'Delete'),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      // Delete haircut visits first (child records)
      await _supabase.from('haircut_visits').delete().eq('customer_phone', _phone);
      // Delete customer
      await _supabase.from('customers').delete().eq('phone', _phone);
      _loadVisitHistory();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: text: 'Customer deleted successfully'),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: text: 'Error: ${e.toString()}'),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: text: 'Customer Profile: ${_phone.substring(_phone.length - 4)}',
        backgroundColor: Color(0xFF1C1B1F),
        foregroundColor: Color(0xFFFFFFFF),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            color: Color(0xFFC25450), // alert
            onPressed: _deleteCustomer,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: text: 'Error loading data: $_error', style: const TextStyle(color: Color(0xFFC25450)))
              : _visitHistory.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.history_toggle_off, size: 64, color: Color(0xFF666666)),
                          const SizedBox(height: 16),
                          text: 'No visit history yet', style: TextStyle(color: Color(0xFF888888)),
                          textButton(
                            onPressed: () => Navigator.pop(context),
                            text: 'Add First Visit',
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _visitHistory.length,
                      itemBuilder: (context, index) {
                        final visit = _visitHistory[index];
                        final visitDate = visit['visit_date'] ?? '';
                        final haircutStyle = visit['haircut_style'] ?? '';
                        final barber = visit['barber_name'] ?? '';
                        final photoUrl = visit['photo_url'];
                        final notes = visit['notes'];

                        return Card(
                          color: Color(0xFF2B2A30),
                          margin: const EdgeInsets.only(bottom: 12),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    CircleAvatar(
                                      backgroundColor: Color(0xFFC98A3E),
                                      child: text: _phone.substring(_phone.length - 1),
                                      foregroundColor: Color(0xFF1C1B1F),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          text: '$haircutStyle', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFF7F5F1), fontSize: 14),
                                          const SizedBox(height: 4),
                                          text: 'Date: $visitDate • Barber: $barber', style: TextStyle(color: Color(0xFFB8B5C0), fontSize: 12),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                if (notes != null && notes.isNotEmpty) ...[
                                  const SizedBox(height: 8),
                                  text: 'Notes: $notes', style: TextStyle(color: Color(0xFF888888), fontSize: 12),
                                ],
                                if (photoUrl != null && photoUrl.isNotEmpty) ...[
                                  const SizedBox(height: 8),
                                  _buildPhotoPreview(photoUrl),
                                ],
                              ],
                            ),
                          ),
                        );
                      },
                    ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/add-visit'),
        backgroundColor: Color(0xFFC98A3E),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildPhotoPreview(String photoUrl) {
    return Container(
      height: 80,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        image: DecorationImage(
          image: NetworkImage(photoUrl),
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}