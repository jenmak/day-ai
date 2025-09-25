# Environment Setup Guide

## Quick Setup

To set up your environment variables, run:

```bash
node setup-env.js
```

This interactive script will help you configure your API keys properly.

## Manual Setup

If you prefer to set up manually, edit the `.env` file with your actual API keys:

### Required API Keys

1. **OpenAI API Key**
   - Get it from: https://platform.openai.com/api-keys
   - Format: Must start with `sk-` and be exactly 51 characters long
   - Example: `sk-1234567890abcdef1234567890abcdef1234567890abcdef12`

2. **OpenCage API Key**
   - Get it from: https://opencagedata.com/api
   - Format: 32+ alphanumeric characters
   - Example: `76a5df4040a14be4828c820c270e4882`

### Environment Variables

```env
# Environment Configuration
NODE_ENV=development

# Server Configuration
PORT=3333
HOST=0.0.0.0

# API Keys
OPENAI_API_KEY=your-actual-openai-key-here
OPENCAGE_API_KEY=your-actual-opencage-key-here

# Frontend URLs (for CORS)
VITE_API_URL=http://localhost:3333/api
VITE_FRONTEND_URL=http://localhost:3000
```

## Testing

After setting up your environment variables, test the server:

```bash
npm run dev
```

You should see:

- ✅ OpenAI: Available (if key is valid)
- ✅ OpenCage: Available (if key is valid)

## Troubleshooting

### OpenAI API Key Issues

- Make sure the key starts with `sk-`
- Ensure it's exactly 51 characters long
- Verify the key is active on your OpenAI account

### OpenCage API Key Issues

- Ensure it's at least 32 characters long
- Remove any quotes around the key
- Verify the key is active on your OpenCage account

### Environment Not Loading

- Make sure the `.env` file is in the backend directory
- Check that there are no syntax errors in the `.env` file
- Restart the development server after making changes
