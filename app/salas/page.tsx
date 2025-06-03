import Image from "next/image"
import { MapPin, Clock, Users, Shield } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SalasPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                Salas de Atención
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
                Espacios diseñados para tu comodidad
              </h1>
              <p className="text-gray-500 md:text-xl">
                Nuestras salas de atención están equipadas con la mejor tecnología y diseñadas para brindarte la mayor comodidad durante tu visita.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#0066ff] hover:bg-[#0066ff]/90">
                  Agendar visita
                </Button>
                <Button variant="outline" className="border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff]/10">
                  Ver ubicaciones
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Sala de atención"
                width={500}
                height={600}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">
              Características de nuestras salas
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Diseñadas pensando en tu bienestar
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <MapPin className="h-12 w-12 text-blue-700 mb-2" />
                <CardTitle>Ubicación estratégica</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nuestras salas están ubicadas en puntos estratégicos de la ciudad para facilitar tu acceso.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Clock className="h-12 w-12 text-blue-700 mb-2" />
                <CardTitle>Horarios extendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Contamos con horarios extendidos para adaptarnos a tu agenda y necesidades.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Users className="h-12 w-12 text-blue-700 mb-2" />
                <CardTitle>Personal capacitado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nuestro equipo está altamente capacitado para brindarte la mejor atención posible.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Shield className="h-12 w-12 text-blue-700 mb-2" />
                <CardTitle>Protocolos de seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Implementamos estrictos protocolos de seguridad e higiene para proteger tu salud.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">
              Nuestras Ubicaciones
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Encuentra la sala más cercana a ti
            </p>
          </div>

          <Tabs defaultValue="lima" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lima">Lima</TabsTrigger>
              <TabsTrigger value="arequipa">Arequipa</TabsTrigger>
              <TabsTrigger value="trujillo">Trujillo</TabsTrigger>
            </TabsList>
            <TabsContent value="lima" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Sede San Isidro", address: "Av. Javier Prado 789, San Isidro", phone: "(01) 513 6666" },
                  { name: "Sede Miraflores", address: "Calle Schell 456, Miraflores", phone: "(01) 513 7777" },
                  { name: "Sede San Borja", address: "Av. San Borja Sur 123, San Borja", phone: "(01) 513 8888" },
                ].map((sede, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle>{sede.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 text-sm text-muted-foreground">
                        <div className="text-gray-700 mb-1">{sede.address}</div>
                        <div className="text-gray-700">{sede.phone}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver mapa</Button>
                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800">Agendar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="arequipa" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Sede Cayma", address: "Av. Ejército 123, Cayma", phone: "(054) 272 273" },
                  { name: "Sede Yanahuara", address: "Av. Ejercito 710, Yanahuara", phone: "(054) 272 274" },
                ].map((sede, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle>{sede.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 text-sm text-muted-foreground">
                        <div className="text-gray-700 mb-1">{sede.address}</div>
                        <div className="text-gray-700">{sede.phone}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver mapa</Button>
                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800">Agendar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="trujillo" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Sede Trujillo Centro", address: "Jr. Pizarro 123, Trujillo", phone: "(044) 123 456" },
                ].map((sede, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle>{sede.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 text-sm text-muted-foreground">
                        <div className="text-gray-700 mb-1">{sede.address}</div>
                        <div className="text-gray-700">{sede.phone}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver mapa</Button>
                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800">Agendar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">
              Servicios disponibles
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Conoce todos los servicios que ofrecemos en nuestras salas
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Toma de muestras",
              "Análisis clínicos",
              "Vacunación",
              "Chequeos preventivos",
              "Pruebas COVID-19",
              "Asesoría médica"
            ].map((service, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Servicio profesional con los más altos estándares de calidad y seguridad.
                  </div>
                  <Button variant="outline" className="text-[#0066ff] border-[#0066ff] hover:bg-[#0066ff]/10">
                    Más información
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

