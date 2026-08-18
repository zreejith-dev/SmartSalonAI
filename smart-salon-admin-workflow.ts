import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const wf = workflow('smart-salon-admin', 'SmartSalon AI - Admin Panel / Owner Dashboard')
  .add(
    trigger({
      type: 'n8n-nodes-base.manualTrigger',
      version: 1,
      config: { name: 'Admin Dashboard', position: [240, 300] },
    })
  )
  .to(
    node({
      type: 'n8n-nodes-base.httpRequest',
      version: 4.3,
      config: {
        name: 'Fetch Dashboard Stats',
        parameters: {
          method: 'POST',
          url: 'https://project-ref.supabase.co/rest/rpc/get_dashboard_stats',
          headers: {
            'apikey': '{{ $env.SUPABASE_PUBLISHABLE_KEY }}',
            'Authorization': 'Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}',
            'Content-Type': 'application/json',
          },
          body: expr('{}'),
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
      type: 'n8n-nodes-base.set',
      version: 3.4,
      config: {
        name: 'Set Dashboard Values',
        parameters: {
          mode: 'manual',
          includeOtherFields: false,
          assignments: [
            {
              id: 'total-customers',
              name: 'total_customers',
              value: expr('{{ $json.total_customers ?? 0 }}'),
              type: 'number',
            },
            {
              id: 'visits-this-week',
              name: 'visits_this_week',
              value: expr('{{ $json.visits_this_week ?? 0 }}'),
              type: 'number',
            },
            {
              id: 'visits-this-month',
              name: 'visits_this_month',
              value: expr('{{ $json.visits_this_month ?? 0 }}'),
              type: 'number',
            },
            {
              id: 'customers-due-today',
              name: 'customers_due_today',
              value: expr('{{ $json.customers_due_today ?? 0 }}'),
              type: 'number',
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
        name: 'Fetch Recent Enrollments',
        parameters: {
          method: 'POST',
          url: 'https://project-ref.supabase.co/rest/rpc/get_recent_enrollments',
          headers: {
            'apikey': '{{ $env.SUPABASE_PUBLISHABLE_KEY }}',
            'Authorization': 'Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}',
            'Content-Type': 'application/json',
          },
          body: expr('{"limit": 5}'),
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
          body: expr('{"interval_days": 30, "status_filter": "due"}'),
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
      type: 'n8n-nodes-base.set',
      version: 3.4,
      config: {
        name: 'Set Recall Queue',
        parameters: {
          mode: 'manual',
          includeOtherFields: false,
          assignments: [
            {
              id: 'recall-list',
              name: 'recall_queue',
              value: expr('{{ $json }}'),
              type: 'object',
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
        name: 'Fetch Shop Settings',
        parameters: {
          method: 'POST',
          url: 'https://project-ref.supabase.co/rest/rpc/get_shop_settings',
          headers: {
            'apikey': '{{ $env.SUPABASE_PUBLISHABLE_KEY }}',
            'Authorization': 'Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}',
            'Content-Type': 'application/json',
          },
          body: expr('{}'),
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
      type: 'n8n-nodes-base.set',
      version: 3.4,
      config: {
        name: 'Set Shop Settings',
        parameters: {
          mode: 'manual',
          includeOtherFields: false,
          assignments: [
            {
              id: 'shop-name',
              name: 'shop_name',
              value: expr('{{ $json.shop_name }}'),
              type: 'string',
            },
            {
              id: 'shop-address',
              name: 'shop_address',
              value: expr('{{ $json.shop_address }}'),
              type: 'string',
            },
            {
              id: 'recall-interval',
              name: 'recall_interval_days_default',
              value: expr('{{ $json.recall_interval_days_default }}'),
              type: 'number',
            },
          ],
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
        name: 'Notify - Dashboard Loaded',
        parameters: {
          chatId: '{{ $env.TELEGRAM_CHAT_ID }}',
          text: expr('📊 Admin dashboard loaded: {{ $json.total_customers }} customers, {{ $json.visits_this_week }} visits this week'),
        },
        credentials: {
          telegramBotApi: newCredential('Telegram Bot'),
        },
        output: [{ id: 1, json: {} }],
      },
    })
  );

export default wf;