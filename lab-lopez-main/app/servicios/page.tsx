"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { Pencil, Trash2 } from "lucide-react"

// Definición del tipo para un perfil
interface Profile {
  title: string
  description: string
  content: string
  price: number
  image: string
  locations: string[] | string
  sampleType: string | string[]
  ageRequirement: string
  tests: string[]
  conditions: string[]
  slug?: string // Slug opcional para identificar el perfil
}

// Tipo para el objeto de perfiles con índice de string
interface ProfilesData {
  [key: string]: Profile
}

// Datos de los perfiles
const profiles: ProfilesData = {
  "prevencion-total": {
    title: "Perfil Prevención total",
    description:
      "Una visión clara de lo que importa para poner tu salud en perspectiva. Este perfil te permitirá conocer de manera general cómo está tu organismo, para prevenir y/o tratar alguna enfermedad de forma oportuna. La salud es una relación entre tú y tu cuerpo, cuidarla depende de ti; pero permítenos acompañarte.",
    content:
      "Este perfil está diseñado para brindarte un panorama general de tu salud. Con exámenes clave, podrás identificar áreas de riesgo y tomar medidas preventivas a tiempo.",
    price: 690.0,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Cualquier edad",
    tests: [
      "HEMOGRAMA",
      "GLUCOSA",
      "UREA",
      "CREATININA",
      "COLESTEROL TOTAL",
      "TRIGLICÉRIDOS",
      "HDL",
      "LDL",
      "ÁCIDO ÚRICO",
      "PROTEÍNAS TOTALES"
    ],
    conditions: [
      "Ayuno de 8 horas",
      "No realizar ejercicio intenso 24 horas antes",
      "Informar sobre medicamentos en uso"
    ],
  },
  "hombre-saludable": {
    title: "Perfil Hombre saludable",
    description:
      "Este perfil proporciona una mirada a tu salud en general, abordando las dudas más comunes que pueden surgir en los hombres entre 18 y 45 años. Compuesto por 16 pruebas, te ayudará a cuidar tu bienestar.",
    content:
      "Pensado para hombres que desean un chequeo integral, este perfil evalúa indicadores clave para que tomes decisiones informadas sobre tu salud.",
    price: 450.0,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "18-45 años",
    tests: [
      "HEMOGRAMA",
      "GLUCOSA",
      "UREA",
      "CREATININA",
      "COLESTEROL TOTAL",
      "TRIGLICÉRIDOS",
      "HDL",
      "LDL",
      "PSA TOTAL",
      "PSA LIBRE",
      "TESTOSTERONA TOTAL",
      "TESTOSTERONA LIBRE",
      "CORTISOL",
      "TSH",
      "T4 LIBRE",
      "T3"
    ],
    conditions: [
      "Ayuno de 8 horas",
      "No realizar ejercicio intenso 24 horas antes",
      "Informar sobre medicamentos en uso",
      "Para PSA: No tener relaciones sexuales 48 horas antes"
    ],
  },
  "mujer-saludable": {
    title: "Perfil Mujer saludable",
    description:
      "Este perfil es esencial para examinar tu salud, controlar tus niveles hormonales y conocer tu riesgo a desarrollar enfermedades crónicas antes de los 45 años.",
    content:
      "Diseñado especialmente para mujeres, este perfil te ayudará a mantener un control integral de tu salud, anticipando posibles complicaciones.",
    price: 550.0,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Hasta 45 años",
    tests: [
      "HEMOGRAMA",
      "GLUCOSA",
      "UREA",
      "CREATININA",
      "COLESTEROL TOTAL",
      "TRIGLICÉRIDOS",
      "HDL",
      "LDL",
      "TSH",
      "T4 LIBRE",
      "T3",
      "FSH",
      "LH",
      "ESTRADIOL",
      "PROGESTERONA",
      "PROLACTINA"
    ],
    conditions: [
      "Ayuno de 8 horas",
      "No realizar ejercicio intenso 24 horas antes",
      "Informar sobre medicamentos en uso",
      "Para hormonas: Tomar la muestra en los primeros días del ciclo menstrual"
    ],
  },
  preoperatorio: {
    title: "Perfil Preoperatorio",
    description:
      "Si tu médico te ha solicitado exámenes preoperatorios, conoce las pruebas que integran nuestro perfil preoperatorio.",
    content:
      "Este perfil reúne las pruebas necesarias para garantizar que estés en óptimas condiciones antes de una cirugía.",
    price: 0,
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede"],
    sampleType: "General",
    ageRequirement: "Mayor de 18",
    tests: [],
    conditions: [],
  },
  "salud-sexual": {
    title: "Perfil Salud sexual",
    description:
      "La salud sexual requiere un enfoque positivo y respetuoso, con experiencias seguras y libres de temores. Con información oportuna, adquiere hábitos saludables.",
    content:
      "Este perfil te permite evaluar tu salud sexual mediante exámenes específicos, garantizando una atención integral y preventiva.",
    price: 300.0,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "Sangre",
    ageRequirement: "18 años en adelante",
    tests: [
      "HIV 1/2 anticuerpo antígeno",
      "Hepatitis B, antígeno australiano (HBsAg)",
      "Hepatitis B, anticore total (anti-HBcAg)",
      "Hepatitis C anticuerpos",
      "VDRL",
    ],
    conditions: [
      "Los análisis en sangre NO requieren ayuno.",
      "Informa sobre medicamentos o tratamientos durante la toma de muestra.",
    ],
  },
  "salud-metabolica": {
    title: "Perfil Salud metabólica",
    description:
      "Evalúa cómo trabaja tu metabolismo para transformar lo que comes en energía y detectar desbalances que puedan afectar tu bienestar.",
    content:
      "Este perfil analiza los procesos metabólicos para brindarte una imagen clara de cómo funciona tu organismo.",
    price: 0,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Cualquier edad",
    tests: [],
    conditions: [],
  },
  "masculino-edad-oro": {
    title: "Perfil masculino Edad de oro",
    description:
      "Conoce los cambios normales y aquellos que pueden ser señal de un problema de salud. Este perfil te ayuda a entender y monitorear tu organismo con el paso de los años.",
    content:
      "Especialmente diseñado para hombres mayores de 45, este perfil integra diversas pruebas para evaluar tu salud integral y anticipar posibles complicaciones.",
    price: 690.0,
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: ["Sangre", "Orina"],
    ageRequirement: "45 años en adelante",
    tests: [],
    conditions: [],
  },
  "diabetes-control": {
    title: "Perfil Diabetes bajo control",
    description: "Monitorea tus niveles de azúcar para detectar indicios de prediabetes o diabetes a tiempo.",
    content:
      "A través de exámenes específicos, este perfil evalúa tus niveles de glucosa y otros indicadores críticos, permitiéndote tomar medidas preventivas.",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "Sangre",
    ageRequirement: "18 años en adelante",
    tests: [],
    conditions: [],
  },
}

export default function ServiciosPage() {
  const [profilesData, setProfilesData] = useState<ProfilesData>(profiles)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const { user } = useAuth()

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile)
    setIsEditModalOpen(true)
  }

  const handleDeleteProfile = (slug: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
      setProfilesData(prevProfiles => {
        const newProfiles = { ...prevProfiles }
        delete newProfiles[slug]
        return newProfiles
      })
    }
  }

  const handleAddProfile = () => {
    setEditingProfile({
      title: '',
      description: '',
      content: '',
      price: 0,
      image: '/placeholder.svg',
      locations: [],
      sampleType: '',
      ageRequirement: '',
      tests: [],
      conditions: []
    })
    setIsEditModalOpen(true)
  }

  const handleSaveProfile = (updatedProfile: Profile) => {
    if (!updatedProfile.slug) {
      console.error("Error: Slug is required to save profile");
      return;
    }
    
    setProfilesData(prevProfiles => ({
      ...prevProfiles,
      [updatedProfile.slug!]: updatedProfile
    }))
    setIsEditModalOpen(false)
    setEditingProfile(null)
  }

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 sm:mb-4">
          Perfiles de bienestar
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-500">
          Servicios diseñados para mejorar tu calidad de vida
        </p>
        
        {user?.user_type === "admin" && (
          <Button 
            onClick={handleAddProfile}
            className="mt-4 bg-[#3DA64A] hover:bg-[#3DA64A]/90 text-white"
          >
            Agregar nuevo perfil
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(profilesData).map(([slug, profile]) => (
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-video">
                <Image
                  src={profile.image}
                  alt={profile.title}
                  fill
                  className="object-cover"
                />
                {user?.user_type === "admin" && (
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2">
                    <Button
                      onClick={() => handleEditProfile({ ...profile, slug })}
                      className="bg-[#1E5FAD] hover:bg-[#1E5FAD]/90 text-white p-1.5 sm:p-2 rounded-full"
                      size="icon"
                    >
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProfile(slug)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-full"
                      size="icon"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <CardContent className="flex-1 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">{profile.title}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">{profile.description}</p>
                <div className="mt-auto">
                  <Link href={`/servicios/${slug}`}>
                    <Button className="w-full bg-[#1E5FAD] hover:bg-[#1E5FAD]/90 text-white h-10 sm:h-11">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingProfile?.slug ? 'Editar perfil' : 'Nuevo perfil'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            
            // Procesar locations y sampleType
            const locationsStr = formData.get('locations') as string;
            const locations = locationsStr ? locationsStr.split(',').map(loc => loc.trim()) : [];
            
            const sampleTypeStr = formData.get('sampleType') as string;
            // Mantener sampleType como string si es un solo valor, o convertirlo en array si contiene comas
            const sampleType = sampleTypeStr.includes(',') 
              ? sampleTypeStr.split(',').map(st => st.trim()) 
              : sampleTypeStr;
            
            const updatedProfile: Profile = {
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              content: formData.get('content') as string,
              price: parseFloat(formData.get('price') as string) || 0,
              image: formData.get('image') as string,
              locations: locations,
              sampleType: sampleType,
              ageRequirement: formData.get('ageRequirement') as string,
              tests: formData.get('tests')?.toString().split('\n').filter(test => test.trim()) || [],
              conditions: formData.get('conditions')?.toString().split('\n').filter(condition => condition.trim()) || [],
              slug: formData.get('slug') as string
            }
            handleSaveProfile(updatedProfile)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingProfile?.title}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editingProfile?.slug}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProfile?.description}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">Contenido</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editingProfile?.content}
                  className="col-span-3"
                  rows={5}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingProfile?.price}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">URL de imagen</Label>
                <Input
                  id="image"
                  name="image"
                  defaultValue={editingProfile?.image}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="locations" className="text-right">Ubicaciones (separadas por coma)</Label>
                <Input
                  id="locations"
                  name="locations"
                  defaultValue={
                    Array.isArray(editingProfile?.locations) 
                      ? editingProfile?.locations.join(', ') 
                      : editingProfile?.locations
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sampleType" className="text-right">Tipo de muestra</Label>
                <Input
                  id="sampleType"
                  name="sampleType"
                  defaultValue={
                    Array.isArray(editingProfile?.sampleType) 
                      ? editingProfile?.sampleType.join(', ') 
                      : editingProfile?.sampleType
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ageRequirement" className="text-right">Requisito de edad</Label>
                <Input
                  id="ageRequirement"
                  name="ageRequirement"
                  defaultValue={editingProfile?.ageRequirement}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tests" className="text-right">Tests (uno por línea)</Label>
                <Textarea
                  id="tests"
                  name="tests"
                  defaultValue={editingProfile?.tests?.join('\n')}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conditions" className="text-right">Condiciones (una por línea)</Label>
                <Textarea
                  id="conditions"
                  name="conditions"
                  defaultValue={editingProfile?.conditions?.join('\n')}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#3DA64A] hover:bg-[#3DA64A]/90 text-white">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

