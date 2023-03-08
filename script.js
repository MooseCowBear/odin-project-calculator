const TOTAL_DIGITS_DISPLAYED = 12; 

let operators = []; 
let operands = []; 

let wantOperator = false;
let numberOkay = true;
let continuingNumber = false; 

const clearButton = document.getElementById("clear"); //for switching between "ac" and "c"

const screen = document.querySelector(".screen");
const keysWrapper = document.querySelector(".keys-wrapper");

keysWrapper.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton){
        return;
    }
    else if (event.target.id === "clear") {
        //need to check the inner text to see if "ac" or "c"
        if (event.target.innerText === "ac"){
            clearAll();
        }
        else {
            clear();
        }
    }
    else if (event.target.id === "equals") { 
        executeEquals();
    }
    else if (event.target.classList.contains("decimal")) {  
        addDecimal();
    }
    else if (event.target.classList.contains("binary")) {  
        addBinaryOperator(event.target);
    }
    else if (event.target.classList.contains("number")) {  
        addNumber(event.target.innerText);
    }
    else { //unary operator 
        executeUnary(event.target.id);
    }
});

//using key board 
window.addEventListener("keydown", (event) => {
    if (event.code === "Backspace"){ //delete key
        if (clearButton.innerText === "ac") {
            clearAll();
        }
        else {
            clear();
        }
    }
    else if (event.code === "Period") {
        addDecimal();
    }
    //binary operators
    else if (event.code === "Equal" && event.shiftKey) {//plus
        const addButton = document.getElementById("add");
        addBinaryOperator(addButton);
    }
    else if (event.code === "Minus") { //subtract
        const subtractButton = document.getElementById("subtract");
        addBinaryOperator(subtractButton);
    }
    else if (event.code === "Digit8" && event.shiftKey) { //multiply
        const multiplyButton = document.getElementById("multiply");
        addBinaryOperator(multiplyButton);
    }
    else if (event.code === "Slash") { //divide
        const divideButton = document.getElementById("divide");
        addBinaryOperator(divideButton);
    }
    //unary ops
    else if (event.code === "Digit5" && event.shiftKey) { //% sign
        executeUnary("percent");
    }
    else if (event.code === "Digit1" && event.shiftKey) { //using ! for negation
        executeUnary("negate");
    }
    //numbers 
    else if (event.code.startsWith("Digit")) {
        const value = event.key; 
        addNumber(value);
    }
    else if (event.code === "Equal" || event.code === "Enter") { //return or equals
        executeEquals();
    }
});

function highlightSelectedOp(target) {
    //remove highlighting from any previously selected binary op
    removeHighlight();
    target.classList.add("selected");
}

function removeHighlight() {
    const binaryOps = document.querySelectorAll(".binary");
    binaryOps.forEach(elem => {
        elem.classList.remove("selected");
    });
}

function clearAll() {
    wantOperator = false;
    numberOkay = true;
    operators = [];
    operands = [];
    screen.innerText = "0"; 
    removeHighlight();
    enableButtons(".number", ".decimal", ".op");
}

function executeEquals() {
    continuingNumber = false;
    performCalculationAndDisplay(); //don't need to hang on to this
    enableButtons(".number", ".decimal", ".op"); //enable any disabled buttons
    clearButton.innerText = "ac";
    removeHighlight();
}

function addDecimal() {
    if (continuingNumber) {
        disableButtons(".decimal");
        screen.innerText += ".";
    }
    else { //after an equals or, after a binary operator, or after unary operator if press decimal want inner text to be "0."
        disableButtons(".decimal");
        screen.innerText = "0.";
        continuingNumber = true;
        enableButtons(".number");

        //here would change ac to c
        clearButton.innerText = "c";
    }
}

function addBinaryOperator(target) {
    let calculated = performCalculationAndDisplay();
    operators.push(target.id);
    enableButtons(".decimal", ".number");
    disableButtons(".op");
    continuingNumber = false;
    if (calculated) { //want to push result to the stack
        let number = parseFloat(screen.innerText); 
        if (!isNaN(number)) {  //if it's not our error message
            operands.push(number);
        }
    }
    highlightSelectedOp(target); 
}

function performCalculationAndDisplay() { 
    let number = parseFloat(screen.innerText); //get whatever is on the screen
    if (!isNaN(number)){
        operands.push(number); //if it's not our error message, push it to the operand stack
    }
    if (operators.length > 0) { //check that we can perform a calculation
        let calculation = evaluate();

        if (isFinite(calculation)){ 
            screen.innerText = `${truncate(calculation)}`;
            return true;
        }
        else {
            screen.innerText = "Nuh uh uh..."; //warning for divide by zero
            operands.push(0);
            removeHighlight();
        }
    }
    return false;
}

function addNumber(numeral) {
    if (!continuingNumber || screen.innerText === "0") {
        screen.innerText = ""; 
    }
    screen.innerText += numeral; 
    enableButtons(".op");
    continuingNumber = true;

    //here would change ac to c
    clearButton.innerText = "c";
}

function clear() {
    //number has not yet been added to stack, so just replace screen with 0
    screen.innerText = "0";
    //change back to "ac" in button innertext
    clearButton.innerText = "ac";
}

function executeUnary(id) {
    continuingNumber = false;
    let number = parseFloat(screen.innerText);
    if (!isNaN(number)){
        number = evaluateUnary(id, number);
        screen.innerText = `${number}`;
        continuingNumber = false; 
    }
    else {
        operands.push(0);
    }
}

//controlling the input by disabling, enabling buttons 
function disableButtons() {
    for (let i = 0; i < arguments.length; i++) {
        const buttons = document.querySelectorAll(arguments[i]);
        buttons.forEach(elem => {
            elem.disabled = true;
        });
    }
}

function enableButtons() {
    for (let i = 0; i < arguments.length; i++) {
        const buttons = document.querySelectorAll(arguments[i]);
        buttons.forEach(elem => {
            elem.disabled = false;
        });
    }
}

function evaluate() {
    const op = operators.pop();
    const x = operands.pop();
    const y = operands.pop(); 

    if (op === "add"){
        return y + x;
    }
    else if (op === "subtract"){
        return y - x;
    }
    else if (op === "multiply"){
        return y * x;
    }
    else {
        return y / x; 
    }
}

function evaluateUnary(op, value) {
    if (op == "negate") {
        return -value;
    }
    return value / 100; 
}

function truncate(float) {
    const asStr = `${float}`;
    const numdigits = asStr.length;

    if (numdigits > 12 && Math.round(float) > 10**12) {
        return float.toExponential(2);
    }
    else if (numdigits > 12) {
        const asInt = `${Math.round(float)}`;
        const digits = asInt.length; 
        return Math.round(float * 10**(TOTAL_DIGITS_DISPLAYED - digits)) / 10**(TOTAL_DIGITS_DISPLAYED - digits); 
    }
    return float;
}