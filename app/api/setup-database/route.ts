import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Verificar si las tablas ya existen
    const { data: existingTables, error: tablesError } = await supabase.from("users").select("id").limit(1)

    // Si no hay error, las tablas probablemente ya existen
    if (!tablesError) {
      return NextResponse.json({
        message: "Las tablas ya existen en la base de datos",
        success: true,
      })
    }

    // Crear tabla de usuarios
    const { error: usersError } = await supabase.rpc("create_users_table")
    if (usersError) {
      console.error("Error al crear tabla de usuarios:", usersError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de usuarios",
          error: usersError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Crear tabla de empleados
    const { error: employeesError } = await supabase.rpc("create_employees_table")
    if (employeesError) {
      console.error("Error al crear tabla de empleados:", employeesError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de empleados",
          error: employeesError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Crear tabla de citas
    const { error: appointmentsError } = await supabase.rpc("create_appointments_table")
    if (appointmentsError) {
      console.error("Error al crear tabla de citas:", appointmentsError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de citas",
          error: appointmentsError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Crear tabla de servicios
    const { error: servicesError } = await supabase.rpc("create_services_table")
    if (servicesError) {
      console.error("Error al crear tabla de servicios:", servicesError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de servicios",
          error: servicesError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Crear tabla de pacientes
    const { error: patientsError } = await supabase.rpc("create_patients_table")
    if (patientsError) {
      console.error("Error al crear tabla de pacientes:", patientsError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de pacientes",
          error: patientsError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Crear tabla de exámenes
    const { error: examsError } = await supabase.rpc("create_exams_table")
    if (examsError) {
      console.error("Error al crear tabla de exámenes:", examsError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de exámenes",
          error: examsError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Crear tabla de diagnósticos
    const { error: diagnosesError } = await supabase.rpc("create_diagnoses_table")
    if (diagnosesError) {
      console.error("Error al crear tabla de diagnósticos:", diagnosesError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de diagnósticos",
          error: diagnosesError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Crear tabla de órdenes
    const { error: ordersError } = await supabase.rpc("create_orders_table")
    if (ordersError) {
      console.error("Error al crear tabla de órdenes:", ordersError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de órdenes",
          error: ordersError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Crear tabla de servicios a domicilio
    const { error: homeServicesError } = await supabase.rpc("create_home_services_table")
    if (homeServicesError) {
      console.error("Error al crear tabla de servicios a domicilio:", homeServicesError)
      return NextResponse.json(
        {
          message: "Error al crear tabla de servicios a domicilio",
          error: homeServicesError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Insertar datos de ejemplo para servicios
    const { error: seedServicesError } = await supabase.rpc("seed_services")
    if (seedServicesError) {
      console.error("Error al insertar servicios de ejemplo:", seedServicesError)
      return NextResponse.json(
        {
          message: "Error al insertar servicios de ejemplo",
          error: seedServicesError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "Base de datos configurada correctamente",
      success: true,
    })
  } catch (error) {
    console.error("Error al configurar la base de datos:", error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      {
        message: "Error al configurar la base de datos",
        error: errorMessage,
        success: false,
      },
      { status: 500 }
    )
  }
}

