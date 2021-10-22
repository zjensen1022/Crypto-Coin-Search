//budget jquery
const $ = (selection) => document.querySelector(selection)

const RANK = "Rank: "
const PRICE = "Price: "
const MARKET = "Market Cap: "
const SUPPLY = "Supply: "
const CHANGE = " 24H %: "

const date = new Date()

let coin = ""

$('#year').textContent = date.getFullYear()

function convertToJson(response) {
    if(response.ok)
        return response.json();
    else {
        console.log(response.status)
        if(response.status == 404) {
            alert("could not find \"" + coin + "\"")
        }
    }
}

function populateData(data) {

    if(data != null) {
        $('#display_container').classList.remove('hidden')

        const coin = data.data

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        $('#name').textContent = coin.name + ' (' + coin.symbol + ')'
        $('#rank').textContent = RANK + coin.rank
        $('#price').textContent = PRICE + formatter.format(coin.priceUsd)
        $('#market_cap').textContent = MARKET + formatter.format(coin.marketCapUsd)

        const percentage = $('#percentage')

        if(coin.changePercent24Hr < 0) {
            percentage.classList.remove('gain')
            percentage.classList.add('loss')
        }
        else {
            percentage.classList.remove('loss')
            percentage.classList.add('gain')
        }

        $('#change').textContent = CHANGE
        percentage.textContent = parseFloat(coin.changePercent24Hr).toFixed(5)
    }
    
}

function findCoin(coin) {
    const promise = fetch('https://api.coincap.io/v2/assets/' + coin)

    promise.then(convertToJson).then(populateData).catch(error => {
        console.log(error.message)
    })
}

function search() {
    const searchBar = $('#search_bar')
    coin = searchBar.value.toLowerCase()
    findCoin(coin)
}

function onKeyDown(key) {
    if(key.code === 'Enter' && $('#search_bar').value != '')
        search();
}

$('#search_bar').addEventListener('keydown', onKeyDown)