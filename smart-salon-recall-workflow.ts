import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const wf = workflow('smart-salon-recall', 'SmartSalon AI - Recall Automation')
  .add(
    trigger({
      type: 'n8n-nodes-base.manualTrigger',
      version: 1,
      config: { name: 'Check Recalls', position: [240, 300] },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.httpRequest',
      version: 4.3,
      config: {
        name: 'Fetch Customers Due for Recall',
        parameters: {
          method: 'POST',
          url: 'https://project-ref.supabase.co/rest/rpc/get_customers_due_for_recall',
          headers: {
            'apikey': '{{ $env.SUPABASE_PUBLISHABLE_KEY }}',
            'Authorization': 'Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}',
            'Content-Type': 'application/json',
          },
          body: expr('{"interval_days": 30, "status_filter": "sent"}'),
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
        name: 'Has Customers Due',
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
      type: 'n8n-nodes-base.telegram',
      version: 1.2,
      config: {
        name: 'Notify - Recalls Available',
        parameters: {
          chatId: '{{ $env.TELEGRAM_CHAT_ID }}',
          text: expr('📅 {{ $json.count }} customers are due for recall. Use the recall queue to send messages.'),
        },
        credentials: {
          telegramBotApi: newCredential('Telegram Bot'),
        },
        output: [{ id: 1, json: {} }],
      },
    })
  )
  .onFalse(
    node({
      type: 'n8n-nodes-base.set',
      version: 3.4,
      config: {
        name: 'No Recalls Due',
        parameters: {
          mode: 'manual',
          includeOtherFields: false,
          assignments: [
            {
              id: 'message',
              name: 'status_message',
              value: expr('0 customers due for recall this cycle'),
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
      type: 'n8n-nodes-base.manualTrigger',
      version: 1,
      config: { name: 'Send Recall Messages', position: [240, 500] },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.httpRequest',
      version: 4.3,
      config: {
        name: 'Send WhatsApp Recall Link',
        parameters: {
          method: 'GET',
          url: expr('https://wa.me/{{ $env.WHATSAPP_NUMBER }}?text={{ encodeURIComponent("Hi {{ $json.name }}, it\\'s been a while since your last visit to Denow! Your usual fade should be due for a refresh - want us to hold a slot this week?") }}'),
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
      type: 'n8n-nodes-base.httpRequest',
      version: 4.3,
      config: {
        name: 'Update Recall Log - Mark as Sent',
        parameters: {
          method: 'POST',
          url: 'https://project-ref.supabase.co/rest/recall_log',
          headers: {
            'apikey': '{{ $env.SUPABASE_PUBLISHABLE_KEY }}',
            'Authorization': 'Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}',
            'Content-Type': 'application/json',
          },
          body: expr('{"customer_id": "{{ $json.customer_id }}", "due_date": "{{ $json.due_date }}", "sent_date": "{{ $now.toISO() }}", "status": "sent"}'),
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
        name: 'Notify - Recall Sent',
        parameters: {
          chatId: '{{ $env.TELEGRAM_CHAT_ID }}',
          text: expr('📤 Recall sent to {{ $json.name }} ({{ $json.phone }})'),
        },
        credentials: {
          telegramBotApi: newCredential('Telegram Bot'),
        },
        output: [{ id: 1, json: {} }],
      },
    })
  );

export default wf;