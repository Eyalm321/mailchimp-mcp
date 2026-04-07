# mailchimp-mcp

MCP server for the Mailchimp Marketing API v3. Provides 280+ tools covering campaigns, lists, automations, e-commerce, templates, reports, and more.

## Installation

```bash
npx mailchimp-mcp
```

Or install globally:

```bash
npm install -g mailchimp-mcp
```

## Configuration

### Environment Variable

Set your Mailchimp API key:

```bash
export MAILCHIMP_API_KEY=your-api-key-us1
```

The datacenter (e.g., `us1`) is automatically extracted from the API key suffix.

### Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mailchimp": {
      "command": "npx",
      "args": ["mailchimp-mcp"],
      "env": {
        "MAILCHIMP_API_KEY": "your-api-key-us1"
      }
    }
  }
}
```

## Available Tools

### API Root & Connectivity (2 tools)
- `mailchimp_get_root` - Get links to all API resources
- `mailchimp_ping` - Test API connectivity

### Account Exports (3 tools)
- List, create, and get account exports

### Activity Feed (1 tool)
- Get latest chimp chatter activity

### Authorized Apps (2 tools)
- List and get authorized app details

### Automations (18 tools)
- Full CRUD for automations, workflow emails, email queues, and removed subscribers
- Actions: archive, pause, start automation emails

### Batch Operations (4 tools)
- Create, list, get, and delete batch operations

### Batch Webhooks (5 tools)
- Full CRUD for batch webhooks

### Campaign Folders (5 tools)
- Full CRUD for campaign folders

### Campaigns (22 tools)
- Full CRUD for campaigns
- Actions: send, schedule, unschedule, pause, resume, replicate, cancel, test
- Campaign content and feedback management
- Send checklist

### Connected Sites (5 tools)
- List, create, delete, get connected sites
- Verify script installation

### Conversations (4 tools)
- List conversations and messages

### Customer Journeys (1 tool)
- Trigger customer journey steps

### E-Commerce (60 tools)
- **Stores**: Full CRUD
- **Carts & Cart Lines**: Full CRUD
- **Customers**: Full CRUD + upsert
- **Orders & Order Lines**: Full CRUD + upsert
- **Products, Images & Variants**: Full CRUD + upsert
- **Promo Rules & Codes**: Full CRUD

### Facebook Ads (2 tools)
- List and get Facebook ad details

### File Manager (11 tools)
- Files: upload, list, get, update, delete
- Folders: create, list, get, update, delete
- List files in folder

### Landing Pages (8 tools)
- Full CRUD for landing pages
- Publish/unpublish actions
- Get page content

### Lists / Audiences (69 tools)
- **Lists**: Full CRUD + batch subscribe/unsubscribe
- **Members**: Full CRUD + upsert + permanent delete
- **Member Activity, Events, Goals, Notes, Tags**
- **Segments**: Full CRUD + batch add/remove members
- **Interest Categories & Interests**: Full CRUD
- **Merge Fields**: Full CRUD
- **Growth History, Locations, Clients**
- **Signup Forms, Surveys, Webhooks, Tag Search**

### Reports (22 tools)
- Campaign reports with drill-down into abuse reports, click details, domain performance, email activity, open details, sent-to, unsubscribed members, and more

### Reporting (12 tools)
- Facebook ads reports with ecommerce breakdown
- Landing page reports
- Survey reports with questions, answers, and responses

### Search (2 tools)
- Search campaigns and members

### Template Folders (5 tools)
- Full CRUD for template folders

### Templates (6 tools)
- Full CRUD for templates
- Get default content

### Verified Domains (5 tools)
- List, create, delete, get domains
- Verify domain ownership

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Development mode
npm run dev
```

## License

MIT
