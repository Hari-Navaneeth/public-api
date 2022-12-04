const mongoose = require('mongoose');

// const url = `mongodb://localhost/test`
const url = `mongodb+srv://admin:Admin1234@pynemonk-1.y44uzig.mongodb.net/?retryWrites=true&w=majority`;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const setup = async () => {
    await mongoose.connect(url, connectionParams)
        .then(() => {
            console.log('Connected to the database ')
        })
        .catch((err) => {
            console.error(`Error connecting to the database. n${err}`);
            setup();
        })
}

module.exports = { setup };