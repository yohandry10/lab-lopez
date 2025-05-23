"use client"

import { useState, FormEvent } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FormData {
  nombres: string
  apellidos: string
  dni: string
  telefono: string
  distrito: string
  direccion: string
  correo: string
  numeroPedido: string
  montoPedido: string
  descripcionProducto: string
  descripcionReclamo: string
  detalleReclamacion: string
}

export default function LibroReclamacionesPage() {
  const [formData, setFormData] = useState<FormData>({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    distrito: "",
    direccion: "",
    correo: "",
    numeroPedido: "",
    montoPedido: "",
    descripcionProducto: "",
    descripcionReclamo: "",
    detalleReclamacion: "",
  })
  const [tipoReclamo, setTipoReclamo] = useState<"Queja" | "Reclamo">("Queja")

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Aquí puedes enviar los datos al servidor
    console.log({ tipoReclamo, ...formData })
    alert("Formulario enviado")
  }

  return (
    <div className="container mx-auto px-4 pt-36 pb-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Detalle de la reclamación</h2>
        <p className="mb-2">
          <strong>Reclamo:</strong> Disconformidad relacionada a los productos o servicios
        </p>
        <p className="mb-6">
          <strong>Queja:</strong> Disconformidad no relacionada a los productos o servicios; o malestar o descontento respecto a la atención al público
        </p>

        <h3 className="text-lg font-medium mb-4">Identificación del consumidor remitente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombres">Nombres *</Label>
            <Input id="nombres" value={formData.nombres} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="apellidos">Apellidos *</Label>
            <Input id="apellidos" value={formData.apellidos} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="dni">Documento de Identidad (DNI) *</Label>
            <Input id="dni" type="text" value={formData.dni} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="telefono">Número de celular o teléfono</Label>
            <Input id="telefono" type="text" value={formData.telefono} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="distrito">Distrito *</Label>
            <Input id="distrito" value={formData.distrito} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="correo">Correo electrónico *</Label>
            <Input id="correo" type="email" value={formData.correo} onChange={handleChange} required />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Input id="direccion" value={formData.direccion} onChange={handleChange} required />
          </div>
        </div>

        <h3 className="text-lg font-medium mt-6 mb-4">Datos del pedido (opcional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numeroPedido">Número de pedido</Label>
            <Input id="numeroPedido" value={formData.numeroPedido} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="montoPedido">Monto del pedido</Label>
            <Input id="montoPedido" value={formData.montoPedido} onChange={handleChange} />
          </div>
        </div>

        <h3 className="text-lg font-medium mt-6 mb-2">Tipo de reclamo *</h3>
        <RadioGroup
          onValueChange={value => setTipoReclamo(value as "Queja" | "Reclamo")}
          value={tipoReclamo}
          className="flex space-x-4 mb-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Queja" id="reclamo-queja" />
            <Label htmlFor="reclamo-queja">Queja</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Reclamo" id="reclamo-reclamo" />
            <Label htmlFor="reclamo-reclamo">Reclamo</Label>
          </div>
        </RadioGroup>

        <div className="mb-4">
          <Label htmlFor="descripcionProducto">Descripción del producto</Label>
          <Textarea id="descripcionProducto" value={formData.descripcionProducto} onChange={handleChange} />
        </div>

        <div className="mb-4">
          <Label htmlFor="descripcionReclamo">Descripción del reclamo *</Label>
          <Textarea id="descripcionReclamo" value={formData.descripcionReclamo} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <Label htmlFor="detalleReclamacion">Detalle de la reclamación</Label>
          <Textarea id="detalleReclamacion" value={formData.detalleReclamacion} onChange={handleChange} />
        </div>

        <Button type="submit" className="mt-6">Enviar</Button>
      </form>
    </div>
  )
} 