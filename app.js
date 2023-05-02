const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const sequelize = require('./Backend/util/userDatabase')
var cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan')
require('dotenv').config();

const app = express();
app.use(cors());


const signUpRoutes = require('./Backend/routes/signup');
const loginRoutes = require('./Backend/routes/login');
const expenseRoutes = require('./Backend/routes/expense');
const purchaseRoutes = require('./Backend/routes/purchase');
const premiumRoutes = require('./Backend/routes/premium');
const forgetPassword = require('./Backend/routes/forgetPassword');
const passwordReset = require('./Backend/routes/resetlink');
const User = require('./Backend/models/user');
const UserExpense = require('./Backend/models/expense');
const Order = require('./Backend/models/order');
const DownloadLink = require('./Backend/models/downloads')
const ForgotPasswordRequests = require('./Backend/models/ForgotPasswordRequests')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(helmet());
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('combined'));

app.use(bodyParser.json({ }));

app.use(signUpRoutes);
app.use(loginRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumRoutes);
app.use(forgetPassword);
app.use(passwordReset);

User.hasMany(UserExpense);
UserExpense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

User.hasMany(DownloadLink)
DownloadLink.belongsTo(User)

console.log(process.env.NODE_ENV)

sequelize
// .sync({force: true})
.sync()
.then(result =>{
    // console.log(result);
    app.listen(process.env.PORT || 4000);
})
.catch(err =>{
    console.log(err);
});

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
 authenticate();