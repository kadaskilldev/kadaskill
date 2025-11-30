-- ============================================
-- Seed Data: Lessons
-- ============================================
-- This file populates the lessons table with sample lessons for courses

-- ============================================
-- Python Foundation for AI - Lessons
-- ============================================

-- Lesson 1: Introduction to Python (Video)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, video_duration_minutes, video_url, text_content, is_published)
SELECT id,
       'Introduction to Python Programming',
       'intro-python',
       'video',
       0,
       15,
       'https://www.youtube.com/watch?v=kqtD5dpn9C8',
       '<h2>Welcome to Python Programming!</h2>
       <p>In this lesson, you will learn the basics of Python programming and why it''s perfect for AI development.</p>
       <h3>What you''ll learn:</h3>
       <ul>
         <li>What is Python and why use it?</li>
         <li>Python syntax basics</li>
         <li>Setting up your development environment</li>
         <li>Writing your first Python program</li>
       </ul>',
       true
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 2: Variables and Data Types (Text)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, text_content, is_published, module_name)
SELECT id,
       'Variables and Data Types',
       'variables-data-types',
       'text',
       1,
       '<h2>Understanding Variables and Data Types</h2>
       <p>Variables are containers for storing data values. Python has various data types including:</p>

       <h3>Basic Data Types</h3>
       <ul>
         <li><strong>int</strong> - Integer numbers (e.g., 5, -3, 1000)</li>
         <li><strong>float</strong> - Decimal numbers (e.g., 3.14, -0.5)</li>
         <li><strong>str</strong> - Text strings (e.g., "Hello", ''Python'')</li>
         <li><strong>bool</strong> - Boolean values (True or False)</li>
       </ul>

       <h3>Creating Variables</h3>
       <pre><code class="language-python"># Variable assignment
name = "Alice"
age = 25
height = 5.6
is_student = True

# Multiple assignment
x, y, z = 1, 2, 3

# Type checking
print(type(name))  # &lt;class ''str''&gt;
print(type(age))   # &lt;class ''int''&gt;</code></pre>

       <h3>Type Conversion</h3>
       <pre><code class="language-python"># Converting between types
num_str = "100"
num_int = int(num_str)    # String to integer
num_float = float(num_int) # Integer to float
back_to_str = str(num_float) # Float to string

print(num_int)    # 100
print(num_float)  # 100.0</code></pre>

       <h3>Try It Yourself</h3>
       <p>Create variables for your name, age, and favorite number. Print them out and check their types!</p>',
       true,
       'Module 1: Python Basics'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 3: Basic Operations (Text with Code)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, text_content, is_published, module_name)
SELECT id,
       'Basic Arithmetic and String Operations',
       'basic-operations',
       'text',
       2,
       '<h2>Basic Operations in Python</h2>

       <h3>Arithmetic Operations</h3>
       <pre><code class="language-python"># Arithmetic Operations
a = 10
b = 3

addition = a + b        # 13
subtraction = a - b     # 7
multiplication = a * b  # 30
division = a / b        # 3.333...
floor_division = a // b # 3
modulus = a % b         # 1
exponent = a ** b       # 1000

print(f"Addition: {addition}")
print(f"Division: {division}")</code></pre>

       <h3>String Operations</h3>
       <pre><code class="language-python">first_name = "John"
last_name = "Doe"

# Concatenation
full_name = first_name + " " + last_name
print(full_name)  # John Doe

# String repetition
laugh = "ha" * 3
print(laugh)  # hahaha

# String methods
message = "Hello, World!"
print(message.upper())      # HELLO, WORLD!
print(message.lower())      # hello, world!
print(message.replace("World", "Python"))  # Hello, Python!

# String formatting
age = 25
greeting = f"I am {age} years old"
print(greeting)</code></pre>',
       true,
       'Module 1: Python Basics'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 4: Lists and Tuples (Text)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, text_content, is_published, module_name)
SELECT id,
       'Working with Lists and Tuples',
       'lists-tuples',
       'text',
       3,
       '<h2>Python Collections: Lists and Tuples</h2>

       <h3>Lists</h3>
       <p>Lists are ordered, mutable collections that can hold different data types.</p>
       <pre><code class="language-python"># Creating lists
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
empty_list = []

# Accessing elements (indexing starts at 0)
print(numbers[0])   # 1
print(numbers[-1])  # 5 (last element)

# Slicing
print(numbers[1:4])  # [2, 3, 4]
print(numbers[:3])   # [1, 2, 3]
print(numbers[2:])   # [3, 4, 5]

# Modifying lists
numbers[0] = 10
numbers.append(6)      # Add to end
numbers.insert(0, 0)   # Insert at position
numbers.remove(3)      # Remove first occurrence
popped = numbers.pop() # Remove and return last element

# List methods
numbers.sort()         # Sort in place
numbers.reverse()      # Reverse in place
length = len(numbers)  # Get length</code></pre>

       <h3>Tuples</h3>
       <p>Tuples are ordered, immutable collections. Once created, they cannot be modified.</p>
       <pre><code class="language-python"># Creating tuples
coordinates = (10, 20)
single_item = (5,)  # Note the comma
mixed_tuple = (1, "hello", 3.14)

# Accessing elements
x = coordinates[0]
y = coordinates[1]

# Tuple unpacking
x, y = coordinates

# Tuples are immutable
# coordinates[0] = 15  # This would raise an error!

# Use cases for tuples
# - Returning multiple values from functions
# - Dictionary keys (lists can''t be used as keys)
# - Data that shouldn''t change</code></pre>

       <h3>When to Use Which?</h3>
       <ul>
         <li>Use <strong>lists</strong> when you need to modify the collection</li>
         <li>Use <strong>tuples</strong> when the data should remain constant</li>
       </ul>',
       true,
       'Module 1: Python Basics'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 5: Dictionaries (Video + Text)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, video_duration_minutes, video_url, text_content, is_published, module_name)
SELECT id,
       'Python Dictionaries',
       'dictionaries',
       'video',
       4,
       20,
       'https://www.youtube.com/watch?v=daefaLgNkw0',
       '<h2>Understanding Dictionaries</h2>
       <p>Dictionaries are key-value pairs, perfect for storing related data.</p>

       <h3>Key Concepts</h3>
       <pre><code class="language-python"># Creating dictionaries
student = {
    "name": "Alice",
    "age": 20,
    "courses": ["Math", "Physics", "CS"],
    "gpa": 3.8
}

# Accessing values
print(student["name"])        # Alice
print(student.get("age"))     # 20
print(student.get("grade", "N/A"))  # N/A (default value)

# Modifying dictionaries
student["age"] = 21           # Update value
student["email"] = "alice@example.com"  # Add new key-value
del student["gpa"]            # Remove key-value

# Dictionary methods
keys = student.keys()         # Get all keys
values = student.values()     # Get all values
items = student.items()       # Get key-value pairs

# Checking if key exists
if "name" in student:
    print("Name found!")

# Looping through dictionary
for key, value in student.items():
    print(f"{key}: {value}")</code></pre>',
       true,
       'Module 2: Data Structures'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 6: Control Flow - If Statements (Text)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, text_content, is_published, module_name)
SELECT id,
       'Control Flow: If Statements',
       'if-statements',
       'text',
       5,
       '<h2>Making Decisions with If Statements</h2>

       <h3>Basic If Statement</h3>
       <pre><code class="language-python">age = 18

if age >= 18:
    print("You are an adult")

# If-else
if age >= 18:
    print("You can vote")
else:
    print("You cannot vote yet")

# If-elif-else
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")</code></pre>

       <h3>Comparison Operators</h3>
       <ul>
         <li><code>==</code> - Equal to</li>
         <li><code>!=</code> - Not equal to</li>
         <li><code>&gt;</code> - Greater than</li>
         <li><code>&lt;</code> - Less than</li>
         <li><code>&gt;=</code> - Greater than or equal to</li>
         <li><code>&lt;=</code> - Less than or equal to</li>
       </ul>

       <h3>Logical Operators</h3>
       <pre><code class="language-python"># AND - Both conditions must be True
age = 25
has_license = True

if age >= 18 and has_license:
    print("You can drive")

# OR - At least one condition must be True
is_weekend = True
is_holiday = False

if is_weekend or is_holiday:
    print("Time to relax!")

# NOT - Reverses the condition
is_raining = False

if not is_raining:
    print("Let''s go outside!")</code></pre>',
       true,
       'Module 2: Data Structures'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 7: Loops - For and While (Text)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, text_content, is_published, module_name)
SELECT id,
       'Loops: For and While',
       'loops',
       'text',
       6,
       '<h2>Loops in Python</h2>

       <h3>For Loops</h3>
       <pre><code class="language-python"># Iterate over a range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# Iterate over a string
for char in "Python":
    print(char)

# Enumerate - get index and value
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")</code></pre>

       <h3>While Loops</h3>
       <pre><code class="language-python">count = 0
while count < 5:
    print(f"Count is {count}")
    count += 1</code></pre>

       <h3>Loop Control</h3>
       <pre><code class="language-python"># Continue - skip to next iteration
for i in range(10):
    if i % 2 == 0:  # Skip even numbers
        continue
    print(i)  # Only prints odd numbers

# Break - exit loop
for i in range(10):
    if i == 5:
        break
    print(i)  # Prints 0-4

# List comprehension
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]</code></pre>',
       true,
       'Module 2: Data Structures'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 8: Functions (Text)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, text_content, is_published, module_name)
SELECT id,
       'Creating and Using Functions',
       'functions',
       'text',
       7,
       '<h2>Functions in Python</h2>
       <p>Functions are reusable blocks of code that perform specific tasks.</p>

       <h3>Defining Functions</h3>
       <pre><code class="language-python"># Basic function
def greet():
    print("Hello, World!")

greet()  # Call the function

# Function with parameters
def greet_person(name):
    print(f"Hello, {name}!")

greet_person("Alice")

# Function with return value
def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # 8

# Function with default parameters
def greet_with_title(name, title="Mr."):
    print(f"Hello, {title} {name}!")

greet_with_title("Smith")           # Hello, Mr. Smith!
greet_with_title("Johnson", "Dr.")  # Hello, Dr. Johnson!</code></pre>

       <h3>Multiple Return Values</h3>
       <pre><code class="language-python">def get_stats(numbers):
    total = sum(numbers)
    average = total / len(numbers)
    minimum = min(numbers)
    maximum = max(numbers)
    return total, average, minimum, maximum

nums = [1, 2, 3, 4, 5]
t, a, min_val, max_val = get_stats(nums)
print(f"Total: {t}, Average: {a}")</code></pre>

       <h3>Variable-length Arguments</h3>
       <pre><code class="language-python"># *args for variable number of arguments
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3))        # 6
print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs for keyword arguments
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="NYC")</code></pre>',
       true,
       'Module 3: Functions'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 9: Quiz - Python Basics (Quiz)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, text_content, is_published, module_name)
SELECT id,
       'Quiz: Python Basics',
       'quiz-python-basics',
       'quiz',
       8,
       '{
         "instructions": "Test your understanding of Python basics! You need to score at least 70% to pass.",
         "questions": [
           {
             "question": "Which of the following is NOT a valid Python data type?",
             "options": [
               "int",
               "float",
               "char",
               "str"
             ],
             "correctAnswer": 2,
             "points": 1
           },
           {
             "question": "What will be the output of: print(type(5.0))?",
             "options": [
               "<class ''int''>",
               "<class ''float''>",
               "<class ''str''>",
               "<class ''number''>"
             ],
             "correctAnswer": 1,
             "points": 1
           },
           {
             "question": "Which operator is used for exponentiation in Python?",
             "options": [
               "^",
               "**",
               "pow",
               "//"
             ],
             "correctAnswer": 1,
             "points": 1
           },
           {
             "question": "What is the result of: ''hello'' * 3?",
             "options": [
               "Error",
               "''hello3''",
               "''hellohellohello''",
               "9"
             ],
             "correctAnswer": 2,
             "points": 1
           },
           {
             "question": "How do you create a variable in Python?",
             "options": [
               "var x = 5",
               "int x = 5",
               "x = 5",
               "declare x = 5"
             ],
             "correctAnswer": 2,
             "points": 1
           }
         ]
       }',
       true,
       'Module 1: Python Basics'
FROM courses WHERE slug = 'python-foundation-ai';

-- Lesson 10: Quiz - Data Structures (Quiz)
INSERT INTO lessons (course_id, title, slug, content_type, order_index, text_content, is_published, module_name)
SELECT id,
       'Quiz: Lists, Tuples & Dictionaries',
       'quiz-data-structures',
       'quiz',
       9,
       '{
         "instructions": "Test your knowledge of Python data structures. Remember, you need 70% to pass!",
         "questions": [
           {
             "question": "Which data structure is immutable in Python?",
             "options": [
               "List",
               "Dictionary",
               "Tuple",
               "Set"
             ],
             "correctAnswer": 2,
             "points": 1
           },
           {
             "question": "How do you access the last element of a list called ''numbers''?",
             "options": [
               "numbers[last]",
               "numbers[-1]",
               "numbers[end]",
               "numbers.last()"
             ],
             "correctAnswer": 1,
             "points": 1
           },
           {
             "question": "What is the correct way to create an empty dictionary?",
             "options": [
               "dict = []",
               "dict = ()",
               "dict = {}",
               "dict = <>"
             ],
             "correctAnswer": 2,
             "points": 1
           },
           {
             "question": "Which method adds an item to the end of a list?",
             "options": [
               "add()",
               "append()",
               "insert()",
               "push()"
             ],
             "correctAnswer": 1,
             "points": 1
           }
         ]
       }',
       true,
       'Module 2: Data Structures'
FROM courses WHERE slug = 'python-foundation-ai';

-- ============================================
-- To use this file:
-- ============================================
-- 1. First, make sure you have imported the courses seed file
-- 2. Then run this file in your Supabase SQL editor
-- 3. The lessons will be automatically linked to the correct course using the slug
