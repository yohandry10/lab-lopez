"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, User, Users, Settings, Edit, Trash2, MoreHorizontal, UserPlus, Building2, Stethoscope, Shield, AlertCircle, RefreshCw } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import type { User as UserType } from "@/lib/supabase-client"
import { toast } from "sonner"

export default function PerfilPage() {
  const { user, isLoading, updateProfile } = useAuth()
  const router = useRouter()
  const [profileLoading, setProfileLoading] = useState(false)
  const [users, setUsers] = useState<UserType[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("perfil")

  // Form data para perfil personal
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    company_name: "",
    company_ruc: "",
    company_position: ""
  })

  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Solo admin puede acceder a esta página
    if (user && user.user_type !== "admin") {
      router.push("/")
      return
    }

    if (user && user.user_type === "admin") {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
        company_name: user.company_name || "",
        company_ruc: user.company_ruc || "",
        company_position: user.company_position || ""
      })

      // Cargar usuarios
      loadUsers()
      
      // Verificar si hay parámetro de URL para mostrar la pestaña de usuarios
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('tab') === 'usuarios') {
        setActiveTab('usuarios')
      }
    }
  }, [user, isLoading, router])

  // Recargar usuarios cuando se cambia a la pestaña de usuarios
  useEffect(() => {
    if (activeTab === 'usuarios' && user && user.user_type === "admin") {
      loadUsers()
    }
  }, [activeTab, user])

  const loadUsers = async () => {
    setUsersLoading(true)
    try {
      console.log("🔍 Cargando usuarios...")
      
      // Primero probemos sin el filtro de admin para ver si hay usuarios
      const { data: allUsers, error: allError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      console.log("📊 TODOS los usuarios (sin filtros):", { data: allUsers, error: allError, count: allUsers?.length || 0 })

      // Ahora con el filtro de admin
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("user_type", "admin")
        .order("created_at", { ascending: false })

      console.log("📊 Usuarios sin admin:", { data, error, count: data?.length || 0 })
      
      if (allUsers && allUsers.length > 0) {
        console.log("👥 Tipos de usuario encontrados:", allUsers.map(u => ({ id: u.id, email: u.email, user_type: u.user_type })))
        console.log("🔍 DETALLE COMPLETO del último usuario:", allUsers[0])
      }

      if (error) throw error
      
      // Mapear los datos de Supabase de manera segura
      const mappedUsers: UserType[] = (data || []).map((userData: any) => ({
        id: String(userData.id || ''),
        email: String(userData.email || ''),
        username: String(userData.username || ''),
        first_name: String(userData.first_name || ''),
        last_name: String(userData.last_name || ''),
        user_type: (userData.user_type === 'doctor' || userData.user_type === 'company' || userData.user_type === 'admin' || userData.user_type === 'patient') 
          ? userData.user_type 
          : 'patient' as "patient" | "doctor" | "company" | "admin",
        company_name: String(userData.company_name || ''),
        company_ruc: String(userData.company_ruc || ''),
        company_position: String(userData.company_position || ''),
        created_at: userData.created_at || new Date().toISOString(),
        accepted_terms: Boolean(userData.accepted_terms || false),
        accepted_marketing: Boolean(userData.accepted_marketing || false)
      }))
      
      setUsers(mappedUsers)
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error)
      toast.error("Error al cargar la lista de usuarios")
    } finally {
      setUsersLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)

    try {
      const result = await updateProfile(profileData)
      if (result.success) {
        toast.success("Perfil actualizado correctamente")
      } else {
        toast.error(result.error || "Error al actualizar perfil")
      }
    } catch (error) {
      toast.error("Error inesperado al actualizar perfil")
    } finally {
      setProfileLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", selectedUser.id)

      if (error) throw error

      toast.success("Usuario eliminado correctamente")
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      toast.error("Error al eliminar usuario")
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          username: selectedUser.username
        })
        .eq("id", selectedUser.id)

      if (error) throw error

      toast.success("Usuario actualizado correctamente")
      
      // Actualizar la lista de usuarios
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u))
      setEditDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      toast.error("Error al actualizar usuario")
    }
  }

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case "doctor":
        return <Stethoscope className="h-4 w-4" />
      case "company":
        return <Building2 className="h-4 w-4" />
      case "admin":
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getUserTypeBadge = (userType: string) => {
    const colors = {
      doctor: "bg-blue-100 text-blue-800",
      company: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800",
      patient: "bg-gray-100 text-gray-800"
    }

    return (
      <Badge className={colors[userType as keyof typeof colors] || colors.patient}>
        {getUserTypeIcon(userType)}
        <span className="ml-1 capitalize">{userType}</span>
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Solo admin puede ver esta página
  if (user.user_type !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos para acceder a esta página
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Mi Perfil
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Gestión de Usuarios
            </TabsTrigger>
          </TabsList>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 justify-center">
              <Shield className="h-8 w-8 text-purple-600" />
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-2 text-center">Gestiona tu perfil y los usuarios del sistema</p>
          </div>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Información del Administrador
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal como administrador del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Nombre</Label>
                      <Input
                        id="first_name"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Apellidos</Label>
                      <Input
                        id="last_name"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                        placeholder="Tus apellidos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nombre de usuario</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        placeholder="tu_usuario"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={profileLoading}>
                      {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Actualizar Perfil
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Gestión de Usuarios
                    </CardTitle>
                    <CardDescription>
                      Administra todos los usuarios del sistema
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={loadUsers}
                      disabled={usersLoading}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
                      Actualizar
                    </Button>
                    <Button onClick={() => router.push("/admin/registrar-usuario")}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Nuevo Usuario
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Fecha de registro</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((userData) => (
                          <TableRow key={userData.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div>{userData.first_name} {userData.last_name}</div>
                                <div className="text-sm text-gray-500">@{userData.username}</div>
                              </div>
                            </TableCell>
                            <TableCell>{userData.email}</TableCell>
                            <TableCell>
                              {getUserTypeBadge(userData.user_type)}
                            </TableCell>
                            <TableCell>
                              {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedUser(userData)
                                      setEditDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedUser(userData)
                                      setDeleteDialogOpen(true)
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para eliminar usuario */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar usuario?</DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. El usuario {selectedUser?.first_name} {selectedUser?.last_name} será eliminado permanentemente del sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para editar usuario */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Actualiza la información del usuario {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_first_name">Nombre</Label>
                    <Input
                      id="edit_first_name"
                      value={selectedUser.first_name || ""}
                      onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_last_name">Apellidos</Label>
                    <Input
                      id="edit_last_name"
                      value={selectedUser.last_name || ""}
                      onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})}
                      placeholder="Apellidos"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_email">Email</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={selectedUser.email || ""}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_username">Nombre de usuario</Label>
                  <Input
                    id="edit_username"
                    value={selectedUser.username || ""}
                    onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                    placeholder="Usuario"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateUser}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 