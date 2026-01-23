-- ============================================
-- CLOUD COURSES EXPANSION - Dummy Lessons
-- ============================================
-- Adds comprehensive dummy lessons to all cloud courses
-- XP Rewards: Video=20, Text=15, Quiz=25, Text(Lab)=30
-- Safe to run - only adds lessons to existing cloud courses

-- ============================================
-- SECURING YOUR WEBSITE - EXPANSION
-- ============================================

-- ================================================
-- MODULE 2: ADVANCED WEB SECURITY (Lessons 6-15)
-- ================================================

-- Lesson 6 - Advanced SSL/TLS Configuration (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Advanced SSL/TLS Configuration and Best Practices',
'advanced-ssl-tls-configuration',
'video',
5,
45,
'https://www.youtube.com/watch?v=advanced-ssl-tls',
'<h2>SSL/TLS Security</h2><p>Master advanced SSL/TLS configuration including cipher suites, certificate management, and HSTS implementation.</p>',
20,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 7 - Content Security Policy (CSP) Implementation (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Implementing Robust Content Security Policies',
'content-security-policy-implementation',
'text',
6,
'<h2>CSP Implementation</h2><p>Hands-on lab: Create and deploy comprehensive Content Security Policies to prevent XSS attacks.</p>',
30,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 8 - Web Application Firewall (WAF) Setup (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Web Application Firewall Configuration and Management',
'web-application-firewall-setup',
'text',
7,
'<h2>WAF Protection</h2><p>Learn to configure and manage Web Application Firewalls for comprehensive web security protection.</p>',
15,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 9 - API Security and Authentication (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'API Security: Authentication, Authorization, and Rate Limiting',
'api-security-authentication',
'video',
8,
50,
'https://www.youtube.com/watch?v=api-security',
'<h2>API Security</h2><p>Comprehensive guide to securing APIs with OAuth, JWT, rate limiting, and input validation.</p>',
20,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 10 - Database Security for Web Applications (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Database Security: SQL Injection Prevention and Data Protection',
'database-security-web-applications',
'text',
9,
'<h2>Database Protection</h2><p>Hands-on lab: Implement database security measures including parameterized queries and encryption.</p>',
30,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 11 - Session Management and Security (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Secure Session Management: Cookies, Tokens, and Storage',
'session-management-security',
'text',
10,
'<h2>Session Security</h2><p>Best practices for secure session management including secure cookies and session token handling.</p>',
15,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 12 - Cross-Site Request Forgery (CSRF) Protection (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'CSRF Protection: Tokens, SameSite Cookies, and Defense Strategies',
'csrf-protection-strategies',
'video',
11,
35,
'https://www.youtube.com/watch?v=csrf-protection',
'<h2>CSRF Defense</h2><p>Learn to implement effective CSRF protection mechanisms and understand attack vectors.</p>',
20,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 13 - Security Headers and HTTP Security (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Implementing Security Headers for Web Protection',
'security-headers-http-security',
'text',
12,
'<h2>HTTP Security Headers</h2><p>Hands-on lab: Configure essential security headers including HSTS, CSP, and X-Frame-Options.</p>',
30,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 14 - Input Validation and Sanitization (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Input Validation and Sanitization Techniques',
'input-validation-sanitization',
'text',
13,
'<h2>Input Security</h2><p>Master input validation and sanitization techniques to prevent injection attacks and data corruption.</p>',
15,
true,
'Module 2: Advanced Web Security'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 15 - Quiz: Web Security Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Advanced Web Security Concepts',
'quiz-web-security-mastery',
'quiz',
14,
'{"instructions": "Test your knowledge of advanced web security concepts and implementation.","questions": [{"question":"Which security header prevents clickjacking attacks?","options":["X-XSS-Protection","X-Frame-Options","X-Content-Type-Options","Strict-Transport-Security"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'securing-your-website';

-- ================================================
-- MODULE 3: SECURITY MONITORING AND INCIDENT RESPONSE (Lessons 16-25)
-- ================================================

-- Lesson 16 - Web Security Monitoring and Logging (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Web Security Monitoring: Logging and Alerting Systems',
'web-security-monitoring-logging',
'video',
15,
55,
'https://www.youtube.com/watch?v=web-security-monitoring',
'<h2>Security Monitoring</h2><p>Implement comprehensive web security monitoring including log analysis and real-time alerting.</p>',
20,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 17 - Vulnerability Scanning for Web Applications (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Automated Vulnerability Scanning and Assessment',
'vulnerability-scanning-web-applications',
'text',
16,
'<h2>Vulnerability Assessment</h2><p>Hands-on lab: Set up and configure automated vulnerability scanning tools for web applications.</p>',
30,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 18 - Security Incident Response for Web Applications (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Web Security Incident Response Procedures',
'security-incident-response-web',
'text',
17,
'<h2>Incident Response</h2><p>Develop and implement effective incident response procedures specifically for web security breaches.</p>',
15,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 19 - Performance Impact of Security Measures (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Balancing Security and Performance in Web Applications',
'performance-impact-security-measures',
'video',
18,
40,
'https://www.youtube.com/watch?v=security-performance',
'<h2>Security vs Performance</h2><p>Learn to optimize security implementations while maintaining optimal website performance.</p>',
20,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 20 - Compliance and Legal Considerations (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Web Security Compliance: GDPR, PCI DSS, and Standards',
'compliance-legal-considerations-web',
'text',
19,
'<h2>Security Compliance</h2><p>Understanding legal and regulatory requirements for web security including GDPR and PCI DSS.</p>',
15,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 21 - Security Testing and Penetration Testing (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Web Application Penetration Testing Techniques',
'security-testing-penetration-testing',
'text',
20,
'<h2>Security Testing</h2><p>Hands-on lab: Conduct comprehensive security testing and penetration testing on web applications.</p>',
30,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 22 - Secure Development Lifecycle (SDLC) (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Integrating Security into the Development Lifecycle',
'secure-development-lifecycle',
'video',
21,
45,
'https://www.youtube.com/watch?v=secure-sdlc',
'<h2>Secure SDLC</h2><p>Implement security practices throughout the software development lifecycle for web applications.</p>',
20,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 23 - Third-Party Security and Dependencies (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Managing Third-Party Security Risks and Dependencies',
'third-party-security-dependencies',
'text',
22,
'<h2>Third-Party Security</h2><p>Assess and manage security risks from third-party libraries and external dependencies.</p>',
15,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 24 - Security Automation and DevSecOps (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Implementing Security Automation and DevSecOps Practices',
'security-automation-devsecops',
'text',
23,
'<h2>DevSecOps Implementation</h2><p>Hands-on lab: Automate security testing and implement DevSecOps practices in web development.</p>',
30,
true,
'Module 3: Security Monitoring and Incident Response'
FROM courses WHERE slug = 'securing-your-website';

-- Lesson 25 - Quiz: Security Operations (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Security Monitoring and Operations',
'quiz-security-operations',
'quiz',
24,
'{"instructions": "Test your knowledge of security monitoring, incident response, and operational security.","questions": [{"question":"What is the primary goal of DevSecOps?","options":["Faster deployment","Security integration","Cost reduction","Performance optimization"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 3: Assessment'
FROM courses WHERE slug = 'securing-your-website';

-- ============================================
-- KUBERNETES - EXPANSION
-- ============================================

-- ================================================
-- MODULE 2: ADVANCED KUBERNETES CONCEPTS (Lessons 9-18)
-- ================================================

-- Lesson 9 - Kubernetes Networking Deep Dive (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Networking: CNI, Services, and Ingress',
'kubernetes-networking-deep-dive',
'video',
8,
60,
'https://www.youtube.com/watch?v=k8s-networking',
'<h2>Advanced Networking</h2><p>Master Kubernetes networking including CNI plugins, service meshes, and network policies.</p>',
20,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 10 - Persistent Storage and Volumes (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Storage: Persistent Volumes and Storage Classes',
'persistent-storage-volumes',
'text',
9,
'<h2>Storage Management</h2><p>Hands-on lab: Configure persistent storage solutions including CSI drivers and storage classes.</p>',
30,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 11 - ConfigMaps and Secrets Management (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Configuration Management: ConfigMaps and Secrets',
'configmaps-secrets-management',
'text',
10,
'<h2>Configuration Security</h2><p>Best practices for managing application configuration and sensitive data in Kubernetes.</p>',
15,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 12 - Kubernetes Security and RBAC (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Security: RBAC, Pod Security, and Network Policies',
'kubernetes-security-rbac',
'video',
11,
55,
'https://www.youtube.com/watch?v=k8s-security',
'<h2>Cluster Security</h2><p>Implement comprehensive Kubernetes security including RBAC, pod security standards, and admission controllers.</p>',
20,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 13 - Helm Charts and Package Management (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Helm Charts: Creating and Managing Kubernetes Applications',
'helm-charts-package-management',
'text',
12,
'<h2>Application Packaging</h2><p>Hands-on lab: Create, customize, and deploy applications using Helm charts and repositories.</p>',
30,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 14 - Monitoring and Observability (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Monitoring: Prometheus, Grafana, and Logging',
'monitoring-observability',
'text',
13,
'<h2>Cluster Observability</h2><p>Implement comprehensive monitoring and observability solutions for Kubernetes clusters.</p>',
15,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 15 - Custom Resources and Operators (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Custom Resources and Kubernetes Operators',
'custom-resources-operators',
'video',
14,
50,
'https://www.youtube.com/watch?v=k8s-operators',
'<h2>Extending Kubernetes</h2><p>Learn to create custom resources and operators to extend Kubernetes functionality.</p>',
20,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 16 - Cluster Autoscaling and Resource Management (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Autoscaling: HPA, VPA, and Cluster Autoscaler',
'cluster-autoscaling-resource-management',
'text',
15,
'<h2>Dynamic Scaling</h2><p>Hands-on lab: Implement horizontal and vertical pod autoscaling plus cluster-level autoscaling.</p>',
30,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 17 - Multi-Cluster and Federation (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Multi-Cluster Kubernetes: Federation and Management',
'multi-cluster-federation',
'text',
16,
'<h2>Multi-Cluster Operations</h2><p>Strategies for managing multiple Kubernetes clusters and cross-cluster communication.</p>',
15,
true,
'Module 2: Advanced Kubernetes Concepts'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 18 - Quiz: Advanced Kubernetes (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Advanced Kubernetes Concepts',
'quiz-advanced-kubernetes',
'quiz',
17,
'{"instructions": "Test your knowledge of advanced Kubernetes concepts and operations.","questions": [{"question":"Which component is responsible for cluster-level autoscaling?","options":["HPA","VPA","Cluster Autoscaler","Metrics Server"],"correctAnswer":2,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'kubernetes-docker';

-- ================================================
-- MODULE 3: PRODUCTION KUBERNETES (Lessons 19-28)
-- ================================================

-- Lesson 19 - Production Deployment Strategies (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Production Deployments: Rolling Updates and Blue-Green',
'production-deployment-strategies',
'video',
18,
50,
'https://www.youtube.com/watch?v=k8s-deployments',
'<h2>Production Deployments</h2><p>Master production deployment strategies including canary releases and blue-green deployments.</p>',
20,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 20 - Disaster Recovery and Backup (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Disaster Recovery and Backup Strategies',
'disaster-recovery-backup',
'text',
19,
'<h2>Business Continuity</h2><p>Hands-on lab: Implement comprehensive backup and disaster recovery solutions for Kubernetes.</p>',
30,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 21 - Performance Tuning and Optimization (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Performance Tuning and Resource Optimization',
'performance-tuning-optimization',
'text',
20,
'<h2>Performance Optimization</h2><p>Advanced techniques for optimizing Kubernetes cluster performance and resource utilization.</p>',
15,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 22 - Service Mesh Integration (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Service Mesh: Istio, Linkerd, and Advanced Networking',
'service-mesh-integration',
'video',
21,
45,
'https://www.youtube.com/watch?v=service-mesh',
'<h2>Service Mesh</h2><p>Implement service mesh solutions for advanced traffic management and security.</p>',
20,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 23 - GitOps and CI/CD Integration (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'GitOps and CI/CD Pipelines for Kubernetes',
'gitops-cicd-integration',
'text',
22,
'<h2>GitOps Workflows</h2><p>Hands-on lab: Implement GitOps workflows and CI/CD pipelines for Kubernetes deployments.</p>',
30,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 24 - Cost Optimization and Resource Management (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Cost Optimization and Resource Governance',
'cost-optimization-resource-management',
'text',
23,
'<h2>Cost Management</h2><p>Strategies for optimizing costs and implementing resource governance in Kubernetes environments.</p>',
15,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 25 - Compliance and Governance (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes Compliance: Policies and Governance Frameworks',
'compliance-governance',
'video',
24,
40,
'https://www.youtube.com/watch?v=k8s-compliance',
'<h2>Compliance Management</h2><p>Implement compliance frameworks and governance policies for enterprise Kubernetes.</p>',
20,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 26 - Troubleshooting and Debugging (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Advanced Kubernetes Troubleshooting and Debugging',
'troubleshooting-debugging',
'text',
25,
'<h2>Troubleshooting Skills</h2><p>Hands-on lab: Master advanced troubleshooting techniques for complex Kubernetes issues.</p>',
30,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 27 - Edge Computing and IoT with Kubernetes (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Kubernetes at the Edge: IoT and Edge Computing Patterns',
'edge-computing-iot-kubernetes',
'text',
26,
'<h2>Edge Deployment</h2><p>Deploying and managing Kubernetes in edge computing and IoT environments.</p>',
15,
true,
'Module 3: Production Kubernetes'
FROM courses WHERE slug = 'kubernetes-docker';

-- Lesson 28 - Quiz: Production Kubernetes Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Production Kubernetes Operations',
'quiz-production-kubernetes',
'quiz',
27,
'{"instructions": "Test your mastery of production Kubernetes operations and best practices.","questions": [{"question":"Which deployment strategy minimizes downtime by running two identical production environments?","options":["Rolling Update","Canary","Blue-Green","Recreate"],"correctAnswer":2,"points":3}]}',
25,
true,
'Module 3: Assessment'
FROM courses WHERE slug = 'kubernetes-docker';

-- ============================================
-- MICROSOFT AZURE FUNDAMENTALS - EXPANSION
-- ============================================

-- ================================================
-- MODULE 2: AZURE COMPUTE AND NETWORKING (Lessons 9-18)
-- ================================================

-- Lesson 9 - Azure Virtual Machines Deep Dive (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Azure Virtual Machines: Configuration and Management',
'azure-virtual-machines-deep-dive',
'video',
8,
55,
'https://www.youtube.com/watch?v=azure-vms',
'<h2>VM Management</h2><p>Comprehensive guide to Azure Virtual Machines including sizing, networking, and storage options.</p>',
20,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 10 - Azure App Service and Web Apps (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure App Service: Deploying and Scaling Web Applications',
'azure-app-service-web-apps',
'text',
9,
'<h2>Web Application Hosting</h2><p>Hands-on lab: Deploy and manage web applications using Azure App Service and scaling features.</p>',
30,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 11 - Azure Container Instances and Services (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Container Solutions: ACI and Container Registry',
'azure-container-instances-services',
'text',
10,
'<h2>Container Services</h2><p>Overview of Azure container services including Container Instances and Azure Container Registry.</p>',
15,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 12 - Azure Virtual Networks and Subnets (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Azure Networking: VNets, Subnets, and Network Security',
'azure-virtual-networks-subnets',
'video',
11,
45,
'https://www.youtube.com/watch?v=azure-networking',
'<h2>Network Architecture</h2><p>Design and implement Azure virtual networks with proper subnet configuration and security.</p>',
20,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 13 - Load Balancing and Application Gateway (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Load Balancing: Load Balancer vs Application Gateway',
'load-balancing-application-gateway',
'text',
12,
'<h2>Traffic Management</h2><p>Hands-on lab: Configure Azure Load Balancer and Application Gateway for high availability.</p>',
30,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 14 - Azure Storage Solutions (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Storage: Blob, File, Queue, and Table Storage',
'azure-storage-solutions',
'text',
13,
'<h2>Storage Services</h2><p>Comprehensive overview of Azure storage solutions and their appropriate use cases.</p>',
15,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 15 - Azure Functions and Serverless Computing (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Azure Functions: Serverless Computing and Event-Driven Architecture',
'azure-functions-serverless-computing',
'video',
14,
50,
'https://www.youtube.com/watch?v=azure-functions',
'<h2>Serverless Applications</h2><p>Build and deploy serverless applications using Azure Functions and event triggers.</p>',
20,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 16 - Azure Content Delivery Network (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure CDN: Global Content Delivery and Optimization',
'azure-content-delivery-network',
'text',
15,
'<h2>Content Acceleration</h2><p>Hands-on lab: Configure Azure CDN for global content delivery and performance optimization.</p>',
30,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 17 - Network Security Groups and Firewalls (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Network Security: NSGs and Azure Firewall',
'network-security-groups-firewalls',
'text',
16,
'<h2>Network Protection</h2><p>Implement network security using Network Security Groups and Azure Firewall services.</p>',
15,
true,
'Module 2: Azure Compute and Networking'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 18 - Quiz: Azure Compute and Networking (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Azure Compute and Networking Services',
'quiz-azure-compute-networking',
'quiz',
17,
'{"instructions": "Test your knowledge of Azure compute and networking services.","questions": [{"question":"Which Azure service provides serverless compute capabilities?","options":["Azure VMs","Azure App Service","Azure Functions","Azure Container Instances"],"correctAnswer":2,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'azure-fundamentals';

-- ================================================
-- MODULE 3: AZURE DATA AND SECURITY SERVICES (Lessons 19-28)
-- ================================================

-- Lesson 19 - Azure SQL Database and Cosmos DB (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Azure Database Services: SQL Database and Cosmos DB',
'azure-sql-database-cosmos-db',
'video',
18,
60,
'https://www.youtube.com/watch?v=azure-databases',
'<h2>Database Solutions</h2><p>Explore Azure database offerings including SQL Database and globally distributed Cosmos DB.</p>',
20,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 20 - Azure Active Directory and Identity (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Active Directory: Identity and Access Management',
'azure-active-directory-identity',
'text',
19,
'<h2>Identity Management</h2><p>Hands-on lab: Configure Azure Active Directory for user management and single sign-on.</p>',
30,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 21 - Azure Key Vault and Security Center (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Security: Key Vault and Security Center',
'azure-key-vault-security-center',
'text',
20,
'<h2>Security Management</h2><p>Manage secrets and monitor security posture using Azure Key Vault and Security Center.</p>',
15,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 22 - Azure Backup and Site Recovery (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Azure Backup and Disaster Recovery Solutions',
'azure-backup-site-recovery',
'video',
21,
45,
'https://www.youtube.com/watch?v=azure-backup',
'<h2>Business Continuity</h2><p>Implement backup and disaster recovery strategies using Azure Backup and Site Recovery.</p>',
20,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 23 - Azure Monitor and Log Analytics (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Monitoring: Azure Monitor and Log Analytics',
'azure-monitor-log-analytics',
'text',
22,
'<h2>Monitoring and Analytics</h2><p>Hands-on lab: Set up comprehensive monitoring and logging using Azure Monitor services.</p>',
30,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 24 - Azure AI and Machine Learning Services (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure AI: Cognitive Services and Machine Learning',
'azure-ai-machine-learning-services',
'text',
23,
'<h2>AI and ML Services</h2><p>Overview of Azure AI services including Cognitive Services and Azure Machine Learning platform.</p>',
15,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 25 - Azure DevOps and CI/CD (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Azure DevOps: CI/CD Pipelines and Project Management',
'azure-devops-cicd',
'video',
24,
50,
'https://www.youtube.com/watch?v=azure-devops',
'<h2>DevOps Solutions</h2><p>Implement continuous integration and deployment using Azure DevOps services.</p>',
20,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 26 - Cost Management and Billing (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Cost Management: Monitoring and Optimization',
'cost-management-billing',
'text',
25,
'<h2>Cost Optimization</h2><p>Hands-on lab: Monitor, analyze, and optimize Azure costs using cost management tools.</p>',
30,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 27 - Azure Governance and Compliance (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Azure Governance: Policies, Blueprints, and Compliance',
'azure-governance-compliance',
'text',
26,
'<h2>Governance Framework</h2><p>Implement governance and compliance using Azure Policy, Blueprints, and management groups.</p>',
15,
true,
'Module 3: Azure Data and Security Services'
FROM courses WHERE slug = 'azure-fundamentals';

-- Lesson 28 - Quiz: Azure Data and Security Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Azure Data and Security Services',
'quiz-azure-data-security',
'quiz',
27,
'{"instructions": "Test your knowledge of Azure data and security services.","questions": [{"question":"Which Azure service provides centralized identity and access management?","options":["Azure Key Vault","Azure Active Directory","Azure Security Center","Azure Policy"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 3: Assessment'
FROM courses WHERE slug = 'azure-fundamentals';