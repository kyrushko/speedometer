# 🚗 Speedometer App

## 📌 Overview  
This is a **client-side Speedometer app** developed for **CS317: Mobile App Development** at the **University of Strathclyde**.  
The app displays real-time speed data using the **Navigator API** and integrates **Mark Dunlop's Speed Limit API** for speed limit guidance.  

✅ **Single Page Application (SPA)** – No server-side code.  
✅ **Mobile-Optimized** – Designed for use on smartphones.  
✅ **Deployed on devweb2024** – Secured within a randomized directory.  

---

## ✨ Features  

### 📡 Live Speed Display  
- Uses **GPS data** to show real-time speed in **mph**.  
- Automatically converts from **m/s to mph**.  

### 🎨 Responsive UI  
- **Techy monospaced font** for speed display.  
- Adapts to **portrait & landscape modes**.  
- **Large, high-contrast text** for readability.  

### 📲 Progressive Web App (PWA)  
- Can be **installed on a mobile home screen** for fullscreen usage.  

### 🚦 Speed Limit Guidance  
- Fetches **local speed limits** from **Mark Dunlop’s API**.  
- Displays **speed limit sign** on the UI.  
- **Dynamic speed color coding**:  
  - ✅ **White** – Safe speed  
  - ⚠️ **Orange** – Near speed limit (≤5 mph below)  
  - 🚨 **Red** – Over speed limit  

### 🏙️ Street Name Display  
- Shows the **current road name** (if available).  

### ⚙️ Customizable Settings  
- **Change Speed Units**: "Always MPH", "Always KM/H", "Local Units".  
- **Personalize Display**: Set colors, background images.  
- **Choose Speed Limit Display Position**: Bottom-left or bottom-right.  
- **Auto-toggle Settings**:  
  - **Portrait Mode** – Settings Panel.  
  - **Landscape Mode** – Full Speed Display.  

---

## 🛠️ Tech Stack  

| Technology        | Purpose |
|------------------|---------|
| **HTML, CSS, JavaScript** | Core structure & styling |
| **Navigator API** | GPS Speed Retrieval |
| **Mark Dunlop’s Speed Limit API** | Speed Limit Data |
| **Service Workers** | PWA Functionality |

---

## 🚀 Installation & Deployment  

### 🔹 Clone the Repository  
```sh
git clone https://gitlab.com/madone-<username>/speedometer-app.git
cd speedometer-app
