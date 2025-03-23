import Image from "next/image"
import { Calendar, Clock, Shield, Users, Check, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VacunacionPage() {
  return (
    <main className="flex min-h-screen flex-col" id="top">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-blue-600/5" />
        <div className="container relative px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                Servicio de Vacunación
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
                Protege tu salud y la de tu familia
              </h1>
              <p className="text-gray-600 md:text-xl">
                En ROE contamos con un servicio de vacunación completo para todas las edades, con personal altamente
                capacitado y las mejores instalaciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-700 hover:bg-blue-800">Agenda tu vacunación</Button>
                <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
                  Ver catálogo de vacunas
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] h-[400px] md:h-[500px]">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="Servicio de vacunación"
                  fill
                  className="rounded-lg object-cover"
                  priority
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vacunas certificadas</p>
                      <p className="text-xs text-gray-500">Estándares internacionales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full py-8 bg-white border-b">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar vacunas por nombre o tipo"
                  className="pl-10 h-12 text-base border-gray-300"
                />
              </div>
              <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-base">Buscar</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">
              ¿Por qué elegir ROE para tu vacunación?
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">Beneficios que nos distinguen</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <Shield className="h-12 w-12 text-blue-700 mb-2" />
                <CardTitle>Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Protocolos de seguridad estrictos y personal altamente capacitado para garantizar una experiencia
                  segura.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <Calendar className="h-12 w-12 text-blue-700 mb-2" />
                <CardTitle>Flexibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Horarios flexibles y posibilidad de agendar citas en línea para tu comodidad.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <Clock className="h-12 w-12 text-blue-700 mb-2" />
                <CardTitle>Rapidez</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Proceso ágil y eficiente para que puedas continuar con tus actividades diarias sin demoras.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <Users className="h-12 w-12 text-blue-700 mb-2" />
                <CardTitle>Experiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Más de 70 años de experiencia brindando servicios de salud de calidad a miles de familias.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vaccines Categories */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">Categorías de Vacunas</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Ofrecemos una amplia gama de vacunas para todas las etapas de la vida
            </p>
          </div>

          <Tabs defaultValue="infants" className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4">
              <TabsTrigger value="infants">Infantes</TabsTrigger>
              <TabsTrigger value="children">Niños</TabsTrigger>
              <TabsTrigger value="adolescents">Adolescentes</TabsTrigger>
              <TabsTrigger value="adults">Adultos</TabsTrigger>
            </TabsList>

            <TabsContent value="infants" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "BCG", description: "Protege contra formas graves de tuberculosis", age: "Recién nacidos" },
                  {
                    name: "Hepatitis B",
                    description: "Previene la infección por el virus de la hepatitis B",
                    age: "Recién nacidos",
                  },
                  { name: "Rotavirus", description: "Previene la diarrea grave por rotavirus", age: "2 y 4 meses" },
                  {
                    name: "Pentavalente",
                    description: "Protege contra difteria, tos ferina, tétanos, Hib y hepatitis B",
                    age: "2, 4 y 6 meses",
                  },
                  {
                    name: "Neumococo",
                    description: "Previene enfermedades como neumonía y meningitis",
                    age: "2, 4 y 12 meses",
                  },
                  { name: "Polio", description: "Previene la poliomielitis", age: "2, 4 y 6 meses" },
                ].map((vaccine, i) => (
                  <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-blue-600 h-2"></div>
                    <CardHeader>
                      <CardTitle>{vaccine.name}</CardTitle>
                      <CardDescription className="text-xs text-blue-600 font-medium">
                        Edad recomendada: {vaccine.age}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{vaccine.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                          Más info
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Agendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="children" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Triple Viral (SRP)",
                    description: "Protege contra sarampión, rubéola y paperas",
                    age: "1 año y 6 años",
                  },
                  { name: "Varicela", description: "Previene la varicela", age: "1 año" },
                  {
                    name: "Hepatitis A",
                    description: "Previene la infección por el virus de la hepatitis A",
                    age: "1 año",
                  },
                  {
                    name: "Influenza",
                    description: "Protege contra la gripe estacional",
                    age: "Anual desde los 6 meses",
                  },
                  { name: "DPT", description: "Refuerzo contra difteria, tos ferina y tétanos", age: "4 años" },
                  { name: "Fiebre Amarilla", description: "Previene la fiebre amarilla", age: "1 año" },
                ].map((vaccine, i) => (
                  <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-green-600 h-2"></div>
                    <CardHeader>
                      <CardTitle>{vaccine.name}</CardTitle>
                      <CardDescription className="text-xs text-green-600 font-medium">
                        Edad recomendada: {vaccine.age}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{vaccine.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-700 border-green-200 hover:bg-green-50"
                        >
                          Más info
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Agendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="adolescents" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "VPH", description: "Previene el virus del papiloma humano", age: "9-14 años" },
                  { name: "Tdap", description: "Refuerzo contra tétanos, difteria y tos ferina", age: "11-12 años" },
                  { name: "Meningococo", description: "Previene la meningitis meningocócica", age: "11-12 años" },
                ].map((vaccine, i) => (
                  <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-purple-600 h-2"></div>
                    <CardHeader>
                      <CardTitle>{vaccine.name}</CardTitle>
                      <CardDescription className="text-xs text-purple-600 font-medium">
                        Edad recomendada: {vaccine.age}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{vaccine.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-700 border-purple-200 hover:bg-purple-50"
                        >
                          Más info
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Agendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="adults" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Influenza", description: "Protege contra la gripe estacional", age: "Anual" },
                  { name: "Td/Tdap", description: "Refuerzo contra tétanos y difteria", age: "Cada 10 años" },
                  { name: "Neumococo", description: "Previene enfermedades como neumonía", age: "65+ años" },
                  { name: "Herpes Zóster", description: "Previene el herpes zóster (culebrilla)", age: "50+ años" },
                  { name: "Hepatitis B", description: "Para adultos no vacunados previamente", age: "Cualquier edad" },
                  {
                    name: "COVID-19",
                    description: "Protege contra el coronavirus SARS-CoV-2",
                    age: "Según recomendaciones vigentes",
                  },
                ].map((vaccine, i) => (
                  <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <div className="bg-orange-600 h-2"></div>
                    <CardHeader>
                      <CardTitle>{vaccine.name}</CardTitle>
                      <CardDescription className="text-xs text-orange-600 font-medium">
                        Edad recomendada: {vaccine.age}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{vaccine.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-orange-700 border-orange-200 hover:bg-orange-50"
                        >
                          Más info
                        </Button>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          Agendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Booking Section */}
      <section className="w-full py-12 md:py-24 bg-blue-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Agenda tu vacunación ahora</h2>
              <p className="text-blue-100 md:text-lg">
                Nuestro proceso de agendamiento es rápido y sencillo. Selecciona la vacuna, la fecha y la sede de tu
                preferencia.
              </p>
              <ul className="space-y-2">
                {[
                  "Personal altamente capacitado",
                  "Vacunas de calidad certificada",
                  "Instalaciones modernas y seguras",
                  "Seguimiento post-vacunación",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-blue-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button className="bg-white text-blue-700 hover:bg-blue-50">Agendar ahora</Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-700 rounded-full"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Formulario de contacto</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Nombres</label>
                      <Input placeholder="Ingresa tus nombres" className="border-gray-300" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Apellidos</label>
                      <Input placeholder="Ingresa tus apellidos" className="border-gray-300" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Correo electrónico</label>
                    <Input type="email" placeholder="correo@ejemplo.com" className="border-gray-300" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Teléfono</label>
                    <Input placeholder="999 999 999" className="border-gray-300" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Vacuna de interés</label>
                    <Input placeholder="Ej: Influenza, COVID-19, etc." className="border-gray-300" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Solicitar información</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">Preguntas Frecuentes</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Resolvemos tus dudas sobre nuestro servicio de vacunación
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
            {[
              {
                question: "¿Necesito agendar una cita para vacunarme?",
                answer:
                  "Sí, recomendamos agendar una cita para garantizar una atención rápida y eficiente. Puedes hacerlo en línea o llamando a nuestro centro de contacto.",
              },
              {
                question: "¿Qué documentos debo llevar?",
                answer:
                  "Debes llevar tu documento de identidad y, si es posible, tu carnet de vacunación para mantener un registro actualizado de tus vacunas.",
              },
              {
                question: "¿Cuánto tiempo debo esperar después de la vacunación?",
                answer:
                  "Recomendamos esperar entre 15 y 30 minutos después de la vacunación para monitorear posibles reacciones inmediatas.",
              },
              {
                question: "¿Las vacunas tienen efectos secundarios?",
                answer:
                  "Algunas vacunas pueden causar efectos secundarios leves como dolor en el sitio de la inyección, fiebre leve o fatiga. Estos efectos suelen ser temporales.",
              },
            ].map((faq, i) => (
              <Card key={i} className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{faq.answer}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

