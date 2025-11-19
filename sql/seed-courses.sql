    -- ============================================
    -- Seed Data: Courses
    -- ============================================
    -- This file populates the courses table with initial course data
    -- based on the courses visible in your learn.html page

    -- Insert courses
    INSERT INTO courses (slug, title, description, short_description, category, difficulty, duration_hours, thumbnail_url, is_published, is_featured, learning_objectives) VALUES

    -- AI Courses
    ('python-foundation-ai', 'Python Foundation for AI',
    'Master Python programming fundamentals with a specific focus on artificial intelligence applications. Learn data structures, algorithms, and Python libraries essential for AI development.',
    'Learn Python programming fundamentals for AI applications',
    'AI', 'Beginner', 40, '/images/courses/python-ai.png', true, true,
    ARRAY['Understand Python syntax and data structures', 'Work with NumPy and Pandas', 'Implement basic algorithms', 'Prepare for AI/ML development']),

    ('machine-learning-basics', 'Machine Learning Basics',
    'Introduction to machine learning concepts, algorithms, and practical applications. Learn supervised and unsupervised learning, model training, and evaluation techniques.',
    'Introduction to machine learning concepts and algorithms',
    'AI', 'Intermediate', 60, '/images/courses/ml-basics.png', true, true,
    ARRAY['Understand ML fundamentals', 'Implement common algorithms', 'Train and evaluate models', 'Work with real datasets']),

    ('deep-learning-neural-networks', 'Deep Learning & Neural Networks',
    'Dive deep into neural networks, deep learning architectures, and modern AI frameworks. Build and train neural networks for various applications.',
    'Master neural networks and deep learning techniques',
    'AI', 'Advanced', 80, '/images/courses/deep-learning.png', true, false,
    ARRAY['Build neural networks from scratch', 'Use TensorFlow and PyTorch', 'Understand backpropagation', 'Implement CNNs and RNNs']),

    ('natural-language-processing', 'Natural Language Processing',
    'Learn how to process, analyze, and generate human language using modern NLP techniques and transformer models.',
    'Process and analyze human language with AI',
    'AI', 'Advanced', 70, '/images/courses/nlp.png', true, false,
    ARRAY['Text preprocessing and tokenization', 'Word embeddings and transformers', 'Sentiment analysis', 'Build chatbots and language models']),

    -- Cloud Courses
    ('aws-cloud-practitioner', 'AWS Cloud Practitioner',
    'Comprehensive preparation for the AWS Certified Cloud Practitioner exam. Learn AWS services, architecture, pricing, and security fundamentals.',
    'Prepare for AWS Cloud Practitioner certification',
    'Cloud', 'Beginner', 30, '/images/courses/aws-ccp.png', true, true,
    ARRAY['Understand cloud computing concepts', 'Navigate AWS services', 'Learn AWS pricing models', 'Prepare for certification exam']),

    ('azure-fundamentals', 'Microsoft Azure Fundamentals',
    'Introduction to Microsoft Azure cloud services, management tools, and cloud concepts. Perfect for beginners in cloud computing.',
    'Get started with Microsoft Azure cloud services',
    'Cloud', 'Beginner', 25, '/images/courses/azure-fund.png', true, false,
    ARRAY['Core Azure services', 'Azure pricing and support', 'Cloud concepts', 'Prepare for AZ-900 exam']),

    ('google-cloud-essentials', 'Google Cloud Platform Essentials',
    'Learn Google Cloud Platform services, tools, and best practices. Hands-on experience with GCP infrastructure and services.',
    'Master Google Cloud Platform fundamentals',
    'Cloud', 'Beginner', 28, '/images/courses/gcp-essentials.png', true, false,
    ARRAY['GCP compute and storage', 'Networking in GCP', 'Identity and security', 'Deploy applications on GCP']),

    ('kubernetes-docker', 'Kubernetes & Docker Mastery',
    'Master container orchestration with Kubernetes and containerization with Docker. Deploy and manage scalable applications.',
    'Container orchestration with Kubernetes and Docker',
    'Cloud', 'Intermediate', 50, '/images/courses/k8s-docker.png', true, true,
    ARRAY['Docker fundamentals', 'Kubernetes architecture', 'Deploy microservices', 'Container security']),

    ('cloud-architecture-design', 'Cloud Architecture & Design',
    'Learn to design robust, scalable, and secure cloud architectures across AWS, Azure, and GCP platforms.',
    'Design scalable and secure cloud architectures',
    'Cloud', 'Advanced', 65, '/images/courses/cloud-arch.png', true, false,
    ARRAY['Cloud design patterns', 'High availability and disaster recovery', 'Cost optimization', 'Multi-cloud strategies']),

    -- Cybersecurity Courses
    ('cybersecurity-fundamentals', 'Cybersecurity Fundamentals',
    'Essential cybersecurity concepts, threats, and best practices. Learn to protect systems, networks, and data from cyber attacks.',
    'Essential cybersecurity concepts and best practices',
    'Cybersecurity', 'Beginner', 35, '/images/courses/cyber-fund.png', true, true,
    ARRAY['Security principles', 'Common threats and vulnerabilities', 'Network security basics', 'Security best practices']),

    ('ethical-hacking-101', 'Ethical Hacking 101',
    'Learn ethical hacking techniques, penetration testing methodologies, and how to identify and exploit vulnerabilities responsibly.',
    'Learn ethical hacking and penetration testing',
    'Cybersecurity', 'Intermediate', 50, '/images/courses/ethical-hack.png', true, true,
    ARRAY['Reconnaissance and scanning', 'Exploitation techniques', 'Post-exploitation', 'Report writing']),

    ('network-security', 'Network Security & Defense',
    'Comprehensive coverage of network security concepts, protocols, firewalls, IDS/IPS, and defense strategies.',
    'Protect networks from cyber threats',
    'Cybersecurity', 'Intermediate', 45, '/images/courses/network-sec.png', true, false,
    ARRAY['Network protocols and security', 'Firewall configuration', 'Intrusion detection', 'VPN and encryption']);

    -- Update course count for published courses
    UPDATE courses SET enrolled_count = FLOOR(RANDOM() * 5000 + 100) WHERE is_published = true;
    UPDATE courses SET completion_count = FLOOR(enrolled_count * 0.3) WHERE is_published = true;
    UPDATE courses SET average_rating = ROUND((RANDOM() * 1.5 + 3.5)::numeric, 2) WHERE is_published = true;

    -- Verify insertion
    SELECT slug, title, category, difficulty, is_published FROM courses ORDER BY category, difficulty;
