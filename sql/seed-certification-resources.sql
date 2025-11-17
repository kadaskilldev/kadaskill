-- ============================================
-- Seed Data: Add Study Resources to Certifications
-- ============================================
-- Updates certifications with study resources to demonstrate the full certification detail page

-- Update AWS Solutions Architect with comprehensive study resources
UPDATE certifications
SET study_resources = '[
  {
    "type": "documentation",
    "title": "AWS Solutions Architect Exam Guide",
    "url": "https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf",
    "description": "Official exam guide from AWS with detailed content outline"
  },
  {
    "type": "documentation",
    "title": "AWS Well-Architected Framework",
    "url": "https://aws.amazon.com/architecture/well-architected/",
    "description": "Best practices for building secure, high-performing, resilient infrastructure"
  },
  {
    "type": "course",
    "title": "AWS Solutions Architect Associate - A Cloud Guru",
    "url": "https://acloudguru.com/course/aws-certified-solutions-architect-associate-saa-c03",
    "description": "Comprehensive video course covering all exam topics"
  },
  {
    "type": "course",
    "title": "Ultimate AWS Solutions Architect Associate - Udemy",
    "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/",
    "description": "In-depth course with hands-on labs and practice exams"
  },
  {
    "type": "lab",
    "title": "AWS Hands-On Labs",
    "url": "https://aws.amazon.com/training/digital/",
    "description": "Free hands-on tutorials and labs from AWS"
  },
  {
    "type": "practice",
    "title": "AWS Practice Exam",
    "url": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/13266/aws-certified-solutions-architect-associate-official-practice-question-set-saa-c03-english",
    "description": "Official practice questions from AWS"
  },
  {
    "type": "practice",
    "title": "Whizlabs Practice Tests",
    "url": "https://www.whizlabs.com/aws-solutions-architect-associate/",
    "description": "Multiple full-length practice exams with detailed explanations"
  },
  {
    "type": "book",
    "title": "AWS Certified Solutions Architect Study Guide",
    "url": "https://www.amazon.com/Certified-Solutions-Architect-Study-Guide/dp/1119982626",
    "description": "Comprehensive study guide by Ben Piper and David Clinton"
  }
]'::jsonb
WHERE slug = 'aws-certified-solutions-architect';

-- Update CompTIA Security+ with study resources
UPDATE certifications
SET study_resources = '[
  {
    "type": "documentation",
    "title": "CompTIA Security+ Exam Objectives",
    "url": "https://www.comptia.org/training/resources/exam-objectives",
    "description": "Official exam objectives and content outline"
  },
  {
    "type": "course",
    "title": "CompTIA Security+ (SY0-701) - Professor Messer",
    "url": "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/",
    "description": "Free comprehensive video training course"
  },
  {
    "type": "course",
    "title": "CompTIA Security+ Certification Course - Udemy",
    "url": "https://www.udemy.com/course/securityplus/",
    "description": "Complete course with labs and practice tests"
  },
  {
    "type": "lab",
    "title": "TryHackMe Security+ Learning Path",
    "url": "https://tryhackme.com/path/outline/security",
    "description": "Hands-on cybersecurity labs aligned with Security+ objectives"
  },
  {
    "type": "practice",
    "title": "CompTIA Security+ Practice Exams - ExamCompass",
    "url": "https://www.examcompass.com/comptia/security-plus-certification/free-security-plus-practice-tests",
    "description": "Free practice questions and exams"
  },
  {
    "type": "book",
    "title": "CompTIA Security+ Study Guide (SY0-701)",
    "url": "https://www.amazon.com/CompTIA-Security-Study-Guide-SY0-701/dp/1394212054",
    "description": "Official CompTIA study guide with practice questions"
  }
]'::jsonb
WHERE slug = 'comptia-security-plus';

-- Update TensorFlow Certificate with study resources
UPDATE certifications
SET study_resources = '[
  {
    "type": "documentation",
    "title": "TensorFlow Certificate Handbook",
    "url": "https://www.tensorflow.org/certificate",
    "description": "Official candidate handbook with exam details and requirements"
  },
  {
    "type": "course",
    "title": "DeepLearning.AI TensorFlow Developer Certificate",
    "url": "https://www.coursera.org/professional-certificates/tensorflow-in-practice",
    "description": "Official preparation course by Andrew Ng on Coursera"
  },
  {
    "type": "course",
    "title": "Complete TensorFlow 2 and Keras Deep Learning Bootcamp",
    "url": "https://www.udemy.com/course/complete-tensorflow-2-and-keras-deep-learning-bootcamp/",
    "description": "Hands-on course covering all TensorFlow certification topics"
  },
  {
    "type": "lab",
    "title": "TensorFlow Tutorials",
    "url": "https://www.tensorflow.org/tutorials",
    "description": "Official hands-on tutorials from TensorFlow"
  },
  {
    "type": "lab",
    "title": "Kaggle TensorFlow Competitions",
    "url": "https://www.kaggle.com/competitions",
    "description": "Real-world practice with machine learning competitions"
  },
  {
    "type": "book",
    "title": "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
    "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
    "description": "Comprehensive guide to machine learning with TensorFlow"
  }
]'::jsonb
WHERE slug = 'tensorflow-certificate';

-- Verify updates
SELECT slug, title,
       CASE
         WHEN study_resources IS NOT NULL THEN 'Has Resources'
         ELSE 'No Resources'
       END as resource_status
FROM certifications
ORDER BY category, title;
