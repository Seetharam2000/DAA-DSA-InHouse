let userXP = localStorage.getItem("userXP") ? parseInt(localStorage.getItem("userXP")) : 0;
let userLevel = localStorage.getItem("userLevel") ? parseInt(localStorage.getItem("userLevel")) : 1;
let workspace;

document.addEventListener("DOMContentLoaded", function () {
    let workspace;
    let progressBar = document.getElementById("progressBar");

    let userXP = localStorage.getItem("userXP") ? parseInt(localStorage.getItem("userXP")) : 0;
    let userLevel = localStorage.getItem("userLevel") ? parseInt(localStorage.getItem("userLevel")) : 1;
    let lastUsedDate = localStorage.getItem("lastUsedDate");

    // Streak System
    function updateStreak() {
        let today = new Date().toDateString();
        if (lastUsedDate !== today) {
            userXP += 10; // Reward daily streak XP
            lastUsedDate = today;
            localStorage.setItem("lastUsedDate", today);
            updateXPDisplay();
        }
    }

    // Update XP and Level
    function updateXP(amount) {
        userXP += amount;
        localStorage.setItem("userXP", userXP);

        if (userXP >= userLevel * 50) {
            userLevel++;
            localStorage.setItem("userLevel", userLevel);
            alert("Level Up! New blocks unlocked.");
            setDifficulty(); // Refresh workspace with new unlocked blocks
        }

        updateXPDisplay();
    }

    function updateXPDisplay() {
        document.getElementById("xpDisplay").innerText = `XP: ${userXP} | Level: ${userLevel}`;
    }

    // Toolbox categories for different difficulty levels
    function getToolbox(level) {
        let baseBlocks = `<xml>
        <category name="Math" colour="#5CA6A6">
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
        </category>

        <category name="Text" colour="#5C68A6">
            <block type="text"></block>
            <block type="text_print"></block>
        </category>`;

        let intermediateBlocks = `<category name="Loops" colour="#5CA65C">
            <block type="controls_repeat_ext"></block>
            <block type="controls_whileUntil"></block>
        </category>`;

        let advancedBlocks = `<category name="Logic" colour="#5C81A6">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
        </category>`;

        // Unlock blocks based on level
        if (userLevel >= 3) baseBlocks += intermediateBlocks;
        if (userLevel >= 5) baseBlocks += advancedBlocks;

        return baseBlocks + `</xml>`;
    }

    window.resetXP = function () {
        localStorage.setItem("userXP", 0);
        localStorage.setItem("userLevel", 1);
        localStorage.removeItem("lastUsedDate"); // Reset streak
        userXP = 0;
        userLevel = 1;
        updateXPDisplay();
        setDifficulty(); // Reload blocks based on level 1
    };
    

    // Initialize Blockly workspace
    function initBlockly(level = "basic") {
        if (workspace) workspace.dispose();
        workspace = Blockly.inject('blocklyDiv', { toolbox: getToolbox(level) });
        updateProgress(level);
    }

    // Set difficulty level and update Blockly workspace
    window.setDifficulty = function () {
        let level = document.getElementById("difficulty").value;
        initBlockly(level);
    };

    // Update progress bar based on difficulty level
    function updateProgress(level) {
        let width = level === "basic" ? "33%" : level === "intermediate" ? "66%" : "100%";
        progressBar.style.width = width;
    }

    // Generate code for selected language
    window.generateCode = function () {
        let language = document.getElementById("language").value;
        let code = "";

        if (language === "python") {
            code = Blockly.Python.workspaceToCode(workspace);
        } else if (language === "c") {
            code = `#include <stdio.h>\n#include <stdlib.h>\nint main() {\n${Blockly.JavaScript.workspaceToCode(workspace).replace(/window\.alert/g, "printf")}\nreturn 0;\n}`;
        } else if (language === "c++") {
            let cppCode = Blockly.JavaScript.workspaceToCode(workspace)
                .replace(/console\.log\(/g, "cout << ")   // Replace `console.log(` with `cout << `
                .replace(/\);/g, " << endl;");  // Ensure semicolons and newlines are handled
            code = `#include <iostream>\nusing namespace std;\nint main() {\n${cppCode}\nreturn 0;\n}`;
        }  else if (language === "javascript") {
            code = Blockly.JavaScript.workspaceToCode(workspace);
        }

        document.getElementById("codeOutput").innerText = code;
        updateXP(10); // Earn XP for generating code
    };

    // Run the generated code
    window.runCode = function () {
        let language = document.getElementById("language").value;
        let code = document.getElementById("codeOutput").innerText;

        fetch("http://127.0.0.1:5000/run_code", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code, language: language })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById("codeOutput").innerText = "Error: " + data.error;
                } else {
                    document.getElementById("codeOutput").innerText = "Output:\n" + data.output;
                    updateXP(20); // Earn XP for running code successfully
                }
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("codeOutput").innerText = "Failed to connect to server. Make sure Flask is running.";
            });
    };

    // Initialize XP and streaks
    updateStreak();
    updateXPDisplay();

    // Initialize Blockly workspace on page load
    initBlockly();
});
let currentChallengeIndex = 0;
let correctAnswers = 0;

const allChallenges = {
    1: [
        { question: "Print numbers 1 to 5 using a loop.", keywords: ["for", "console.log"], xp: 10 },
        { question: "Add two numbers and print the result.", keywords: ["+", "console.log"], xp: 10 },
        { question: "Print 'Hello World' using text block.", keywords: ["console.log", "'Hello"], xp: 10 },
        { question: "Subtract one number from another.", keywords: ["-", "console.log"], xp: 10 },
        { question: "Multiply two numbers.", keywords: ["*", "console.log"], xp: 10 },
        { question: "Divide one number by another.", keywords: ["/", "console.log"], xp: 10 },
        { question: "Use a variable to store a number.", keywords: ["let", "="], xp: 10 },
        { question: "Print a text and number together.", keywords: ["+", "console.log"], xp: 10 },
        { question: "Create a loop that counts to 3.", keywords: ["for", "3"], xp: 10 },
        { question: "Use an if block to check if 5 > 3.", keywords: ["if", ">"], xp: 10 }
    ],
    2: [
        { question: "Use an if-else block to check even/odd.", keywords: ["if", "%", "else"], xp: 15 },
        { question: "Use a while loop to print 1 to 3.", keywords: ["while", "<=", "console.log"], xp: 15 },
        { question: "Check if a number is negative.", keywords: ["if", "<"], xp: 15 },
        { question: "Create a function that returns a number.", keywords: ["function", "return"], xp: 15 },
        { question: "Declare an array of 3 items.", keywords: ["[", "]"], xp: 15 },
        { question: "Access second item in an array.", keywords: ["[1]"], xp: 15 },
        { question: "Loop through an array using for loop.", keywords: ["for", "[", "]"], xp: 15 },
        { question: "Use logical AND (&&) in a condition.", keywords: ["&&"], xp: 15 },
        { question: "Use >= in an if statement.", keywords: [">="], xp: 15 },
        { question: "Use the NOT (!) operator.", keywords: ["!"], xp: 15 }
    ],
    3: [
        { question: "Write a function to calculate factorial.", keywords: ["function", "return", "*"], xp: 20 },
        { question: "Use a nested loop to print pattern.", keywords: ["for", "for"], xp: 20 },
        { question: "Check if a string contains a word.", keywords: [".includes"], xp: 20 },
        { question: "Reverse an array.", keywords: [".reverse"], xp: 20 },
        { question: "Sort an array.", keywords: [".sort"], xp: 20 },
        { question: "Use a switch statement.", keywords: ["switch", "case"], xp: 20 },
        { question: "Throw and catch an error.", keywords: ["try", "catch"], xp: 20 },
        { question: "Create an object with 2 properties.", keywords: ["{", ":", "}"], xp: 20 },
        { question: "Loop through object keys.", keywords: ["for", "in"], xp: 20 },
        { question: "Use map function on an array.", keywords: [".map"], xp: 20 }
    ]
};

window.startChallenge = function () {
    currentChallengeIndex = 0;
    correctAnswers = 0;
    showChallenge();
};

function showChallenge() {
    let currentLevelChallenges = allChallenges[userLevel];
    if (!currentLevelChallenges) {
        alert("You've completed all levels!");
        return;
    }

    if (currentChallengeIndex >= currentLevelChallenges.length) {
        if (correctAnswers >= 5) {
            alert("You passed the level! Level up!");
            userLevel++;
            localStorage.setItem("userLevel", userLevel);
            updateXPDisplay();
            setDifficulty();
        } else {
            alert("You got less than 5 correct. Try again!");
        }
        document.getElementById("challengeModal").style.display = "none";
        return;
    }

    const challenge = currentLevelChallenges[currentChallengeIndex];
    document.getElementById("challengeText").innerText = `Question ${currentChallengeIndex + 1}: ${challenge.question}`;
    document.getElementById("challengeModal").style.display = "flex";
    document.getElementById("challengeResult").innerText = "";
}

window.checkChallenge = function () {
    const challenge = allChallenges[userLevel][currentChallengeIndex];
    const userCode = Blockly.JavaScript.workspaceToCode(workspace);

    const isCorrect = challenge.keywords.every(kw => userCode.includes(kw));

    if (isCorrect) {
        correctAnswers++;
        updateXP(challenge.xp);
        document.getElementById("challengeResult").innerText = "Correct!";
    } else {
        document.getElementById("challengeResult").innerText = "Incorrect. Try next one.";
    }

    currentChallengeIndex++;
    setTimeout(() => {
        showChallenge();
    }, 1500);
};
