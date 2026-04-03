# Automation & Content API Guide

Your UPSC Portal is built to be **data-driven**. This means you don't need to touch the code to update Daily Notes or Quizzes. You can use **n8n** as your custom "Website API."

## Data Flow Overview
1. **Frontend**: The React site fetches data from `get-upsc-content` webhook.
2. **Backend (n8n)**: n8n pulls this data from your source (Google Sheets, Notion, or a Database).
3. **API Posting**: To "post" regularly via API, you should create a secondary n8n webhook that **accepts POST requests**.

## How to "Post" via API
(Existing instructions preserved...)

## Method 3: Direct Google Sheets Integration (Zero Delay)
This is the **fastest** and **easiest** way. Your website will read your Google Sheet directly, with no n8n workflow execution required for students to see updates.

### 1. Create your Google Sheet
Create a new Google Sheet with the following columns (Exact names):

| Column Name | Description |
| :--- | :--- |
| **Title** | The headline of the Note or Quiz. |
| **Category** | e.g., Polity, Economy, History. |
| **Date** | Format: `Feb 09, 2026`. |
| **Type** | Use `daily` for Current Affairs or `static` for permanent notes. |
| **Content** | (For Notes) The main summary or text. |
| **Question** | (For Quizzes) The MCQ question text. |
| **Option A** | (For Quizzes) Choice 1. |
| **Option B** | (For Quizzes) Choice 2. |
| **Option C** | (For Quizzes) Choice 3. |
| **Option D** | (For Quizzes) Choice 4. |
| **Correct Answer**| (For Quizzes) Use `A`, `B`, `C`, or `D`. |
| **Explanation** | (For Quizzes) Why the answer is correct. |

### 2. Publish to Web
1. Open your Google Sheet.
2. Go to **File > Share > Publish to web**.
3. Select **"Entire Document"** and change **"Web page"** to **"Comma-separated values (.csv)"**.
4. Click **Publish**.
5. **Copy the Link** that appears.

### 3. Connect to Website
1. Paste the link into the website code:
   - For Notes: `GSHEET_NOTES_CSV_URL` in [DailyNotes.jsx](file:///C:/Users/Shikha/.gemini/antigravity/scratch/upsc-prep-site/src/components/DailyNotes.jsx).
   - For Quizzes: `GSHEET_QUIZ_CSV_URL` in [DailyQuiz.jsx](file:///C:/Users/Shikha/.gemini/antigravity/scratch/upsc-prep-site/src/components/DailyQuiz.jsx).

### 4. Optional: Automate Sheet Updates
You can still use n8n! 
- Set n8n to **"Append Row"** to this Google Sheet every morning.
- The moment n8n adds a row, your website updates **instantly** for every student.
