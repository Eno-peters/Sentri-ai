SentriAI – AI-Powered Early Student Dropout Prediction System

SentriAI is a lightweight, AI-driven early-warning simulation tool designed to help schools identify students who are at risk of dropping out. Using synthetic data, simple prediction logic, and a clean admin-facing interface, the system demonstrates how predictive analytics can support early intervention and improve student retention.

This MVP was built using a no-code/low-code stack — **Lovable**, **Glide/Airtable AI**, **Mockaroo/ChatGPT synthetic data**, and optional **Figma UI enhancements**. It includes a functional prototype, predictive simulation, structured dashboards, and polished design assets suitable for demos or pitch presentations.

## 📌 Table of Contents

* Overview
* Features
* How It Works
* Screens & Modules
* Tech Stack
* Dataset Structure
* Installation & Setup
* Project Architecture
* Future Enhancements
* License

## 🔍 **Overview**

Schools often lose students due to low engagement, poor attendance, academic decline, or behavioral challenges. Many institutions lack simple, affordable tools for spotting early warning signs before dropout becomes unavoidable.

SentriAI addresses this by:

* Simulating AI-powered predictions
* Visualizing student risk levels
* Highlighting contributing factors
* Suggesting actionable interventions
* Centralizing data in a unified admin dashboard

This MVP demonstrates the concept of an Early Warning System (EWS) using **synthetic data only**.

##  Features

### 1. AI-Generated Predictions

* Risk levels: **Low**, **Moderate**, **High**
* Simple explanations showing why a student is flagged

### 2. Admin Dashboard

* Total student count
* Risk distribution chart
* High-risk alerts
* Quick overview of vulnerable students

### 3. Student Directory**

* Search & filter
* Risk badges with color coding
* Key metrics: attendance %, GPA, behavior score, warnings

### 4. Detailed Student Profiles**

* GPA history
* Attendance trend
* Behavior score timeline
* Risk explanation
  *“Risk increased due to 20% drop in attendance and GPA decline.”*

### 5. Alerts Center**

* Sudden performance drops
* Behavior spikes
* Threshold-based alerts

### 6. Intervention Suggestions**

* Personalized support steps
* Parent engagement strategies
* Academic intervention guidance
* Follow-up reminders


## ⚙️ How It Works

### 1. Generate Synthetic Dataset**

Using Mockaroo or ChatGPT with fields like:

* Attendance %
* GPA
* Behavior score
* Parent engagement

### 2. Apply AI Prediction Logic**

Airtable AI or Glide AI reads the dataset and outputs:

* Risk level
* Explanation
* Contributing factors

### 3. Build Prototype in Lovable**

Lovable handles:

* UI generation
* Routing
* Data display
* Simulation logic

### 4. (Optional) Figma Polish

Enhanced spacing, typography, and presentation visuals.


## 📁 Screens & Modules

### Landing Page

* Overview of SentriAI
* CTA: “View Dashboard”

### Admin Dashboard

* Risk analytics
* Alerts
* High-risk overview

### Student List

* Sort, search, filter
* Risk indicators
* Quick metrics

### Student Profile

* Attendance, GPA, behavior history
* AI-generated risk score and explanation

### Alerts Center

* Threshold alerts
* Behaviour/academic anomalies

### Intervention Center

* Recommendations
* Next steps
* Follow-up actions



## 🧰 **Tech Stack**

| Layer                | Tool                   |
| -------------------- | ---------------------- |
| Frontend / Prototype | Lovable                |
| AI Prediction Logic  | Airtable AI / Glide AI |
| Data Generation      | ChatGPT / Mockaroo     |
| UI & Visual Polish   | Figma                  |
| Data Formats         | CSV, JSON              |



## 📊 Dataset Structure

Fields include:

* `student_id`
* `name`
* `attendance_percentage`
* `gpa`
* `behavior_score`
* `warning_count`
* `parent_engagement_level`
* `attendance_history[]`
* `gpa_history[]`
* `behavior_trend[]`
* `ai_risk_level`
* `risk_explanation`

---

## 🛠 Installation & Setup

### 1. Clone this repository

bash
git clone https://github.com/YOUR-USERNAME/sentriAI.git
cd sentriAI
```

### 2. Synthetic Dataset**

Use the included dataset or generate a new one.

### 3. Prediction Logic**

Upload data into Airtable AI or Glide AI → configure AI fields.

### 4. Build Prototype (Lovable)**

* Import dataset
* Connect data
* Map screens
* Publish

### 5. Optional Figma Polish**

Import screens → refine typography, layout, spacing, visuals.


## 🏗 Project Architecture


sentriAI/
│
├── dataset/
│   └── synthetic_students.csv
│
├── app/
│   ├── dashboard/
│   ├── students/
│   ├── profiles/
│   └── alerts/
│
├── designs/
│   └── figma-polish/
│
└── README.md
```



## 🚀 **Future Enhancements**

* Real ML model integration
* Real-time data ingestion
* Student & parent portals
* SMS/email alerts
* Advanced forecasting
* Intervention workflow tracking



## 📄 License

This project is for educational, prototyping, and demonstration purposes only.
All data used is synthetic.



