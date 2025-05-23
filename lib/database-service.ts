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

    return data as User
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

    return data as User
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

    return data as User
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return null
  }
}

// Funciones para pacientes
export async function getPatient(userId: string): Promise<Patient | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error al obtener paciente:", error)
      return null
    }

    return data as Patient
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

    return data as Patient
  } catch (error) {
    console.error("Error al crear paciente:", error)
    return null
  }
}

export async function updatePatient(patientId: string, updates: Partial<Patient>): Promise<Patient | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("patients").update(updates).eq("id", patientId).select().single()

    if (error) {
      console.error("Error al actualizar paciente:", error)
      return null
    }

    return data as Patient
  } catch (error) {
    console.error("Error al actualizar paciente:", error)
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

    return (data || []) as Employee[]
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

    return data as Employee
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

    return data as Employee
  } catch (error) {
    console.error("Error al actualizar empleado:", error)
    return null
  }
}

export async function deleteEmployee(employeeId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from("employees").delete().eq("id", employeeId)

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

    return (data || []) as Exam[]
  } catch (error) {
    console.error("Error al obtener exámenes:", error)
    return []
  }
}

export async function getExam(examId: string): Promise<Exam | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("exams").select("*").eq("id", examId).single()

    if (error) {
      console.error("Error al obtener examen:", error)
      return null
    }

    return data as Exam
  } catch (error) {
    console.error("Error al obtener examen:", error)
    return null
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

    return data as Exam
  } catch (error) {
    console.error("Error al crear examen:", error)
    return null
  }
}

export async function updateExam(examId: string, updates: Partial<Exam>): Promise<Exam | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("exams").update(updates).eq("id", examId).select().single()

    if (error) {
      console.error("Error al actualizar examen:", error)
      return null
    }

    return data as Exam
  } catch (error) {
    console.error("Error al actualizar examen:", error)
    return null
  }
}

// Funciones para citas
export async function getAppointments(patientId: string): Promise<Appointment[]> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("appointments").select("*").eq("patient_id", patientId)

    if (error) {
      console.error("Error al obtener citas:", error)
      return []
    }

    return (data || []) as Appointment[]
  } catch (error) {
    console.error("Error al obtener citas:", error)
    return []
  }
}

export async function getAppointment(appointmentId: string): Promise<Appointment | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("appointments").select("*").eq("id", appointmentId).single()

    if (error) {
      console.error("Error al obtener cita:", error)
      return null
    }

    return data as Appointment
  } catch (error) {
    console.error("Error al obtener cita:", error)
    return null
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

    return data as Appointment
  } catch (error) {
    console.error("Error al crear cita:", error)
    return null
  }
}

export async function updateAppointment(appointmentId: string, updates: Partial<Appointment>): Promise<Appointment | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("appointments").update(updates).eq("id", appointmentId).select().single()

    if (error) {
      console.error("Error al actualizar cita:", error)
      return null
    }

    return data as Appointment
  } catch (error) {
    console.error("Error al actualizar cita:", error)
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

    return (data || []) as Service[]
  } catch (error) {
    console.error("Error al obtener servicios:", error)
    return []
  }
}

export async function getService(serviceId: string): Promise<Service | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("services").select("*").eq("id", serviceId).single()

    if (error) {
      console.error("Error al obtener servicio:", error)
      return null
    }

    return data as Service
  } catch (error) {
    console.error("Error al obtener servicio:", error)
    return null
  }
}

export async function createService(serviceData: Partial<Service>): Promise<Service | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("services").insert([serviceData]).select().single()

    if (error) {
      console.error("Error al crear servicio:", error)
      return null
    }

    return data as Service
  } catch (error) {
    console.error("Error al crear servicio:", error)
    return null
  }
}

export async function updateService(serviceId: string, updates: Partial<Service>): Promise<Service | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("services").update(updates).eq("id", serviceId).select().single()

    if (error) {
      console.error("Error al actualizar servicio:", error)
      return null
    }

    return data as Service
  } catch (error) {
    console.error("Error al actualizar servicio:", error)
    return null
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

    return (data || []) as Order[]
  } catch (error) {
    console.error("Error al obtener órdenes:", error)
    return []
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (error) {
      console.error("Error al obtener orden:", error)
      return null
    }

    return data as Order
  } catch (error) {
    console.error("Error al obtener orden:", error)
    return null
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

    return data as Order
  } catch (error) {
    console.error("Error al crear orden:", error)
    return null
  }
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("orders").update(updates).eq("id", orderId).select().single()

    if (error) {
      console.error("Error al actualizar orden:", error)
      return null
    }

    return data as Order
  } catch (error) {
    console.error("Error al actualizar orden:", error)
    return null
  }
}

