import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Insertar usuarios de ejemplo
    const { error: usersError } = await supabase
      .from("users")
      .insert([
        {
          email: "paciente@lopez.com",
          first_name: "Juan",
          last_name: "Pérez",
          username: "juanperez",
          user_type: "patient",
          patient_code: "ROE-12345-6789",
        },
        {
          email: "doctor@lopez.com",
          first_name: "Carlos",
          last_name: "Rodríguez",
          username: "carlosrodriguez",
          user_type: "doctor",
        },
        {
          email: "empresa@lopez.com",
          first_name: "María",
          last_name: "García",
          username: "mariagarcia",
          user_type: "company",
          company_name: "Empresa ABC",
          company_ruc: "20123456789",
          is_company_admin: true,
        },
      ])
      .select()

    if (usersError) {
      console.error("Error al insertar usuarios de ejemplo:", usersError)
      return NextResponse.json(
        {
          message: "Error al insertar usuarios de ejemplo",
          error: usersError.message,
          success: false,
        },
        { status: 500 },
      )
    }

    // Obtener IDs de los usuarios insertados
    const { data: users } = await supabase.from("users").select("id, user_type, email")

    if (!users || users.length === 0) {
      return NextResponse.json(
        {
          message: "No se pudieron obtener los usuarios insertados",
          success: false,
        },
        { status: 500 },
      )
    }

    const patientUser = users.find((u) => u.user_type === "patient")
    const doctorUser = users.find((u) => u.user_type === "doctor")
    const companyUser = users.find((u) => u.user_type === "company")

    // Insertar empleados de ejemplo para la empresa
    if (companyUser) {
      const { error: employeesError } = await supabase.from("employees").insert([
        {
          company_id: companyUser.id,
          name: "Roberto Gómez",
          position: "Gerente de Recursos Humanos",
          department: "Recursos Humanos",
          email: "roberto.gomez@empresa.com",
          phone: "999-888-777",
          status: "active",
          join_date: "2023-01-15",
        },
        {
          company_id: companyUser.id,
          name: "Laura Torres",
          position: "Analista Financiero",
          department: "Finanzas",
          email: "laura.torres@empresa.com",
          phone: "999-777-888",
          status: "active",
          join_date: "2023-01-20",
        },
        {
          company_id: companyUser.id,
          name: "Miguel Sánchez",
          position: "Supervisor de Operaciones",
          department: "Operaciones",
          email: "miguel.sanchez@empresa.com",
          phone: "999-666-555",
          status: "inactive",
          join_date: "2023-01-10",
        },
      ])

      if (employeesError) {
        console.error("Error al insertar empleados de ejemplo:", employeesError)
        return NextResponse.json(
          {
            message: "Error al insertar empleados de ejemplo",
            error: employeesError.message,
            success: false,
          },
          { status: 500 },
        )
      }
    }

    // Insertar datos de paciente para el usuario paciente
    if (patientUser) {
      const { error: patientError } = await supabase.from("patients").insert({
        user_id: patientUser.id,
        document_type: "DNI",
        document_number: "12345678",
        birth_date: "1990-01-01",
        gender: "M",
        address: "Av. Principal 123",
        phone: "999-888-777",
        emergency_contact: "María Pérez",
        emergency_phone: "999-777-888",
        blood_type: "O+",
      })

      if (patientError) {
        console.error("Error al insertar datos de paciente:", patientError)
        return NextResponse.json(
          {
            message: "Error al insertar datos de paciente",
            error: patientError.message,
            success: false,
          },
          { status: 500 },
        )
      }

      // Insertar exámenes de ejemplo para el paciente
      const { error: examsError } = await supabase.from("exams").insert([
        {
          patient_id: patientUser.id,
          doctor_id: doctorUser?.id,
          type: "Hemograma completo",
          date: "2023-03-15",
          status: "completed",
          results: JSON.stringify([
            { name: "Hemoglobina", value: "14.5 g/dL", reference: "13.5 - 17.5 g/dL", status: "normal" },
            { name: "Glucosa", value: "95 mg/dL", reference: "70 - 100 mg/dL", status: "normal" },
            { name: "Colesterol total", value: "210 mg/dL", reference: "< 200 mg/dL", status: "high" },
          ]),
        },
        {
          patient_id: patientUser.id,
          doctor_id: doctorUser?.id,
          type: "Análisis bioquímicos",
          date: "2023-03-20",
          status: "completed",
          results: JSON.stringify([
            { name: "Colesterol total", value: "210 mg/dL", reference: "< 200 mg/dL", status: "high" },
            { name: "HDL", value: "45 mg/dL", reference: "> 40 mg/dL", status: "normal" },
            { name: "LDL", value: "130 mg/dL", reference: "< 130 mg/dL", status: "normal" },
            { name: "Triglicéridos", value: "180 mg/dL", reference: "< 150 mg/dL", status: "high" },
          ]),
        },
      ])

      if (examsError) {
        console.error("Error al insertar exámenes de ejemplo:", examsError)
        return NextResponse.json(
          {
            message: "Error al insertar exámenes de ejemplo",
            error: examsError.message,
            success: false,
          },
          { status: 500 },
        )
      }

      // Insertar órdenes de ejemplo para el paciente
      const { error: ordersError } = await supabase.from("orders").insert({
        user_id: patientUser.id,
        date: "2023-03-10",
        total: 130.0,
        status: "paid",
        items: JSON.stringify([
          { service_id: "1", service_name: "Hemograma completo", quantity: 1, price: 60.0 },
          { service_id: "2", service_name: "Análisis bioquímicos", quantity: 1, price: 70.0 },
        ]),
      })

      if (ordersError) {
        console.error("Error al insertar órdenes de ejemplo:", ordersError)
        return NextResponse.json(
          {
            message: "Error al insertar órdenes de ejemplo",
            error: ordersError.message,
            success: false,
          },
          { status: 500 },
        )
      }
    }

    // Insertar citas de ejemplo
    if (patientUser && doctorUser) {
      const { error: appointmentsError } = await supabase.from("appointments").insert({
        patient_id: patientUser.id,
        doctor_id: doctorUser.id,
        date: "2023-04-15",
        time: "10:00:00",
        status: "scheduled",
        type: "Consulta médica",
        location: "Sede Central",
      })

      if (appointmentsError) {
        console.error("Error al insertar citas de ejemplo:", appointmentsError)
        return NextResponse.json(
          {
            message: "Error al insertar citas de ejemplo",
            error: appointmentsError.message,
            success: false,
          },
          { status: 500 },
        )
      }
    }

    // Insertar servicios a domicilio de ejemplo
    if (patientUser) {
      const { data: services } = await supabase.from("services").select("id").eq("category", "Domicilio").limit(1)

      if (services && services.length > 0) {
        const { error: homeServicesError } = await supabase.from("home_services").insert({
          user_id: patientUser.id,
          service_id: services[0].id,
          address: "Av. Principal 123, Dpto 501",
          date: "2023-04-20",
          time: "15:00:00",
          status: "confirmed",
          notes: "Llamar antes de llegar",
        })

        if (homeServicesError) {
          console.error("Error al insertar servicios a domicilio de ejemplo:", homeServicesError)
          return NextResponse.json(
            {
              message: "Error al insertar servicios a domicilio de ejemplo",
              error: homeServicesError.message,
              success: false,
            },
            { status: 500 },
          )
        }
      }
    }

    return NextResponse.json({
      message: "Datos de ejemplo insertados correctamente",
      success: true,
    })
  } catch (error) {
    console.error("Error al insertar datos de ejemplo:", error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      {
        message: "Error al insertar datos de ejemplo",
        error: errorMessage,
        success: false,
      },
      { status: 500 }
    )
  }
}

