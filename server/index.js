const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const cors = require('cors')
const formidable = require('express-formidable')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3001

console.log('---------------------------------------------------------')

// Настройка CORS
app.use(
    cors({
        origin: 'http://localhost:5173', // allow to server to accept request from different origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, // allow session cookie from browser to pass through
    })
)

// Настройка Formidable
app.use(
    formidable({
        uploadDir: __dirname + '/tmp', // don't forget the __dirname here
        keepExtensions: true,
    })
)

const sessionSecret = crypto.randomBytes(32).toString('hex')

app.use(cookieParser())
// Используем сессии для хранения состояния аутентификации
app.use(
    session({
        name: 'Interactive-map',
        secret: sessionSecret,
        resave: true,
        proxy: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            // secure: true,
            sameSite: 'Strict',
        },
    })
)

// Инициализация Passport и использование сессий
app.use(passport.initialize())
app.use(passport.session())

// Подключение к базе данных
const url = 'mongodb://localhost:27017'
const dbName = 'interactive-map'

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

// Выполняем подключение к базе данных
client
    .connect()
    .then(() => {
        console.log('Подключение к базе данных успешно!')
    })
    .catch((err) => {
        console.error('Ошибка при подключении к базе данных:', err)
    })

// Добавляем обработчики событий
client.on('connected', () => {
    console.log('Успешно подключено к серверу MongoDB!')
})

client.on('disconnected', () => {
    console.log('Отключено от сервера MongoDB!')
})

client.on('error', (err) => {
    console.error('Ошибка подключения к MongoDB:', err)
})

// Выбор базы данных
const db = client.db(dbName)

const usersCollection = 'users'

// Паспортная стратегия для проверки учетных данных
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            await db
                .collection(usersCollection)
                .findOne({ username: username })
                .then((user, err) => {
                    if (err) {
                        return done(null, false, { message: err.message })
                    }

                    if (!user) {
                        return done(null, false, {
                            message: 'Неверное имя пользователя.',
                        })
                    }
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (res) {
                            return done(null, user) // Возвращаем пользователя, если пароль совпадает
                        } else {
                            return done(null, false, {
                                message: 'Неверный пароль',
                            })
                        }
                    })
                })
        }
    )
)

// Сериализация и десериализация пользователя
passport.serializeUser((user, done) => {
    try {
        return done(null, user._id)
    } catch (err) {
        console.error(err)
        return done(err, null)
    }
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db
            .collection(usersCollection)
            .findOne({ _id: ObjectId.createFromHexString(id) })
        return done(null, user)
    } catch (err) {
        return done(err, null)
    }
})

// Маршрут для аутентификации
app.post('/login', (req, res, next) => {
    req.body = req.fields
    passport.authenticate('local', (err, user, info) => {
        try {
            if (err) {
                console.error(err)
                return next(err)
            }

            if (!user) {
                return res.json({
                    success: false,
                    message: info.message,
                })
            }

            req.logIn(user, (err) => {
                if (err) {
                    console.error(err)
                    return next(err)
                }

                return res.status(200).json({
                    success: true,
                    message: 'Successful login',
                })
            })
        } catch (error) {
            console.log(error.message)
        }
    })(req, res, next)
})

// Маршрут для проверки состояния аутентификации
app.get('/check-auth', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() })
})

// Маршрут для выхода из системы
app.post('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res
                .status(500)
                .json({ success: false, message: 'Error during logout' })
        }
        return res.json({ success: true, message: 'Logout successful' })
    })
})

// Получение маркеров
app.get('/markers/*', async (req, res) => {
    const refererPath = req.params[0] || ''
    const collectionName = refererPath
    try {
        // Поиск всех документов в коллекции
        await client.connect()

        const results = await db.collection(collectionName).find({}).toArray()

        res.json(results)
    } catch (error) {
        console.error('Ошибка при обработке запроса: ' + error.stack)
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера',
        })
    }
})

// Добавление нового маркера
app.post('/markers', async (req, res) => {
    const collectionName = req.fields.location

    try {
        await client.connect()

        const id = req.fields.id
        const name = req.fields.name
        const icon = req.fields.icon
        const description = req.fields.description
        const img = JSON.parse(req.fields.img)
        const position = JSON.parse(req.fields.position)
        const color = req.fields.color

        //Загрузка файлов
        for (const [key, value] of Object.entries(req.files)) {
            const oldpath = value.path
            const uploadFolder = path.join(
                __dirname,
                '..',
                'client',
                'public',
                'assets',
                'images',
                value.name
            )

            fs.access(uploadFolder, fs.constants.F_OK, (err) => {
                if (err) {
                    fs.rename(oldpath, uploadFolder, (err) => {
                        if (err) throw err
                    })
                } else {
                    return
                }
            })
        }

        // Добавление нового маркера в коллекцию
        await db.collection(collectionName).insertOne({
            id,
            name,
            icon,
            description,
            position,
            img,
            color,
        })

        const newMarker = {
            id,
            name,
            icon,
            description,
            position: position,
            img: img,
            color,
        }

        res.status(201).json({
            success: true,
            message: 'Маркер успешно добавлен.',
            newMarker,
        })
    } catch (error) {
        console.error('Ошибка при обработке запроса: ' + error.stack)
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера',
        })
    }
})

// Обновление маркера
app.put('/markers', async (req, res) => {
    const { id, name, description, location } = req.fields
    const img = JSON.parse(req.fields.img)
    console.log(req.files)

    try {
        const filter = { id: id }
        const update = {
            $set: {
                name,
                description,
                img,
            },
        }
        const options = { returnDocument: true }
        // Загрузка файлов
        for (const [key, value] of Object.entries(req.files)) {
            const oldpath = value.path
            const uploadFolder = path.join(
                __dirname,
                '..',
                'public',
                'images',
                value.name
            )

            fs.access(uploadFolder, fs.constants.F_OK, (err) => {
                if (err) {
                    fs.rename(oldpath, uploadFolder, (err) => {
                        if (err) throw err
                    })
                } else {
                    return
                }
            })
        }
        // Запрос в БД
        const updatedMarker = await db
            .collection(location)
            .findOneAndUpdate(filter, update, options)

        res.status(201).json({
            success: true,
            message: 'Маркер успешно добавлен.',
            marker: updatedMarker,
        })
    } catch (error) {
        console.error('Error processing request:', error)
        res.status(500).json({ success: false, message: 'Ошибка сервера' })
    }
})

// Удаление маркера
app.delete('/markers/:id/:location', async (req, res) => {
    try {
        const { id, location } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Отсутствует идентификатор маркера (id).',
            })
        }

        // Удаление маркера по id
        await db.collection(location).deleteOne({ id: id })

        res.status(200).json({
            success: true,
            message: 'Маркер успешно удален.',
            id,
        })
    } catch (error) {
        console.error('Ошибка при удалении маркера:', error)
        res.status(500).json({ success: false, message: 'Ошибка сервера' })
    }
})

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`)
})
