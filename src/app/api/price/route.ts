import cheerio from 'cheerio'

const googleLink = "https://www.google.com/finance/quote/USD-COP?window=5D"
const prevCloseClass = "P6K39c"

export async function GET() {
  let html = ""
  try {
    const res = await fetch(googleLink, {
      next: {
        revalidate: 150
      }
    })
    html = await res.text()
  } catch (error) {
    console.error("Error: " + error)
  }
  
  const $ = cheerio.load(html)
  const currentAttrs = $("div[data-last-price]").attr()

  const lastPrice = parseFloat(currentAttrs["data-last-price"])
  const timestamp = parseInt(currentAttrs["data-last-normal-market-timestamp"]) * 1000

  const prevClose = parseFloat($(`div.${prevCloseClass}`).text().replace(",", ""))

  return Response.json({
    lastPrice,
    timestamp,
    prevClose
  })
}