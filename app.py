from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'secret_key'

# ✅ This sets proper CORS policy
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}}, supports_credentials=True)

#@app.after_request
#   response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
 #   response.headers.add('Access-Control-Allow-Credentials', 'true')
  #  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
   # response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    #return response



questions_by_level = {
    1: [
        {"id": 1, "question": "Print Hello World", "expected_output": "Hello World"},
        {"id": 2, "question": "Print 2 + 2", "expected_output": "4"},
        {"id": 3, "question": "Print the square of 5", "expected_output": "25"},
        {"id": 4, "question": "Print 'Python is fun'", "expected_output": "Python is fun"},
        {"id": 5, "question": "Print 10 * 10", "expected_output": "100"},
        {"id": 6, "question": "Print the sum of 3 and 7", "expected_output": "10"},
        {"id": 7, "question": "Print 50 - 8", "expected_output": "42"},
        {"id": 8, "question": "Print the result of 12 / 4", "expected_output": "3.0"},
        {"id": 9, "question": "Print 2 to the power 3", "expected_output": "8"},
        {"id": 10, "question": "Print the string 'Level 1 Done!'", "expected_output": "Level 1 Done!"}
    ],
    2: [
        {"id": 1, "question": "Print numbers from 1 to 5 using a loop", "expected_output": "1\n2\n3\n4\n5"},
        {"id": 2, "question": "Print the sum of numbers from 1 to 100", "expected_output": "5050"},
        {"id": 3, "question": "Print even numbers between 1 and 10", "expected_output": "2\n4\n6\n8\n10"},
        {"id": 4, "question": "Print the length of the string 'Python'", "expected_output": "6"},
        {"id": 5, "question": "Print the reverse of 'hello'", "expected_output": "olleh"},
        {"id": 6, "question": "Print whether 7 is prime", "expected_output": "True"},
        {"id": 7, "question": "Print all characters in 'code'", "expected_output": "c\no\nd\ne"},
        {"id": 8, "question": "Print 5 factorial", "expected_output": "120"},
        {"id": 9, "question": "Print the first character of 'banana'", "expected_output": "b"},
        {"id": 10, "question": "Print ASCII value of 'A'", "expected_output": "65"}
    ],
    3: [
        {"id": 1, "question": "Define a function that returns square of a number and call it for 4", "expected_output": "16"},
        {"id": 2, "question": "Define a list [1, 2, 3] and print its length", "expected_output": "3"},
        {"id": 3, "question": "Define a dictionary {'a':1, 'b':2} and print value for key 'b'", "expected_output": "2"},
        {"id": 4, "question": "Print whether 'x' is in 'example'", "expected_output": "True"},
        {"id": 5, "question": "Define a function that checks if number is even and call it for 6", "expected_output": "True"},
        {"id": 6, "question": "Print all elements of [10, 20, 30] using a loop", "expected_output": "10\n20\n30"},
        {"id": 7, "question": "Create a set with elements 1, 2, 3 and print it", "expected_output": "{1, 2, 3}"},
        {"id": 8, "question": "Sort [3, 1, 2] and print it", "expected_output": "[1, 2, 3]"},
        {"id": 9, "question": "Print 2 decimal places of 3.14159", "expected_output": "3.14"},
        {"id": 10, "question": "Print the current level (should be 3)", "expected_output": "3"}
    ]
}


@app.route('/')
def home():
    session['level'] = 1
    session['correct'] = 0
    return render_template('index.html', level=1, questions=questions_by_level[1])


@app.route('/submit', methods=['POST'])
def submit():
    print("Submit route hit!")
    code = request.form['code']
    expected = request.form['expected_output'].strip()

    filename = f'/tmp/{uuid.uuid4().hex}.py'
    with open(filename, 'w') as f:
        f.write(code)

    try:
        result = subprocess.run(['python3', filename], capture_output=True, text=True, timeout=2)
        output = result.stdout.strip()
    except Exception as e:
        output = str(e)

    correct = output == expected
    allow_next = False
    if correct:
        session['correct'] += 1
        if session['correct'] >= 5:
            allow_next = True

    return jsonify({'output': output, 'correct': correct, 'allow_next': allow_next})


@app.route('/next_level', methods=['POST'])
def next_level():
    if session['correct'] >= 5:
        session['level'] += 1
        session['correct'] = 0
        level = session['level']
        if level > 3:
            return jsonify({'status': 'completed', 'message': 'All levels completed!'})
        return jsonify({'status': 'moved', 'level': level, 'questions': questions_by_level[level]})
    return jsonify({'status': 'stay'})


if __name__ == '__main__':
    app.run(debug=True)
