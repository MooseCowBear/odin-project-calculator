const TOTAL_DIGITS_DISPLAYED = 12; 

let operators = []; 
let operands = []; 

let wantOperator = false;
let numberOkay = true;
let continuingNumber = false;

const screen = document.querySelector(".screen");
const keysWrapper = document.querySelector(".keys-wrapper");

keysWrapper.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton){
        return;
    }
    else if (event.target.id === "clear") {
        console.log("hit clear button!");
        clearAll();
        return;
    }
    else if (event.target.id === "equals") { 
        console.log("hit equals!");
        executeEquals();
    }
    else if (event.target.classList.contains("decimal")) {  //still bug, this one where 0. needs be added 
        addDecimal();
    }
    else if (event.target.classList.contains("binary")) { 
        console.log("hit binary op!");
        addBinaryOperator(event.target.id);
    }
    else if (event.target.classList.contains("number")) { 
        console.log("hit number!");
        addNumber();
    }

    else if (event.target.classList.contains("unary")) { //unary operator - can this just be be?
        console.log("hit unary op!");
        executeUnary(event.target.id);
    }
    
});

function clearAll() {
    wantOperator = false;
    numberOkay = true;
    operators = [];
    operands = [];

    screen.innerText = "0"; 
    enableButtons(".number", ".decimal", ".op");
}

function executeEquals() {
    let number = parseFloat(screen.innerText); //get whatever is on the screen
        if (!isNaN(number)){
            operands.push(number); //if it's not our error message, push it to the operand stack
        }
        console.log("OPERANDS", operands, operators);

        if (operators.length > 0) { //check that we can perform a calculation
            let calculation = evaluate();
            console.log("CALC = ", calculation);

            if (isFinite(calculation)){ 
                screen.innerText = `${truncate(calculation)}`;
            }
            else {
                screen.innerText = "Nuh uh uh..."; //warning for divide by zero
                operands.push(0);
            }
        }
        enableButtons(".number", ".decimal", ".op"); //enable any disabled buttons
        continuingNumber = false;
        console.log("after equals", operands, operators);
}

function addDecimal() {
    if (continuingNumber) {
        console.log("OPERANDS", operands);
        console.log("hit decimal!");
        disableButtons(".decimal");
        screen.innerText += ".";
    }
}

function addBinaryOperator(id) {
    continuingNumber = false;
    let number = parseFloat(screen.innerText); 
    if (!isNaN(number)){
        operands.push(number);
    }
        console.log("OPERANDS AFTER HITTING BINARY OP", operands, operators);

    if (operators.length > 0) {
        console.log("enough operators to evalaute!");
        let calculation = evaluate();
        console.log("calc = ", calculation);
        if (isFinite(calculation)){
            screen.innerText = `${truncate(calculation)}`;
            operands.push(parseFloat(screen.innerText));
        }
        else {
            screen.innerText = "Nuh uh uh...";
            operands.push(0); //just reset
        }
    }
    operators.push(id);
    enableButtons(".decimal", ".number");
    disableButtons(".binary");
}

function addNumber() {
    console.log("OPERANDS", operands);
    if (!continuingNumber || screen.innerText === "0") {
        screen.innerText = ""; 
    }
    screen.innerText += event.target.innerText; 
    enableButtons(".op");
    continuingNumber = true;
}

function executeUnary(id) {
    continuingNumber = false;
    let number = parseFloat(screen.innerText);
    if (!isNaN(number)){
        number = evaluateUnary(id, number);
        screen.innerText = `${number}`;
        disableButtons(".number");
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

    console.log("evaluting with operands", operands, "and operators", operators);
    const op = operators.pop();
    const x = operands.pop();
    const y = operands.pop(); 

    console.log("x, y", x, y, op);

    let result; 
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