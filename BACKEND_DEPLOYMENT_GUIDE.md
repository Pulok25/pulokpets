# Backend Deployment Guide

## Problem
Your frontend is deployed on Netlify, but your backend is only running locally. The API endpoints (`/api/*`) don't exist on Netlify's servers, causing the errors you're seeing.

## Solution Overview
You need to:
1. Deploy your backend separately to a platform that supports Node.js
2. Set the `VITE_API_URL` environment variable in Netlify to point to your deployed backend

## Option 1: Deploy to Railway (Recommended - Free tier available)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will detect the Node.js server automatically
5. Under "Variables", add your environment variables
6. Click "Deploy"
7. Once deployed, you'll get a URL like `https://your-app.railway.app`

### Set Environment Variable in Netlify:
1. Go to Netlify Dashboard → Your Site → Site Settings → Build & Deploy → Environment
2. Add new variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-app.railway.app` (from Railway)
3. Trigger a new deploy

## Option 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server/server.js`
   - Environment: Node
5. Under "Environment", add `PORT=4000`
6. Deploy
7. Copy your deployed URL

### Set Environment Variable in Netlify:
Same as Option 1, but use your Render URL

## Option 3: Deploy to Heroku

1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Run: `git push heroku main`
4. Get your app URL: `https://your-app-name.herokuapp.com`

### Set Environment Variable in Netlify:
Same as Option 1, but use your Heroku URL

## Option 4: Deploy to Fly.io

1. Go to [fly.io](https://fly.io) and sign up
2. Install Fly CLI
3. Run: `fly launch` in your project root
4. Follow the prompts
5. Run: `fly deploy`

### Set Environment Variable in Netlify:
Use your Fly.io URL

## Updating Netlify Environment Variable

Once your backend is deployed:

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to Site Settings → Build & Deploy → Environment Variables
4. Click "Edit variables"
5. Add or update:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com` (the URL from your backend hosting)
6. **IMPORTANT**: Trigger a redeploy after setting the variable!
   - Go to Deploys → Trigger deploy → Deploy site

## Testing

After deploying:
1. Check browser console (F12) for any remaining JSON parse errors
2. The app should now be able to load inventory and chat threads
3. Admin functions (add/delete categories, etc.) should work

## Environment Files Reference

- `.env.local` - Local development (git-ignored, has `http://localhost:4000`)
- `.env.example` - Template for other developers
- **Netlify Dashboard** - Where you set production `VITE_API_URL`

## Troubleshooting

### Still seeing HTML errors in console?
- Double-check your `VITE_API_URL` in Netlify matches your backend URL
- Verify the backend is actually running and accessible
- Check browser console to see what URL is being called
- Make sure CORS is enabled on your backend (it should be with the current server.js)

### Backend URL not working?
- Test the URL directly: `https://your-backend-url.com/api/inventory`
- Should return JSON, not HTML
- If it returns HTML, your backend isn't running or the URL is wrong

### Still getting 405 errors?
- Make sure you're using the correct HTTP methods (GET for fetch without method)
- Check that your backend server.js has the endpoints defined

## Next Steps

1. Choose a deployment platform (Railway is easiest)
2. Deploy your backend
3. Set `VITE_API_URL` in Netlify
4. Redeploy your frontend
5. Test in production
