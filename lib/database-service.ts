import { getSupabaseClient } from "./supabase-client"
import type { User, Patient, Employee, Exam, Appointment, Service, Order } from "./supabase-client"

// Funciones para usuarios
export async function getUser(userId: string): Promise<User | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error al obtener usuario:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return null
  }
}

export async function createUser(userData: Partial<User>): Promise<User | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) {
      console.error("Error al crear usuario:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return null
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

    if (error) {
      console.error("Error al actualizar usuario:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return null
  }
}

// Funciones para pacientes
export async function getPatient(patientId: string): Promise<Patient | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("patients").select("*").eq("id", patientId).single()

    if (error) {
      console.error("Error al obtener paciente:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al obtener paciente:", error)
    return null
  }
}

export async function createPatient(patientData: Partial<Patient>): Promise<Patient | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("patients").insert([patientData]).select().single()

    if (error) {
      console.error("Error al crear paciente:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al crear paciente:", error)
    return null
  }
}

// Funciones para empleados
export async function getEmployees(companyId: string): Promise<Employee[]> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("employees").select("*").eq("company_id", companyId)

    if (error) {
      console.error("Error al obtener empleados:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener empleados:", error)
    return []
  }
}

export async function createEmployee(employeeData: Partial<Employee>): Promise<Employee | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("employees").insert([employeeData]).select().single()

    if (error) {
      console.error("Error al crear empleado:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al crear empleado:", error)
    return null
  }
}

export async function updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<Employee | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("employees").update(updates).eq("id", employeeId).select().single()

    if (error) {
      console.error("Error al actualizar empleado:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al actualizar empleado:", error)
    return null
  }
}

export async function deleteEmployee(employeeId: string): Promise<boolean> {
  try {
    const suupabase = getSupabaseClient()

    const { error } = await suupabase.from("employees").delete().eq("id", employeeId)

    if (error) {
      console.error("Error al eliminar empleado:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error al eliminar empleado:", error)
    return false
  }
}

// Funciones para exámenes
export async function getExams(patientId: string): Promise<Exam[]> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("exams").select("*").eq("patient_id", patientId)

    if (error) {
      console.error("Error al obtener exámenes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener exámenes:", error)
    return []
  }
}

export async function createExam(examData: Partial<Exam>): Promise<Exam | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("exams").insert([examData]).select().single()

    if (error) {
      console.error("Error al crear examen:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al crear examen:", error)
    return null
  }
}

// Funciones para citas
export async function getAppointments(userId: string, userType: "patient" | "doctor"): Promise<Appointment[]> {
  try {
    const supabase = getSupabaseClient()

    const field = userType === "patient" ? "patient_id" : "doctor_id"

    const { data, error } = await supabase.from("appointments").select("*").eq(field, userId)

    if (error) {
      console.error("Error al obtener citas:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener citas:", error)
    return []
  }
}

export async function createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("appointments").insert([appointmentData]).select().single()

    if (error) {
      console.error("Error al crear cita:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al crear cita:", error)
    return null
  }
}

// Funciones para servicios
export async function getServices(): Promise<Service[]> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("services").select("*").eq("is_active", true)

    if (error) {
      console.error("Error al obtener servicios:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener servicios:", error)
    return []
  }
}

// Funciones para órdenes
export async function getOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("orders").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error al obtener órdenes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener órdenes:", error)
    return []
  }
}

export async function createOrder(orderData: Partial<Order>): Promise<Order | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("orders").insert([orderData]).select().single()

    if (error) {
      console.error("Error al crear orden:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al crear orden:", error)
    return null
  }
}

