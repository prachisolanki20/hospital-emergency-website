# Hospital Emergency Management System — Web Demo

A browser-based version of the Java Swing DSA demonstration. It showcases patient registration, priority selection, a max-heap/priority queue, search, processing, sample data, and an operation log.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a browser. No installation or build command is required.

## Deploy on Vercel
1. Upload these four files (`index.html`, `style.css`, `app.js`, `README.md`) to a new GitHub repository, or add them to a dedicated folder/repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Select **Other** as the framework preset if prompted.
4. Leave **Build Command** blank and set **Output Directory** to `.` if Vercel asks for it.
5. Deploy. The site should open at the deployment URL because `index.html` is in the root.

## Notes
- This is a front-end educational demo. Data lives in the current browser session and is not shared between users or stored in a server database.
- Do not enter real patient information. This is not a production medical triage or record-management system.
- The Java Swing application remains a separate desktop version; this web version reimplements the visible features in HTML/CSS/JavaScript.
