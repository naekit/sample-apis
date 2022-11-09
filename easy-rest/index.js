const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json())

app.get('/socktype', (req,res) => {
    res.status(200).send({
        socktype: 'wool',
        size: '9-11'
    })
})

app.post('/socktype/:id', (req,res) => {

    const { id } = req.params;
    const { color } = req.body;
    
    if (!color) {
        res.status(418).send({ message: 'Pick a color!' })
    }

    res.send({
        sock: `wool sock in ${color} and ID of ${id}`
    });

})

app.listen(PORT, () =>{
    console.log(`server running on http://localhost:${PORT}`)
})