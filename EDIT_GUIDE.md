# How to Update and Build Your Website

This guide explains how to make changes and update your live website.

## 1. Where to Run Commands
You run the build command in a **Terminal** (also called Command Prompt or PowerShell).
- **If you are using VS Code**: Go to the top menu and select **Terminal > New Terminal**.
- **The Command**:
  ```powershell
  npm run build
  ```
- **Requirements**: You must have [Node.js](https://nodejs.org/) installed on your computer to run this command yourself.

> [!TIP]
> **Don't want to install Node.js?**
> You can simply ask me (your AI agent) to "Run the build command" whenever you want to update your site. I will do it for you in the background!

## 2. Making Minor Changes
If you want to edit text or colors yourself:

| Goal | Path to File |
| :--- | :--- |
| **Change Logo/Brand Name** | `src/components/Navbar.jsx` |
| **Change Homepage Headlines** | `src/components/Hero.jsx` |
| **Change Colors/Padding** | `src/index.css` |
| **Change n8n Webhook URLs** | Top of `src/components/CurrentAffairs.jsx` and `MockTest.jsx` |

## 3. The Update Workflow
1.  **Edit**: Open the file and change the text or code.
2.  **Save**: Save the file (`Ctrl + S`).
3.  **Build**: Run `npm run build` (or ask me to do it).
4.  **Upload**: Open your FTP tool and upload the new contents of the `dist` folder to your website's `htdocs` folder.

## 4. Automatic Updates (n8n)
Remember: You **DO NOT** need to run any commands or upload files to update your **MCQs or Current Affairs Notes**. Just update your Google Sheet, and the website will fetch the new data automatically!
