const { createClient: supabaseClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

interface User {
  id: string
  email: string
}

async function createOrUpdateAdminUser() {
  const supabase = supabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const email = 'cliente@miempresa.com'
  const password = 'Administrador123!'

  try {
    // 1. Buscar si el usuario existe
    const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers()
    
    if (searchError) {
      throw searchError
    }

    const existingUser = users.find((u: User) => u.email === email)

    if (existingUser) {
      console.log('Usuario existente encontrado, actualizando...')
      
      // Actualizar contraseña
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: password }
      )

      if (updateError) {
        throw updateError
      }

      // Verificar si existe en la tabla users
      const { data: existingProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', existingUser.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      if (existingProfile) {
        // Actualizar perfil existente
        const { error: updateProfileError } = await supabase
          .from('users')
          .update({
            user_type: 'admin',
            username: 'adminuser',
            first_name: 'Admin',
            last_name: 'Usuario',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id)

        if (updateProfileError) {
          throw updateProfileError
        }
      } else {
        // Crear nuevo perfil
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: existingUser.id,
            email,
            username: 'adminuser',
            first_name: 'Admin',
            last_name: 'Usuario',
            user_type: 'admin',
            accepted_terms: true,
            accepted_marketing: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          throw insertError
        }
      }

      console.log('✅ Usuario administrador actualizado exitosamente')
    } else {
      // Crear nuevo usuario
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: 'admin'
        }
      })

      if (createError) {
        throw createError
      }

      if (!newUser?.user?.id) {
        throw new Error('No se pudo crear el usuario')
      }

      console.log('Usuario creado en Auth:', newUser.user.id)

      // Crear perfil en tabla users
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: newUser.user.id,
          email,
          username: 'adminuser',
          first_name: 'Admin',
          last_name: 'Usuario',
          user_type: 'admin',
          accepted_terms: true,
          accepted_marketing: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        throw profileError
      }

      console.log('✅ Usuario administrador creado exitosamente')
    }

    console.log('\nCredenciales del administrador:')
    console.log('Email:', email)
    console.log('Contraseña:', password)

  } catch (err: any) {
    console.error('Error:', err?.message || String(err))
    process.exit(1)
  }
}

createOrUpdateAdminUser() 