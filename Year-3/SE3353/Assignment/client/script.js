const result = document.getElementById('result');
const calc = document.getElementsByClassName('calc')[0];

const func = ['(', ')', '+', '-', '/', '*', '='];

let calculation = '';

let actions = [];

calc.addEventListener('click', (event) => {
    const isBtm = event.target.nodeName === 'BUTTON';
    let action = {};
    action[Date.now()] = event.target.innerText;

    actions.push(action);

    if (!isBtm){
        return;
    }
    
    let input = event.target.innerText;

    if (func.includes(input)){
        input = ` ${input} `;
    }

    if (input.includes('=')){
        fetch('http://localhost:5500/calc', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'calc': calculation
            })
        })
        .then(res => {return res.json()})
        .then(data => result.innerText = data.msg);
    }
    else{
        calculation += input;
        result.innerText = calculation;
    }


    fetch('http://localhost:5500/saveActions', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'actions': actions
            })
        })
});
