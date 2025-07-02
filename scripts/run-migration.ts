/**
 * SCRIPT DE MIGRACIÓN DE PRECIOS AL SISTEMA DE TARIFAS
 * Ejecutar con: npx tsx scripts/run-migration.ts
 */

import { getSupabaseClient } from '../lib/supabase-client'

async function runMigration() {
  console.log('🚀 Iniciando migración de precios...')
  
  const supabase = getSupabaseClient()
  
  try {
    // Verificar conexión
    const { data: testConnection } = await supabase
      .from('tariffs')
      .select('count')
      .limit(1)
    
    if (!testConnection) {
      throw new Error('No se pudo conectar con la base de datos')
    }
    
    // Ejecutar script SQL de migración
    const migrationSQL = `
      -- Script de migración simplificado
      DO $$
      DECLARE
          tariff_base_id uuid;
          tariff_ref_id uuid;
          analysis_record record;
          count_migrated integer := 0;
      BEGIN
          -- Obtener tarifas
          SELECT id INTO tariff_base_id FROM tariffs WHERE name = 'Base' AND type = 'sale' LIMIT 1;
          SELECT id INTO tariff_ref_id FROM tariffs WHERE name = 'Referencial con IGV' AND type = 'sale' LIMIT 1;
          
          IF tariff_base_id IS NULL OR tariff_ref_id IS NULL THEN
              RAISE EXCEPTION 'No se encontraron las tarifas necesarias';
          END IF;
          
          -- Migrar precios
          FOR analysis_record IN SELECT id, price, reference_price FROM analyses WHERE price > 0 LOOP
              -- Precio base
              INSERT INTO tariff_prices (tariff_id, exam_id, price) 
              VALUES (tariff_base_id, analysis_record.id, analysis_record.price)
              ON CONFLICT (tariff_id, exam_id) DO NOTHING;
              
              -- Precio referencial
              INSERT INTO tariff_prices (tariff_id, exam_id, price) 
              VALUES (tariff_ref_id, analysis_record.id, 
                      COALESCE(analysis_record.reference_price, analysis_record.price * 0.8))
              ON CONFLICT (tariff_id, exam_id) DO NOTHING;
              
              count_migrated := count_migrated + 1;
          END LOOP;
          
          RAISE NOTICE 'Migrados % análisis', count_migrated;
      END $$;
    `
    
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error('❌ Error ejecutando migración:', error)
      return
    }
    
    console.log('✅ Migración completada exitosamente')
    
    // Mostrar estadísticas
    const { data: stats } = await supabase
      .from('tariff_prices')
      .select('id')
    
    console.log(`📊 Total precios migrados: ${stats?.length || 0}`)
    
  } catch (error) {
    console.error('💥 Error en migración:', error)
  }
}

runMigration() 