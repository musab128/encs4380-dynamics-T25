ENCS4380 – Dynamic Characteristics & PID Control Interactive Toolkit
Project Description
This project is an interactive website that helps students understand the dynamic characteristics of sensors using sliders and graphs. Homework 2 extends it with PID control pages, so Homework 1 and Homework 2 are integrated into one static GitHub Pages website.


Team Members
- Member 1: Aws Abdallah 1230619 (Modules 1, 2, P1, P2, P3)
- Member 2: Musab Farhat 1230093 (Modules 1, 2, P1, P2, P3)
- Member 3: Mohammad Abdallah 1230096 (Modules 3, 4, P4, My System)
- Member 4: Ahmad Bazzar 1230575 (Modules 3, 4, P4, My System)

## Modules
- Module 1 – First-Order Time Response: Step/ramp inputs, K and τ sliders, 63.2% at τ, approximately 95% at 3τ, steady-state ramp error, logarithmic error fraction, prediction question, validation.
- Module 2 – First-Order Frequency Response: Input/output sinusoidal steady state, amplitude ratio and phase lag, magnitude and phase Bode plots, cutoff at ω = 1/τ, dynamic-error calculator, prediction question, validation.
- Module 3 – Second-Order Response: Mass-spring-damper controls m, b, k, three damping regimes, rise/peak/settling times, overshoot, s-plane poles, live A/B matrices and eigenvalues, phase-plane trajectory, prediction question, validation.
- Module 4 – Guess the Sensor: Students observe a sensor's noisy response to an unknown input and estimate its dynamic parameters. They enter their guesses, check their answers, receive a score, and compare their predicted response with the actual response using a graph.
- P1 – PID Playground: PID control of first/second-order plants with saturated control and response metrics, plus built-in numeric validation checks.
- P2 – Feedback Control with a Slow Sensor: Feedback control when the sensor itself has slow dynamics.
- P3 – Digital PID: Sampled digital PID with anti-windup, stair-step output, generated Arduino code and a copy button.
- P4 – PID Tuning Challenge: Random-plant PID tuning challenge with pass/fail criteria, per-round and session scoring.
- My System: Project actuator design with editable source values, specs, results and Arduino code. It starts with illustrative values (K = 1, τ = 1 s), which must be replaced with the project's own measured or datasheet values.

Pages
- index.html (landing page), module1.html, module2.html, module3.html, module4.html, p1.html, p2.html, p3.html, p4.html, my-system.html

Live Website

[https://musab128.github.io/encs4380-dynamics-T25/]

Technologies Used
- HTML
- CSS
- JavaScript
- Plotly.js (loaded from CDN, so plots need internet access)
- RK4 simulation (pid-core.js for P1/P2; hw2-extra.js for P3 and My System with a sampled zero-order-hold controller)

Run Locally
Extract the entire folder and open index.html in a browser. No backend is required.

Submission
GitHub Release tagged v2.0, with the GitHub Pages link submitted on the course page.

AI Usage

claude was used to assist with code development, explanations, and debugging. ChatGPT assisted with draft code, structure, explanations and development of the Homework 2 pages. The team is responsible for testing, editing, understanding and explaining all code and equations.
