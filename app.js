const express = require('express')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./usersdb.sqlite3');
const app = express()

const PORT = process.env.PORT || 4000

app.use('/api', require('./api'))

function start() {
    app.listen(PORT, () => {
        console.log('Server is started')
    })
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, gender TEXT, ip_address TEXT)");

        const file = fs.readFileSync('users.json', 'utf8')
        const arr = JSON.parse(file)

        const stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)");
        db.get('SELECT count(*) as q FROM users_statistic', (err, results) => {
            let f = results.q
            for (let i = f; i < arr.length; i++) {
                stmt.run(arr[i]['id'], arr[i]['first_name'], arr[i]['last_name'], arr[i]['email'], arr[i]['gender'], arr[i]['ip_address']);
            }
            stmt.finalize();
        })
    });

    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS users_statistic (user_id INT, date TEXT, page_views INT, clicks INT)");

        const file = fs.readFileSync('users_statistic.json', 'utf8')
        const arr = JSON.parse(file)

        const stmt = db.prepare("INSERT INTO users_statistic VALUES (?, ?, ?, ?)");
        db.get('SELECT count(*) as q FROM users_statistic', (err, results) => {
            let f = results.q
            for (let i = f; i < arr.length; i++) {
                stmt.run(arr[i]['user_id'], arr[i]['date'], arr[i]['page_views'], arr[i]['clicks']);
            }
            stmt.finalize();
        })
    });
    db.close();
}

start()
