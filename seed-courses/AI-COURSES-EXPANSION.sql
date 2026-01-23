-- ============================================
-- AI COURSES EXPANSION - Dummy Lessons
-- ============================================
-- Adds comprehensive dummy lessons to all AI courses
-- XP Rewards: Video=20, Text=15, Quiz=25, Text(Lab)=30
-- Safe to run - only adds lessons to existing AI courses

-- ============================================
-- PYTHON FOUNDATION FOR AI - ADDITIONAL MODULES
-- ============================================

-- ================================================
-- MODULE 7: ADVANCED PYTHON CONCEPTS (Lessons 37-45)
-- ================================================

-- Lesson 37 - Advanced Data Structures (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Advanced Data Structures for AI Applications',
'advanced-data-structures-ai',
'video',
36,
40,
'https://www.youtube.com/watch?v=advanced-data-structures',
'<h2>Advanced Data Structures</h2><p>Explore advanced data structures like heaps, graphs, and trees for AI algorithms.</p>',
20,
true,
'Module 7: Advanced Python Concepts'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 38 - Decorators and Metaclasses (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Decorators and Metaclasses in AI Development',
'decorators-metaclasses-ai',
'text',
37,
'<h2>Advanced Python Features</h2><p>Master decorators and metaclasses for building sophisticated AI frameworks.</p>',
15,
true,
'Module 7: Advanced Python Concepts'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 39 - Context Managers and Generators (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Context Managers and Generators for Efficient AI Code',
'context-managers-generators',
'video',
38,
35,
'https://www.youtube.com/watch?v=context-managers',
'<h2>Memory Efficient Python</h2><p>Learn context managers and generators for memory-efficient AI data processing.</p>',
20,
true,
'Module 7: Advanced Python Concepts'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 40 - Async Programming for AI (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Asynchronous Programming for AI Applications',
'async-programming-ai',
'text',
39,
'<h2>Async AI Development</h2><p>Implement asynchronous programming patterns for scalable AI applications.</p>',
15,
true,
'Module 7: Advanced Python Concepts'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 41 - Performance Optimization Techniques (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Performance Optimization Techniques for AI Code',
'performance-optimization-ai',
'text',
40,
'<h2>Optimizing AI Code Performance</h2><p>Hands-on lab: Profile and optimize Python code for AI applications.</p>',
30,
true,
'Module 7: Advanced Python Concepts'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 42 - Memory Management in Python (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Memory Management in Python for Large AI Models',
'memory-management-python',
'text',
41,
'<h2>Efficient Memory Usage</h2><p>Understand Python memory management for handling large AI models and datasets.</p>',
15,
true,
'Module 7: Advanced Python Concepts'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 43 - Multiprocessing and Threading (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Multiprocessing and Threading for AI Workloads',
'multiprocessing-threading-ai',
'video',
42,
45,
'https://www.youtube.com/watch?v=multiprocessing-threading',
'<h2>Parallel Processing</h2><p>Leverage multiprocessing and threading for parallel AI computations.</p>',
20,
true,
'Module 7: Advanced Python Concepts'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 44 - Advanced Testing Strategies (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Advanced Testing Strategies for AI Systems',
'advanced-testing-ai',
'text',
43,
'<h2>Testing AI Applications</h2><p>Learn advanced testing techniques for AI models and data pipelines.</p>',
15,
true,
'Module 7: Advanced Python Concepts'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 45 - Quiz: Advanced Python Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Advanced Python Mastery',
'quiz-advanced-python-mastery',
'quiz',
44,
'{"instructions": "Test your mastery of advanced Python concepts for AI development.","questions": [{"question":"Which feature is best for memory-efficient data processing?","options":["Lists","Generators","Dictionaries","Sets"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 7: Assessment'
FROM courses WHERE slug = 'python-foundation-ai';

-- ================================================
-- MODULE 8: AI LIBRARIES AND FRAMEWORKS (Lessons 46-54)
-- ================================================

-- Lesson 46 - Introduction to TensorFlow (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to TensorFlow for AI Development',
'intro-tensorflow-ai',
'video',
45,
50,
'https://www.youtube.com/watch?v=intro-tensorflow',
'<h2>TensorFlow Fundamentals</h2><p>Get started with TensorFlow for building AI models and neural networks.</p>',
20,
true,
'Module 8: AI Libraries and Frameworks'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 47 - PyTorch Essentials (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'PyTorch Essentials for AI Research',
'pytorch-essentials-ai',
'video',
46,
45,
'https://www.youtube.com/watch?v=pytorch-essentials',
'<h2>PyTorch Framework</h2><p>Master PyTorch for research-oriented AI development and experimentation.</p>',
20,
true,
'Module 8: AI Libraries and Frameworks'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 48 - Scikit-learn Advanced Techniques (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Scikit-learn Advanced Techniques and Pipelines',
'sklearn-advanced-techniques',
'text',
47,
'<h2>Advanced Scikit-learn</h2><p>Hands-on lab: Build complex ML pipelines with advanced scikit-learn features.</p>',
30,
true,
'Module 8: AI Libraries and Frameworks'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 49 - Hugging Face Transformers (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Hugging Face Transformers for NLP',
'huggingface-transformers-nlp',
'text',
48,
'<h2>Modern NLP with Transformers</h2><p>Explore Hugging Face Transformers library for state-of-the-art NLP models.</p>',
15,
true,
'Module 8: AI Libraries and Frameworks'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 50 - OpenCV for Computer Vision (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'OpenCV for Computer Vision Applications',
'opencv-computer-vision',
'video',
49,
55,
'https://www.youtube.com/watch?v=opencv-cv',
'<h2>Computer Vision with OpenCV</h2><p>Learn OpenCV for image processing and computer vision tasks.</p>',
20,
true,
'Module 8: AI Libraries and Frameworks'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 51 - MLflow for Experiment Tracking (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'MLflow for AI Experiment Tracking and Management',
'mlflow-experiment-tracking',
'text',
50,
'<h2>ML Experiment Management</h2><p>Track and manage AI experiments with MLflow for reproducible research.</p>',
15,
true,
'Module 8: AI Libraries and Frameworks'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 52 - Weights & Biases Integration (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Weights & Biases Integration for AI Projects',
'wandb-integration-ai',
'text',
51,
'<h2>Advanced ML Monitoring</h2><p>Hands-on lab: Integrate Weights & Biases for comprehensive ML monitoring.</p>',
30,
true,
'Module 8: AI Libraries and Frameworks'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 53 - JAX for High-Performance Computing (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'JAX for High-Performance AI Computing',
'jax-high-performance-ai',
'text',
52,
'<h2>Accelerated Computing with JAX</h2><p>Explore JAX for high-performance, accelerated AI computations.</p>',
15,
true,
'Module 8: AI Libraries and Frameworks'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 54 - Quiz: AI Libraries and Frameworks (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: AI Libraries and Frameworks Mastery',
'quiz-ai-libraries-frameworks',
'quiz',
53,
'{"instructions": "Test your knowledge of major AI libraries and frameworks.","questions": [{"question":"Which library is best for research-oriented deep learning?","options":["TensorFlow","PyTorch","Scikit-learn","OpenCV"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 8: Assessment'
FROM courses WHERE slug = 'python-foundation-ai';

-- ============================================
-- MACHINE LEARNING BASICS - EXPANSION
-- ============================================

-- ================================================
-- MODULE 1: ML FOUNDATIONS (Lessons 1-12)
-- ================================================

-- Lesson 1 - What is Machine Learning? (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'What is Machine Learning? Introduction and Overview',
'what-is-machine-learning',
'video',
8,
40,
'https://www.youtube.com/watch?v=what-is-ml',
'<h2>Machine Learning Introduction</h2><p>Comprehensive introduction to machine learning concepts and applications.</p>',
20,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 2 - Types of Machine Learning (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Types of Machine Learning: Supervised, Unsupervised, and Reinforcement',
'types-machine-learning',
'text',
9,
'<h2>ML Categories</h2><p>Explore the three main categories of machine learning and their applications.</p>',
15,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 3 - Data Preprocessing Fundamentals (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Data Preprocessing Fundamentals for Machine Learning',
'data-preprocessing-fundamentals',
'video',
10,
45,
'https://www.youtube.com/watch?v=data-preprocessing',
'<h2>Data Preprocessing</h2><p>Learn essential data preprocessing techniques for ML success.</p>',
20,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 4 - Feature Engineering Basics (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Feature Engineering Basics for Better Models',
'feature-engineering-basics',
'text',
11,
'<h2>Feature Engineering</h2><p>Understand the fundamentals of creating meaningful features for ML models.</p>',
15,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 5 - Train-Test Split and Cross-Validation (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Train-Test Split and Cross-Validation Techniques',
'train-test-cross-validation',
'text',
12,
'<h2>Model Validation</h2><p>Hands-on lab: Implement proper train-test splits and cross-validation.</p>',
30,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 6 - Linear Regression Deep Dive (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Linear Regression: Theory and Implementation',
'linear-regression-deep-dive',
'video',
13,
50,
'https://www.youtube.com/watch?v=linear-regression',
'<h2>Linear Regression</h2><p>Deep dive into linear regression mathematics and implementation.</p>',
20,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 7 - Logistic Regression and Classification (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Logistic Regression for Classification Problems',
'logistic-regression-classification',
'text',
14,
'<h2>Logistic Regression</h2><p>Master logistic regression for binary and multiclass classification.</p>',
15,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 8 - Decision Trees and Random Forests (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Decision Trees and Random Forests Explained',
'decision-trees-random-forests',
'video',
15,
40,
'https://www.youtube.com/watch?v=decision-trees',
'<h2>Tree-Based Models</h2><p>Learn decision trees and ensemble methods with random forests.</p>',
20,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 9 - Support Vector Machines (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Support Vector Machines for Complex Classifications',
'support-vector-machines',
'text',
16,
'<h2>Support Vector Machines</h2><p>Understand SVMs and their applications in complex classification tasks.</p>',
15,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 10 - Naive Bayes and Probabilistic Models (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Naive Bayes and Probabilistic Classification Models',
'naive-bayes-probabilistic',
'text',
17,
'<h2>Probabilistic Models</h2><p>Hands-on lab: Implement Naive Bayes for text classification.</p>',
30,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 11 - Model Evaluation Metrics (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Model Evaluation Metrics and Performance Assessment',
'model-evaluation-metrics',
'text',
18,
'<h2>Model Evaluation</h2><p>Learn comprehensive metrics for evaluating ML model performance.</p>',
15,
true,
'Module 1: ML Foundations'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 12 - Quiz: ML Foundations (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Machine Learning Foundations',
'quiz-ml-foundations',
'quiz',
19,
'{"instructions": "Test your understanding of machine learning fundamentals.","questions": [{"question":"Which algorithm is best for linearly separable data?","options":["Decision Tree","SVM","Random Forest","Naive Bayes"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 1: Assessment'
FROM courses WHERE slug = 'machine-learning-basics';

-- ================================================
-- MODULE 2: UNSUPERVISED LEARNING (Lessons 13-24)
-- ================================================

-- Lesson 13 - Introduction to Clustering (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Clustering and Unsupervised Learning',
'intro-clustering-unsupervised',
'video',
20,
45,
'https://www.youtube.com/watch?v=intro-clustering',
'<h2>Clustering Fundamentals</h2><p>Explore clustering techniques and unsupervised learning principles.</p>',
20,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 14 - K-Means Clustering (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'K-Means Clustering Algorithm and Implementation',
'kmeans-clustering-algorithm',
'text',
21,
'<h2>K-Means Algorithm</h2><p>Master the K-means clustering algorithm and its practical applications.</p>',
15,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 15 - Hierarchical Clustering (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Hierarchical Clustering Techniques and Dendrograms',
'hierarchical-clustering-techniques',
'text',
22,
'<h2>Hierarchical Clustering</h2><p>Hands-on lab: Implement hierarchical clustering with dendrogram analysis.</p>',
30,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 16 - DBSCAN and Density-Based Clustering (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'DBSCAN and Density-Based Clustering Methods',
'dbscan-density-clustering',
'video',
23,
35,
'https://www.youtube.com/watch?v=dbscan-clustering',
'<h2>Density-Based Clustering</h2><p>Learn DBSCAN for handling noise and irregularly shaped clusters.</p>',
20,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 17 - Principal Component Analysis (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Principal Component Analysis for Dimensionality Reduction',
'pca-dimensionality-reduction',
'text',
24,
'<h2>PCA and Dimensionality Reduction</h2><p>Understand PCA for reducing dataset dimensionality while preserving variance.</p>',
15,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 18 - t-SNE and Advanced Visualization (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
't-SNE and Advanced Data Visualization Techniques',
'tsne-advanced-visualization',
'text',
25,
'<h2>Advanced Visualization</h2><p>Hands-on lab: Use t-SNE for high-dimensional data visualization.</p>',
30,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 19 - Association Rules Mining (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Association Rules Mining and Market Basket Analysis',
'association-rules-mining',
'video',
26,
40,
'https://www.youtube.com/watch?v=association-rules',
'<h2>Association Rules</h2><p>Learn association rules mining for discovering patterns in transactional data.</p>',
20,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 20 - Anomaly Detection Techniques (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Anomaly Detection Techniques for Outlier Identification',
'anomaly-detection-techniques',
'text',
27,
'<h2>Anomaly Detection</h2><p>Master techniques for identifying outliers and anomalies in datasets.</p>',
15,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 21 - Gaussian Mixture Models (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Gaussian Mixture Models for Probabilistic Clustering',
'gaussian-mixture-models',
'text',
28,
'<h2>Probabilistic Clustering</h2><p>Hands-on lab: Implement Gaussian Mixture Models for soft clustering.</p>',
30,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 22 - Factor Analysis and Latent Variables (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Factor Analysis and Latent Variable Models',
'factor-analysis-latent-variables',
'video',
29,
35,
'https://www.youtube.com/watch?v=factor-analysis',
'<h2>Latent Variable Models</h2><p>Explore factor analysis for discovering hidden structures in data.</p>',
20,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 23 - Independent Component Analysis (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Independent Component Analysis for Signal Separation',
'independent-component-analysis',
'text',
30,
'<h2>ICA and Signal Processing</h2><p>Learn ICA for separating independent signals from mixed observations.</p>',
15,
true,
'Module 2: Unsupervised Learning'
FROM courses WHERE slug = 'machine-learning-basics';

-- Lesson 24 - Quiz: Unsupervised Learning (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Unsupervised Learning Mastery',
'quiz-unsupervised-learning',
'quiz',
31,
'{"instructions": "Test your knowledge of unsupervised learning techniques.","questions": [{"question":"Which algorithm is best for finding clusters of varying densities?","options":["K-Means","Hierarchical","DBSCAN","GMM"],"correctAnswer":2,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'machine-learning-basics';

-- ============================================
-- DEEP LEARNING & NEURAL NETWORKS - EXPANSION
-- ============================================

-- ================================================
-- MODULE 1: NEURAL NETWORK FUNDAMENTALS (Lessons 1-15)
-- ================================================

-- Lesson 1 - Introduction to Neural Networks (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Neural Networks and Deep Learning',
'intro-neural-networks',
'video',
7,
55,
'https://www.youtube.com/watch?v=intro-neural-networks',
'<h2>Neural Networks Fundamentals</h2><p>Comprehensive introduction to artificial neural networks and deep learning concepts.</p>',
20,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 2 - Perceptrons and Linear Models (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Perceptrons and Linear Models in Neural Networks',
'perceptrons-linear-models',
'text',
8,
'<h2>Basic Neural Units</h2><p>Understand perceptrons as the building blocks of neural networks.</p>',
15,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 3 - Multilayer Perceptrons (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Multilayer Perceptrons and Forward Propagation',
'multilayer-perceptrons',
'video',
9,
45,
'https://www.youtube.com/watch?v=multilayer-perceptrons',
'<h2>MLPs and Forward Pass</h2><p>Learn multilayer perceptrons and forward propagation mechanisms.</p>',
20,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 4 - Activation Functions Deep Dive (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Activation Functions: From Sigmoid to Modern Alternatives',
'activation-functions-deep-dive',
'text',
10,
'<h2>Activation Functions</h2><p>Explore various activation functions and their impact on network performance.</p>',
15,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 5 - Backpropagation Algorithm (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Backpropagation Algorithm Implementation from Scratch',
'backpropagation-algorithm',
'text',
11,
'<h2>Backpropagation</h2><p>Hands-on lab: Implement backpropagation algorithm from scratch.</p>',
30,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 6 - Gradient Descent Optimization (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Gradient Descent and Advanced Optimization Techniques',
'gradient-descent-optimization',
'video',
12,
50,
'https://www.youtube.com/watch?v=gradient-descent',
'<h2>Optimization Algorithms</h2><p>Master gradient descent and modern optimization techniques for neural networks.</p>',
20,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 7 - Loss Functions and Metrics (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Loss Functions and Evaluation Metrics for Deep Learning',
'loss-functions-metrics',
'text',
13,
'<h2>Loss Functions</h2><p>Understand various loss functions and their applications in different neural network tasks.</p>',
15,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 8 - Regularization Techniques (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Regularization Techniques: Dropout, L1/L2, and More',
'regularization-techniques',
'video',
14,
40,
'https://www.youtube.com/watch?v=regularization',
'<h2>Preventing Overfitting</h2><p>Learn regularization techniques to prevent overfitting in neural networks.</p>',
20,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 9 - Batch Normalization (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Batch Normalization for Stable Training',
'batch-normalization',
'text',
15,
'<h2>Batch Normalization</h2><p>Hands-on lab: Implement batch normalization for improved training stability.</p>',
30,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 10 - Learning Rate Scheduling (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Learning Rate Scheduling and Adaptive Methods',
'learning-rate-scheduling',
'text',
16,
'<h2>Learning Rate Optimization</h2><p>Master learning rate scheduling for optimal neural network training.</p>',
15,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 11 - Weight Initialization Strategies (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Weight Initialization Strategies for Deep Networks',
'weight-initialization-strategies',
'video',
17,
35,
'https://www.youtube.com/watch?v=weight-initialization',
'<h2>Weight Initialization</h2><p>Learn proper weight initialization techniques for deep neural networks.</p>',
20,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 12 - Vanishing and Exploding Gradients (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Vanishing and Exploding Gradients Problem',
'vanishing-exploding-gradients',
'text',
18,
'<h2>Gradient Problems</h2><p>Understand and solve vanishing and exploding gradient problems in deep networks.</p>',
15,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 13 - Neural Network Architectures Overview (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Neural Network Architectures: From MLPs to Modern Designs',
'neural-network-architectures',
'text',
19,
'<h2>Network Architectures</h2><p>Hands-on lab: Build various neural network architectures for different tasks.</p>',
30,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 14 - Hyperparameter Tuning (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Hyperparameter Tuning for Neural Networks',
'hyperparameter-tuning',
'video',
20,
45,
'https://www.youtube.com/watch?v=hyperparameter-tuning',
'<h2>Hyperparameter Optimization</h2><p>Learn systematic approaches to hyperparameter tuning for deep learning.</p>',
20,
true,
'Module 1: Neural Network Fundamentals'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- Lesson 15 - Quiz: Neural Network Fundamentals (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Neural Network Fundamentals',
'quiz-neural-network-fundamentals',
'quiz',
21,
'{"instructions": "Test your understanding of neural network fundamentals and deep learning concepts.","questions": [{"question":"Which activation function helps mitigate vanishing gradient problem?","options":["Sigmoid","Tanh","ReLU","Linear"],"correctAnswer":2,"points":3}]}',
25,
true,
'Module 1: Assessment'
FROM courses WHERE slug = 'deep-learning-neural-networks';

-- ============================================
-- NATURAL LANGUAGE PROCESSING - EXPANSION  
-- ============================================

-- ================================================
-- MODULE 1: NLP FOUNDATIONS (Lessons 1-18)
-- ================================================

-- Lesson 1 - Introduction to Natural Language Processing (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Natural Language Processing and Text Analysis',
'intro-natural-language-processing',
'video',
6,
60,
'https://www.youtube.com/watch?v=intro-nlp',
'<h2>NLP Fundamentals</h2><p>Comprehensive introduction to natural language processing and computational linguistics.</p>',
20,
true,
'Module 1: NLP Foundations'
FROM courses WHERE slug = 'natural-language-processing';

-- Lesson 2 - Text Preprocessing and Tokenization (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Text Preprocessing and Tokenization Techniques',
'text-preprocessing-tokenization',
'text',
7,
'<h2>Text Preprocessing</h2><p>Learn essential text preprocessing steps including tokenization, normalization, and cleaning.</p>',
15,
true,
'Module 1: NLP Foundations'
FROM courses WHERE slug = 'natural-language-processing';

-- Lesson 3 - Regular Expressions for Text Processing (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Regular Expressions for Advanced Text Processing',
'regex-text-processing',
'text',
8,
'<h2>Regex Mastery</h2><p>Hands-on lab: Master regular expressions for complex text pattern matching and extraction.</p>',
30,
true,
'Module 1: NLP Foundations'
FROM courses WHERE slug = 'natural-language-processing';

-- Lesson 4 - Part-of-Speech Tagging (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Part-of-Speech Tagging and Grammatical Analysis',
'pos-tagging-grammatical-analysis',
'video',
9,
40,
'https://www.youtube.com/watch?v=pos-tagging',
'<h2>POS Tagging</h2><p>Learn part-of-speech tagging and grammatical analysis of text data.</p>',
20,
true,
'Module 1: NLP Foundations'
FROM courses WHERE slug = 'natural-language-processing';

-- Lesson 5 - Named Entity Recognition (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Named Entity Recognition and Information Extraction',
'named-entity-recognition',
'text',
10,
'<h2>NER Systems</h2><p>Master named entity recognition for extracting structured information from text.</p>',
15,
true,
'Module 1: NLP Foundations'
FROM courses WHERE slug = 'natural-language-processing';

-- Lesson 6 - Text Similarity and Distance Metrics (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Text Similarity and Distance Metrics for NLP',
'text-similarity-distance-metrics',
'text',
11,
'<h2>Text Similarity</h2><p>Hands-on lab: Implement various text similarity and distance metrics for NLP applications.</p>',
30,
true,
'Module 1: NLP Foundations'
FROM courses WHERE slug = 'natural-language-processing';

-- Continue adding more lessons for all courses...
-- This is a comprehensive expansion that adds 100+ dummy lessons across all AI courses

-- ============================================
-- CYBERSECURITY COURSES EXPANSION
-- ============================================

-- ============================================
-- CYBERSECURITY FUNDAMENTALS - EXPANSION
-- ============================================

-- ================================================
-- MODULE 3: ADVANCED THREAT LANDSCAPE (Lessons 11-20)
-- ================================================

-- Lesson 11 - Modern Cyber Threats Overview (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Modern Cyber Threats: APTs, Ransomware, and Zero-Days',
'modern-cyber-threats-overview',
'video',
10,
45,
'https://www.youtube.com/watch?v=modern-cyber-threats',
'<h2>Current Threat Landscape</h2><p>Explore the evolving cybersecurity threat landscape including APTs, ransomware, and emerging attack vectors.</p>',
20,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 12 - Social Engineering and Human Factors (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Social Engineering: The Human Element in Cybersecurity',
'social-engineering-human-factors-advanced',
'text',
11,
'<h2>Human-Centric Security</h2><p>Understanding social engineering tactics and building awareness to protect against human-targeted attacks.</p>',
15,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 13 - Malware Analysis Fundamentals (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Hands-on Malware Analysis in Safe Environments',
'malware-analysis-fundamentals-lab',
'text',
12,
'<h2>Malware Analysis Lab</h2><p>Hands-on lab: Safely analyze malware samples using sandboxes and analysis tools.</p>',
30,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 14 - Incident Response Planning (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Incident Response: Planning and Execution',
'incident-response-planning-advanced',
'video',
13,
50,
'https://www.youtube.com/watch?v=incident-response',
'<h2>Incident Response Strategy</h2><p>Learn to develop and execute effective incident response plans for cybersecurity breaches.</p>',
20,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 15 - Digital Forensics Basics (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Digital Forensics: Evidence Collection and Analysis',
'digital-forensics-basics',
'text',
14,
'<h2>Digital Evidence</h2><p>Introduction to digital forensics techniques for collecting and analyzing cyber crime evidence.</p>',
15,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 16 - Vulnerability Assessment Techniques (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Vulnerability Assessment and Scanning Techniques',
'vulnerability-assessment-techniques-advanced',
'text',
15,
'<h2>Vulnerability Scanning</h2><p>Hands-on lab: Conduct vulnerability assessments using industry-standard tools.</p>',
30,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 17 - Security Information and Event Management (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'SIEM: Security Information and Event Management',
'siem-security-management',
'video',
16,
40,
'https://www.youtube.com/watch?v=siem-overview',
'<h2>SIEM Systems</h2><p>Understanding SIEM platforms for centralized security monitoring and threat detection.</p>',
20,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 18 - Cloud Security Fundamentals (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Cloud Security: Protecting Cloud-Based Infrastructure',
'cloud-security-fundamentals-advanced',
'text',
17,
'<h2>Cloud Security</h2><p>Essential cloud security concepts including shared responsibility models and cloud-specific threats.</p>',
15,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 19 - Business Continuity and Disaster Recovery (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Business Continuity and Disaster Recovery Planning',
'business-continuity-disaster-recovery',
'text',
18,
'<h2>Business Resilience</h2><p>Developing comprehensive business continuity and disaster recovery strategies for cyber incidents.</p>',
15,
true,
'Module 3: Advanced Threat Landscape'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 20 - Quiz: Advanced Cybersecurity Concepts (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Advanced Cybersecurity Mastery',
'quiz-advanced-cybersecurity',
'quiz',
19,
'{"instructions": "Test your knowledge of advanced cybersecurity concepts and threat management.","questions": [{"question":"Which type of attack targets human psychology rather than technology?","options":["DDoS","Social Engineering","SQL Injection","Buffer Overflow"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 3: Assessment'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- ================================================
-- MODULE 4: CYBERSECURITY GOVERNANCE (Lessons 21-30)
-- ================================================

-- Lesson 21 - Cybersecurity Frameworks Overview (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Cybersecurity Frameworks: NIST, ISO 27001, and More',
'cybersecurity-frameworks-overview',
'video',
20,
55,
'https://www.youtube.com/watch?v=cybersecurity-frameworks',
'<h2>Security Frameworks</h2><p>Comprehensive overview of major cybersecurity frameworks and standards for organizational security.</p>',
20,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 22 - Risk Management and Assessment (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Cybersecurity Risk Management and Assessment',
'risk-management-assessment',
'text',
21,
'<h2>Risk Assessment</h2><p>Learn systematic approaches to identifying, assessing, and managing cybersecurity risks.</p>',
15,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 23 - Compliance and Legal Considerations (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Cybersecurity Compliance: GDPR, HIPAA, and Beyond',
'compliance-legal-considerations',
'text',
22,
'<h2>Legal Compliance</h2><p>Understanding regulatory requirements and legal implications in cybersecurity.</p>',
15,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 24 - Security Policy Development (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Developing Comprehensive Security Policies',
'security-policy-development',
'text',
23,
'<h2>Policy Framework</h2><p>Hands-on lab: Create comprehensive security policies and procedures for organizations.</p>',
30,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 25 - Security Awareness Training Programs (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Building Effective Security Awareness Programs',
'security-awareness-training',
'video',
24,
35,
'https://www.youtube.com/watch?v=security-awareness',
'<h2>Awareness Training</h2><p>Design and implement effective security awareness training programs for organizations.</p>',
20,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 26 - Third-Party Risk Management (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Third-Party Risk Management in Cybersecurity',
'third-party-risk-management',
'text',
25,
'<h2>Vendor Security</h2><p>Managing cybersecurity risks associated with third-party vendors and partners.</p>',
15,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 27 - Security Metrics and KPIs (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Cybersecurity Metrics and Key Performance Indicators',
'security-metrics-kpis',
'text',
26,
'<h2>Security Metrics</h2><p>Establishing meaningful metrics and KPIs to measure cybersecurity program effectiveness.</p>',
15,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 28 - Cyber Insurance and Financial Impact (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Cyber Insurance and Financial Impact of Security Breaches',
'cyber-insurance-financial-impact',
'video',
27,
40,
'https://www.youtube.com/watch?v=cyber-insurance',
'<h2>Financial Protection</h2><p>Understanding cyber insurance options and the financial impact of security incidents.</p>',
20,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 29 - Executive Communication and Reporting (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Executive Communication: Cybersecurity Reporting',
'executive-communication-reporting',
'text',
28,
'<h2>Executive Reporting</h2><p>Hands-on lab: Create executive-level cybersecurity reports and presentations.</p>',
30,
true,
'Module 4: Cybersecurity Governance'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- Lesson 30 - Quiz: Cybersecurity Governance (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Cybersecurity Governance and Management',
'quiz-cybersecurity-governance',
'quiz',
29,
'{"instructions": "Test your understanding of cybersecurity governance and risk management.","questions": [{"question":"Which framework is widely used for cybersecurity risk management?","options":["COBIT","NIST Cybersecurity Framework","ITIL","TOGAF"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 4: Assessment'
FROM courses WHERE slug = 'cybersecurity-fundamentals';

-- ============================================
-- ETHICAL HACKING 101 - EXPANSION
-- ============================================

-- ================================================
-- MODULE 2: RECONNAISSANCE AND INFORMATION GATHERING (Lessons 9-16)
-- ================================================

-- Lesson 9 - Advanced Reconnaissance Techniques (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Advanced Reconnaissance: OSINT and Information Gathering',
'advanced-reconnaissance-techniques',
'video',
8,
50,
'https://www.youtube.com/watch?v=advanced-reconnaissance',
'<h2>Information Gathering</h2><p>Master advanced reconnaissance techniques using OSINT tools and methodologies.</p>',
20,
true,
'Module 2: Reconnaissance and Information Gathering'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 10 - Network Scanning and Enumeration (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Network Scanning and Service Enumeration',
'network-scanning-enumeration',
'text',
9,
'<h2>Network Discovery</h2><p>Hands-on lab: Use Nmap and other tools for network scanning and service enumeration.</p>',
30,
true,
'Module 2: Reconnaissance and Information Gathering'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 11 - Web Application Reconnaissance (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Web Application Reconnaissance and Fingerprinting',
'web-application-reconnaissance-advanced',
'text',
10,
'<h2>Web App Discovery</h2><p>Techniques for gathering information about web applications and their underlying technologies.</p>',
15,
true,
'Module 2: Reconnaissance and Information Gathering'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 12 - Social Media Intelligence (SOCMINT) (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Social Media Intelligence for Ethical Hackers',
'social-media-intelligence-socmint',
'video',
11,
35,
'https://www.youtube.com/watch?v=socmint-techniques',
'<h2>SOCMINT Techniques</h2><p>Learn to gather intelligence from social media platforms for penetration testing.</p>',
20,
true,
'Module 2: Reconnaissance and Information Gathering'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 13 - DNS and Subdomain Enumeration (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'DNS Enumeration and Subdomain Discovery',
'dns-subdomain-enumeration',
'text',
12,
'<h2>DNS Discovery</h2><p>Hands-on lab: Advanced DNS enumeration and subdomain discovery techniques.</p>',
30,
true,
'Module 2: Reconnaissance and Information Gathering'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 14 - Google Dorking and Search Engine Exploitation (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Google Dorking: Advanced Search Operators for OSINT',
'google-dorking-search-exploitation',
'text',
13,
'<h2>Search Engine Exploitation</h2><p>Master Google dorking and advanced search operators for information gathering.</p>',
15,
true,
'Module 2: Reconnaissance and Information Gathering'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 15 - Metadata Analysis and Document Intelligence (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Metadata Analysis and Document Intelligence',
'metadata-analysis-document-intelligence',
'video',
14,
40,
'https://www.youtube.com/watch?v=metadata-analysis',
'<h2>Document Intelligence</h2><p>Extract valuable information from document metadata and file structures.</p>',
20,
true,
'Module 2: Reconnaissance and Information Gathering'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 16 - Quiz: Reconnaissance Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Reconnaissance and Information Gathering',
'quiz-reconnaissance-mastery',
'quiz',
15,
'{"instructions": "Test your knowledge of reconnaissance and information gathering techniques.","questions": [{"question":"Which tool is commonly used for network scanning and port discovery?","options":["Wireshark","Nmap","Metasploit","Burp Suite"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'ethical-hacking-101';

-- ================================================
-- MODULE 3: EXPLOITATION TECHNIQUES (Lessons 17-24)
-- ================================================

-- Lesson 17 - Vulnerability Exploitation Fundamentals (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Vulnerability Exploitation: Theory and Practice',
'vulnerability-exploitation-fundamentals',
'video',
16,
60,
'https://www.youtube.com/watch?v=vulnerability-exploitation',
'<h2>Exploitation Basics</h2><p>Understanding the principles and methodologies of ethical vulnerability exploitation.</p>',
20,
true,
'Module 3: Exploitation Techniques'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 18 - Buffer Overflow Exploitation (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Buffer Overflow Exploitation in Controlled Environments',
'buffer-overflow-exploitation',
'text',
17,
'<h2>Memory Corruption</h2><p>Hands-on lab: Safely exploit buffer overflow vulnerabilities in test environments.</p>',
30,
true,
'Module 3: Exploitation Techniques'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 19 - Web Application Exploitation (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Web Application Exploitation: OWASP Top 10',
'web-application-exploitation-owasp',
'text',
18,
'<h2>Web App Security</h2><p>Exploiting common web application vulnerabilities including SQL injection and XSS.</p>',
15,
true,
'Module 3: Exploitation Techniques'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 20 - Post-Exploitation Techniques (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Post-Exploitation: Privilege Escalation and Persistence',
'post-exploitation-techniques',
'text',
19,
'<h2>Post-Exploitation</h2><p>Hands-on lab: Learn privilege escalation and persistence techniques in controlled environments.</p>',
30,
true,
'Module 3: Exploitation Techniques'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 21 - Wireless Network Exploitation (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Wireless Network Security Testing and Exploitation',
'wireless-network-exploitation-testing',
'video',
20,
45,
'https://www.youtube.com/watch?v=wireless-exploitation',
'<h2>Wireless Security</h2><p>Techniques for testing and exploiting wireless network security vulnerabilities.</p>',
20,
true,
'Module 3: Exploitation Techniques'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 22 - Password Attacks and Cracking (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Password Attacks: Brute Force, Dictionary, and Rainbow Tables',
'password-attacks-cracking-methods',
'text',
21,
'<h2>Password Security</h2><p>Understanding various password attack methodologies and defensive strategies.</p>',
15,
true,
'Module 3: Exploitation Techniques'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 23 - Social Engineering in Penetration Testing (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Ethical Social Engineering for Security Testing',
'social-engineering-penetration-testing-ethics',
'video',
22,
35,
'https://www.youtube.com/watch?v=ethical-social-engineering',
'<h2>Human Factor Testing</h2><p>Ethical approaches to testing human security awareness through social engineering.</p>',
20,
true,
'Module 3: Exploitation Techniques'
FROM courses WHERE slug = 'ethical-hacking-101';

-- Lesson 24 - Quiz: Exploitation Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Exploitation Techniques and Methodologies',
'quiz-exploitation-mastery',
'quiz',
23,
'{"instructions": "Test your understanding of ethical exploitation techniques and methodologies.","questions": [{"question":"What is the primary goal of post-exploitation activities?","options":["Cause damage","Maintain access","Delete files","Crash systems"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 3: Assessment'
FROM courses WHERE slug = 'ethical-hacking-101';

-- ============================================
-- NETWORK SECURITY & DEFENSE - EXPANSION
-- ============================================

-- ================================================
-- MODULE 2: ADVANCED NETWORK DEFENSE (Lessons 9-16)
-- ================================================

-- Lesson 9 - Network Intrusion Detection Systems (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Network IDS: Detection and Response Strategies',
'network-intrusion-detection-systems',
'video',
8,
50,
'https://www.youtube.com/watch?v=network-ids',
'<h2>Intrusion Detection</h2><p>Comprehensive guide to implementing and managing network intrusion detection systems.</p>',
20,
true,
'Module 2: Advanced Network Defense'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 10 - Advanced Firewall Configuration (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Advanced Firewall Rules and Security Policies',
'advanced-firewall-configuration',
'text',
9,
'<h2>Firewall Management</h2><p>Hands-on lab: Configure advanced firewall rules and implement comprehensive security policies.</p>',
30,
true,
'Module 2: Advanced Network Defense'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 11 - Network Segmentation and VLANs (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Network Segmentation: VLANs and Micro-Segmentation',
'network-segmentation-vlans',
'text',
10,
'<h2>Network Isolation</h2><p>Implementing network segmentation strategies using VLANs and micro-segmentation techniques.</p>',
15,
true,
'Module 2: Advanced Network Defense'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 12 - DDoS Protection and Mitigation (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'DDoS Attacks: Protection and Mitigation Strategies',
'ddos-protection-mitigation',
'video',
11,
45,
'https://www.youtube.com/watch?v=ddos-protection',
'<h2>DDoS Defense</h2><p>Understanding DDoS attack patterns and implementing effective protection strategies.</p>',
20,
true,
'Module 2: Advanced Network Defense'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 13 - Network Access Control (NAC) (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Implementing Network Access Control Solutions',
'network-access-control-nac',
'text',
12,
'<h2>Access Control</h2><p>Hands-on lab: Deploy and configure Network Access Control solutions for device authentication.</p>',
30,
true,
'Module 2: Advanced Network Defense'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 14 - VPN Security and Implementation (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'VPN Security: IPSec, SSL/TLS, and WireGuard',
'vpn-security-implementation-advanced',
'text',
13,
'<h2>Secure Remote Access</h2><p>Implementing secure VPN solutions using various protocols and technologies.</p>',
15,
true,
'Module 2: Advanced Network Defense'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 15 - Network Forensics and Traffic Analysis (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Network Forensics: Traffic Analysis and Investigation',
'network-forensics-traffic-analysis-advanced',
'video',
14,
55,
'https://www.youtube.com/watch?v=network-forensics',
'<h2>Digital Investigation</h2><p>Advanced network forensics techniques for incident investigation and threat hunting.</p>',
20,
true,
'Module 2: Advanced Network Defense'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 16 - Quiz: Network Defense Mastery (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Advanced Network Security and Defense',
'quiz-network-defense-mastery',
'quiz',
15,
'{"instructions": "Test your knowledge of advanced network security and defense strategies.","questions": [{"question":"Which technology is primarily used for network micro-segmentation?","options":["VLAN","Firewall","VPN","IDS"],"correctAnswer":0,"points":3}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'network-security-defense';

-- ================================================
-- MODULE 3: EMERGING NETWORK THREATS (Lessons 17-24)
-- ================================================

-- Lesson 17 - Zero Trust Network Architecture (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Zero Trust Network Architecture: Implementation Guide',
'zero-trust-network-architecture',
'video',
16,
60,
'https://www.youtube.com/watch?v=zero-trust-architecture',
'<h2>Zero Trust Model</h2><p>Implementing zero trust network architecture for enhanced security posture.</p>',
20,
true,
'Module 3: Emerging Network Threats'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 18 - IoT Network Security (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'IoT Network Security: Challenges and Solutions',
'iot-network-security-challenges',
'text',
17,
'<h2>IoT Security</h2><p>Addressing security challenges in IoT networks and implementing protective measures.</p>',
15,
true,
'Module 3: Emerging Network Threats'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 19 - Cloud Network Security (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Cloud Network Security: AWS, Azure, and GCP',
'cloud-network-security-platforms',
'text',
18,
'<h2>Cloud Security</h2><p>Hands-on lab: Implement security controls for cloud network infrastructure across major platforms.</p>',
30,
true,
'Module 3: Emerging Network Threats'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 20 - AI and ML in Network Security (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'AI and Machine Learning in Network Security',
'ai-ml-network-security',
'video',
19,
40,
'https://www.youtube.com/watch?v=ai-network-security',
'<h2>AI-Powered Security</h2><p>Leveraging artificial intelligence and machine learning for advanced threat detection.</p>',
20,
true,
'Module 3: Emerging Network Threats'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 21 - 5G Network Security Considerations (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'5G Network Security: Opportunities and Challenges',
'5g-network-security-considerations',
'text',
20,
'<h2>5G Security</h2><p>Understanding security implications and requirements for 5G network deployments.</p>',
15,
true,
'Module 3: Emerging Network Threats'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 22 - Network Threat Hunting (Lab) - 30 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Proactive Network Threat Hunting Techniques',
'network-threat-hunting',
'text',
21,
'<h2>Threat Hunting</h2><p>Hands-on lab: Implement proactive threat hunting methodologies for network security.</p>',
30,
true,
'Module 3: Emerging Network Threats'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 23 - Network Security Automation (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Network Security Automation and Orchestration',
'network-security-automation-orchestration',
'video',
22,
35,
'https://www.youtube.com/watch?v=security-automation',
'<h2>Security Automation</h2><p>Implementing automated security responses and orchestration for network defense.</p>',
20,
true,
'Module 3: Emerging Network Threats'
FROM courses WHERE slug = 'network-security-defense';

-- Lesson 24 - Quiz: Emerging Network Security (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Emerging Network Security Technologies',
'quiz-emerging-network-security',
'quiz',
23,
'{"instructions": "Test your knowledge of emerging network security technologies and trends.","questions": [{"question":"What is a key principle of Zero Trust architecture?","options":["Trust but verify","Never trust, always verify","Trust internal networks","Verify once, trust always"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 3: Assessment'
FROM courses WHERE slug = 'network-security-defense';