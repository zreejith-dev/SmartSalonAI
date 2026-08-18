import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const wf = workflow('smart-salon-haircut-db', 'SmartSalon AI - Haircut Database')
  .add(
    trigger({
      type: 'n8n-nodes-base.manualTrigger',
      version: 1,
      config: { name: 'Log Haircut', position: [240, 300] },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.set',
      version: 3.4,
      config: {
        name: 'Prepare Visit Record',
        parameters: {
          mode: 'manual',
          includeOtherFields: false,
          assignments: [
            {
              id: 'visit-customer-phone',
              name: 'customer_phone',
              value: expr('{{ $json.phone }}'),
              type: 'string',
            },
            {
              id: 'visit-date',
              name: 'visit_date',
              value: expr('{{ $json.visit_date }}'),
              type: 'string',
            },
            {
              id: 'visit-barber',
              name: 'barber_name',
              value: expr('{{ $json.barber_name }}'),
              type: 'string',
            },
            {
              id: 'visit-style',
              name: 'haircut_style',
              value: expr('{{ $json.haircut_style }}'),
              type: 'string',
            },
            {
              id: 'visit-beard',
              name: 'beard_style',
              value: expr('{{ $json.beard_style }}'),
              type: 'string',
            },
            {
              id: 'visit-notes',
              name: 'notes',
              value: expr('{{ $json.notes }}'),
              type: 'string',
            },
            {
              id: 'visit-photo',
              name: 'photo_url',
              value: expr('{{ $json.photo_url }}'),
              type: 'string',
            },
            {
              id: 'visit-created',
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
        name: 'Insert Haircut Visit into Supabase',
        parameters: {
          method: 'POST',
          url: 'https://project-ref.supabase.co/rest/haircut_visits',
          headers: {
            'apikey': '{{ $env.SUPABASE_PUBLISHABLE_KEY }}',
            'Authorization': 'Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}',
            'Content-Type': 'application/json',
          },
          body: expr('{"customer_phone": "{{ $json.customer_phone }}", "visit_date": "{{ $json.visit_date }}", "barber_name": "{{ $json.barber_name }}", "haircut_style": "{{ $json.haircut_style }}", "beard_style": "{{ $json.beard_style }}", "notes": "{{ $json.notes }}", "photo_url": "{{ $json.photo_url }}", "created_at": "{{ $now.toISO() }}"}'),
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
        name: 'Notify Staff - Visit Logged',
        parameters: {
          chatId: '{{ $env.TELEGRAM_CHAT_ID }}',
          text: expr('✂️ Haircut logged for {{ $json.customer_phone }}: {{ $json.haircut_style }} on {{ $json.visit_date }} by {{ $json.barber_name }}'),
        },
        credentials: {
          telegramBotApi: newCredential('Telegram Bot'),
        },
        output: [{ id: 1, json: {} }],
      },
    })
  );

export default wf;