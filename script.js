document.addEventListener('DOMContentLoaded', function () {
  const mathInput = document.getElementById('mathInput');
  const buttons = document.querySelectorAll('button.btn');
  const themeSwitcher = document.getElementById('themeSwitcher');
  let currentInput = '';
  let memory = 0;

  const operators = ['+', '-', '*', '/', '^', '%'];

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleButtonClick(button.getAttribute('data-action'));
    });
  });

  // Handle keyboard input
  document.addEventListener('keydown', function (event) {
    const key = event.key;
    if (!isNaN(key) || key === '.') { // Numbers and decimal point
      handleButtonClick(key);
    } else if (operators.includes(key)) {
      handleButtonClick(key);
    } else if (key === 'Enter' || key === '=') {
      handleButtonClick('='); // Trigger equals button logic
    } else if (key === 'Backspace') {
      handleButtonClick('delete');
    } else if (key === 'Escape') {
      handleButtonClick('CLR');
    } else if (key === 'π') {
      handleButtonClick('π');
    } else if (key === '√') {
      handleButtonClick('√');
    } else if (key === 'l') { // Assuming 'l' for 'ln'
      handleButtonClick('ln');
    } else if (key === 's') { // Assuming 's' for 'sin'
      handleButtonClick('sin');
    } else if (key === 'c') { // Assuming 'c' for 'cos'
      handleButtonClick('cos');
    } else if (key === 't') { // Assuming 't' for 'tan'
      handleButtonClick('tan');
    } else if (key === '(') {
      handleButtonClick('(');
    } else if (key === ')') {
      handleButtonClick(')');
    }
  });

  // Theme switcher functionality
  themeSwitcher.addEventListener('change', () => {
    if (themeSwitcher.checked) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  });

  function handleButtonClick(action) {
    if (action === 'CLR') {
      currentInput = '';
      mathInput.value = currentInput;
    } else if (action === 'delete') {
      if (mathInput.value === 'Error') {
        currentInput = ''; // Clear the entire 'Error' message
      } else {
        currentInput = currentInput.slice(0, -1); // Delete the last character
      }
      mathInput.value = currentInput;
    } else if (operators.includes(action) && operators.includes(currentInput.slice(-1))) {
      // Prevent consecutive operators
      return;
    } else if (action === '=') {
      try {
        // Replace special functions with JavaScript equivalents for evaluation
        let expression = currentInput.replace(/π/g, 'Math.PI')
                                     .replace(/√/g, 'Math.sqrt')
                                     .replace(/log\(/g, 'Math.log10(')
                                     .replace(/ln\(/g, 'Math.log(') // Natural logarithm
                                     .replace(/sin\(/g, 'Math.sin(radians(') // sin
                                     .replace(/cos\(/g, 'Math.cos(radians(') // cos
                                     .replace(/tan\(/g, 'Math.tan(radians(') // tan
                                     .replace(/\^/g, '**')
                                     .replace(/%/g, '*0.01'); // Convert % to its decimal form

        // Add function to convert degrees to radians
        expression = `function radians(degrees) {
          return degrees * Math.PI / 180;
        }; ${expression}`;

        // Balance parentheses
        const openParens = (expression.match(/\(/g) || []).length;
        const closeParens = (expression.match(/\)/g) || []).length;
        const missingParens = openParens - closeParens;
        expression += ')'.repeat(missingParens);

        // Debugging: Log the expression before evaluating
        console.log("Expression to evaluate:", expression);

        // Evaluate the expression
        currentInput = eval(expression).toString();
      } catch (e) {
        console.error("Error evaluating expression:", e);
        currentInput = 'Error';
      }
      mathInput.value = currentInput;
    } else {
      if (action === 'π') {
        currentInput += 'π';
      } else if (action === '√') {
        currentInput += '√(';
      } else if (action === 'log') {
        currentInput += 'log(';
      } else if (action === 'ln') {
        currentInput += 'ln(';
      } else if (action === 'sin') {
        currentInput += 'sin(';
      } else if (action === 'cos') {
        currentInput += 'cos(';
      } else if (action === 'tan') {
        currentInput += 'tan(';
      } else {
        currentInput += action;
      }
      mathInput.value = currentInput;
    }

    if (mathInput.value === 'Error') {
      mathInput.classList.add('error'); // Add error styling
    } else {
      mathInput.classList.remove('error');
    }
  }

  // Skin changer
  function setSkin(skin) {
    document.body.classList.remove('skin-rounded', 'skin-flat');
    document.body.classList.add(skin);
    localStorage.setItem('calculatorSkin', skin);
  }

  // Load saved preferences
  const savedSkin = localStorage.getItem('calculatorSkin') || 'skin-flat';
  setSkin(savedSkin);
});
