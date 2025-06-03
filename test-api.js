const ORION_API_KEY = "pwEwr5sVaLEfKstRQMOE9jvXR8PthtICgNRiGgdtEe29YUf4pMuTEGdx5dJm"

async function testOrionAPI() {
  // Lista de URLs para probar
  const urls = [
    "https://demo.orion-labs.com/api/v1/ordenes?numero_orden=2504016",
    "https://demo.orion-labs.com/api/v1/ordenes?orden=2504016",
    "https://demo.orion-labs.com/api/v1/ordenes/2504016",
    "https://demo.orion-labs.com/api/v1/ordenes?numero_orden_externa=2504016"
  ]
  
  for (const url of urls) {
    console.log("\n=== PROBANDO URL ===")
    console.log(url)
    
    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ORION_API_KEY}`
        }
      })
      
      const text = await response.text()
      console.log("Status:", response.status)
      console.log("Headers:", Object.fromEntries(response.headers))
      
      try {
        const json = JSON.parse(text)
        console.log("Response:", JSON.stringify(json, null, 2))
      } catch (e) {
        console.log("Body (no JSON):", text)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

testOrionAPI() 