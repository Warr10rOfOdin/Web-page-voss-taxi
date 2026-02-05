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

### 1. **Destinations (Destinasjonar / Destinations)** ⭐ NEW!
Edit all content for the 9 destination pages:
- **Stalheimskleiva** - Norway's steepest road
- **Tvindefossen** - Norway's most visited waterfall
- **Skjervsfossen** - Twin waterfall
- **Flåm** - Fjord village and Flåm Railway
- **Gudvangen** - UNESCO fjord and Viking village
- **Nærøyfjorden** - UNESCO World Heritage fjord
- **Bergen** - Capital of Western Norway
- **Bordalsgjelet** - Spectacular gorge
- **Mølstertunet** - Historic farm

For each destination you can edit:
- **Title and subtitle** (both Norwegian and English)
- **Hero image** - Main photo at the top
- **Description** - Introduction text
- **History section** - Full content with markdown formatting
- **Highlights** - Bullet points list
- **Practical information** - Bullet points list
- **Photo gallery** - Up to 4 images
- **Button text** - Book tour and back buttons
- **Price** (optional)

**You can also create new destinations!**

### 2. **Norwegian Translations (Norske Oversettingar - Globalt)**
Global site-wide Norwegian text:
- Navigation menu labels
- Homepage hero section text
- Service highlights (24/7, Airport, Sightseeing, Wheelchair, Maxi)
- Calculator section
- All Norwegian text throughout the site

### 3. **English Translations (Global)**
Global site-wide English text:
- Navigation menu labels
- Homepage hero section text
- Service highlights (24/7, Airport, Sightseeing, Wheelchair, Maxi)
- Calculator section
- All English text throughout the site

### 4. **Images (Bilder / Images)**
- Upload new images
- Manage existing images
- Images are stored in `/public/images/`
- Used in destinations, hero sections, galleries, etc.

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
