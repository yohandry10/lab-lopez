import { supabase } from "./supabase"
import type { Employee, ExamResult } from "./supabase"

// Funciones para usuarios
export async function createUser(user: any): Promise<any | null> {
  try {
    const { data, error } = await supabase.from("users").insert([user]).select()
    if (error) {
      console.error("Error creating user:", error)
      return null
    }
    return data ? data[0] : null
  } catch (error) {
    console.error("Error in createUser:", error)
    return null
  }
}

export async function getUser(userId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
    if (error) {
      console.error("Error getting user:", error)
      return null
    }
    return data
  } catch (error) {
    console.error("Error in getUser:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()
    if (error) {
      console.error("Error getting user by email:", error)
      return null
    }
    return data
  } catch (error) {
    console.error("Error in getUserByEmail:", error)
    return null
  }
}

export async function updateUser(userId: string, updates: any): Promise<any | null> {
  try {
    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateUser:", error)
    return null
  }
}

// Funciones para empleados
export async function getEmployees(companyId: string): Promise<Employee[]> {
  try {
    // Para demo, devolver datos de ejemplo
    return [
      {
        id: "emp-001",
        name: "Roberto Gómez",
        position: "Gerente de Recursos Humanos",
        department: "Recursos Humanos",
        email: "roberto.gomez@empresa.com",
        phone: "999-888-777",
        status: "active",
        join_date: "2023-01-15",
        company_id: companyId,
      },
      {
        id: "emp-002",
        name: "Laura Torres",
        position: "Analista Financiero",
        department: "Finanzas",
        email: "laura.torres@empresa.com",
        phone: "999-777-888",
        status: "active",
        join_date: "2023-01-20",
        company_id: companyId,
      },
      {
        id: "emp-003",
        name: "Miguel Sánchez",
        position: "Supervisor de Operaciones",
        department: "Operaciones",
        email: "miguel.sanchez@empresa.com",
        phone: "999-666-555",
        status: "inactive",
        join_date: "2023-01-10",
        company_id: companyId,
      },
    ]
  } catch (error) {
    console.error("Error en getEmployees:", error)
    return []
  }
}

export async function createEmployee(employeeData: any): Promise<Employee | null> {
  try {
    // Para demo, simular creación exitosa
    return {
      id: `emp-${Date.now()}`,
      name: employeeData.name,
      position: employeeData.position,
      department: employeeData.department,
      email: employeeData.email,
      phone: employeeData.phone,
      status: employeeData.status,
      join_date: employeeData.join_date,
      company_id: employeeData.company_id,
    }
  } catch (error) {
    console.error("Error en createEmployee:", error)
    return null
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    // Para demo, simular eliminación exitosa
    return true
  } catch (error) {
    console.error("Error en deleteEmployee:", error)
    return false
  }
}

// Añadir la función updateEmployee que falta

export async function updateEmployee(id: string, updates: any): Promise<Employee | null> {
  try {
    // Para demo, simular actualización exitosa
    return {
      id: id,
      name: updates.name || "Nombre Actualizado",
      position: updates.position || "Cargo Actualizado",
      department: updates.department || "Departamento Actualizado",
      email: updates.email || "email@actualizado.com",
      phone: updates.phone || "999-999-999",
      status: updates.status || "active",
      join_date: "2023-01-01",
      company_id: "company-001",
    }
  } catch (error) {
    console.error("Error en updateEmployee:", error)
    return null
  }
}

// Funciones para exámenes
export async function getExamByOrderNumber(orderNumber: string, patientCode: string): Promise<ExamResult | null> {
  try {
    // Para demo, devolver datos de ejemplo
    const mockResults = [
      {
        id: "exam-001",
        patient_code: "ROE-12345-6789",
        order_number: "ORD-001",
        patient_name: "Juan Pérez",
        date: "2023-03-15",
        status: "completed" as const,
        results: [
          { name: "Hemoglobina", value: "14.5 g/dL", reference: "13.5 - 17.5 g/dL", status: "normal" as const },
          { name: "Glucosa", value: "95 mg/dL", reference: "70 - 100 mg/dL", status: "normal" as const },
          { name: "Colesterol total", value: "210 mg/dL", reference: "< 200 mg/dL", status: "high" as const },
        ],
      },
      {
        id: "exam-002",
        patient_code: "ROE-54321-9876",
        order_number: "ORD-002",
        patient_name: "María García",
        date: "2023-03-20",
        status: "completed" as const,
        results: [
          { name: "Hemoglobina", value: "12.8 g/dL", reference: "12.0 - 16.0 g/dL", status: "normal" as const },
          { name: "Glucosa", value: "110 mg/dL", reference: "70 - 100 mg/dL", status: "high" as const },
          { name: "Colesterol total", value: "185 mg/dL", reference: "< 200 mg/dL", status: "normal" as const },
        ],
      },
      {
        id: "exam-003",
        patient_code: "ROE-67890-1234",
        order_number: "ORD-003",
        patient_name: "Carlos Rodríguez",
        date: "2023-03-25",
        status: "pending" as const,
        results: [],
      },
    ]

    return mockResults.find((r) => r.order_number === orderNumber && r.patient_code === patientCode) || null
  } catch (error) {
    console.error("Error en getExamByOrderNumber:", error)
    return null
  }
}

