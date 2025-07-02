import { NextResponse } from "next/server"
import { tariffsService } from "@/lib/tariffs-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const userId = searchParams.get("userId")
    const examId = searchParams.get("examId")

    // Obtener todas las tarifas
    if (type === "all") {
      const response = await tariffsService.getAllTariffs()
      return NextResponse.json(response)
    }

    // Obtener precio de un examen específico
    if (type === "exam-price" && examId) {
      const price = await tariffsService.getExamPrice(examId, userId || undefined)
      return NextResponse.json({ 
        success: true, 
        data: price 
      })
    }

    // Obtener contexto de tarifa de usuario
    if (type === "user-context" && userId) {
      const context = await tariffsService.getUserTariffContext(userId)
      return NextResponse.json({ 
        success: true, 
        data: context 
      })
    }

    // Obtener todas las referencias
    if (type === "references") {
      const response = await tariffsService.getAllReferences()
      return NextResponse.json(response)
    }

    // Obtener exámenes con precios
    if (type === "exams-with-prices") {
      const tariffId = searchParams.get("tariffId")
      const exams = await tariffsService.getExamsWithPrices(tariffId || undefined)
      return NextResponse.json({ 
        success: true, 
        data: exams 
      })
    }

    return NextResponse.json({ 
      success: false, 
      error: "Tipo de consulta no válido" 
    }, { status: 400 })

  } catch (error) {
    console.error("Error en API de tarifas:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "create-tariff":
        const tariffResponse = await tariffsService.createTariff(data)
        return NextResponse.json(tariffResponse)

      case "create-reference":
        const referenceResponse = await tariffsService.createReference(data)
        return NextResponse.json(referenceResponse)

      case "create-tariff-price":
        const priceResponse = await tariffsService.createTariffPrice(data)
        return NextResponse.json(priceResponse)

      case "update-multiple-prices":
        const multipleResponse = await tariffsService.updateMultiplePrices(data)
        return NextResponse.json(multipleResponse)

      case "copy-tariff-prices":
        const copyResponse = await tariffsService.copyTariffPrices(
          data.sourceTariffId, 
          data.targetTariffId, 
          data.multiplier || 1
        )
        return NextResponse.json(copyResponse)

      case "assign-user-reference":
        const assignResponse = await tariffsService.assignUserReference(data)
        return NextResponse.json(assignResponse)

      default:
        return NextResponse.json({ 
          success: false, 
          error: "Acción no válida" 
        }, { status: 400 })
    }

  } catch (error) {
    console.error("Error en POST de tarifas:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "update-tariff":
        const tariffResponse = await tariffsService.updateTariff(data)
        return NextResponse.json(tariffResponse)

      case "update-reference":
        const referenceResponse = await tariffsService.updateReference(data)
        return NextResponse.json(referenceResponse)

      case "update-tariff-price":
        const priceResponse = await tariffsService.updateTariffPrice(data)
        return NextResponse.json(priceResponse)

      default:
        return NextResponse.json({ 
          success: false, 
          error: "Acción no válida" 
        }, { status: 400 })
    }

  } catch (error) {
    console.error("Error en PUT de tarifas:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "ID requerido" 
      }, { status: 400 })
    }

    switch (type) {
      case "tariff":
        const tariffResponse = await tariffsService.deleteTariff(id)
        return NextResponse.json(tariffResponse)

      case "reference":
        const referenceResponse = await tariffsService.deleteReference(id)
        return NextResponse.json(referenceResponse)

      case "tariff-price":
        const priceResponse = await tariffsService.deleteTariffPrice(id)
        return NextResponse.json(priceResponse)

      case "user-reference":
        const userId = searchParams.get("userId")
        const referenceId = searchParams.get("referenceId")
        if (!userId || !referenceId) {
          return NextResponse.json({ 
            success: false, 
            error: "userId y referenceId requeridos" 
          }, { status: 400 })
        }
        const userRefResponse = await tariffsService.removeUserReference(userId, referenceId)
        return NextResponse.json(userRefResponse)

      default:
        return NextResponse.json({ 
          success: false, 
          error: "Tipo de eliminación no válido" 
        }, { status: 400 })
    }

  } catch (error) {
    console.error("Error en DELETE de tarifas:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
} 