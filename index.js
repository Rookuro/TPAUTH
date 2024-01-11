const express = require('express')
const app = express()
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
const fs = require('fs')
const port = 3000

const usersFile = fs.readFileSync('users.json', 'utf8')
const data = JSON.parse(usersFile)
const users = data.users;

const posts = 
  [
    {
      "postid": 456,
      "userid": 123,
      "contenu": "Il n'aime pas le chocolat"
    },
    {
      "postid": 654,
      "userid": 321,
      "contenu": "Il n'aime pas les jeux"
    },
    {
      "postid": 555,
      "userid": "777",
      "contenu": "Il n'aime pas les chats"
    }
  ]


app.use(express.json())

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAna0ffx4JcSqAyE9qrzo8UCYgddPbsaN5mqAO8tuW8DOxE8ZO
9at3rOKdmSzZC5xqypNSYP66ZpwMfJcEuVsEvKu95QjzLaSKB1it2ZSdEdNrPa7w
RbLP/lKymGYiu5Tx00t4B6P53xh6TPt//RGrX7Z21ZbeCIoGFck5VYlSFcDBPa6f
VKUedPJPEj//oLx3kJsTj7m6mDDobi3LOXQ1lLxX4jjIYPvtF4ta1q/9ffzJHmF+
jKOoceUm+XOXrQsrJMZ+Fj1Po7GNCFTmp9JQkqBQUgK/qE1jW3V3zwhkjLcs5MoZ
sJ7E6eki4Da+JoY3+1sb3LQxLgxuag4HFcC+aQIDAQABAoIBAFyMWDdhpwMggnSQ
gLsXQH1+04C1eHccz+ydVAjiMQcOIDrOJFx4Z4c3gG9+7mqtRdVfgXPjL/+4Sm/6
qFAvh2lCmPRNO4cn08iaGXjjjQoAgSq0et0+Jm1NlvxyvqJBu2tdGbfKXIjBMk/r
MuWUsHU+gSO/KNX0RbwV3yxArMiM7LWOrflrLsvaPvf2seHy2wzvKn5D1JM8BL2L
mdwSR7nlvQP491Y+xDG3x3mcskxTETAqq69bhDwSTrKjgCFf1puUMqbcUZpYQK+4
OxUa9zzHIxOHzjnS7FL66inAxZvbbzrCBfDEB7xldNsGQLEAVxXvKVsBvooRpwON
2U5f3bECgYEA4WbK0QuYf6WUpyH2aUMl9H14TmN1bpDh/0UOz5UrQkDcrdppr8Mi
NLDUrDdYKsCWo/l6+8ctF0q3siNFK5m6iAw+QNhJ44iM9jSPMhtSa4Aebh7ITX1j
BeAGNZZ4wCsC9mAO1Niil+udQQffVW8bUPQ3lwnwtJ66JyxlfkKOct0CgYEAsxS5
3mc6mvhGMQSe8jUsbH0n859RNXesxhrNwV2YEuQxLrpB+vXUYUo8ntc3vxZazS0S
40GSahqaQThsBChYXR16aka/wYoJfVT3qNBQdI6WnyjH2PiCVRWJl36PNQZsRXAV
+rUxUCLHNJIkqNRfnx5BuxnOQDTWhuiMOYxpgv0CgYEAxntr8XUSjqTSJ/KCN+MH
UyoBfJWcXQZ72/uFtUmX1DmlmfoQwtNEFb35KMV7f/ojLLWNlJSpoi8LX3Qrft9a
IF8XmqZbOl+OMWfLCMaCZ2NkaHf2zjWxswS4swuTvTSi4S1pIgi59KlnylISWfsC
xOCo6vm32nVDWyd/IBWftokCgYA2ZiFgEfOXh7uqwECYStbHze0I8Gh22Xe+Zf4C
sy+y7WaTTzkjxvFQ7IAlsDLa9St4EC0go5aabKJXFZCaYrcU8hNxnTQ60ne3fswM
l9sYzQesKXMr0bGlrvkw790Iun7BSR8kHU5xjV799Tb1oi255DMLZvdkQai5KoMO
KD0U8QKBgAY+pCpVnVwh5hcF62WvD8ieXy5qcWl2r4VRSD1tDh0VeEmzr8FCdfKZ
tG5QtxMqi4FTvtK846auTDXo6mWarFINtwQhUu/8gybkLjyrsZL0tQTjiF+aeg+d
wuSMbRS6ScYyVLYvowCL/Mg+M7uZ8gcGWwSse3U2HAP6ANnRis2+
-----END RSA PRIVATE KEY-----`

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAna0ffx4JcSqAyE9qrzo8
UCYgddPbsaN5mqAO8tuW8DOxE8ZO9at3rOKdmSzZC5xqypNSYP66ZpwMfJcEuVsE
vKu95QjzLaSKB1it2ZSdEdNrPa7wRbLP/lKymGYiu5Tx00t4B6P53xh6TPt//RGr
X7Z21ZbeCIoGFck5VYlSFcDBPa6fVKUedPJPEj//oLx3kJsTj7m6mDDobi3LOXQ1
lLxX4jjIYPvtF4ta1q/9ffzJHmF+jKOoceUm+XOXrQsrJMZ+Fj1Po7GNCFTmp9JQ
kqBQUgK/qE1jW3V3zwhkjLcs5MoZsJ7E6eki4Da+JoY3+1sb3LQxLgxuag4HFcC+
aQIDAQAB
-----END PUBLIC KEY-----`

function jwtGuard(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const idToken = authorizationHeader.substring(7);

    jwt.verify(idToken, privateKey, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized');
      } else {
        req.userToken = decoded;
        next();
      }
    });
  } else {
    res.status(401).send('Unauthorized');
  }
}

app.get('/', jwtGuard, (req, res) => {
  res.send(req.userToken)
})

app.post('/auth', (req, res) => {
  const { name, password } = req.body;

  const user = users.find(user => user.name === name && user.password === password);

  if (user) {
    const token = jwt.sign({ name: user.name, userId: user.id, admin: user.admin }, privateKey, {algorithm: 'RS256', expiresIn: '1d'});
    res.set('Authorization', `Bearer ${token}`);
    res.send(token);
  } else {
    res.status(401).send("Pas trouvé");
  }
});

app.get('/posts/:postid', jwtGuard, (req, res) => {
  const userId = req.userToken.userId;
  const isAdmin = req.userToken.admin

  if (isAdmin == true) {
    userPosts = posts;
  } else {
    userPosts = posts.filter(post => post.userid == userId);
  }

  res.json({ posts: userPosts });
});

app.listen(port, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});
