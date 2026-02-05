# Decap CMS Setup Guide for Voss Taxi

This guide explains how to use the Decap CMS admin panel to edit your website content without coding.

## Accessing the Admin Panel

Once deployed, visit: **`https://your-website.com/admin`**

You'll be prompted to log in with your GitHub account.

## Setting Up Authentication (Required for First Use)

### If using Netlify:

1. Go to **Netlify Dashboard** → Your site → **Site Settings**
2. Click **Access control** → **OAuth**
3. Click **Install provider** → Select **GitHub**
4. Netlify will automatically configure GitHub OAuth for you

### If using Vercel:

You need to set up a GitHub OAuth App:

1. **Create GitHub OAuth App:**
   - Go to https://github.com/settings/developers
   - Click **New OAuth App**
   - Fill in:
     - **Application name**: `Voss Taxi CMS`
     - **Homepage URL**: `https://your-vercel-site.vercel.app`
     - **Authorization callback URL**: `https://your-vercel-site.vercel.app/api/auth/callback`
   - Click **Register application**
   - Copy the **Client ID** and generate a **Client Secret**

2. **Add Environment Variables to Vercel:**
   - Go to Vercel Dashboard → Your project → **Settings** → **Environment Variables**
   - Add these variables:
     ```
     OAUTH_GITHUB_CLIENT_ID=your_client_id
     OAUTH_GITHUB_CLIENT_SECRET=your_client_secret
     ```
   - Redeploy your site

3. **Create OAuth API Route:**
   - Already done in your codebase (see `/pages/api/auth` folder)

## Alternative: Local Development Mode

For testing locally without OAuth setup:

1. Uncomment this line in `/public/admin/config.yml`:
   ```yaml
   local_backend: true
   ```

2. Run the local proxy:
   ```bash
   npx decap-server
   ```

3. Access the admin at `http://localhost:3000/admin`

## What You Can Edit

### 1. **Norwegian Translations (Norske Oversettingar)**
- Navigation menu labels
- Homepage hero section text
- Service highlights
- Calculator section
- All Norwegian text throughout the site

### 2. **English Translations**
- Navigation menu labels
- Homepage hero section text
- Service highlights
- Calculator section
- All English text throughout the site

### 3. **Images (Bilder / Images)**
- Upload new images
- Manage existing images
- Images are stored in `/public/images/`

## How to Edit Content

1. **Log in** to `/admin` with your GitHub account
2. **Select a collection** from the left sidebar (e.g., "Norske Oversettingar")
3. **Click on the item** you want to edit (e.g., "Norsk Innhald")
4. **Make your changes** in the editor
5. **Click "Save"** - this creates a draft
6. **Click "Publish"** - this commits changes to GitHub and deploys automatically

## Editorial Workflow

The CMS uses an **editorial workflow** with three stages:

- **Drafts**: Changes you're working on
- **In Review**: Changes ready for review
- **Ready**: Changes ready to publish

This prevents accidental changes from going live immediately.

## Tips

- **Always save your work** before closing the admin panel
- **Preview your changes** before publishing
- **Test on staging** if you have a staging environment
- **Images**: Upload images in JPG format, preferably under 2MB for faster loading

## Troubleshooting

### "Unable to access authentication endpoint"
- Make sure OAuth is properly configured (see setup instructions above)
- Check that your GitHub OAuth app URLs match your deployed site

### "Error loading entries"
- Check your internet connection
- Make sure you're logged in to GitHub
- Verify the repository permissions

### Changes not appearing on site
- Wait 2-3 minutes for Vercel/Netlify to rebuild
- Check the deploy logs for errors
- Clear your browser cache

## For Developers

The CMS configuration is in `/public/admin/config.yml`. To add new editable sections:

1. Edit `config.yml` to add new collections or fields
2. Ensure the file paths match your actual content files
3. Commit and push changes
4. The admin panel will automatically reflect the new configuration

## Support

For issues with:
- **Decap CMS**: https://decapcms.org/docs/
- **Your website code**: Contact your developer or open a GitHub issue
- **Deployment**: Check Vercel/Netlify documentation

---

**Important**: Only users with GitHub access to the `Warr10rOfOdin/Web-page-voss-taxi` repository can edit content through the CMS.
