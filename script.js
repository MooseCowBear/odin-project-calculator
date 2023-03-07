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
        console.log("hit clear!");
        clear();
        return;
    }
    else if (event.target.id === "equals") { 
        console.log("hit equals!");
        operands.push(parseFloat(screen.innerText));
        console.log("OPERANDS", operands, operators);

        if (operators.length > 0) {
            console.log("enough operators to evalaute!");
            let calculation = evaluate();
            console.log("calc = ", calculation);
            screen.innerText = `${truncate(calculation)}`;
        }
        //need to allow all buttons
        enableButtons(".number", ".decimal", ".op"); 
        continuingNumber = true;
        console.log("after equals", operands, operators);
    }
    else if (event.target.classList.contains("binary")) { //got a binary op
        console.log("hit binary op!");
        continuingNumber = false;
        operands.push(parseFloat(screen.innerText)); //took what was in display before and added it to the stack to be evaluated
        console.log("OPERANDS AFTER HITTING BINARY OP", operands, operators);

        if (operators.length > 0) {
            console.log("enough operators to evalaute!");
            let calculation = evaluate();
            console.log("calc = ", calculation);
            screen.innerText = `${truncate(calculation)}`; //now ready for a number
            operands.push(parseFloat(screen.innerText));
        }
        operators.push(event.target.id);
        enableButtons(".decimal", ".number");
        disableButtons(".binary");
    }
    else if (!event.target.classList.contains("op")) { //got a number
        console.log("hit number!");
        console.log("OPERANDS", operands);
        if (!continuingNumber || screen.innerText === "0") {
            screen.innerText = ""; 
        }
        screen.innerText += event.target.innerText; 
        enableButtons(".binary");
        continuingNumber = true;
    }
    else if (event.target.classList.contains("unary")) { //unary operator
        console.log("OPERANDS", operands);
        console.log("hit unary op!");
        continuingNumber = false;
        let number = parseFloat(screen.innerText);
        number = evaluateUnary(event.target.id, number);
        screen.innerText = `${number}`;
        disableButtons(".number");
    }
    else if (event.target.classList.contains(".decimal")) { 
        console.log("OPERANDS", operands);
        console.log("hit decimal!");
        disableButtons(".decimal");
        screen.innerText += ".";
    }
    
});

function clear() {
    wantOperator = false;
    numberOkay = true;
    operators = [];
    operands = [];

    screen.innerText = "0"; 
    enableButtons(".number", ".decimal", ".op");
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
    console.log("evaluating....");
    console.log("operators", operators);
    console.log("operands", operands);
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