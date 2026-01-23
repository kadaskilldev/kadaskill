-- COURSE: Cybersecurity Fundamentals (DELETE + INSERT)
-- Safe to run - only affects lessons for this specific course
-- Run this in Supabase SQL Editor
-- XP Rewards: Video=20, Text=15, Quiz=25

-- =============================================
-- STEP 1: Delete existing lessons for this course only
-- =============================================
DELETE FROM lessons
WHERE course_id = (SELECT id FROM courses WHERE slug = 'cybersecurity-fundamentals');

-- =============================================
-- STEP 2: Insert all lessons fresh (with XP rewards)
-- =============================================

-- MODULE 1: FOUNDATIONS OF CYBERSECURITY

-- Lesson 1 — Introduction to Cybersecurity (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Cybersecurity',
'introduction-to-cybersecurity',
'video',
0,
40,
'https://www.youtube.com/watch?v=inWWhr5tnEA',
'
<h2>What Is Cybersecurity?</h2>

<p>
Cybersecurity is the discipline of protecting digital systems, networks,
applications, and data from unauthorized access, misuse, disruption, or
destruction. It exists because modern society relies heavily on interconnected
technology.
</p>

<p>
Unlike physical security, cybersecurity operates in an environment where
attackers can be anonymous, remote, automated, and persistent. A single
individual can attack thousands of systems from anywhere in the world.
</p>

<hr/>

<h2>Why Cybersecurity Is Necessary</h2>

<p>
Every digital system is built by humans, and every human makes mistakes.
Cybersecurity exists to manage the consequences of these mistakes.
</p>

<p>
Cyber attacks target:
</p>

<ul>
  <li>Personal data (identity theft)</li>
  <li>Financial systems (fraud, ransomware)</li>
  <li>Critical infrastructure (power, healthcare, transportation)</li>
  <li>Organizational trust and reputation</li>
</ul>

<hr/>

<h2>Cybersecurity Is a Socio-Technical Discipline</h2>

<p>
Cybersecurity is not just about technology. Many breaches occur because of
human behavior, poor processes, or organizational decisions.
</p>

<p>
Effective security requires balancing:
</p>

<ul>
  <li>Technology</li>
  <li>People</li>
  <li>Policies</li>
</ul>

<p>
This course builds the foundation required to understand all three.
</p>
',
20,
true,
'Module 1: Foundations'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- Lesson 2 — The CIA Triad: Core Security Principles (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'The CIA Triad: Confidentiality, Integrity, and Availability',
'cia-triad',
'text',
1,
'
<h2>The Core Objectives of Cybersecurity</h2>

<p>
All cybersecurity decisions revolve around three fundamental principles:
Confidentiality, Integrity, and Availability — collectively known as the
CIA Triad.
</p>

<h3>Confidentiality</h3>
<p>
Confidentiality ensures that information is accessible only to authorized
individuals. Breaches of confidentiality expose sensitive data such as
passwords, personal records, and intellectual property.
</p>

<h3>Integrity</h3>
<p>
Integrity ensures that data remains accurate and unaltered unless modified by
authorized actions. Even small integrity failures can have severe consequences,
such as altered financial records or corrupted medical data.
</p>

<h3>Availability</h3>
<p>
Availability ensures systems and data are accessible when needed. Attacks that
disrupt availability can halt operations even if data is not stolen.
</p>

<p>
Security is always a balance. Strengthening one pillar often impacts the others,
making architectural decisions critical.
</p>
',
15,
true,
'Module 1: Foundations'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- Lesson 3 — Threats, Vulnerabilities, and Risk (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Threats, Vulnerabilities, and Risk',
'threats-vulnerabilities-risk',
'text',
2,
'
<h2>Understanding Security Risk</h2>

<p>
Cybersecurity is fundamentally about managing risk, not eliminating it.
Understanding the difference between threats, vulnerabilities, and risk is
essential.
</p>

<h3>Threats</h3>
<p>
A threat is any potential source of harm, including attackers, malware,
insiders, or natural disasters.
</p>

<h3>Vulnerabilities</h3>
<p>
A vulnerability is a weakness that can be exploited, such as misconfigurations,
software bugs, or weak credentials.
</p>

<h3>Risk</h3>
<p>
Risk is the probability that a threat will exploit a vulnerability and cause
damage. Security prioritization depends on risk assessment.
</p>

<p>
Not all vulnerabilities require immediate action. Risk determines response.
</p>
',
15,
true,
'Module 1: Foundations'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- MODULE 2: THE THREAT LANDSCAPE

-- Lesson 4 — Malware and Ransomware (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Malware and Ransomware',
'malware-ransomware',
'video',
3,
42,
'https://www.youtube.com/watch?v=2S0pK8G2Bfs',
'
<h2>What Is Malware?</h2>

<p>
Malware is malicious software designed to infiltrate, damage, or disrupt
systems without the user''s consent.
</p>

<h3>Common Malware Types</h3>
<ul>
  <li>Viruses – attach to legitimate programs</li>
  <li>Worms – self-propagate across networks</li>
  <li>Trojans – disguise as legitimate software</li>
  <li>Ransomware – encrypts data for extortion</li>
</ul>

<h3>Why Ransomware Is So Effective</h3>
<p>
Ransomware targets availability and exploits poor backup practices and
organizational panic.
</p>
',
20,
true,
'Module 2: Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- Lesson 5 — Social Engineering and Human Factors (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Social Engineering and Human Factors',
'social-engineering-human-factors',
'text',
4,
'
<h2>Why Humans Are the Weakest Link</h2>

<p>
Attackers often bypass technical defenses by exploiting human psychology.
Social engineering attacks manipulate trust, fear, authority, and urgency.
</p>

<h3>Common Techniques</h3>
<ul>
  <li>Phishing</li>
  <li>Pretexting</li>
  <li>Baiting</li>
  <li>Impersonation</li>
</ul>

<p>
Security awareness training is one of the most effective defenses against
social engineering attacks.
</p>
',
15,
true,
'Module 2: Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- Lesson 6 — Network and System Attacks (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Network and System Attacks',
'network-system-attacks',
'video',
5,
45,
'https://www.youtube.com/watch?v=7zV0h32aU6A',
'
<h2>Attacks on Infrastructure</h2>

<p>
Network and system attacks target the communication and processing layers of
digital systems.
</p>

<h3>Examples</h3>
<ul>
  <li>Denial-of-Service attacks</li>
  <li>Password attacks</li>
  <li>Man-in-the-middle attacks</li>
</ul>

<p>
Many successful attacks exploit weak configurations rather than advanced
techniques.
</p>
',
20,
true,
'Module 2: Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- MODULE 3: DEFENSE AND RESPONSE

-- Lesson 7 — Security Controls and Defense-in-Depth (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Security Controls and Defense-in-Depth',
'security-controls-defense',
'text',
6,
'
<h2>Layered Security Strategy</h2>

<p>
Defense-in-depth uses multiple layers of controls to prevent, detect, and
respond to attacks.
</p>

<h3>Control Types</h3>
<ul>
  <li>Preventive</li>
  <li>Detective</li>
  <li>Corrective</li>
</ul>

<p>
Assuming breaches will occur leads to more resilient system design.
</p>
',
15,
true,
'Module 3: Defense'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- Lesson 8 — Incident Response and Recovery (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Incident Response and Recovery',
'incident-response-recovery',
'video',
7,
40,
'https://www.youtube.com/watch?v=0Gm6XkgdH5Y',
'
<h2>Responding to Security Incidents</h2>

<p>
Incident response focuses on preparation, detection, containment, eradication,
and recovery.
</p>

<p>
Organizations with response plans recover faster and suffer less damage.
</p>
',
20,
true,
'Module 3: Defense'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- MODULE 4: ASSESSMENT

-- Lesson 9 — Quiz: Introduction to Cybersecurity - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Introduction to Cybersecurity',
'quiz-intro-cybersecurity',
'quiz',
8,
'{
 "instructions": "This quiz covers only Lesson 1.",
 "questions": [
  {"question":"What is cybersecurity?","options":["Hardware repair","Protecting digital systems","Programming","Networking"],"correctAnswer":1,"points":1},
  {"question":"Why is cybersecurity needed?","options":["Faster systems","Risk management","Lower costs","Automation"],"correctAnswer":1,"points":1},
  {"question":"Cyber attackers can be?","options":["Local","Remote","Manual","Visible"],"correctAnswer":1,"points":1},
  {"question":"Cybersecurity involves?","options":["Only tools","Only people","People, process, and tech","None"],"correctAnswer":2,"points":1},
  {"question":"Which depends on cybersecurity?","options":["Finance","Healthcare","Government","All"],"correctAnswer":3,"points":1}
 ]
}',
25,
true,
'Module 1 Assessment'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- Lesson 10 — Quiz: CIA Triad - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: CIA Triad',
'quiz-cia-triad',
'quiz',
9,
'{
 "instructions": "This quiz covers only Lesson 2.",
 "questions": [
  {"question":"What does CIA stand for?","options":["Agency","Confidentiality Integrity Availability","Control Access","Cyber Info"],"correctAnswer":1,"points":1},
  {"question":"Which protects data from unauthorized access?","options":["Integrity","Availability","Confidentiality","Backup"],"correctAnswer":2,"points":1},
  {"question":"Which ensures data accuracy?","options":["Integrity","Confidentiality","Availability","Encryption"],"correctAnswer":0,"points":1},
  {"question":"Which protects uptime?","options":["Integrity","Encryption","Availability","Hashing"],"correctAnswer":2,"points":1},
  {"question":"Security decisions balance?","options":["Speed","Cost","CIA principles","Tools"],"correctAnswer":2,"points":1}
 ]
}',
25,
true,
'Module 1 Assessment'
FROM courses WHERE slug = 'cybersecurity-fundamentals';


-- =============================================
-- DONE! Verify the lessons were created with XP:
-- =============================================
SELECT title, slug, content_type, xp_reward, module_name, order_index
FROM lessons
WHERE course_id = (SELECT id FROM courses WHERE slug = 'cybersecurity-fundamentals')
ORDER BY order_index;
