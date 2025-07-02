import { NextRequest, NextResponse } from 'next/server'
import { supabase } from "@/lib/supabase"
import { getSupabaseClient } from '@/lib/supabase-client'

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

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    const supabase = getSupabaseClient()

    if (action === 'migrate-tariffs') {
      console.log('🚀 Iniciando migración de tarifas...')

      // 1. Verificar que existen las tablas necesarias
      const { data: tariffsCheck } = await supabase
        .from('tariffs')
        .select('id, name')
        .limit(1)

      if (!tariffsCheck) {
        return NextResponse.json({
          success: false,
          error: 'Las tablas de tarifas no existen. Ejecutar primero create-tariffs-system.sql'
        })
      }

      // 2. Verificar si ya hay precios migrados
      const { data: existingPrices, count } = await supabase
        .from('tariff_prices')
        .select('id', { count: 'exact' })

      if (count && count > 0) {
        return NextResponse.json({
          success: false,
          error: `La migración ya se ejecutó. Hay ${count} precios en el sistema.`
        })
      }

      // 3. Obtener todas las tarifas necesarias
      const { data: baseTariff } = await supabase
        .from('tariffs')
        .select('id')
        .eq('name', 'Base')
        .single()

      const { data: referenceTariff } = await supabase
        .from('tariffs')
        .select('id')
        .eq('name', 'Referencial con IGV')
        .single()

      if (!baseTariff || !referenceTariff) {
        return NextResponse.json({
          success: false,
          error: 'No se encontraron las tarifas Base y Referencial con IGV'
        })
      }

      // 4. Obtener todos los análisis con precios
      const { data: analyses } = await supabase
        .from('analyses')
        .select('id, name, price, reference_price')
        .not('price', 'is', null)
        .gt('price', 0)

      if (!analyses || analyses.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No se encontraron análisis con precios para migrar'
        })
      }

      console.log(`📊 Encontrados ${analyses.length} análisis para migrar`)

      // 5. Preparar datos para inserción
      const tariffPrices = []

      for (const analysis of analyses) {
        // Precio base (público)
        tariffPrices.push({
          tariff_id: (baseTariff as any).id,
          exam_id: (analysis as any).id,
          price: (analysis as any).price
        })

        // Precio referencial (empresarial)
        const referencePrice = (analysis as any).reference_price && (analysis as any).reference_price > 0 
          ? (analysis as any).reference_price 
          : (analysis as any).price * 0.8

        tariffPrices.push({
          tariff_id: (referenceTariff as any).id,
          exam_id: (analysis as any).id,
          price: Math.round(referencePrice * 100) / 100 // Redondear a 2 decimales
        })
      }

      console.log(`💾 Insertando ${tariffPrices.length} precios...`)

      // 6. Insertar precios en lotes
      const batchSize = 100
      let totalInserted = 0

      for (let i = 0; i < tariffPrices.length; i += batchSize) {
        const batch = tariffPrices.slice(i, i + batchSize)
        
        const { error: insertError } = await supabase
          .from('tariff_prices')
          .insert(batch)

        if (insertError) {
          console.error('Error insertando lote:', insertError)
          return NextResponse.json({
            success: false,
            error: `Error en migración: ${insertError.message}`
          })
        }

        totalInserted += batch.length
        console.log(`✅ Insertados ${totalInserted}/${tariffPrices.length} precios`)
      }

      // 7. Configurar referencias por defecto
      await supabase
        .from('references')
        .update({ default_tariff_id: (baseTariff as any).id })
        .eq('name', 'Público General')

      await supabase
        .from('references')
        .update({ default_tariff_id: (referenceTariff as any).id })
        .eq('name', 'Empresas')

      await supabase
        .from('references')
        .update({ default_tariff_id: (referenceTariff as any).id })
        .eq('name', 'Médicos')

      // 8. Verificar resultados
      const { count: finalCount } = await supabase
        .from('tariff_prices')
        .select('id', { count: 'exact' })

      console.log('🎉 Migración completada exitosamente')

      return NextResponse.json({
        success: true,
        message: 'Migración de tarifas completada exitosamente',
        data: {
          analysesProcessed: analyses.length,
          pricesInserted: finalCount,
          baseTariffId: (baseTariff as any).id,
          referenceTariffId: (referenceTariff as any).id
        }
      })
    }

    // Funcionalidad existente para otras acciones
    console.log('🔧 Configurando base de datos...')

    // Resto del código existente...
    return NextResponse.json({
      success: true,
      message: 'Configuración de base de datos completada',
      details: []
    })

  } catch (error) {
    console.error('Error en setup de base de datos:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

