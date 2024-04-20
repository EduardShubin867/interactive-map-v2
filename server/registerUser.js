const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { MongoClient } = require('mongodb')

// Подключение к базе данных
const url = 'mongodb://localhost:27017'
const dbName = 'interactive-map'
const collectionName = 'users'

const client = new MongoClient(url, { useUnifiedTopology: true })

async function connectToDatabase() {
    await client.connect()
    console.log('Connected to the database')
}

// Вызовем функцию подключения
connectToDatabase()

// Инициализация Passport
passport.initialize()

// Локальная стратегия регистрации
passport.use(
    'local-register',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const db = client.db(dbName)

                // Проверка, существует ли пользователь с таким именем
                const existingUser = await db
                    .collection(collectionName)
                    .findOne({ username })

                if (existingUser) {
                    return done(null, false, {
                        message: 'Пользователь с таким именем уже существует',
                    })
                }

                // Зарегистрировать нового пользователя
                const saltRounds = 10
                const hashedPassword = await bcrypt.hash(password, saltRounds)
                const newUser = { username, password: hashedPassword }

                await db.collection(collectionName).insertOne(newUser)

                return done(null, newUser)
            } catch (error) {
                return done(error)
            }
        }
    )
)

// Функция для регистрации пользователя
async function registerUser(username, password) {
    return new Promise((resolve, reject) => {
        passport.authenticate('local-register', (err, user) => {
            if (err) {
                return reject({
                    success: false,
                    message: 'Ошибка при регистрации пользователя',
                })
            }

            if (!user) {
                return reject({
                    success: false,
                    message: 'Пользователь с таким именем уже существует',
                })
            }

            resolve({ success: true, user })
        })({ body: { username, password } })
    })
}

async function runRegistration(username, password) {
    try {
        const result = await registerUser(username, password)
        console.log(result)
    } catch (error) {
        console.error(error)
    }
}

module.exports = runRegistration
