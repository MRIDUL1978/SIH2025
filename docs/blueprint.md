# **App Name**: AttendEase

## Core Features:

- Student Login: Allows students to log in and access their attendance information using mock credentials.
- Student Dashboard: Displays the student's attendance statistics and a list of their courses, populated with mock data.
- QR Code Check-In: Simulates a successful attendance check-in by displaying a confirmation message after scanning any QR code.
- Faculty Login: Enables faculty members to log in and access their course management dashboard using mock credentials.
- Course QR Code Generation: Generates a visual QR code on-screen for a selected course, facilitating student check-ins. Includes an AI "tool" that decides the format for generating a code with higher security to ensure that unauthorized users cannot scan the code to enter into class. The format includes hashing techniques along with time sensitivity.
- Attendance Tracking: Displays a list of students for a selected course and simulates real-time attendance updates upon simulated QR code scans using Zustand state management.
- Admin Analytics Dashboard: Visualizes mock attendance data for the entire institution using charts and graphs, offering insights into overall attendance trends.

## Style Guidelines:

- Primary color: Deep Indigo (#6666FF) to convey trust and reliability.
- Background color: Light Gray (#F0F0F5) to ensure a clean and modern look.
- Accent color: Vibrant Teal (#40E0D0) for interactive elements and highlights, offering a fresh contrast.
- Font Pairing: 'Space Grotesk' (sans-serif) for headlines, 'Inter' (sans-serif) for body text. Use Space Grotesk to headings and emphasize the importance.
- Code Font: 'Source Code Pro' (monospace) for displaying code snippets.
- Use consistent and simple icons from a library like 'Lucide React' to maintain a sleek and effective interface.
- Implement a responsive, grid-based layout using Tailwind CSS for consistent spacing and alignment across devices.
- Add subtle transition animations for UI elements using React Transition Group to enhance user experience.