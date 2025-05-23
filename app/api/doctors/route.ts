// Create an API endpoint for doctors
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, this would fetch data from a database
    const doctors = [
      {
        id: 1,
        name: "Dr. Carlos Mendoza",
        specialty: "Cardiología",
        image: "/placeholder.svg?height=200&width=200&text=Dr.%20Mendoza",
        phone: "(01) 555-1234",
        email: "carlos.mendoza@roe.com",
        location: "Sede San Isidro",
      },
      {
        id: 2,
        name: "Dra. María Sánchez",
        specialty: "Endocrinología",
        image: "/placeholder.svg?height=200&width=200&text=Dra.%20Sánchez",
        phone: "(01) 555-2345",
        email: "maria.sanchez@roe.com",
        location: "Sede Miraflores",
      },
      {
        id: 3,
        name: "Dr. Jorge Ramírez",
        specialty: "Neurología",
        image: "/placeholder.svg?height=200&width=200&text=Dr.%20Ramírez",
        phone: "(01) 555-3456",
        email: "jorge.ramirez@roe.com",
        location: "Sede San Borja",
      },
      {
        id: 4,
        name: "Dra. Ana Torres",
        specialty: "Pediatría",
        image: "/placeholder.svg?height=200&width=200&text=Dra.%20Torres",
        phone: "(01) 555-4567",
        email: "ana.torres@roe.com",
        location: "Sede La Molina",
      },
      {
        id: 5,
        name: "Dr. Roberto Gómez",
        specialty: "Gastroenterología",
        image: "/placeholder.svg?height=200&width=200&text=Dr.%20Gómez",
        phone: "(01) 555-5678",
        email: "roberto.gomez@roe.com",
        location: "Sede San Isidro",
      },
      {
        id: 6,
        name: "Dra. Laura Vega",
        specialty: "Dermatología",
        image: "/placeholder.svg?height=200&width=200&text=Dra.%20Vega",
        phone: "(01) 555-6789",
        email: "laura.vega@roe.com",
        location: "Sede Miraflores",
      },
    ]

    return NextResponse.json(doctors)
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}

