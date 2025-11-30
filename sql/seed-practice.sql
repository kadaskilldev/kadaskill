-- ============================================
-- Seed Data: Practice Exercises v2.0
-- Multiple Choice Format (5-10 questions each)
-- ============================================

INSERT INTO practice_exercises (slug, title, description, category, difficulty, questions, passing_score, time_limit_minutes, xp_reward, thumbnail_url, tags, is_published) VALUES

-- AI Practice Exercises
('python-basics-variables',
 'Python Basics: Variables and Data Types',
 'Test your knowledge of Python variables, data types, and basic operations.',
 'AI', 'Beginner',
 '[
   {
     "question": "Which of the following is the correct way to declare a variable in Python?",
     "options": ["var x = 5", "int x = 5", "x = 5", "let x = 5"],
     "correct_answer": 2,
     "explanation": "In Python, you simply assign a value to a variable name without declaring its type. Python is dynamically typed."
   },
   {
     "question": "What is the data type of the value True in Python?",
     "options": ["String", "Integer", "Boolean", "Float"],
     "correct_answer": 2,
     "explanation": "True (and False) are Boolean values in Python, used for logical operations."
   },
   {
     "question": "Which function is used to display output in Python?",
     "options": ["echo()", "print()", "console.log()", "display()"],
     "correct_answer": 1,
     "explanation": "The print() function is used to display output to the console in Python."
   },
   {
     "question": "What will be the output of: print(type(3.14))?",
     "options": ["<class ''int''>", "<class ''float''>", "<class ''str''>", "<class ''decimal''>"],
     "correct_answer": 1,
     "explanation": "3.14 is a floating-point number, so type() returns <class ''float''>."
   },
   {
     "question": "Which symbol is used for comments in Python?",
     "options": ["//", "/* */", "#", "<!--"],
     "correct_answer": 2,
     "explanation": "The # symbol is used for single-line comments in Python."
   }
 ]'::jsonb,
 70, 10, 10,
 '/images/practice/python-basics.png',
 ARRAY['python', 'basics', 'variables', 'data-types'],
 true),

('numpy-arrays',
 'NumPy Array Operations',
 'Test your understanding of NumPy arrays and common operations.',
 'AI', 'Intermediate',
 '[
   {
     "question": "Which NumPy function creates an array?",
     "options": ["np.create()", "np.array()", "np.new()", "np.make()"],
     "correct_answer": 1,
     "explanation": "np.array() is the standard function to create NumPy arrays from Python lists or tuples."
   },
   {
     "question": "What does np.mean() calculate?",
     "options": ["Median", "Mode", "Average", "Standard deviation"],
     "correct_answer": 2,
     "explanation": "np.mean() calculates the arithmetic mean (average) of array elements."
   },
   {
     "question": "How do you select all elements greater than 5 in array ''arr''?",
     "options": ["arr > 5", "arr[arr > 5]", "select(arr > 5)", "filter(arr, 5)"],
     "correct_answer": 1,
     "explanation": "arr[arr > 5] uses boolean indexing to select elements that meet the condition."
   },
   {
     "question": "What is the shape of an array created with np.zeros((3, 4))?",
     "options": ["(4, 3)", "(3, 4)", "(12,)", "(7,)"],
     "correct_answer": 1,
     "explanation": "np.zeros((3, 4)) creates a 2D array with 3 rows and 4 columns, shape (3, 4)."
   },
   {
     "question": "Which operation multiplies each element of array by 2?",
     "options": ["arr + 2", "arr * 2", "arr ** 2", "arr / 2"],
     "correct_answer": 1,
     "explanation": "In NumPy, arr * 2 performs element-wise multiplication, multiplying each element by 2."
   },
   {
     "question": "What does arr.reshape(2, 3) do?",
     "options": ["Changes array to 2 rows and 3 columns", "Adds 2 rows and 3 columns", "Removes 2 rows", "Creates new array"],
     "correct_answer": 0,
     "explanation": "reshape() reorganizes array elements into specified dimensions (2 rows, 3 columns)."
   }
 ]'::jsonb,
 70, 15, 20,
 '/images/practice/numpy.png',
 ARRAY['python', 'numpy', 'arrays', 'data-science'],
 true),

('pandas-dataframes',
 'Pandas DataFrame Basics',
 'Test your knowledge of Pandas DataFrames and data manipulation.',
 'AI', 'Intermediate',
 '[
   {
     "question": "Which function creates a DataFrame from a dictionary?",
     "options": ["pd.create()", "pd.DataFrame()", "pd.table()", "pd.new()"],
     "correct_answer": 1,
     "explanation": "pd.DataFrame() creates a DataFrame from various data structures including dictionaries."
   },
   {
     "question": "How do you select rows where column ''age'' is greater than 25?",
     "options": ["df.age > 25", "df[df[''age''] > 25]", "df.select(age > 25)", "df.where(age > 25)"],
     "correct_answer": 1,
     "explanation": "df[df[''age''] > 25] uses boolean indexing to filter rows based on a condition."
   },
   {
     "question": "What does df.head() display by default?",
     "options": ["First 10 rows", "First 5 rows", "Last 5 rows", "All rows"],
     "correct_answer": 1,
     "explanation": "df.head() displays the first 5 rows of the DataFrame by default."
   },
   {
     "question": "Which method calculates the mean of a column?",
     "options": ["df[''column''].avg()", "df[''column''].mean()", "df[''column''].average()", "df[''column''].sum()"],
     "correct_answer": 1,
     "explanation": "The mean() method calculates the average of numeric columns."
   },
   {
     "question": "How do you add a new column ''total'' to a DataFrame?",
     "options": ["df.add(''total'')", "df[''total''] = values", "df.insert(''total'')", "df.column(''total'')"],
     "correct_answer": 1,
     "explanation": "You can add a new column by assigning values to df[''column_name'']."
   },
   {
     "question": "What does df.describe() show?",
     "options": ["Column names", "Statistical summary", "First 5 rows", "Data types"],
     "correct_answer": 1,
     "explanation": "describe() generates descriptive statistics including count, mean, std, min, max, etc."
   },
   {
     "question": "How do you remove rows with missing values?",
     "options": ["df.remove_na()", "df.dropna()", "df.delete_missing()", "df.clean()"],
     "correct_answer": 1,
     "explanation": "dropna() removes rows (or columns) that contain missing (NaN) values."
   }
 ]'::jsonb,
 70, 15, 25,
 '/images/practice/pandas.png',
 ARRAY['python', 'pandas', 'data-science', 'dataframes'],
 true),

('machine-learning-fundamentals',
 'Machine Learning Fundamentals',
 'Test your understanding of basic machine learning concepts.',
 'AI', 'Intermediate',
 '[
   {
     "question": "What type of ML learns from labeled data?",
     "options": ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
     "correct_answer": 1,
     "explanation": "Supervised learning uses labeled training data where each example has an input and corresponding output."
   },
   {
     "question": "Which algorithm is used for classification?",
     "options": ["Linear Regression", "K-Means", "Logistic Regression", "PCA"],
     "correct_answer": 2,
     "explanation": "Logistic Regression is a classification algorithm despite having ''regression'' in its name."
   },
   {
     "question": "What is overfitting?",
     "options": ["Model too simple", "Model memorizes training data", "Model underfits", "Model has no bias"],
     "correct_answer": 1,
     "explanation": "Overfitting occurs when a model learns training data too well, including noise, and performs poorly on new data."
   },
   {
     "question": "What is the purpose of a validation set?",
     "options": ["Train the model", "Test final performance", "Tune hyperparameters", "Store data"],
     "correct_answer": 2,
     "explanation": "The validation set is used to tune model hyperparameters and prevent overfitting during training."
   },
   {
     "question": "Which metric measures classification accuracy?",
     "options": ["MSE", "RMSE", "Accuracy Score", "R-squared"],
     "correct_answer": 2,
     "explanation": "Accuracy score measures the ratio of correct predictions to total predictions in classification."
   }
 ]'::jsonb,
 70, 12, 20,
 '/images/practice/ml-basics.png',
 ARRAY['machine-learning', 'ai', 'fundamentals'],
 true),

-- Cybersecurity Practice Exercises
('mfa-scenario',
 'Multi-Factor Authentication (MFA) Concepts',
 'Test your knowledge of multi-factor authentication and security best practices.',
 'Cybersecurity', 'Beginner',
 '[
   {
     "question": "What does MFA stand for?",
     "options": ["Multi-File Authentication", "Multi-Factor Authentication", "Main Frame Access", "Mobile First Application"],
     "correct_answer": 1,
     "explanation": "MFA stands for Multi-Factor Authentication, which requires multiple forms of verification to access an account."
   },
   {
     "question": "Which is NOT a common factor in MFA?",
     "options": ["Something you know (password)", "Something you have (phone)", "Something you are (fingerprint)", "Something you want (preference)"],
     "correct_answer": 3,
     "explanation": "The three main factors are: knowledge (password), possession (device), and inherence (biometric)."
   },
   {
     "question": "Why is SMS-based 2FA less secure?",
     "options": ["Too slow", "Vulnerable to SIM swapping", "Hard to use", "Not supported"],
     "correct_answer": 1,
     "explanation": "SMS 2FA is vulnerable to SIM swapping attacks where attackers can intercept text messages."
   },
   {
     "question": "What is the most secure MFA method?",
     "options": ["SMS codes", "Email codes", "Hardware tokens (YubiKey)", "Security questions"],
     "correct_answer": 2,
     "explanation": "Hardware tokens like YubiKey are the most secure as they''re resistant to phishing and can''t be remotely compromised."
   },
   {
     "question": "When should MFA be required?",
     "options": ["Only for admin accounts", "Optional for all users", "Before granting access", "After logging in"],
     "correct_answer": 2,
     "explanation": "MFA should be required before granting access to ensure the person logging in is who they claim to be."
   },
   {
     "question": "What is TOTP?",
     "options": ["Type of password", "Time-based One-Time Password", "Total Password", "Token Password"],
     "correct_answer": 1,
     "explanation": "TOTP (Time-based One-Time Password) generates temporary codes that expire, used by apps like Google Authenticator."
   }
 ]'::jsonb,
 70, 12, 15,
 '/images/practice/mfa-scenario.png',
 ARRAY['cybersecurity', 'authentication', 'mfa', '2fa'],
 true),

('secrets-in-code',
 'Identifying Secrets in Code',
 'Learn to spot hardcoded credentials and security vulnerabilities in source code.',
 'Cybersecurity', 'Beginner',
 '[
   {
     "question": "What is wrong with: API_KEY = \"sk_live_abc123xyz789\" in source code?",
     "options": ["Nothing wrong", "Hardcoded secret exposed", "Wrong syntax", "Too short"],
     "correct_answer": 1,
     "explanation": "Hardcoding API keys in source code exposes them to anyone with code access or if committed to version control."
   },
   {
     "question": "Where should API keys be stored?",
     "options": ["In the code", "In comments", "In environment variables", "In README"],
     "correct_answer": 2,
     "explanation": "API keys should be stored in environment variables or secure secrets management systems, never in code."
   },
   {
     "question": "Which file should NEVER be committed to Git?",
     "options": [".env", "README.md", "package.json", "index.html"],
     "correct_answer": 0,
     "explanation": ".env files contain sensitive environment variables and should be excluded from version control via .gitignore."
   },
   {
     "question": "What is a best practice for database passwords in code?",
     "options": ["Hardcode them", "Put in comments", "Use environment variables", "Share publicly"],
     "correct_answer": 2,
     "explanation": "Database passwords should be stored in environment variables or secrets managers, never hardcoded."
   },
   {
     "question": "What tool can help detect secrets in commits?",
     "options": ["git-secrets", "npm install", "prettier", "eslint"],
     "correct_answer": 0,
     "explanation": "Tools like git-secrets, GitGuardian, or TruffleHog scan commits for accidentally committed secrets."
   },
   {
     "question": "If you accidentally commit a secret to Git, what should you do?",
     "options": ["Delete the file", "Nothing, it''s fine", "Rotate the secret immediately", "Make repo private"],
     "correct_answer": 2,
     "explanation": "You must immediately rotate (change) the secret because Git history persists even if you delete the file."
   },
   {
     "question": "Which is a sign of a hardcoded API key?",
     "options": ["os.getenv(''API_KEY'')", "API_KEY = ''sk_live_...''", "config.api_key", "process.env.API_KEY"],
     "correct_answer": 1,
     "explanation": "A string value directly assigned to a variable (especially with prefixes like sk_, pk_) indicates a hardcoded key."
   }
 ]'::jsonb,
 70, 15, 20,
 '/images/practice/secrets-in-code.png',
 ARRAY['cybersecurity', 'secure-coding', 'secrets', 'best-practices'],
 true),

('phishing-detection',
 'Phishing Email Detection',
 'Learn to identify phishing emails and social engineering attempts.',
 'Cybersecurity', 'Beginner',
 '[
   {
     "question": "What is a red flag in email sender: security@paypa1-support.com?",
     "options": ["Nothing wrong", "Uses number 1 instead of letter l", "Too long", "No .com"],
     "correct_answer": 1,
     "explanation": "''paypa1'' uses number 1 instead of letter l - this is typosquatting, a common phishing technique."
   },
   {
     "question": "Which email greeting suggests phishing?",
     "options": ["Hello John Smith", "Dear Valued Customer", "Hi John", "Hello Mr. Smith"],
     "correct_answer": 1,
     "explanation": "Generic greetings like ''Dear Customer'' suggest the sender doesn''t know you personally - common in phishing."
   },
   {
     "question": "An email says ''Your account will be closed in 24 hours!'' This creates:",
     "options": ["Urgency", "Confusion", "Happiness", "Curiosity"],
     "correct_answer": 0,
     "explanation": "Phishing emails create urgency to bypass rational thinking and pressure you into clicking quickly."
   },
   {
     "question": "What should you do when receiving a suspicious link?",
     "options": ["Click it immediately", "Hover to check URL", "Forward to friends", "Reply to email"],
     "correct_answer": 1,
     "explanation": "Hover over links to see the actual URL before clicking. Legitimate companies use their official domains."
   },
   {
     "question": "Which URL is likely phishing for PayPal?",
     "options": ["https://paypal.com", "https://www.paypal.com/signin", "http://paypal-verify.tk", "https://paypal.com/security"],
     "correct_answer": 2,
     "explanation": "paypal-verify.tk uses a different domain (.tk) and subdomain - not the official paypal.com site."
   },
   {
     "question": "Best way to verify a security alert email?",
     "options": ["Click the link", "Reply to email", "Log in via official website directly", "Call the number in email"],
     "correct_answer": 2,
     "explanation": "Always navigate to the official website directly (bookmark or type URL) rather than clicking email links."
   },
   {
     "question": "What is ''typosquatting''?",
     "options": ["Typing fast", "Using similar-looking domain names", "Squatting on website", "Typo in email"],
     "correct_answer": 1,
     "explanation": "Typosquatting uses domain names that look similar to legitimate ones (e.g., goog1e.com vs google.com)."
   },
   {
     "question": "Which helps prevent phishing?",
     "options": ["Clicking all links", "Disabling 2FA", "Using password manager", "Ignoring HTTPS"],
     "correct_answer": 2,
     "explanation": "Password managers auto-fill only on legitimate sites, preventing credential entry on phishing sites."
   }
 ]'::jsonb,
 70, 18, 25,
 '/images/practice/phishing.png',
 ARRAY['cybersecurity', 'phishing', 'social-engineering', 'email-security'],
 true),

-- Cloud Practice Exercises
('aws-s3-security',
 'AWS S3 Bucket Security',
 'Test your knowledge of AWS S3 security best practices.',
 'Cloud', 'Beginner',
 '[
   {
     "question": "What is the most secure default setting for S3 buckets?",
     "options": ["Public access", "Private with no access", "Block all public access", "Open to internet"],
     "correct_answer": 2,
     "explanation": "AWS recommends blocking all public access by default and granting access only when explicitly needed."
   },
   {
     "question": "Which encryption should be enabled on S3 buckets?",
     "options": ["No encryption", "Server-side encryption", "Client-only encryption", "Email encryption"],
     "correct_answer": 1,
     "explanation": "Server-side encryption (SSE-S3, SSE-KMS, or SSE-C) should be enabled to encrypt data at rest."
   },
   {
     "question": "What is bucket versioning used for?",
     "options": ["Speed", "Protect against deletion", "Reduce cost", "Improve latency"],
     "correct_answer": 1,
     "explanation": "Versioning keeps multiple versions of objects, protecting against accidental deletion or overwrites."
   },
   {
     "question": "Which service should you use to serve S3 content globally?",
     "options": ["EC2", "CloudFront", "Route 53", "Lambda"],
     "correct_answer": 1,
     "explanation": "CloudFront CDN caches and serves S3 content from edge locations for better performance and security."
   },
   {
     "question": "What does an S3 bucket policy control?",
     "options": ["CPU usage", "Who can access bucket objects", "Encryption type", "Storage class"],
     "correct_answer": 1,
     "explanation": "Bucket policies define permissions for who can access objects in the bucket and what actions they can perform."
   },
   {
     "question": "Should you store credentials in S3?",
     "options": ["Yes, always", "No, use Secrets Manager", "Only in private buckets", "Only encrypted"],
     "correct_answer": 1,
     "explanation": "Credentials should be stored in AWS Secrets Manager or Parameter Store, not in S3 buckets."
   },
   {
     "question": "What is the principle of least privilege for S3?",
     "options": ["Give everyone access", "Give minimum necessary permissions", "Block all access", "Public by default"],
     "correct_answer": 1,
     "explanation": "Grant only the minimum permissions necessary for users/applications to perform their required tasks."
   }
 ]'::jsonb,
 70, 15, 20,
 '/images/practice/aws-s3.png',
 ARRAY['cloud', 'aws', 's3', 'security', 'storage'],
 true),

('shared-responsibility-model',
 'Cloud Shared Responsibility Model',
 'Understand the division of security responsibilities in cloud computing.',
 'Cloud', 'Beginner',
 '[
   {
     "question": "Who is responsible for physical data center security?",
     "options": ["Customer", "Cloud Provider", "Both", "Third party"],
     "correct_answer": 1,
     "explanation": "Cloud providers (AWS, Azure, GCP) handle physical security of data centers, hardware, and infrastructure."
   },
   {
     "question": "Who is responsible for operating system patches on EC2?",
     "options": ["Cloud Provider", "Customer", "Automatic", "Not needed"],
     "correct_answer": 1,
     "explanation": "For IaaS like EC2, customers are responsible for OS patching. Providers handle this for managed services."
   },
   {
     "question": "Who manages network firewall configuration?",
     "options": ["Cloud Provider", "Customer", "Automatic", "No one"],
     "correct_answer": 1,
     "explanation": "Customers configure security groups, NACLs, and firewall rules for their resources."
   },
   {
     "question": "Who is responsible for application security?",
     "options": ["Cloud Provider", "Customer", "Both", "Third party"],
     "correct_answer": 1,
     "explanation": "Customers are responsible for securing their applications, including code, input validation, and authentication."
   },
   {
     "question": "Who handles hardware maintenance?",
     "options": ["Customer", "Cloud Provider", "Both", "Vendor"],
     "correct_answer": 1,
     "explanation": "Cloud providers maintain, repair, and replace hardware infrastructure."
   },
   {
     "question": "Who manages IAM user permissions?",
     "options": ["Cloud Provider", "Customer", "Automatic", "AI"],
     "correct_answer": 1,
     "explanation": "Customers create and manage IAM users, roles, and policies for access control."
   },
   {
     "question": "Data encryption is responsibility of:",
     "options": ["Provider only", "Customer only", "Shared", "Neither"],
     "correct_answer": 2,
     "explanation": "Providers offer encryption tools; customers decide what to encrypt and manage encryption keys."
   },
   {
     "question": "What phrase summarizes the model?",
     "options": ["Security FOR the cloud", "Security OF vs IN the cloud", "Cloud is secure", "Provider does everything"],
     "correct_answer": 1,
     "explanation": "Security OF the cloud (provider) vs Security IN the cloud (customer) defines the shared model."
   }
 ]'::jsonb,
 70, 15, 20,
 '/images/practice/shared-responsibility.png',
 ARRAY['cloud', 'aws', 'azure', 'gcp', 'security', 'compliance'],
 true),

('cloud-basics',
 'Cloud Computing Fundamentals',
 'Test your understanding of basic cloud computing concepts.',
 'Cloud', 'Beginner',
 '[
   {
     "question": "What does IaaS stand for?",
     "options": ["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Information as a Service"],
     "correct_answer": 1,
     "explanation": "IaaS (Infrastructure as a Service) provides virtualized computing resources like servers, storage, and networking."
   },
   {
     "question": "Which is an example of PaaS?",
     "options": ["AWS EC2", "Google App Engine", "Dropbox", "Gmail"],
     "correct_answer": 1,
     "explanation": "Platform as a Service (PaaS) like Google App Engine provides a platform for developers to build apps without managing infrastructure."
   },
   {
     "question": "What is the main benefit of cloud computing?",
     "options": ["More expensive", "Scalability and flexibility", "Requires more hardware", "Slower"],
     "correct_answer": 1,
     "explanation": "Cloud computing offers scalability (scale up/down as needed) and flexibility without large upfront investments."
   },
   {
     "question": "What does ''elasticity'' mean in cloud?",
     "options": ["Rubber servers", "Automatically scale resources", "Fixed capacity", "Manual scaling"],
     "correct_answer": 1,
     "explanation": "Elasticity means resources automatically scale up or down based on demand."
   },
   {
     "question": "Which cloud deployment model is for single organization?",
     "options": ["Public cloud", "Private cloud", "Hybrid cloud", "Community cloud"],
     "correct_answer": 1,
     "explanation": "Private cloud is dedicated to a single organization, offering more control and security."
   }
 ]'::jsonb,
 70, 10, 15,
 '/images/practice/cloud-basics.png',
 ARRAY['cloud', 'fundamentals', 'basics', 'iaas', 'paas', 'saas'],
 true);

-- Verify insertion
SELECT slug, title, category, difficulty, jsonb_array_length(questions) as question_count, xp_reward
FROM practice_exercises
ORDER BY category, difficulty;
