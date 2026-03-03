<div align="center">

  <img src="./assets/logo.jpg" alt="Parsent Logo" width="150" style="border-radius: 20px; box-shadow: 0 0 20px rgba(153, 255, 102, 0.2);" />

  <h1>📊 Parsent</h1>
  
  <p>
    <b>A fluid, high-performance analytics dashboard that parses social data for real-time sentiment analysis.</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Status-In%20Development-99ff66?style=for-the-badge&logoColor=black" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-99ff66?style=for-the-badge&logoColor=black" alt="License" />
    <img src="https://img.shields.io/badge/PRs-Welcome-99ff66?style=for-the-badge&logoColor=black" alt="PRs Welcome" />
  </p>

  <p>
    <a href="#sparkles-features">Features</a> •
    <a href="#rocket-tech-stack">Tech Stack</a> •
    <a href="#wrench-installation">Installation</a> •
    <a href="#handshake-contributing">Contributing</a>
  </p>

</div>

---

<div align="center">
  
  ### 🚀 See it in Action
  <img src="https://via.placeholder.com/800x450.png?text=[Drop+Your+Animated+UI+GIF+Here]" alt="Parsent Animated Demo" width="100%" style="border-radius: 10px; border: 1px solid #333;" />

</div>

## :sparkles: The Experience

Parsent isn't just a data scraper; it’s built to make heavy data processing feel instantaneous. By pulling real-time threads from **Reddit** and **X (Twitter)**, the platform categorizes public sentiment into Positive, Negative, and Neutral visualizations. 

Instead of jarring page reloads, Parsent utilizes **skeleton morphing**, **staggered list animations**, and **fluid tab routing** to provide a seamless, native-app experience right in your browser.

## :art: Micro-Interactions Built-In

* **Morphing Skeletons:** Say goodbye to loading spinners. Data gracefully fades into place once the backend finishes parsing.
* **Staggered Feed Entrances:** Sentiment cards cascade into the viewport smoothly as you scroll.
* **Dynamic Chart Rendering:** Pie charts and trend lines animate from zero upon intersection, drawing the user's eye to the data that matters.

---

## :rocket: Tech Stack

We use modern tools to ensure the frontend is as beautiful as the backend is powerful.

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

### **Backend & Data**
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

---

## :wrench: Installation & Setup

Want to run Parsent locally? Follow these steps to get the data flowing.

```bash
# 1. Clone the repository
git clone [https://github.com/yourusername/parsent.git](https://github.com/yourusername/parsent.git)

# 2. Navigate into the directory
cd parsent

# 3. Install frontend and backend dependencies
npm install
pip install -r requirements.txt

# 4. Set up your environment variables
cp .env.example .env
# (Make sure to add your Reddit and X API keys!)

# 5. Spin up the dev server
npm run dev
