const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
require('../db/mongoose')
const Team = require('../models/Team')
const Player = require('../models/Player')
const Data = require('../Utils/data')
const cors = require('cors')


const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(cors())



app.listen(port, () => {
    console.log(`Listening to port ${port}`)
    // let data = Data[0].playersData
    // data.map((item) => {
    //     let newPlayer = new Player(item)
    //     newPlayer.save().then((res) => {
    //         console.log(res)
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // })
    //
    //
    // let teamData = Data[0].allTeamCards
    // teamData.map((item) => {
    //     let newTeam = new Team(item)
    //     newTeam.save().then((res) => {
    //         console.log(res)
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // })
})

app.get('/' , (req, res) => {
    Team.find({}).then((e) => {
        res.send(e)
    })
})

app.get('/team-details/:id' , (req, res) => {
    Team.find({ id: req.params.id})
        .then((response) => {
            Player.find({ teamId : req.params.id })
                .then((players) => {
                    console.log(response)
                    res.send([
                        {
                            teamDetails: response[0]
                        },
                        {
                            playerDetails: players
                        }
                    ])
                }).catch(err => console.log(err))
        })
})

app.get('/player/:id' , (req, res) => {
    console.log(req.params)
    Player.findById(req.params.id)
        .then((response) => {
            Team.findOne({id: response.teamId})
                .then((result) => {
                    console.log(result)
                    res.send([
                        {
                            teamName: result.name,
                            shortName: result.short
                        },
                        {
                            playerDetails: response
                        }
                    ])
                })
        }).catch(err => console.log(err))
})

app.get('/teamId/:name' , (req, res) => {
    Team.find({})
        .then((teams) => {
            teams.map((team) => {
                if(req.params.name.length >= 2 && req.params.name.length < 5) {
                    if (team.short.toLowerCase() === req.params.name.toLowerCase()) {
                        console.log(team.id)
                        res.send({
                            team: team.id
                        })
                    }
                }else if(req.params.name.length > 4) {
                    if(team.name.toLowerCase().includes(req.params.name.toLowerCase())) {
                        console.log(team.id)
                        res.send({
                            team: team.id
                        })
                    }
                }
            })
        })
        .catch(err => console.log(err))
})