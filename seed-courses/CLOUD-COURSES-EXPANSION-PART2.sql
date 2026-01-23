-- ============================================
-- CLOUD COURSES EXPANSION PART 2 - Dummy Lessons
-- ============================================
-- Adds comprehensive dummy lessons to additional cloud courses
-- XP Rewards: Video=20, Text=15, Quiz=25, Text(Lab)=30
-- Safe to run - only adds lessons to existing cloud courses

-- ============================================
-- GOOGLE CLOUD PLATFORM ESSENTIALS - EXPANSION
-- ============================================

-- ================================================
-- MODULE 2: ADVANCED GCP SERVICES (Lessons 9-16)
-- ================================================

-- Lesson 9 - Google Compute Engine Deep Dive (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Google Compute Engine: Advanced VM Management and Scaling',
'google-compute-engine-deep-dive',
'video',
8,
55,
'https://www.youtube.com/watch?v=gcp-compute-engine',
'<h2>GCE Advanced Features</h2><p>Master Google Compute Engine with advanced instance management, custom machine types, and auto-scaling groups.</p>',
20,
true,
'Module 2: Advanced GCP Services'
FROM courses WHERE slug = 'google-cloud-essentials';

-- Lesson 10 - Google Kubernetes Engine (GKE) (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Google Kubernetes Engine: Container Orchestration on GCP',
'google-kubernetes-engine-gke',
'text',
9,
'<h2>GKE Container Management</h2><p>Hands-on lab: Deploy and manage containerized applications using Google Kubernetes Engine with autopilot and standard modes.</p>',
30,
true,
'Module 2: Advanced GCP Services'
FROM courses WHERE slug = 'google-cloud-essentials';

-- Lesson 11 - Cloud Storage and BigQuery (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'GCP Storage Solutions: Cloud Storage and BigQuery Analytics',
'cloud-storage-bigquery',
'text',
10,
'<h2>Data Storage and Analytics</h2><p>Comprehensive overview of Google Cloud Storage classes and BigQuery for large-scale data analytics.</p>',
15,
true,
'Module 2: Advanced GCP Services'
FROM courses WHERE slug = 'google-cloud-essentials';

-- Lesson 12 - Cloud Functions and App Engine (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'GCP Serverless: Cloud Functions and App Engine',
'cloud-functions-app-engine',
'video',
11,
50,
'https://www.youtube.com/watch?v=gcp-serverless',
'<h2>Serverless Computing</h2><p>Build and deploy serverless applications using Cloud Functions and App Engine with automatic scaling.</p>',
20,
true,
'Module 2: Advanced GCP Services'
FROM courses WHERE slug = 'google-cloud-essentials';

-- Lesson 13 - VPC Networks and Cloud CDN (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'GCP Networking: VPC Design and Cloud CDN Implementation',
'vpc-networks-cloud-cdn',
'text',
12,
'<h2>Network Architecture</h2><p>Hands-on lab: Design Virtual Private Cloud networks and implement Cloud CDN for global content delivery.</p>',
30,
true,
'Module 2: Advanced GCP Services'
FROM courses WHERE slug = 'google-cloud-essentials';

-- Lesson 14 - Cloud SQL and Firestore (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'GCP Database Services: Cloud SQL and Firestore NoSQL',
'cloud-sql-firestore',
'text',
13,
'<h2>Database Solutions</h2><p>Compare and implement Google Cloud database solutions including managed SQL and NoSQL options.</p>',
15,
true,
'Module 2: Advanced GCP Services'
FROM courses WHERE slug = 'google-cloud-essentials';

-- Lesson 15 - Cloud Monitoring and Logging (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'GCP Observability: Cloud Monitoring and Logging',
'cloud-monitoring-logging',
'video',
14,
45,
'https://www.youtube.com/watch?v=gcp-monitoring',
'<h2>Operations and Monitoring</h2><p>Implement comprehensive monitoring, logging, and alerting using Google Cloud Operations suite.</p>',
20,
true,
'Module 2: Advanced GCP Services'
FROM courses WHERE slug = 'google-cloud-essentials';

-- Lesson 16 - Quiz: GCP Services Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Google Cloud Platform Services',
'quiz-gcp-services-mastery',
'quiz',
15,
'{"instructions": "Test your knowledge of Google Cloud Platform services and implementations.","questions": [{"question":"Which GCP service provides managed Kubernetes without node management?","options":["GKE Standard","GKE Autopilot","Cloud Run","Compute Engine"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'google-cloud-essentials';

-- ============================================
-- CLOUD ARCHITECTURE DESIGN - EXPANSION
-- ============================================

-- ================================================
-- MODULE 2: ADVANCED ARCHITECTURE PATTERNS (Lessons 5-12)
-- ================================================

-- Lesson 5 - Microservices Architecture Design (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Microservices Architecture: Design Patterns and Best Practices',
'microservices-architecture-design',
'video',
4,
60,
'https://www.youtube.com/watch?v=microservices-architecture',
'<h2>Microservices Patterns</h2><p>Master microservices architecture design including service decomposition, communication patterns, and data management.</p>',
20,
true,
'Module 2: Advanced Architecture Patterns'
FROM courses WHERE slug = 'cloud-architecture-design';

-- Lesson 6 - Event-Driven Architecture (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Event-Driven Architecture: Implementation and Patterns',
'event-driven-architecture',
'text',
5,
'<h2>Event-Driven Systems</h2><p>Hands-on lab: Design and implement event-driven architectures using message queues, event streams, and pub-sub patterns.</p>',
30,
true,
'Module 2: Advanced Architecture Patterns'
FROM courses WHERE slug = 'cloud-architecture-design';

-- Lesson 7 - Serverless Architecture Patterns (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Serverless Architecture: Functions, Events, and Orchestration',
'serverless-architecture-patterns',
'text',
6,
'<h2>Serverless Design</h2><p>Design serverless architectures using cloud functions, event triggers, and workflow orchestration patterns.</p>',
15,
true,
'Module 2: Advanced Architecture Patterns'
FROM courses WHERE slug = 'cloud-architecture-design';

-- Lesson 8 - Multi-Cloud and Hybrid Architecture (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Multi-Cloud Strategy: Hybrid and Distributed Architectures',
'multi-cloud-hybrid-architecture',
'video',
7,
55,
'https://www.youtube.com/watch?v=multi-cloud-architecture',
'<h2>Multi-Cloud Design</h2><p>Architect solutions across multiple cloud providers and hybrid environments with proper abstraction layers.</p>',
20,
true,
'Module 2: Advanced Architecture Patterns'
FROM courses WHERE slug = 'cloud-architecture-design';

-- Lesson 9 - Data Architecture and Data Lakes (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Data Architecture: Data Lakes, Warehouses, and Streaming',
'data-architecture-data-lakes',
'text',
8,
'<h2>Data Architecture Design</h2><p>Hands-on lab: Design comprehensive data architectures including data lakes, real-time streaming, and analytics pipelines.</p>',
30,
true,
'Module 2: Advanced Architecture Patterns'
FROM courses WHERE slug = 'cloud-architecture-design';

-- Lesson 10 - Security Architecture and Zero Trust (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Security Architecture: Zero Trust and Defense in Depth',
'security-architecture-zero-trust',
'text',
9,
'<h2>Security by Design</h2><p>Implement security architecture principles including zero trust models and defense in depth strategies.</p>',
15,
true,
'Module 2: Advanced Architecture Patterns'
FROM courses WHERE slug = 'cloud-architecture-design';

-- Lesson 11 - Cost Optimization Architecture (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Cost-Optimized Architecture: FinOps and Resource Efficiency',
'cost-optimization-architecture',
'video',
10,
40,
'https://www.youtube.com/watch?v=cost-optimization',
'<h2>Cost-Efficient Design</h2><p>Design cost-optimized cloud architectures using FinOps principles and resource optimization strategies.</p>',
20,
true,
'Module 2: Advanced Architecture Patterns'
FROM courses WHERE slug = 'cloud-architecture-design';

-- Lesson 12 - Quiz: Architecture Design Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Advanced Cloud Architecture Design',
'quiz-architecture-design-mastery',
'quiz',
11,
'{"instructions": "Test your mastery of advanced cloud architecture design patterns and principles.","questions": [{"question":"Which architecture pattern is best for handling unpredictable workloads with automatic scaling?","options":["Monolithic","Microservices","Serverless","Event-Driven"],"correctAnswer":2,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'cloud-architecture-design';

-- ============================================
-- AWS CLOUD PRACTITIONER - EXPANSION
-- ============================================

-- ================================================
-- MODULE 2: AWS CORE SERVICES (Lessons 9-16)
-- ================================================

-- Lesson 9 - Amazon EC2 Advanced Features (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Amazon EC2: Instance Types, Auto Scaling, and Load Balancing',
'amazon-ec2-advanced-features',
'video',
8,
55,
'https://www.youtube.com/watch?v=aws-ec2-advanced',
'<h2>EC2 Deep Dive</h2><p>Master Amazon EC2 with advanced instance management, auto scaling groups, and Elastic Load Balancing.</p>',
20,
true,
'Module 2: AWS Core Services'
FROM courses WHERE slug = 'aws-cloud-practitioner';

-- Lesson 10 - Amazon S3 and CloudFront (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Amazon S3 Storage and CloudFront CDN Integration',
'amazon-s3-cloudfront',
'text',
9,
'<h2>Storage and Content Delivery</h2><p>Hands-on lab: Configure Amazon S3 storage classes and integrate with CloudFront for global content delivery.</p>',
30,
true,
'Module 2: AWS Core Services'
FROM courses WHERE slug = 'aws-cloud-practitioner';

-- Lesson 11 - Amazon RDS and DynamoDB (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'AWS Database Services: RDS and DynamoDB Comparison',
'amazon-rds-dynamodb',
'text',
10,
'<h2>Database Solutions</h2><p>Compare and choose between Amazon RDS for relational databases and DynamoDB for NoSQL applications.</p>',
15,
true,
'Module 2: AWS Core Services'
FROM courses WHERE slug = 'aws-cloud-practitioner';

-- Lesson 12 - AWS Lambda and Serverless (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'AWS Lambda: Serverless Computing and Event Processing',
'aws-lambda-serverless',
'video',
11,
50,
'https://www.youtube.com/watch?v=aws-lambda',
'<h2>Serverless Applications</h2><p>Build serverless applications using AWS Lambda with event triggers and API Gateway integration.</p>',
20,
true,
'Module 2: AWS Core Services'
FROM courses WHERE slug = 'aws-cloud-practitioner';

-- Lesson 13 - VPC Networking and Security Groups (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Amazon VPC: Network Design and Security Configuration',
'vpc-networking-security-groups',
'text',
12,
'<h2>Network Architecture</h2><p>Hands-on lab: Design Virtual Private Clouds with subnets, route tables, and security group configurations.</p>',
30,
true,
'Module 2: AWS Core Services'
FROM courses WHERE slug = 'aws-cloud-practitioner';

-- Lesson 14 - IAM Security and Access Control (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'AWS IAM: Identity and Access Management Best Practices',
'iam-security-access-control',
'text',
13,
'<h2>Security and Access</h2><p>Implement AWS Identity and Access Management with users, groups, roles, and policy-based access control.</p>',
15,
true,
'Module 2: AWS Core Services'
FROM courses WHERE slug = 'aws-cloud-practitioner';

-- Lesson 15 - CloudWatch Monitoring and CloudTrail (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'AWS Monitoring: CloudWatch and CloudTrail for Operations',
'cloudwatch-monitoring-cloudtrail',
'video',
14,
45,
'https://www.youtube.com/watch?v=aws-monitoring',
'<h2>Operations and Compliance</h2><p>Monitor AWS resources and maintain compliance using CloudWatch metrics and CloudTrail audit logs.</p>',
20,
true,
'Module 2: AWS Core Services'
FROM courses WHERE slug = 'aws-cloud-practitioner';

-- Lesson 16 - Quiz: AWS Core Services Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: AWS Cloud Practitioner Core Services',
'quiz-aws-core-services-mastery',
'quiz',
15,
'{"instructions": "Test your knowledge of AWS core services and cloud practitioner concepts.","questions": [{"question":"Which AWS service provides serverless compute capabilities?","options":["Amazon EC2","Amazon ECS","AWS Lambda","AWS Batch"],"correctAnswer":2,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'aws-cloud-practitioner';