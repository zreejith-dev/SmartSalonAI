import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const wf = workflow('smart-salon-web-booking', 'SmartSalon AI - Web Booking Request')
  .add(
    trigger({
      type: 'n8n-nodes-base.manualTrigger',
      version: 1,
      config: { name: 'Web Booking Form', position: [240, 300] },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.set',
      version: 3.4,
      config: {
        name: 'Prepare Booking Request',
        parameters: {
          mode: 'manual',
          includeOtherFields: false,
          assignments: [
            {
              id: 'booking-name',
              name: 'name',
              value: expr('{{ $json.name }}'),
              type: 'string',
            },
            {
              id: 'booking-phone',
              name: 'phone',
              value: expr('{{ $json.phone }}'),
              type: 'string',
            },
            {
              id: 'booking-datetime',
              name: 'preferred_datetime',
              value: expr('{{ $json.preferred_datetime }}'),
              type: 'string',
            },
            {
              id: 'booking-service',
              name: 'service_requested',
              value: expr('{{ $json.service_requested }}'),
              type: 'string',
            },
            {
              id: 'booking-status',
              name: 'status',
              value: expr('"new"'),
              type: 'string',
            },
            {
              id: 'booking-created',
              name: 'created_at',
              value: expr('{{ $now.toISO() }}'),
              type: 'string',
            },
          ],
        },
        output: [{ id: 1, json: {} }],
      },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.httpRequest',
      version: 4.3,
      config: {
        name: 'Insert Booking Request into Supabase',
        parameters: {
          method: 'POST',
          url: 'https://project-ref.supabase.co/rest/booking_requests',
          headers: {
            'apikey': '{{ $env.SUPABASE_PUBLISHABLE_KEY }}',
            'Authorization': 'Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}',
            'Content-Type': 'application/json',
          },
          body: expr('{"name": "{{ $json.name }}", "phone": "{{ $json.phone }}", "preferred_datetime": "{{ $json.preferred_datetime }}", "service_requested": "{{ $json.service_requested }}", "status": "new", "created_at": "{{ $now.toISO() }}"}'),
        },
        credentials: {
          httpHeaderAuth: newCredential('Supabase'),
        },
        output: [{ id: 1, json: {} }],
      },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.telegram',
      version: 1.2,
      config: {
        name: 'Notify Staff - New Booking Request',
        parameters: {
          chatId: '{{ $env.TELEGRAM_CHAT_ID }}',
          text: expr('📋 New booking request:\nName: {{ $json.name }}\nPhone: {{ $json.phone }}\nPreferred: {{ $json.preferred_datetime }}\nService: {{ $json.service_requested }}'),
        },
        credentials: {
          telegramBotApi: newCredential('Telegram Bot'),
        },
        output: [{ id: 1, json: {} }],
      },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.httpRequest',
      version: 4.3,
      config: {
        name: 'Send WhatsApp Booking Notification',
        parameters: {
          method: 'GET',
          url: expr('https://wa.me/{{ $env.WHATSAPP_NUMBER }}?text={{ encodeURIComponent("Hi! I saw Denow online and would like to book a {{ $json.service_requested }} appointment. Preferred time: {{ $json.preferred_datetime }}. Name: {{ $json.name }}, Phone: {{ $json.phone }}") }}'),
          query: {},
          headers: {
            'Accept': 'text/html',
          },
        },
        output: [{ id: 1, json: {} }],
      },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.telegram',
      version: 1.2,
      config: {
        name: 'Notify - Booking Request Sent',
        parameters: {
          chatId: '{{ $env.TELEGRAM_CHAT_ID }}',
          text: expr('📱 WhatsApp booking notification sent to {{ $json.name }}'),
        },
        credentials: {
          telegramBotApi: newCredential('Telegram Bot'),
        },
        output: [{ id: 1, json: {} }],
      },
    })
  );

export default wf;