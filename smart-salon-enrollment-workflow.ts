import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const wf = workflow('smart-salon-enrollment', 'SmartSalon AI - Customer Enrollment')
  .add(
    trigger({
      type: 'n8n-nodes-base.manualTrigger',
      version: 1,
      config: { name: 'Enroll Customer', position: [240, 300] },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.set',
      version: 3.4,
      config: {
        name: 'Enroll Customer',
        parameters: {
          mode: 'manual',
          includeOtherFields: false,
          assignments: [
            {
              id: 'customer-name',
              name: 'name',
              value: expr('{{ $json.name }}'),
              type: 'string',
            },
            {
              id: 'customer-phone',
              name: 'phone',
              value: expr('{{ $json.phone }}'),
              type: 'string',
            },
            {
              id: 'customer-gender',
              name: 'gender',
              value: expr('{{ $json.gender }}'),
              type: 'string',
            },
            {
              id: 'customer-dob',
              name: 'dob',
              value: expr('{{ $json.dob }}'),
              type: 'string',
            },
            {
              id: 'customer-notes',
              name: 'notes',
              value: expr('{{ $json.notes }}'),
              type: 'string',
            },
            {
              id: 'customer-consent',
              name: 'consent_whatsapp',
              value: expr('{{ $json.consent_whatsapp ? 1 : 0 }}'),
              type: 'boolean',
            },
            {
              id: 'created-at',
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
        name: 'Upsert Customer to Supabase',
        parameters: {
          method: 'POST',
          url: 'https://project-ref.supabase.co/rest/customers',
          headers: {
            'apikey': '{{ $env.SUPABASE_PUBLISHABLE_KEY }}',
            'Authorization': 'Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}',
            'Content-Type': 'application/json',
          },
          body: expr('{"name": "{{ $json.name }}", "phone": "{{ $json.phone }}", "gender": "{{ $json.gender }}", "dob": "{{ $json.dob }}", "notes": "{{ $json.notes }}", "consent_whatsapp": {{ $json.consent_whatsapp }}, "created_at": "{{ $now.toISO() }}"}'),
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
      type: 'n8n-nodes-base.if',
      version: 2.2,
      config: {
        name: 'Check Duplicate Phone',
        parameters: {
          conditions: {
            options: { caseSensitive: true, typeValidation: 'loose' },
            conditions: [
              {
                leftValue: expr('{{ $json.count }}'),
                operator: { type: 'number', operation: 'greaterThan' },
                rightValue: 0,
              },
            ],
            combinator: 'and',
          },
        },
      },
    })
  )
  .onTrue(
    node({
      type: 'n8n-nodes-base.set',
      version: 3.4,
      config: {
        name: 'Duplicate Customer Flagged',
        parameters: {
          mode: 'manual',
          includeOtherFields: false,
          assignments: [
            {
              id: 'flag',
              name: 'duplicate_flag',
              value: expr('1'),
              type: 'number',
            },
          ],
        },
        output: [{ id: 1, json: {} }],
      },
    })
  )
  .onFalse(
    node({
      type: 'n8n-nodes-base.telegram',
      version: 1.2,
      config: {
        name: 'Notify Staff - Customer Enrolled',
        parameters: {
          chatId: '{{ $env.TELEGRAM_CHAT_ID }}',
          text: expr('🎉 New customer enrolled: {{ $json.name }} ({{ $json.phone }})'),
        },
        credentials: {
          telegramBotApi: newCredential('Telegram Bot'),
        },
        output: [{ id: 1, json: {} }],
      },
    })
  );

export default wf;