# Deployment Guide for https://educateurself.great-site.net/

Since you are using a hosting provider like InfinityFree (great-site.net), follow these steps to launch your website:

## 1. Generate Production Files
I have already generated the production files for you in the `dist` folder:
`C:\Users\Shikha\.gemini\antigravity\scratch\upsc-prep-site\dist`

## 2. Access the Hosting Panel
1. Log in to your hosting account at [InfinityFree](https://infinityfree.net/) or your provider.
2. Go to the **Control Panel** (cPanel).
3. Open the **Online File Manager** or use an FTP client (like FileZilla).

## 3. Upload Files
1. Navigate to the `htdocs` folder (this is where public files go).
2. Upload **all the contents** of the `dist` folder into the `htdocs` folder.
3. Make sure `index.html` is directly inside `htdocs`.

## 4. Verify
Once the files are uploaded, your site will be live at:
[https://educateurself.great-site.net/](https://educateurself.great-site.net/)

---
> [!IMPORTANT]
> Only upload the contents of the `dist` folder. Do not upload the `node_modules` or `src` folders to the hosting server.
