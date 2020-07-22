const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./usersdb.sqlite3');
const router = express.Router()

router.get('/users/:count/:page', (req, res) => {
    db.all(`SELECT * from users LIMIT ${req.params.count} OFFSET ${req.params.page*req.params.count}`, (err, results) => {
        res.send(results)
    })
})
router.get('/statistics', (req, res) => {
    db.all('SELECT * from users_statistic', (err, results) => {
        res.send(results)
    })
})
router.get('/user/:id', (req, res) => {
    db.get(`SELECT * from users WHERE id = ${req.params.id}`, (err, results) => {
        res.send(results)
    })
})
router.get('/userscount', (req, res) => {
    db.get(`SELECT count(*) as q from users`, (err, results) => {
        res.send(results)
    })
})

module.exports = router