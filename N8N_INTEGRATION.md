# n8n & Google Sheets Integration Guide

This guide explains how to connect your automated MCQ workflow to your UPSC website.

## 1. Google Sheets Setup

Your Google Sheet should have the following column headers (case-sensitive):

### For MCQs (Sheet Name: MCQs)
- `Question`
- `Option1`
- `Option2`
- `Option3`
- `Option4`
- `CorrectIndex` (0 for Option1, 1 for Option2, etc.)

### For Daily Notes (Sheet Name: CA_Notes)
- `title`
- `category`
- `summary`
- `date`

## 2. Publish as CSV

1. In your Google Sheet, go to **File > Share > Publish to web**.
2. Select your specific sheet (e.g., `MCQs`).
3. Change "Web page" to **Comma-separated values (.csv)**.
4. Click **Publish** and copy the generated link.
5. Repeat for the `CA_Notes` sheet.

## 3. Update the Website Code

Open the following files and paste your CSV links into the empty quotes:

- `src/components/CurrentAffairs.jsx`: Update `NOTES_CSV_URL`
- `src/components/MockTest.jsx`: Update `MCQ_CSV_URL`

## 4. Deploy

Re-run `npm run build` and upload the new `dist` folder to your host.

Now, your n8n workflow updates the Google Sheet, and the website reflects those changes instantly!
