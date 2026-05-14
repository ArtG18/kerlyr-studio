require('dotenv').config()
const app  = require('./routes/app')

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🌸 Kerlyr Studio API corriendo en http://localhost:${PORT}`)
})