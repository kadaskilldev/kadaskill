-- COURSE: Python Foundation for AI (COMPREHENSIVE VERSION)
-- Safe to run - only affects lessons for this specific course
-- Run this in Supabase SQL Editor
-- XP Rewards: Video=20, Text=15, Quiz=25
-- TOTAL: 36 Lessons (6 Modules × 6 Lessons each)

-- =============================================
-- STEP 1: Delete existing lessons for this course only
-- =============================================
DELETE FROM lessons
WHERE course_id = (SELECT id FROM courses WHERE slug = 'python-foundation-ai');

-- =============================================
-- STEP 2: Insert all lessons fresh (with XP rewards)
-- =============================================

-- ================================================
-- MODULE 1: PYTHON FUNDAMENTALS & SETUP (Lessons 1-6)
-- ================================================

-- Lesson 1 — Introduction to Python and AI Development Environment (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Python and AI Development Environment',
'intro-python-ai-environment',
'video',
0,
45,
'https://www.youtube.com/watch?v=kqtD5dpn9C8',
'
<h2>Welcome to Python for AI Development</h2>

<p>
Python has become the de facto standard for artificial intelligence and machine learning development due to its simplicity, readability, and extensive ecosystem of libraries. In this comprehensive course, you''ll learn not just Python fundamentals, but specifically how to use Python as a foundation for AI applications.
</p>

<h3>Why Python for AI?</h3>
<ul>
  <li><strong>Simplicity</strong>: Python''s clean syntax allows developers to focus on solving problems rather than complex language syntax</li>
  <li><strong>Rich Ecosystem</strong>: Libraries like NumPy, Pandas, Scikit-learn, TensorFlow, and PyTorch make AI development accessible</li>
  <li><strong>Community Support</strong>: Massive community with extensive documentation and tutorials</li>
  <li><strong>Integration</strong>: Easy integration with other languages and systems</li>
  <li><strong>Industry Adoption</strong>: Used by Google, Netflix, NASA, and leading AI research organizations</li>
</ul>

<h3>Setting Up Your Development Environment</h3>
<p>
A proper development environment is crucial for AI development. You''ll need:
</p>
<ul>
  <li><strong>Python 3.8+</strong>: Latest version with performance improvements</li>
  <li><strong>Package Manager</strong>: pip or conda for installing libraries</li>
  <li><strong>Virtual Environments</strong>: Isolate project dependencies</li>
  <li><strong>IDE/Editor</strong>: PyCharm, VS Code, or Jupyter Notebooks</li>
  <li><strong>Version Control</strong>: Git for project management</li>
</ul>

<h3>Course Structure and Learning Path</h3>
<p>
This course is designed to take you from Python beginner to AI-ready developer:
</p>
<ol>
  <li><strong>Module 1</strong>: Python fundamentals and environment setup</li>
  <li><strong>Module 2</strong>: Data structures and control flow for data processing</li>
  <li><strong>Module 3</strong>: Functions and object-oriented programming</li>
  <li><strong>Module 4</strong>: Data handling with NumPy and Pandas</li>
  <li><strong>Module 5</strong>: Machine learning fundamentals</li>
  <li><strong>Module 6</strong>: Building real AI applications</li>
</ol>

<h3>Additional Resources</h3>
<ul>
  <li><a href="https://python.org" target="_blank">Official Python Documentation</a></li>
  <li><a href="https://realpython.com" target="_blank">Real Python Tutorials</a></li>
  <li><a href="https://docs.python.org/3/tutorial/" target="_blank">Python Tutorial</a></li>
</ul>
',
20,
true,
'Module 1: Python Fundamentals'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 2 — Python Syntax, Variables, and Data Types (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Python Syntax, Variables, and Data Types',
'python-syntax-variables-datatypes',
'text',
1,
'
<h2>Understanding Python Syntax</h2>

<p>
Python''s syntax is designed to be readable and intuitive. Unlike many programming languages that use curly braces {}, Python uses indentation to define code blocks, making it visually clear and forcing good coding practices.
</p>

<h3>Basic Syntax Rules</h3>
<ul>
  <li><strong>Indentation</strong>: Use 4 spaces (not tabs) for each level of indentation</li>
  <li><strong>Case Sensitivity</strong>: Python distinguishes between uppercase and lowercase</li>
  <li><strong>Comments</strong>: Use # for single-line comments, """ """ for multi-line</li>
  <li><strong>Line Continuation</strong>: Use \ to continue long lines</li>
</ul>

<h3>Variables in Python</h3>
<p>
Variables in Python are dynamically typed, meaning you don''t need to declare their type explicitly. Python infers the type based on the assigned value.
</p>

<pre><code>
# Variable assignment examples
name = "Alice"                    # String
age = 25                         # Integer  
height = 5.6                     # Float
is_student = True                # Boolean
data = None                      # None type
</code></pre>

<h3>Python Data Types for AI Development</h3>

<h4>1. Numbers (int, float, complex)</h4>
<p>Essential for mathematical computations in AI algorithms:</p>
<pre><code>
# Integer for counting, indexing
num_samples = 1000
epochs = 50

# Float for measurements, probabilities
learning_rate = 0.001
accuracy = 0.95

# Complex for signal processing
signal = 3 + 4j
</code></pre>

<h4>2. Strings (str)</h4>
<p>Critical for text processing and natural language processing:</p>
<pre><code>
# Text data examples
user_input = "Hello, AI assistant!"
file_path = "/data/training_set.csv"
model_name = "bert-base-uncased"

# String methods useful for AI
cleaned_text = user_input.lower().strip()
tokens = user_input.split()
</code></pre>

<h4>3. Booleans (bool)</h4>
<p>Essential for conditional logic and binary classification:</p>
<pre><code>
# Boolean variables
is_trained = False
model_converged = True
has_gpu = True

# Boolean operations
can_train = has_gpu and not is_trained
needs_more_data = accuracy < 0.8
</code></pre>

<h4>4. Collections Overview</h4>
<p>We''ll dive deeper into these in the next module, but here''s a preview:</p>
<ul>
  <li><strong>Lists</strong>: Ordered, mutable collections for datasets</li>
  <li><strong>Tuples</strong>: Immutable sequences for coordinates, RGB values</li>
  <li><strong>Dictionaries</strong>: Key-value pairs for configuration, metadata</li>
  <li><strong>Sets</strong>: Unique collections for vocabulary, feature sets</li>
</ul>

<h3>Type Checking and Conversion</h3>
<p>Understanding data types is crucial for AI development where data consistency is paramount:</p>
<pre><code>
# Check variable type
print(type(age))          # <class ''int''>
print(isinstance(age, int))  # True

# Type conversion
age_str = str(age)        # "25"
height_int = int(height)  # 5
is_valid = bool(age)      # True (non-zero numbers are True)
</code></pre>

<h3>Best Practices for AI Development</h3>
<ul>
  <li><strong>Descriptive Names</strong>: Use clear variable names like training_accuracy instead of ta</li>
  <li><strong>Consistent Naming</strong>: Use snake_case for variables and functions</li>
  <li><strong>Type Hints</strong>: Use type annotations for better code documentation</li>
  <li><strong>Constants</strong>: Use UPPER_CASE for constants like MAX_EPOCHS = 100</li>
</ul>

<h3>Practice Exercise</h3>
<p>
Try creating variables for an AI project:
</p>
<pre><code>
# Dataset information
dataset_name = "MNIST"
num_classes = 10
input_shape = (28, 28, 1)
train_size = 60000
test_size = 10000

# Model parameters
learning_rate = 0.001
batch_size = 32
epochs = 25
dropout_rate = 0.2
</code></pre>

<h3>Additional Resources</h3>
<ul>
  <li><a href="https://docs.python.org/3/library/stdtypes.html" target="_blank">Python Standard Types Documentation</a></li>
  <li><a href="https://realpython.com/python-data-types/" target="_blank">Python Data Types (Real Python)</a></li>
  <li><a href="https://www.w3schools.com/python/python_datatypes.asp" target="_blank">Python Data Types (W3Schools)</a></li>
</ul>
',
15,
true,
'Module 1: Python Fundamentals'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 3 — Operators and Expressions (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Operators and Expressions in Python',
'python-operators-expressions',
'video',
2,
35,
'https://www.youtube.com/watch?v=v5MR5JnKcZI',
'
<h2>Python Operators for AI and Data Science</h2>

<p>
Operators are the building blocks of mathematical and logical expressions in AI applications. Understanding operators is essential for data manipulation, feature engineering, and algorithm implementation.
</p>

<h3>Arithmetic Operators</h3>
<p>Fundamental for numerical computations in machine learning:</p>
<ul>
  <li><strong>+</strong> Addition (vector addition, concatenation)</li>
  <li><strong>-</strong> Subtraction (difference calculations)</li>
  <li><strong>*</strong> Multiplication (scaling, dot products)</li>
  <li><strong>/</strong> Division (normalization, ratios)</li>
  <li><strong>//</strong> Floor division (integer division)</li>
  <li><strong>%</strong> Modulus (cyclical operations)</li>
  <li><strong>**</strong> Exponentiation (power functions)</li>
</ul>

<h3>Assignment Operators</h3>
<p>Efficient for updating model parameters and counters:</p>
<ul>
  <li><strong>+=</strong> Add and assign</li>
  <li><strong>-=</strong> Subtract and assign</li>
  <li><strong>*=</strong> Multiply and assign</li>
  <li><strong>/=</strong> Divide and assign</li>
</ul>

<h3>Comparison Operators</h3>
<p>Critical for conditional logic and decision trees:</p>
<ul>
  <li><strong>==</strong> Equal to</li>
  <li><strong>!=</strong> Not equal to</li>
  <li><strong><</strong> Less than</li>
  <li><strong>></strong> Greater than</li>
  <li><strong><=</strong> Less than or equal</li>
  <li><strong>>=</strong> Greater than or equal</li>
</ul>

<h3>Logical Operators</h3>
<p>Essential for complex conditions and boolean logic:</p>
<ul>
  <li><strong>and</strong> Logical AND</li>
  <li><strong>or</strong> Logical OR</li>
  <li><strong>not</strong> Logical NOT</li>
</ul>

<h3>AI-Specific Examples</h3>
<p>Here are practical examples of how operators are used in AI development:</p>
<pre><code>
# Feature scaling example
min_val = 0
max_val = 100
feature_value = 75
normalized = (feature_value - min_val) / (max_val - min_val)  # 0.75

# Accuracy calculation
correct_predictions = 850
total_predictions = 1000
accuracy = correct_predictions / total_predictions  # 0.85

# Learning rate decay
initial_lr = 0.01
epoch = 5
decay_rate = 0.9
current_lr = initial_lr * (decay_rate ** epoch)  # 0.0059

# Threshold-based classification
prediction_score = 0.7
threshold = 0.5
is_positive = prediction_score > threshold  # True
</code></pre>
',
20,
true,
'Module 1: Python Fundamentals'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 4 — Input and Output Operations (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Input and Output Operations for Data Handling',
'python-input-output-operations',
'text',
3,
'
<h2>Input and Output in Python for AI Applications</h2>

<p>
Input and output operations are fundamental for AI applications where you need to load datasets, save model parameters, display results, and interact with users. Python provides various ways to handle I/O operations efficiently.
</p>

<h3>Basic Input and Output</h3>

<h4>The print() Function</h4>
<p>Essential for debugging, monitoring training progress, and displaying results:</p>
<pre><code>
# Basic printing
print("Training started...")
print("Epoch 1/10")

# Printing multiple values
epoch = 5
loss = 0.234
accuracy = 0.89
print("Epoch:", epoch, "Loss:", loss, "Accuracy:", accuracy)

# Formatted printing (recommended for AI applications)
print(f"Epoch {epoch}: Loss = {loss:.4f}, Accuracy = {accuracy:.2%}")

# Output: Epoch 5: Loss = 0.2340, Accuracy = 89.00%
</code></pre>

<h4>The input() Function</h4>
<p>Useful for interactive AI applications and user input processing:</p>
<pre><code>
# Basic input
user_text = input("Enter text for sentiment analysis: ")
model_choice = input("Choose model (1-LSTM, 2-BERT): ")

# Converting input types
num_epochs = int(input("Number of training epochs: "))
learning_rate = float(input("Learning rate: "))

# Input validation for AI applications
while True:
    batch_size = input("Batch size (power of 2): ")
    try:
        batch_size = int(batch_size)
        if batch_size > 0 and (batch_size & (batch_size - 1)) == 0:
            break
        else:
            print("Please enter a valid power of 2")
    except ValueError:
        print("Please enter a valid number")
</code></pre>

<h3>String Formatting for AI Reporting</h3>

<h4>f-strings (Python 3.6+) - Recommended</h4>
<p>Modern, readable formatting perfect for AI metrics reporting:</p>
<pre><code>
# Training metrics
epoch = 10
train_loss = 0.1234
val_loss = 0.1456
train_acc = 0.9234
val_acc = 0.9012

# Comprehensive training report
report = f"""
Epoch {epoch:02d} Training Report:
{''=''*40}
Training   - Loss: {train_loss:.4f}, Accuracy: {train_acc:.2%}
Validation - Loss: {val_loss:.4f}, Accuracy: {val_acc:.2%}
Improvement: {(''+'' if val_loss < train_loss else ''-'')}{abs(val_loss - train_loss):.4f}
"""
print(report)
</code></pre>

<h4>format() Method</h4>
<p>Alternative formatting method with more control:</p>
<pre><code>
# Model performance comparison
models = ["CNN", "RNN", "Transformer"]
accuracies = [0.85, 0.78, 0.92]

print("{:<12} {:>10}".format("Model", "Accuracy"))
print("-" * 22)
for model, acc in zip(models, accuracies):
    print("{:<12} {:>9.2%}".format(model, acc))
</code></pre>

<h3>File Input/Output for AI Data</h3>

<h4>Reading Data Files</h4>
<p>Essential for loading datasets and configuration files:</p>
<pre><code>
# Reading configuration files
try:
    with open("config.txt", "r") as file:
        config_data = file.read()
    print("Configuration loaded successfully")
except FileNotFoundError:
    print("Configuration file not found, using defaults")

# Reading CSV-like data (basic approach)
data_points = []
with open("dataset.txt", "r") as file:
    for line in file:
        values = line.strip().split(",")
        data_points.append([float(x) for x in values])
        
print(f"Loaded {len(data_points)} data points")
</code></pre>

<h4>Writing Results and Logs</h4>
<p>Important for saving model outputs and training logs:</p>
<pre><code>
# Saving training history
training_log = []
for epoch in range(1, 6):
    loss = 1.0 / epoch  # Simulated decreasing loss
    training_log.append(f"Epoch {epoch}: Loss = {loss:.4f}")

# Write to file
with open("training_log.txt", "w") as file:
    file.write("Training Session Log\\n")
    file.write("=" * 20 + "\\n")
    for entry in training_log:
        file.write(entry + "\\n")

print("Training log saved to training_log.txt")

# Appending to existing logs
with open("all_experiments.txt", "a") as file:
    file.write(f"Experiment completed at {datetime.now()}\\n")
</code></pre>

<h3>Advanced I/O for AI Applications</h3>

<h4>Working with JSON (Common for AI configs)</h4>
<pre><code>
import json

# AI model configuration
config = {
    "model_type": "neural_network",
    "layers": [128, 64, 32],
    "activation": "relu",
    "learning_rate": 0.001,
    "batch_size": 32
}

# Save configuration
with open("model_config.json", "w") as file:
    json.dump(config, file, indent=2)

# Load configuration
with open("model_config.json", "r") as file:
    loaded_config = json.load(file)
</code></pre>

<h4>Error Handling in I/O Operations</h4>
<pre><code>
def safe_load_dataset(filename):
    """Safely load a dataset with proper error handling"""
    try:
        with open(filename, "r") as file:
            data = file.readlines()
        print(f"Successfully loaded {len(data)} records from {filename}")
        return data
    except FileNotFoundError:
        print(f"Error: Dataset file ''{filename}'' not found")
        return None
    except PermissionError:
        print(f"Error: No permission to read ''{filename}''")
        return None
    except Exception as e:
        print(f"Unexpected error loading {filename}: {e}")
        return None
</code></pre>

<h3>Best Practices for AI I/O Operations</h3>
<ul>
  <li><strong>Always use context managers (with statements)</strong> for file operations</li>
  <li><strong>Handle exceptions</strong> gracefully, especially for data loading</li>
  <li><strong>Use descriptive filenames</strong> with timestamps for experiments</li>
  <li><strong>Log progress</strong> for long-running training processes</li>
  <li><strong>Validate input data</strong> before processing</li>
  <li><strong>Use appropriate file formats</strong> (JSON for configs, CSV for data, etc.)</li>
</ul>

<h3>Additional Resources</h3>
<ul>
  <li><a href="https://docs.python.org/3/tutorial/inputoutput.html" target="_blank">Python Input/Output Tutorial</a></li>
  <li><a href="https://realpython.com/working-with-files-in-python/" target="_blank">Working with Files in Python</a></li>
  <li><a href="https://docs.python.org/3/library/json.html" target="_blank">JSON Handling in Python</a></li>
</ul>
',
15,
true,
'Module 1: Python Fundamentals'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 5 — Comments, Documentation, and Code Organization (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Comments, Documentation, and Code Organization for AI Projects',
'python-comments-documentation-organization',
'text',
4,
'
<h2>Writing Maintainable AI Code</h2>

<p>
In AI development, code complexity can grow rapidly as you experiment with different models, hyperparameters, and data processing techniques. Good documentation and code organization are essential for reproducible research, team collaboration, and long-term project maintenance.
</p>

<h3>Types of Comments in Python</h3>

<h4>Single-Line Comments</h4>
<p>Use # for brief explanations and annotations:</p>
<pre><code>
# Load the dataset
data = pd.read_csv("training_data.csv")

# Hyperparameter configuration
learning_rate = 0.001  # Tested values: 0.01, 0.001, 0.0001
batch_size = 32        # Optimal for our GPU memory

# Feature engineering
X_scaled = scaler.fit_transform(X)  # Normalize features to [0,1]
</code></pre>

<h4>Multi-Line Comments and Docstrings</h4>
<p>Use triple quotes for longer explanations and function documentation:</p>
<pre><code>
"""
Neural Network Training Module

This module implements a flexible neural network training pipeline
for classification tasks. It supports various optimizers, loss functions,
and evaluation metrics commonly used in deep learning.

Author: Data Science Team
Last Modified: 2024-01-15
"""

def train_model(model, train_loader, val_loader, epochs=10):
    """
    Train a neural network model with validation monitoring.
    
    Args:
        model (torch.nn.Module): The neural network to train
        train_loader (DataLoader): Training data loader
        val_loader (DataLoader): Validation data loader
        epochs (int): Number of training epochs
    
    Returns:
        dict: Training history containing loss and accuracy curves
    
    Example:
        >>> model = NeuralNetwork(input_size=784, hidden_size=128)
        >>> history = train_model(model, train_dl, val_dl, epochs=20)
    """
    # Implementation here...
</code></pre>

<h3>Code Organization for AI Projects</h3>

<h4>Project Structure</h4>
<p>A well-organized AI project typically follows this structure:</p>
<pre><code>
ai_project/
├── data/                    # Raw and processed datasets
│   ├── raw/
│   ├── processed/
│   └── external/
├── notebooks/              # Jupyter notebooks for exploration
│   ├── exploratory_analysis.ipynb
│   └── model_experiments.ipynb
├── src/                    # Source code modules
│   ├── __init__.py
│   ├── data_preprocessing.py
│   ├── model_architecture.py
│   ├── training.py
│   └── evaluation.py
├── models/                 # Saved model files
├── results/               # Output plots, metrics, reports
├── config/                # Configuration files
│   └── model_config.yaml
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
└── main.py               # Main execution script
</code></pre>

<h4>Modular Code Design</h4>
<p>Break your AI code into logical modules:</p>
<pre><code>
# data_preprocessing.py
class DataPreprocessor:
    """Handle all data preprocessing operations"""
    
    def __init__(self, config):
        """Initialize with configuration parameters"""
        self.config = config
        
    def load_data(self, filepath):
        """Load raw data from file"""
        # Implementation
        
    def clean_data(self, df):
        """Remove outliers and handle missing values"""
        # Implementation
        
    def engineer_features(self, df):
        """Create new features from existing ones"""
        # Implementation

# model_architecture.py  
class NeuralNetworkBuilder:
    """Build and configure neural network architectures"""
    
    @staticmethod
    def create_classifier(input_dim, num_classes, hidden_layers):
        """Create a classification neural network"""
        # Implementation
        
    @staticmethod
    def create_autoencoder(input_dim, encoding_dim):
        """Create an autoencoder architecture"""
        # Implementation
</code></pre>

<h3>Documentation Best Practices for AI</h3>

<h4>Algorithm Documentation</h4>
<p>Document the reasoning behind algorithmic choices:</p>
<pre><code>
def calculate_attention_weights(query, key, value, temperature=1.0):
    """
    Calculate attention weights using scaled dot-product attention.
    
    This implementation follows the "Attention Is All You Need" paper
    (Vaswani et al., 2017). The temperature parameter allows for 
    controlling the sharpness of the attention distribution.
    
    Mathematical Formula:
        Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V
        
    Where:
        Q: Query matrix of shape (batch_size, seq_len, d_model)
        K: Key matrix of shape (batch_size, seq_len, d_model)  
        V: Value matrix of shape (batch_size, seq_len, d_model)
        d_k: Dimension of key vectors (for scaling)
        
    Args:
        query (torch.Tensor): Query tensor
        key (torch.Tensor): Key tensor  
        value (torch.Tensor): Value tensor
        temperature (float): Temperature scaling factor
        
    Returns:
        torch.Tensor: Attention output of same shape as value
        torch.Tensor: Attention weights for visualization
    """
    # Implementation here
</code></pre>

<h4>Experiment Documentation</h4>
<p>Keep detailed records of your experiments:</p>
<pre><code>
# experiment_log.py
"""
Experiment Log: CNN Architecture Comparison
==========================================

Experiment ID: EXP_2024_001
Date: 2024-01-15
Researcher: Alice Johnson

Objective:
    Compare different CNN architectures for image classification
    on the CIFAR-10 dataset.

Hypotheses:
    1. Deeper networks will achieve higher accuracy
    2. ResNet connections will help with gradient flow
    3. Dropout will reduce overfitting

Methodology:
    - Dataset: CIFAR-10 (50k train, 10k test)
    - Preprocessing: Normalization, data augmentation
    - Architectures tested: Basic CNN, ResNet-18, DenseNet-121
    - Training: 100 epochs, Adam optimizer, lr=0.001
    - Evaluation: Accuracy, F1-score, confusion matrix

Results Summary:
    - Basic CNN: 78.5% accuracy
    - ResNet-18: 85.2% accuracy  
    - DenseNet-121: 87.1% accuracy (best)

Key Findings:
    - Skip connections significantly improved performance
    - DenseNet achieved best results with fewer parameters
    - Data augmentation increased accuracy by ~3%

Next Steps:
    - Test DenseNet-169 for potential further improvement
    - Experiment with different learning rate schedules
    - Try ensemble methods combining top models
"""
</code></pre>

<h3>Version Control and Reproducibility</h3>

<h4>Git Commit Messages for AI Projects</h4>
<pre><code>
# Good commit messages for AI projects:
git commit -m "feat: implement LSTM model for sequence prediction"
git commit -m "experiment: test dropout rates 0.1, 0.3, 0.5 for CNN"
git commit -m "fix: resolve data leakage in train/validation split"
git commit -m "data: add new preprocessed dataset version 2.1"
git commit -m "refactor: modularize data loading pipeline"
</code></pre>

<h4>Configuration Management</h4>
<p>Use configuration files to make experiments reproducible:</p>
<pre><code>
# config.yaml
model:
  architecture: "resnet50"
  num_classes: 10
  dropout_rate: 0.3
  
training:
  learning_rate: 0.001
  batch_size: 32
  epochs: 100
  optimizer: "adam"
  
data:
  dataset_path: "./data/processed/"
  validation_split: 0.2
  augmentation: true
  
experiment:
  name: "resnet50_cifar10_v1"
  save_path: "./results/"
  random_seed: 42
</code></pre>

<h3>Inline Comments for Complex AI Code</h3>
<pre><code>
def train_gan(generator, discriminator, dataloader, epochs):
    """Train a Generative Adversarial Network"""
    
    for epoch in range(epochs):
        for batch_idx, real_data in enumerate(dataloader):
            
            # ============================================
            # Train Discriminator: max log(D(x)) + log(1 - D(G(z)))
            # ============================================
            
            # Train with real data (label = 1)
            discriminator.zero_grad()
            real_output = discriminator(real_data)
            real_loss = criterion(real_output, torch.ones_like(real_output))
            
            # Train with fake data (label = 0)  
            noise = torch.randn(batch_size, latent_dim)
            fake_data = generator(noise).detach()  # Detach to avoid training G
            fake_output = discriminator(fake_data)
            fake_loss = criterion(fake_output, torch.zeros_like(fake_output))
            
            # Update discriminator
            d_loss = real_loss + fake_loss
            d_loss.backward()
            d_optimizer.step()
            
            # ============================================
            # Train Generator: max log(D(G(z)))
            # ============================================
            
            generator.zero_grad()
            # Generate new fake data (don''t detach this time)
            fake_data = generator(noise)
            fake_output = discriminator(fake_data)
            # We want generator to fool discriminator (label = 1)
            g_loss = criterion(fake_output, torch.ones_like(fake_output))
            g_loss.backward()
            g_optimizer.step()
</code></pre>

<h3>Documentation Tools for AI Projects</h3>
<ul>
  <li><strong>Sphinx</strong>: Auto-generate documentation from docstrings</li>
  <li><strong>Jupyter Notebooks</strong>: Document experiments with code and results</li>
  <li><strong>MLflow</strong>: Track experiments, parameters, and metrics</li>
  <li><strong>Weights & Biases</strong>: Visualize and compare experiments</li>
  <li><strong>README.md</strong>: Project overview and setup instructions</li>
</ul>

<h3>Additional Resources</h3>
<ul>
  <li><a href="https://peps.python.org/pep-0008/" target="_blank">PEP 8 - Python Style Guide</a></li>
  <li><a href="https://peps.python.org/pep-0257/" target="_blank">PEP 257 - Docstring Conventions</a></li>
  <li><a href="https://realpython.com/documenting-python-code/" target="_blank">Documenting Python Code (Real Python)</a></li>
  <li><a href="https://google.github.io/styleguide/pyguide.html" target="_blank">Google Python Style Guide</a></li>
</ul>
',
15,
true,
'Module 1: Python Fundamentals'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 6 — Quiz: Python Fundamentals Assessment (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Python Fundamentals Assessment',
'quiz-python-fundamentals',
'quiz',
5,
'{
 "instructions": "This quiz covers all concepts from Module 1: Python Fundamentals. Test your understanding of Python syntax, variables, data types, operators, I/O operations, and documentation practices.",
 "questions": [
  {
    "question": "Which of the following is the correct way to define a variable for storing a learning rate in Python?",
    "options": [
      "learning_rate = 0.001",
      "float learning_rate = 0.001",
      "var learning_rate = 0.001",
      "learning_rate: float = 0.001"
    ],
    "correctAnswer": 0,
    "points": 2
  },
  {
    "question": "What is the output of: print(type(5 / 2))?",
    "options": [
      "<class ''int''>",
      "<class ''float''>", 
      "<class ''double''>",
      "<class ''number''>"
    ],
    "correctAnswer": 1,
    "points": 2
  },
  {
    "question": "Which operator is best for checking if a model''s accuracy meets a minimum threshold?",
    "options": [
      "=",
      "==",
      ">=",
      "and"
    ],
    "correctAnswer": 2,
    "points": 2
  },
  {
    "question": "What is the recommended way to format a training progress message in modern Python?",
    "options": [
      "print(\"Epoch \" + str(epoch) + \": Loss = \" + str(loss))",
      "print(\"Epoch %d: Loss = %.4f\" % (epoch, loss))",
      "print(f\"Epoch {epoch}: Loss = {loss:.4f}\")",
      "print(\"Epoch {}: Loss = {}\".format(epoch, loss))"
    ],
    "correctAnswer": 2,
    "points": 2
  },
  {
    "question": "Which file operation pattern is safest for reading AI dataset files?",
    "options": [
      "file = open(\"data.txt\", \"r\")",
      "with open(\"data.txt\", \"r\") as file:",
      "file = open(\"data.txt\")",
      "open(\"data.txt\", \"r\")"
    ],
    "correctAnswer": 1,
    "points": 2
  },
  {
    "question": "What type of comment should you use for documenting a machine learning function''s parameters and return values?",
    "options": [
      "# Single line comment",
      "\"\"\"Docstring\"\"\"",
      "/* Multi-line comment */",
      "// Inline comment"
    ],
    "correctAnswer": 1,
    "points": 2
  },
  {
    "question": "In AI development, which naming convention is most appropriate for a constant representing maximum epochs?",
    "options": [
      "maxEpochs",
      "max_epochs", 
      "MAX_EPOCHS",
      "MaxEpochs"
    ],
    "correctAnswer": 2,
    "points": 2
  },
  {
    "question": "What will be the result of: bool(0.0) in Python?",
    "options": [
      "True",
      "False",
      "Error",
      "None"
    ],
    "correctAnswer": 1,
    "points": 2
  }
 ]
}',
25,
true,
'Module 1: Assessment'
FROM courses WHERE slug = 'python-foundation-ai';

-- ================================================
-- MODULE 2: DATA STRUCTURES & CONTROL FLOW (Lessons 7-12)
-- ================================================

-- Lesson 7 — Lists and Tuples for Data Management (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Lists and Tuples for AI Data Management',
'lists-tuples-ai-data-management',
'video',
6,
50,
'https://www.youtube.com/watch?v=W8KRzm-HUcc',
'
<h2>Lists and Tuples: Foundation of AI Data Structures</h2>

<p>
Lists and tuples are fundamental data structures in Python that form the backbone of data handling in AI applications. Understanding their characteristics, use cases, and performance implications is crucial for efficient AI development.
</p>

<h3>Python Lists: Dynamic and Flexible</h3>
<p>
Lists are mutable, ordered collections that can store heterogeneous data types. They are extensively used in AI for storing datasets, model predictions, training metrics, and more.
</p>

<h4>Creating and Initializing Lists</h4>
<pre><code>
# Different ways to create lists for AI applications
training_accuracies = []                    # Empty list
epochs = [1, 2, 3, 4, 5]                  # Training epochs
layer_sizes = [784, 128, 64, 10]          # Neural network architecture
activation_functions = ["relu", "sigmoid", "tanh"]  # Mixed data types

# List comprehensions for data generation
squared_errors = [error**2 for error in residuals]
normalized_features = [x/max_val for x in raw_features]
binary_labels = [1 if score > 0.5 else 0 for score in predictions]
</code></pre>

<h4>Essential List Operations for AI</h4>
<pre><code>
# Building training data
training_data = []
training_data.append((image, label))       # Add training examples
training_data.extend(new_batch)            # Add multiple examples

# Accessing data
first_example = training_data[0]           # First training example
last_prediction = predictions[-1]          # Most recent prediction
validation_set = full_dataset[8000:10000]  # Slice for validation

# Modifying training parameters
hyperparameters = [0.01, 0.001, 0.0001]   # Learning rates to try
hyperparameters.insert(1, 0.005)          # Insert new learning rate
hyperparameters.remove(0.01)              # Remove learning rate
hyperparameters.sort(reverse=True)        # Sort in descending order
</code></pre>

<h3>Tuples: Immutable and Efficient</h3>
<p>
Tuples are immutable, ordered collections ideal for representing fixed structures like image dimensions, RGB color values, or coordinate pairs.
</p>

<h4>Common AI Use Cases for Tuples</h4>
<pre><code>
# Image and data specifications
image_shape = (224, 224, 3)              # Height, width, channels
model_input = (batch_size, sequence_length, feature_dim)
coordinate = (latitude, longitude)         # GPS coordinates

# Configuration tuples
hyperparams = (learning_rate, batch_size, epochs)
model_config = ("CNN", 5, "relu", 0.2)   # Type, layers, activation, dropout

# Multiple return values from functions
def train_model(data):
    # ... training logic ...
    return train_loss, val_loss, accuracy   # Returns tuple

# Unpacking return values
tr_loss, val_loss, acc = train_model(dataset)
</code></pre>

<h3>Advanced List Techniques for AI</h3>

<h4>List Comprehensions with Conditions</h4>
<pre><code>
# Filter high-confidence predictions
confident_predictions = [pred for pred in predictions if pred > 0.8]

# Data preprocessing with conditions
cleaned_data = [x for x in raw_data if x is not None and x > 0]

# Feature selection based on importance scores
important_features = [feat for feat, score in zip(features, importance_scores) 
                     if score > threshold]

# Nested list comprehensions for matrix operations
matrix = [[row[i] for row in data] for i in range(len(data[0]))]  # Transpose
</code></pre>

<h4>Working with Multi-dimensional Data</h4>
<pre><code>
# Batch processing structure
batch_data = [
    ([0.1, 0.2, 0.3], 1),    # (features, label)
    ([0.4, 0.5, 0.6], 0),
    ([0.7, 0.8, 0.9], 1)
]

# Extract features and labels
features = [item[0] for item in batch_data]
labels = [item[1] for item in batch_data]

# Time series data structure
time_series = [
    (timestamp1, [sensor1_val, sensor2_val, sensor3_val]),
    (timestamp2, [sensor1_val, sensor2_val, sensor3_val])
]
</code></pre>

<h3>Performance Considerations</h3>

<h4>When to Use Lists vs Tuples</h4>
<ul>
  <li><strong>Use Lists when:</strong>
    <ul>
      <li>Data needs to be modified (adding training examples)</li>
      <li>Size varies during execution (growing result sets)</li>
      <li>Need methods like append(), remove(), sort()</li>
    </ul>
  </li>
  <li><strong>Use Tuples when:</strong>
    <ul>
      <li>Data structure is fixed (image dimensions, RGB values)</li>
      <li>Used as dictionary keys (tuples are hashable)</li>
      <li>Returning multiple values from functions</li>
      <li>Memory efficiency is important (tuples use less memory)</li>
    </ul>
  </li>
</ul>

<h4>Memory and Speed Optimization</h4>
<pre><code>
import sys

# Memory comparison
list_data = [1, 2, 3, 4, 5]
tuple_data = (1, 2, 3, 4, 5)

print(f"List size: {sys.getsizeof(list_data)} bytes")
print(f"Tuple size: {sys.getsizeof(tuple_data)} bytes")

# Speed comparison for large datasets
import time

# Creating large datasets
n = 1000000

# List creation time
start = time.time()
large_list = [i for i in range(n)]
list_time = time.time() - start

# Tuple creation time  
start = time.time()
large_tuple = tuple(range(n))
tuple_time = time.time() - start

print(f"List creation: {list_time:.4f}s")
print(f"Tuple creation: {tuple_time:.4f}s")
</code></pre>

<h3>Real-world AI Examples</h3>

<h4>Training Loop Implementation</h4>
<pre><code>
def training_loop(model, data, epochs):
    """Complete training loop using lists and tuples"""
    
    # Training metrics storage
    train_losses = []
    val_losses = []
    accuracies = []
    
    for epoch in range(epochs):
        # Training phase
        epoch_train_loss = 0
        for batch_idx, (features, labels) in enumerate(data):
            # Forward pass, loss calculation, backprop
            batch_loss = train_batch(model, features, labels)
            epoch_train_loss += batch_loss
            
        # Validation phase
        val_loss, accuracy = validate_model(model, val_data)
        
        # Store metrics
        train_losses.append(epoch_train_loss / len(data))
        val_losses.append(val_loss)
        accuracies.append(accuracy)
        
        # Progress reporting
        metrics = (epoch + 1, train_losses[-1], val_loss, accuracy)
        print(f"Epoch {metrics[0]}: Train Loss={metrics[1]:.4f}, "
              f"Val Loss={metrics[2]:.4f}, Accuracy={metrics[3]:.2%}")
    
    # Return training history as tuple
    return (train_losses, val_losses, accuracies)
</code></pre>

<h3>Common Pitfalls and Best Practices</h3>

<h4>Avoiding Shallow Copy Issues</h4>
<pre><code>
# Dangerous: Shallow copy
original_data = [[1, 2], [3, 4]]
copied_data = original_data.copy()  # Shallow copy
copied_data[0][0] = 999             # Modifies original!

# Safe: Deep copy for nested structures
import copy
deep_copied_data = copy.deepcopy(original_data)
deep_copied_data[0][0] = 999        # Original unchanged

# Best practice for AI data
def safe_data_split(dataset, split_ratio=0.8):
    """Safely split dataset without data leakage"""
    import random
    shuffled = dataset.copy()       # Shallow copy is fine here
    random.shuffle(shuffled)        # Shuffle the copy
    
    split_index = int(len(shuffled) * split_ratio)
    train_data = shuffled[:split_index]
    val_data = shuffled[split_index:]
    
    return train_data, val_data
</code></pre>

<h3>Integration with NumPy</h3>
<pre><code>
import numpy as np

# Converting between Python lists and NumPy arrays
python_list = [1, 2, 3, 4, 5]
numpy_array = np.array(python_list)         # List to array
back_to_list = numpy_array.tolist()         # Array to list

# Efficient data pipeline
def preprocess_batch(raw_data):
    """Convert list of data to NumPy for efficient computation"""
    # Data comes as list of tuples
    features = [item[0] for item in raw_data]
    labels = [item[1] for item in raw_data]
    
    # Convert to NumPy for vectorized operations
    X = np.array(features)
    y = np.array(labels)
    
    # Normalize features
    X = (X - X.mean(axis=0)) / X.std(axis=0)
    
    return X, y
</code></pre>
',
20,
true,
'Module 2: Data Structures & Control Flow'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 8 — Dictionaries and Sets for Data Organization (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Dictionaries and Sets for Data Organization',
'dictionaries-sets-data-organization',
'text',
7,
'<h2>Dictionaries and Sets in AI Development</h2><p>Content covers dictionaries for configuration management, feature mappings, and sets for unique data handling in AI applications.</p>',
15,
true,
'Module 2: Data Structures & Control Flow'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 9 — Conditional Statements for Decision Logic (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Conditional Statements for AI Decision Logic',
'conditional-statements-decision-logic',
'video',
8,
35,
'https://www.youtube.com/watch?v=DZwmZ8Usvnk',
'<h2>If/Else Statements in AI Applications</h2><p>Learn how conditional logic controls AI model behavior, data validation, and decision trees.</p>',
20,
true,
'Module 2: Data Structures & Control Flow'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 10 — Loops for Data Processing (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Loops for AI Data Processing',
'loops-data-processing',
'text',
9,
'<h2>For and While Loops in AI</h2><p>Master iteration techniques for training loops, data processing, and batch operations in machine learning.</p>',
15,
true,
'Module 2: Data Structures & Control Flow'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 11 — Exception Handling for Robust AI Systems (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Exception Handling for Robust AI Systems',
'exception-handling-robust-systems',
'text',
10,
'<h2>Error Handling in AI Applications</h2><p>Learn try/except blocks, error recovery strategies, and building fault-tolerant AI systems.</p>',
15,
true,
'Module 2: Data Structures & Control Flow'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 12 — Quiz: Data Structures and Control Flow (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Data Structures and Control Flow',
'quiz-data-structures-control-flow',
'quiz',
11,
'{"instructions": "Test your knowledge of Python data structures, conditional statements, loops, and exception handling.","questions": [{"question":"Which data structure is best for storing model hyperparameters?","options":["List","Tuple","Dictionary","Set"],"correctAnswer":2,"points":2}]}',
25,
true,
'Module 2: Assessment'
FROM courses WHERE slug = 'python-foundation-ai';

-- ================================================
-- MODULE 3: FUNCTIONS & OBJECT-ORIENTED PROGRAMMING (Lessons 13-18)
-- ================================================

-- Lesson 13 — Functions and Parameters for Code Modularity (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Functions and Parameters for AI Code Modularity',
'functions-parameters-modularity',
'video',
12,
40,
'https://www.youtube.com/watch?v=9Os0o3wzS_I',
'<h2>Building Modular AI Functions</h2><p>Learn to create reusable functions for data preprocessing, model training, and evaluation.</p>',
20,
true,
'Module 3: Functions & OOP'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 14 — Lambda Functions and Functional Programming (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Lambda Functions and Functional Programming for AI',
'lambda-functions-functional-programming',
'text',
13,
'<h2>Lambda Functions in Data Processing</h2><p>Master lambda functions, map(), filter(), and reduce() for efficient data transformations in AI pipelines.</p>',
15,
true,
'Module 3: Functions & OOP'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 15 — Classes and Objects for AI Model Architecture (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Classes and Objects for AI Model Architecture',
'classes-objects-model-architecture',
'video',
14,
45,
'https://www.youtube.com/watch?v=JeznW_7DlB0',
'<h2>Object-Oriented AI Development</h2><p>Design neural network classes, data preprocessors, and model architectures using OOP principles.</p>',
20,
true,
'Module 3: Functions & OOP'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 16 — Inheritance and Polymorphism in AI Systems (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Inheritance and Polymorphism in AI Systems',
'inheritance-polymorphism-ai-systems',
'text',
15,
'<h2>Advanced OOP for AI</h2><p>Implement inheritance hierarchies for different model types and use polymorphism for flexible AI architectures.</p>',
15,
true,
'Module 3: Functions & OOP'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 17 — Modules and Packages for AI Project Organization (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Modules and Packages for AI Project Organization',
'modules-packages-project-organization',
'text',
16,
'<h2>Organizing Large AI Projects</h2><p>Structure AI projects with modules, packages, and proper import strategies for maintainable code.</p>',
15,
true,
'Module 3: Functions & OOP'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 18 — Quiz: Functions and Object-Oriented Programming (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Functions and Object-Oriented Programming',
'quiz-functions-oop',
'quiz',
17,
'{"instructions": "Assess your understanding of functions, classes, inheritance, and code organization for AI development.","questions": [{"question":"What is the main benefit of using classes in AI model development?","options":["Faster execution","Code reusability","Less memory usage","Simpler syntax"],"correctAnswer":1,"points":2}]}',
25,
true,
'Module 3: Assessment'
FROM courses WHERE slug = 'python-foundation-ai';

-- ================================================
-- MODULE 4: DATA HANDLING WITH NUMPY & PANDAS (Lessons 19-24)
-- ================================================

-- Lesson 19 — Introduction to NumPy for Numerical Computing (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to NumPy for AI Numerical Computing',
'intro-numpy-numerical-computing',
'video',
18,
50,
'https://www.youtube.com/watch?v=QUT1VHiLmmI',
'<h2>NumPy: Foundation of AI Computing</h2><p>Master NumPy arrays, vectorized operations, and mathematical functions essential for AI and machine learning.</p>',
20,
true,
'Module 4: Data Handling'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 20 — NumPy Arrays and Mathematical Operations (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'NumPy Arrays and Mathematical Operations for AI',
'numpy-arrays-mathematical-operations',
'text',
19,
'<h2>Advanced NumPy for Machine Learning</h2><p>Deep dive into array manipulation, broadcasting, linear algebra operations, and performance optimization.</p>',
15,
true,
'Module 4: Data Handling'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 21 — Introduction to Pandas for Data Manipulation (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Pandas for AI Data Manipulation',
'intro-pandas-data-manipulation',
'video',
20,
45,
'https://www.youtube.com/watch?v=vmEHCJofslg',
'<h2>Pandas for AI Data Processing</h2><p>Learn DataFrames, data cleaning, preprocessing techniques, and preparing datasets for machine learning.</p>',
20,
true,
'Module 4: Data Handling'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 22 — Data Cleaning and Preprocessing Techniques (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Data Cleaning and Preprocessing for Machine Learning',
'data-cleaning-preprocessing-techniques',
'text',
21,
'<h2>Preparing Data for AI Models</h2><p>Handle missing values, outliers, feature scaling, encoding categorical variables, and data validation.</p>',
15,
true,
'Module 4: Data Handling'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 23 — Data Visualization with Matplotlib and Seaborn (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Data Visualization for AI Insights',
'data-visualization-ai-insights',
'text',
22,
'<h2>Visualizing AI Data and Results</h2><p>Create plots for exploratory data analysis, model performance visualization, and result interpretation.</p>',
15,
true,
'Module 4: Data Handling'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 24 — Quiz: Data Handling with NumPy and Pandas (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Data Handling with NumPy and Pandas',
'quiz-data-handling-numpy-pandas',
'quiz',
23,
'{"instructions": "Test your knowledge of NumPy arrays, Pandas DataFrames, data preprocessing, and visualization for AI.","questions": [{"question":"Which library is best for vectorized mathematical operations in AI?","options":["Pandas","NumPy","Matplotlib","Scikit-learn"],"correctAnswer":1,"points":2}]}',
25,
true,
'Module 4: Assessment'
FROM courses WHERE slug = 'python-foundation-ai';

-- ================================================
-- MODULE 5: MACHINE LEARNING FUNDAMENTALS (Lessons 25-30)
-- ================================================

-- Lesson 25 — Introduction to Machine Learning Concepts (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Machine Learning Concepts and Types',
'intro-machine-learning-concepts',
'video',
24,
55,
'https://www.youtube.com/watch?v=ukzFI9rgwfU',
'<h2>Machine Learning Fundamentals</h2><p>Understand supervised, unsupervised, and reinforcement learning with practical Python examples.</p>',
20,
true,
'Module 5: Machine Learning'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 26 — Scikit-learn for Machine Learning Implementation (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Scikit-learn for Machine Learning Implementation',
'scikit-learn-ml-implementation',
'text',
25,
'<h2>Practical ML with Scikit-learn</h2><p>Implement classification, regression, clustering algorithms and model evaluation using Scikit-learn.</p>',
15,
true,
'Module 5: Machine Learning'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 27 — Model Training and Evaluation Techniques (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Model Training and Evaluation Techniques',
'model-training-evaluation-techniques',
'video',
26,
40,
'https://www.youtube.com/watch?v=fSytzGwwBVw',
'<h2>Training and Validating ML Models</h2><p>Learn cross-validation, hyperparameter tuning, performance metrics, and avoiding overfitting.</p>',
20,
true,
'Module 5: Machine Learning'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 28 — Feature Engineering and Selection (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Feature Engineering and Selection for Better Models',
'feature-engineering-selection',
'text',
27,
'<h2>Advanced Feature Engineering</h2><p>Create meaningful features, handle categorical data, dimensionality reduction, and feature importance analysis.</p>',
15,
true,
'Module 5: Machine Learning'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 29 — Introduction to Deep Learning with TensorFlow (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Introduction to Deep Learning with TensorFlow and Keras',
'intro-deep-learning-tensorflow',
'text',
28,
'<h2>Deep Learning Foundations</h2><p>Build neural networks with TensorFlow/Keras, understand layers, activation functions, and gradient descent.</p>',
15,
true,
'Module 5: Machine Learning'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 30 — Quiz: Machine Learning Fundamentals (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Quiz: Machine Learning Fundamentals',
'quiz-machine-learning-fundamentals',
'quiz',
29,
'{"instructions": "Evaluate your understanding of ML concepts, algorithms, model evaluation, and deep learning basics.","questions": [{"question":"What is the main purpose of cross-validation in machine learning?","options":["Increase accuracy","Assess model generalization","Reduce training time","Simplify code"],"correctAnswer":1,"points":2}]}',
25,
true,
'Module 5: Assessment'
FROM courses WHERE slug = 'python-foundation-ai';

-- ================================================
-- MODULE 6: BUILDING REAL AI APPLICATIONS (Lessons 31-36)
-- ================================================

-- Lesson 31 — Computer Vision with OpenCV and PIL (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Computer Vision with OpenCV and PIL',
'computer-vision-opencv-pil',
'video',
30,
50,
'https://www.youtube.com/watch?v=oXlwWbU8l2o',
'<h2>AI Computer Vision Applications</h2><p>Process images, detect objects, apply filters, and build computer vision applications with Python.</p>',
20,
true,
'Module 6: Real AI Applications'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 32 — Natural Language Processing Basics (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Natural Language Processing Fundamentals',
'natural-language-processing-basics',
'text',
31,
'<h2>NLP with Python</h2><p>Text preprocessing, tokenization, sentiment analysis, and building chatbots with NLTK and spaCy.</p>',
15,
true,
'Module 6: Real AI Applications'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 33 — Building a Complete AI Project (Video) - 20 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  video_duration_minutes, video_url, text_content,
  xp_reward, is_published, module_name
)
SELECT id,
'Building a Complete End-to-End AI Project',
'building-complete-ai-project',
'video',
32,
60,
'https://www.youtube.com/watch?v=MqZgoNV0OsA',
'<h2>End-to-End AI Development</h2><p>Create a complete AI project from data collection to model deployment and monitoring.</p>',
20,
true,
'Module 6: Real AI Applications'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 34 — Model Deployment and Production Considerations (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Model Deployment and Production Best Practices',
'model-deployment-production',
'text',
33,
'<h2>Deploying AI Models</h2><p>Learn Flask/FastAPI for model serving, containerization with Docker, cloud deployment, and monitoring.</p>',
15,
true,
'Module 6: Real AI Applications'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 35 — AI Ethics and Responsible Development (Text) - 15 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'AI Ethics and Responsible Development Practices',
'ai-ethics-responsible-development',
'text',
34,
'<h2>Ethical AI Development</h2><p>Understand bias, fairness, privacy, transparency, and responsible AI practices in modern development.</p>',
15,
true,
'Module 6: Real AI Applications'
FROM courses WHERE slug = 'python-foundation-ai';


-- Lesson 36 — Final Project: Capstone AI Application (Quiz) - 25 XP
INSERT INTO lessons (
  course_id, title, slug, content_type, order_index,
  text_content, xp_reward, is_published, module_name
)
SELECT id,
'Final Assessment: Python Foundation for AI Mastery',
'final-assessment-python-ai-mastery',
'quiz',
35,
'{"instructions": "Comprehensive assessment covering all modules: Python fundamentals, data structures, OOP, NumPy/Pandas, machine learning, and AI applications.","questions": [{"question":"Which Python feature is most important for AI development scalability?","options":["List comprehensions","Object-oriented programming","Exception handling","Lambda functions"],"correctAnswer":1,"points":3}]}',
25,
true,
'Module 6: Final Assessment'
FROM courses WHERE slug = 'python-foundation-ai';

-- =============================================
-- DONE! Verify the lessons were created with XP:
-- =============================================
SELECT title, slug, content_type, xp_reward, module_name, order_index
FROM lessons
WHERE course_id = (SELECT id FROM courses WHERE slug = 'python-foundation-ai')
ORDER BY order_index;