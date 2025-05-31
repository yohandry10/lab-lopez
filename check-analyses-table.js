const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://chvkrslefmbdkejkprkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodmtyc2xlZm1iZGtlampwcmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNTM5MjksImV4cCI6MjA0ODgyOTkyOX0.JKVhXMzUi-5QqKg9zlm2A--yb4gdFKpBxr9Q8TLjBCU'
);

async function checkAndFixTable() {
  console.log('🔍 Verificando estructura de tabla analyses...');
  
  try {
    // Hacer una consulta simple para refrescar el cache
    const { data, error } = await supabase.from('analyses').select('*').limit(1);
    
    if (error) {
      console.error('❌ Error al acceder a tabla:', error.message);
      return;
    }
    
    console.log('✅ Tabla analyses accesible');
    console.log('📊 Columnas disponibles:', Object.keys(data[0] || {}));
    
    // Intentar insertar un registro de prueba SIMPLE
    const testData = {
      name: 'TEST',
      price: 10.0,
      category: 'TEST'
    };
    
    console.log('🧪 Intentando inserción simple...');
    const { data: insertData, error: insertError } = await supabase
      .from('analyses')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('❌ Error en inserción simple:', insertError.message);
      console.error('📋 Detalles del error:', insertError);
      return;
    }
    
    console.log('✅ Inserción simple exitosa:', insertData[0]);
    
    // Eliminar el registro de prueba
    if (insertData && insertData[0]) {
      await supabase.from('analyses').delete().eq('id', insertData[0].id);
      console.log('🗑️ Registro de prueba eliminado');
    }
    
    // Ahora intentar con deliveryTime
    const testDataComplete = {
      name: 'TEST COMPLETE',
      price: 10.0,
      category: 'TEST',
      deliveryTime: '2-4 horas'
    };
    
    console.log('🧪 Intentando inserción con deliveryTime...');
    const { data: insertData2, error: insertError2 } = await supabase
      .from('analyses')
      .insert([testDataComplete])
      .select();
    
    if (insertError2) {
      console.error('❌ Error con deliveryTime:', insertError2.message);
      console.error('📋 Detalles del error:', insertError2);
    } else {
      console.log('✅ Inserción con deliveryTime exitosa:', insertData2[0]);
      
      // Eliminar registro de prueba
      if (insertData2 && insertData2[0]) {
        await supabase.from('analyses').delete().eq('id', insertData2[0].id);
        console.log('🗑️ Registro completo de prueba eliminado');
      }
    }
    
  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
  }
}

checkAndFixTable(); 