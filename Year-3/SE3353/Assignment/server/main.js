const express = require('express');
const csvWriter = require('csv-write-stream');
const fs = require('fs');
const cors = require('cors');


const nums = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "0": 0
}

const app = express();
const port = 5500;

app.use(express.json());
app.use(cors());
app.use(express.static('../client'));


app.get('/', (req, res) => {
    res.render('../client/index.html');
});

app.post('/calc', (req, res) => {
    let calc = req.body.calc.split(' ');

    calc = calc.filter(elem => elem);
    let result = 0;
    let tempVal = 0;
    let priority = 0;

    for (item of calc){
        switch(x){
            case '(':
                priority = 1;
                break;
        
            case ')':
                priority = 0;
                break;

            case '+':
                result += parseInt(item);
                break;
            
            case '-':
                result -= parseInt(item);
                break;

            case '/':
                result /= parseInt(item);
                break;
        
            case '*':
                result *= parseInt(item);
                break;

            default:
                result += parseInt(item);
        }

    }
    
    res.status(200).send({msg: result});
});

app.post('/saveActions', (req, res) => {

    let actions = req.body.actions;
    
    res.status(200);
})

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
