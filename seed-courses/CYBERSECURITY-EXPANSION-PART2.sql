-- ============================================
-- CYBERSECURITY COURSES EXPANSION PART 2 - New Courses
-- ============================================
-- Creates 2 new cybersecurity courses with comprehensive lessons
-- XP Rewards: Video=20, Text=15, Quiz=25, Text(Lab)=30
-- Safe to run - creates new courses and adds lessons

-- ============================================
-- CREATE NEW COURSES
-- ============================================

-- Course 1: Ethical Hacking Fundamentals
INSERT INTO courses (
  title, slug, description, estimated_duration_hours,
  image_url, instructor_name, category, is_published, created_at, updated_at
) VALUES (
  'Ethical Hacking Fundamentals',
  'ethical-hacking-fundamentals',
  'Master ethical hacking techniques including reconnaissance, exploitation, and professional penetration testing methodologies.',
  40,
  '/images/courses/ethical-hacking.jpg',
  'Security Expert',
  'cybersecurity',
  true,
  NOW(),
  NOW()
);

-- Course 2: Network Security
INSERT INTO courses (
  title, slug, description, estimated_duration_hours,
  image_url, instructor_name, category, is_published, created_at, updated_at
) VALUES (
  'Network Security',
  'network-security',
  'Comprehensive network security covering firewalls, intrusion detection, VPNs, and advanced threat protection strategies.',
  24,
  '/images/courses/network-security.jpg',
  'Network Security Specialist',
  'cybersecurity',
  true,
  NOW(),
  NOW()
);

-- ============================================
-- ETHICAL HACKING FUNDAMENTALS - LESSONS
-- ============================================

-- ================================================
-- MODULE 1: INTRODUCTION TO ETHICAL HACKING (Lessons 1-10)
-- ================================================

-- Lesson 1 - Introduction to Ethical Hacking (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Ethical Hacking: Legal and Ethical Framework',
'introduction-to-ethical-hacking',
'video',
0,
45,
'https://www.youtube.com/watch?v=ethical-hacking-intro',
'<h2>Ethical Hacking Foundation</h2><p>Learn the fundamentals of ethical hacking including legal frameworks, methodologies, and professional ethics.</p>',
20,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 2 - Information Gathering and Reconnaissance (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Information Gathering: OSINT and Reconnaissance Techniques',
'information-gathering-reconnaissance',
'text',
1,
'<h2>Information Gathering</h2><p>Hands-on lab: Master open source intelligence (OSINT) and passive reconnaissance techniques for ethical hacking.</p>',
30,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 3 - Network Scanning and Enumeration (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Network Scanning: Port Scanning and Service Enumeration',
'network-scanning-enumeration',
'text',
2,
'<h2>Network Discovery</h2><p>Learn network scanning techniques including port scanning, service detection, and network enumeration methods.</p>',
15,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 4 - Vulnerability Assessment Tools (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Vulnerability Assessment: Tools and Methodologies',
'vulnerability-assessment-tools',
'video',
3,
50,
'https://www.youtube.com/watch?v=vulnerability-assessment',
'<h2>Vulnerability Scanning</h2><p>Master vulnerability assessment tools including Nessus, OpenVAS, and custom scanning techniques.</p>',
20,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 5 - System Exploitation Basics (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'System Exploitation: Buffer Overflows and Memory Corruption',
'system-exploitation-basics',
'text',
4,
'<h2>Exploitation Fundamentals</h2><p>Hands-on lab: Learn basic exploitation techniques including buffer overflows and memory corruption attacks.</p>',
30,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 6 - Web Application Penetration Testing (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Web Application Security: OWASP Top 10 and Testing Methods',
'web-application-penetration-testing',
'text',
5,
'<h2>Web App Security</h2><p>Comprehensive guide to web application penetration testing including OWASP Top 10 vulnerabilities.</p>',
15,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 7 - Wireless Network Security (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Wireless Security: WiFi Hacking and Defense Techniques',
'wireless-network-security',
'video',
6,
55,
'https://www.youtube.com/watch?v=wireless-security',
'<h2>Wireless Penetration Testing</h2><p>Learn wireless security assessment including WEP/WPA cracking and wireless defense strategies.</p>',
20,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 8 - Social Engineering and Physical Security (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Social Engineering: Psychological Manipulation and Physical Tests',
'social-engineering-physical-security',
'text',
7,
'<h2>Human Factor Security</h2><p>Hands-on lab: Explore social engineering techniques and physical security assessment methods.</p>',
30,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 9 - Post-Exploitation and Persistence (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Post-Exploitation: Maintaining Access and Data Exfiltration',
'post-exploitation-persistence',
'text',
8,
'<h2>Advanced Techniques</h2><p>Learn post-exploitation techniques including privilege escalation, persistence, and data exfiltration methods.</p>',
15,
true,
'Module 1: Introduction to Ethical Hacking'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 10 - Quiz: Ethical Hacking Fundamentals (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Ethical Hacking Foundation Assessment',
'quiz-ethical-hacking-fundamentals',
'quiz',
9,
'{"instructions": "Test your knowledge of ethical hacking fundamentals and methodologies.","questions": [{"question":"What is the first phase in the ethical hacking methodology?","options":["Scanning","Reconnaissance","Exploitation","Reporting"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 1: Assessment'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- ================================================
-- MODULE 2: ADVANCED PENETRATION TESTING (Lessons 11-20)
-- ================================================

-- Lesson 11 - Advanced Network Exploitation (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Advanced Network Attacks: Lateral Movement and Pivoting',
'advanced-network-exploitation',
'video',
10,
60,
'https://www.youtube.com/watch?v=network-exploitation',
'<h2>Advanced Network Attacks</h2><p>Master advanced network exploitation techniques including lateral movement, pivoting, and network tunneling.</p>',
20,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 12 - Database Security Testing (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Database Security: SQL Injection and Database Exploitation',
'database-security-testing',
'text',
11,
'<h2>Database Penetration Testing</h2><p>Hands-on lab: Advanced database security testing including SQL injection, privilege escalation, and data extraction.</p>',
30,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 13 - Mobile Application Security (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Mobile Security: iOS and Android Penetration Testing',
'mobile-application-security',
'text',
12,
'<h2>Mobile Security Testing</h2><p>Learn mobile application security assessment for iOS and Android platforms including reverse engineering.</p>',
15,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 14 - Cloud Security Penetration Testing (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Cloud Security: AWS, Azure, and GCP Penetration Testing',
'cloud-security-penetration-testing',
'video',
13,
45,
'https://www.youtube.com/watch?v=cloud-security-testing',
'<h2>Cloud Security Assessment</h2><p>Master cloud security testing techniques for major cloud platforms including misconfigurations and privilege escalation.</p>',
20,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 15 - Malware Analysis and Reverse Engineering (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Malware Analysis: Static and Dynamic Analysis Techniques',
'malware-analysis-reverse-engineering',
'text',
14,
'<h2>Malware Analysis</h2><p>Hands-on lab: Learn malware analysis techniques including static analysis, dynamic analysis, and reverse engineering.</p>',
30,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 16 - Red Team Operations (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Red Team Operations: Advanced Persistent Threat Simulation',
'red-team-operations',
'text',
15,
'<h2>Red Team Tactics</h2><p>Advanced red team operations including APT simulation, covert channels, and long-term persistence strategies.</p>',
15,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 17 - Digital Forensics for Hackers (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Digital Forensics: Evidence Collection and Analysis',
'digital-forensics-for-hackers',
'video',
16,
50,
'https://www.youtube.com/watch?v=digital-forensics',
'<h2>Forensic Investigation</h2><p>Learn digital forensics techniques including evidence collection, analysis, and anti-forensics methods.</p>',
20,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 18 - Cryptographic Attacks (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Cryptographic Security: Attacking Weak Implementations',
'cryptographic-attacks',
'text',
17,
'<h2>Cryptographic Attacks</h2><p>Hands-on lab: Explore cryptographic vulnerabilities and attacks including weak implementations and key management flaws.</p>',
30,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 19 - Reporting and Communication (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Professional Reporting: Documentation and Client Communication',
'reporting-and-communication',
'text',
18,
'<h2>Professional Reporting</h2><p>Master professional penetration testing reporting including executive summaries and technical documentation.</p>',
15,
true,
'Module 2: Advanced Penetration Testing'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- Lesson 20 - Quiz: Advanced Penetration Testing (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Advanced Penetration Testing Mastery',
'quiz-advanced-penetration-testing',
'quiz',
19,
'{"instructions": "Test your mastery of advanced penetration testing techniques and methodologies.","questions": [{"question":"Which technique is used for maintaining access after initial compromise?","options":["Reconnaissance","Persistence","Scanning","Reporting"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'ethical-hacking-fundamentals';

-- ============================================
-- NETWORK SECURITY - LESSONS
-- ============================================

-- ================================================
-- MODULE 1: NETWORK SECURITY FUNDAMENTALS (Lessons 1-12)
-- ================================================

-- Lesson 1 - Network Security Overview (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Network Security Fundamentals: Threats and Defense Strategies',
'network-security-overview',
'video',
0,
50,
'https://www.youtube.com/watch?v=network-security-overview',
'<h2>Network Security Foundation</h2><p>Comprehensive overview of network security threats, attack vectors, and defense strategies in modern networks.</p>',
20,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 2 - Firewall Technologies and Configuration (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Firewall Implementation: Next-Gen and Traditional Firewalls',
'firewall-technologies-configuration',
'text',
1,
'<h2>Firewall Security</h2><p>Hands-on lab: Configure and manage firewall technologies including next-generation firewalls and rule optimization.</p>',
30,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 3 - Network Access Control (NAC) (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Network Access Control: 802.1X and Identity Management',
'network-access-control',
'text',
2,
'<h2>Access Control Systems</h2><p>Learn network access control mechanisms including 802.1X authentication and identity-based access policies.</p>',
15,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 4 - Intrusion Detection and Prevention Systems (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'IDS/IPS Systems: Detection and Response Mechanisms',
'intrusion-detection-prevention-systems',
'video',
3,
45,
'https://www.youtube.com/watch?v=ids-ips-systems',
'<h2>Intrusion Detection</h2><p>Master intrusion detection and prevention systems including signature-based and anomaly-based detection.</p>',
20,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 5 - VPN Technologies and Implementation (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'VPN Security: Site-to-Site and Remote Access VPNs',
'vpn-technologies-implementation',
'text',
4,
'<h2>VPN Implementation</h2><p>Hands-on lab: Configure and secure VPN technologies including IPSec, SSL/TLS VPNs, and WireGuard.</p>',
30,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 6 - Network Segmentation and VLANs (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Network Segmentation: VLANs and Micro-segmentation',
'network-segmentation-vlans',
'text',
5,
'<h2>Network Isolation</h2><p>Implement network segmentation strategies using VLANs, subnets, and micro-segmentation for security isolation.</p>',
15,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 7 - Wireless Network Security (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Wireless Security: Enterprise WiFi and Security Protocols',
'wireless-network-security-advanced',
'video',
6,
55,
'https://www.youtube.com/watch?v=wireless-enterprise-security',
'<h2>Enterprise Wireless</h2><p>Secure enterprise wireless networks using WPA3-Enterprise, certificate-based authentication, and RADIUS.</p>',
20,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 8 - DDoS Protection and Mitigation (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'DDoS Protection: Detection and Mitigation Strategies',
'ddos-protection-mitigation',
'text',
7,
'<h2>DDoS Defense</h2><p>Hands-on lab: Implement DDoS protection mechanisms including rate limiting, traffic filtering, and cloud-based protection.</p>',
30,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 9 - Network Monitoring and Threat Hunting (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Network Monitoring: SIEM and Threat Hunting Techniques',
'network-monitoring-threat-hunting',
'text',
8,
'<h2>Threat Detection</h2><p>Learn network monitoring techniques and threat hunting methodologies for proactive security defense.</p>',
15,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 10 - Zero Trust Network Architecture (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Zero Trust Architecture: Never Trust, Always Verify',
'zero-trust-network-architecture',
'video',
9,
50,
'https://www.youtube.com/watch?v=zero-trust-network',
'<h2>Zero Trust Security</h2><p>Implement zero trust network architecture principles including continuous verification and least privilege access.</p>',
20,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 11 - Network Forensics and Incident Response (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Network Forensics: Traffic Analysis and Incident Investigation',
'network-forensics-incident-response',
'text',
10,
'<h2>Network Forensics</h2><p>Hands-on lab: Conduct network forensics investigations using packet analysis and traffic correlation techniques.</p>',
30,
true,
'Module 1: Network Security Fundamentals'
FROM courses WHERE slug = 'network-security';

-- Lesson 12 - Quiz: Network Security Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Network Security Foundation Assessment',
'quiz-network-security-mastery',
'quiz',
11,
'{"instructions": "Test your comprehensive knowledge of network security principles and implementations.","questions": [{"question":"Which security model assumes that threats exist both inside and outside the network perimeter?","options":["Perimeter Security","Defense in Depth","Zero Trust","Network Segmentation"],"correctAnswer":2,"points":3}]}',
25,
true,
'Module 1: Assessment'
FROM courses WHERE slug = 'network-security';