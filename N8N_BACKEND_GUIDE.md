# n8n Backend Integration Guide

Use this guide to connect your n8n workflow directly to the UPSC website as a REST API.

## 1. n8n Workflow Setup

You need a **Webhook Node** at the end (or as a listener) of your workflow:

### Webhook Node Configuration:
- **HTTP Method**: `GET` (or `POST` if you prefer).
- **Path**: e.g., `get-upsc-content`.
- **Response Mode**: `On Received` (or `Last Node` if you want to fetch live from sheets).
- **Response Data**: `All Item Data`.
### IMPORTANT: Test URL vs. Production URL
In n8n, there are two types of URLs:
1.  **Test URL** (`.../webhook-test/...`): This ONLY works when you have the n8n editor open and have clicked "Listen for Test Event".
2.  **Production URL** (`.../webhook/...`): This is the one you MUST use for your live website.
    - To use the Production URL, you must **SAVE** your workflow and **ACTIVATE** it (the toggle switch in the top right).

**-> YOU MUST USE THE PRODUCTION URL IN YOUR WEBSITE CODE.**
If you see "Check CORS settings," it means your n8n server is blocking the website. To fix this permanently:

1.  **Use the "Respond to Webhook" Node**: Instead of letting the Webhook node respond automatically, add a "Respond to Webhook" node at the very end of your workflow.
2.  **Add Headers**:
    - In the "Respond to Webhook" node, click **Add Option** -> **Response Headers**.
    - Click **Add Header** and use:
        - **Name**: `Access-Control-Allow-Origin`
        - **Value**: `*` (Use `*` first to make sure it works, then you can change it back to your domain later)
    - Add another header:
        - **Name**: `Access-Control-Allow-Methods`
        - **Value**: `GET, POST, OPTIONS`
3.  **Webhook Node Settings** (CRITICAL):
    - Open your **Webhook node**.
    - Look for the **Respond** dropdown (it might currently say `When Last Node Finishes`).
    - Change it to: **Using Respond to Webhook Node**.
    - *If you don't do this, n8n ignores your custom CORS headers!*

## 2. JSON Response Structure (Based on your Google Sheet)

Your n8n workflow should filter your Google Sheet rows where **`Approval Status`** is **`complete`**. Then, it should return a JSON object where the `mcqs` array matches this mapping:

| Sheet Column | JSON Field (MockTest.jsx) |
| :--- | :--- |
| `Question` | `q` |
| `Option A` | `options[0]` |
| `Option B` | `options[1]` |
| `Option C` | `options[2]` |
| `Option D` | `options[3]` |
| `Correct Answer` | `correct` (Use `0` for A, `1` for B, etc.) |
| `Explanation` | `explanation` (New!) |

### Example n8n Response:
```json
{
  "mcqs": [
    {
      "q": "Who was the first President of India?",
      "options": ["Rajendra Prasad", "Radhakrishnan", "Nehru", "Ambedkar"],
      "correct": 0,
      "explanation": "Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962."
    }
  ]
}
```

## 3. Link the Website
... (rest of the steps)

1. Copy your **Test/Production Webhook URL** from n8n.
2. Open `src/components/CurrentAffairs.jsx` and `src/components/MockTest.jsx`.
3. Paste the URL into the `N8N_BACKEND_URL` variable at the top of the files.
4. Run `npm run build` and re-upload the `dist` folder.

Now, whenever anyone opens your site, it will ask n8n for the latest approved MCQs and News!
