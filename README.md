# 🌱 Climate Action Pledge

A modern web application that allows users to take a pledge for climate action, track key performance indicators (KPIs), and showcase pledges on a public Pledge Wall. Built with **HTML, Tailwind CSS, and Supabase** for backend storage.

---

## Table of Contents

- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Supabase Setup](#supabase-setup)  
- [Technology Stack](#technology-stack)  
- [Folder Structure](#folder-structure)  
- [Contributing](#contributing)    

---

## Features

- Responsive landing page with **Hero Section** and smooth scroll to pledge form.
- **KPI Dashboard** showing:
  - Total pledges achieved
  - Number of students and working professionals
  - Target goal
- Interactive **Pledge Form** with:
  - Name, email, mobile, state, profile, and commitments
  - Validation for required fields
- **Pledge Wall** displaying all pledges with commitment hearts
- Downloadable **Certificate** after pledge submission
- **Supabase integration** for storing and retrieving pledges
- Modern, clean **Tailwind CSS design** with green-themed UI

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/climate-action-pledge.git

2. Navigate into the project folder:

cd climate-action-pledge


3. Open index.html in a browser.

## Usage

1. Click **Take the Pledge** to scroll to the pledge form.
2. Fill in the form with required details.
3. Select commitments and submit.
4. Your pledge will appear on the **Pledge Wall**.
5. Download your certificate using the download button.


## **Supabase Setup**

1. **Create a free account at Supabase.**

2. **Create a new project.**

3. **Create a table named `pledges` with the following columns:**

   - `id` (integer, auto-increment, primary key)  
   - `name` (text)  
   - `email` (text)  
   - `mobile` (text)  
   - `state` (text)  
   - `profile` (text)  
   - `commitments` (text)  
   - `commitCount` (integer)  
   - `date` (timestamp)  

4. **Update `app.js` with your Supabase URL and public API key.**

5. **Ensure RLS (Row Level Security) is enabled and create a policy to allow public inserts/selects.**

## **Technology Stack**

Frontend: HTML, Tailwind CSS, JavaScript
Backend / Database: Supabase
Libraries: html2canvas  for generating certificate PNG


## **Folder Structure**

climate-action-pledge/
│
├── index.html          # Main HTML page
├── styles.css          # Tailwind CSS + custom styles
├── app.js              # JavaScript logic
├── README.md           # Project documentation

## **Contributing**

Contributions are welcome! You can:
Improve the design
Add more pledge categories
Optimize performance
Add user authentication for verified pledges

*** Please create a pull request with a clear description of changes***


## **Author**

Naveen Kumar M – navexe25

Built with ❤️ for a greener world.
