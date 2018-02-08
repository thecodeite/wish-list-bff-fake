const express = require('express')
const fetch = require('node-fetch')
const proxy = require('express-http-proxy')

const app = express()

app.use((req, res, next) => {
  console.log(req.path)
  next()
})

app.get('/bff/wish-lists', (req, res) => {
  fetch('http://localhost:3009/api/customer/v1/950a78eb1a4c498e8336fa4456de9c28/wish-lists')
    .then(r => {
      if (!r.ok) return r.text().then(err => {
        throw new Error(`Code: ${r.status} Err:${err}`);
      })
      return r.json()
    })
    .then(data => res.json(formatWishLists(data)))
    .catch(e => {
      console.error(e)
      res.status(500).json(e)
    })
})

app.get('/bff/wish-lists/:id', (req, res) => {
  fetch(`http://localhost:3009/api/customer/v1/950a78eb1a4c498e8336fa4456de9c28/wish-lists/${req.params.id}`)
    .then(r => {
      if (!r.ok) return r.text().then(err => {
        throw new Error(`Code: ${r.status} Err:${err}`);
      })
      return r.json()
    })
    .then(data => res.json(formatWishList(data)))
    .catch(e => {
      console.error(e)
      res.status(500).json(e)
    })
})

app.delete('/bff/wish-lists/:id/items/:sku', (req, res) => {
  setTimeout(() => {
  const options = {method: 'DELETE'}
  fetch(`http://localhost:3009/api/customer/v1/950a78eb1a4c498e8336fa4456de9c28/wish-lists/${req.params.id}/items/${req.params.sku}`, options)
    .then(r => {
      if (!r.ok) return r.text().then(err => {
        throw new Error(`Code: ${r.status} Err:${err}`);
      })
      return r.json()
    })
    .then(data => res.json(formatWishList(data)))
    .catch(e => {
      console.error(e)
      res.status(500).json(e)
    })
  }, 5000)
})

function formatWishList(data) {
  return data
}

function formatWishLists(data) {
  return {
    wishLists: data.wishlists.map(wl => {
      wl.productCount = wl.products.length
      wl.image = wl.products.length ? wl.products[wl.products.length-1].image : ''
      delete wl.products
      return wl
    })
  }
}

app.all('*', (req, res) => {
  res.statusMessage = 'No route matched'
  res.status(405).json({error: 'No route matched'})
})

const port = 3019
app.listen(port, err => {
  if (err) console.error(`Failed to listen on port ${port}`)
  else console.log(`The magic happens on port: ${port}`)
})